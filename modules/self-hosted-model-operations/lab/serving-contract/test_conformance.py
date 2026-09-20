"""Protected synthetic transport tests for conformance.py.

These fixtures do not run a model and must never be described as inference
proof. They exercise parser, HTTP, timeout, redirect, disconnect, size-bound,
and exclusive receipt behavior.
"""
from __future__ import annotations

import contextlib
import io
import json
import os
import socket
import tempfile
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from unittest import mock

import conformance


class QuietServer(ThreadingHTTPServer):
    daemon_threads = True


class Fixture(BaseHTTPRequestHandler):
    hits = 0
    hit_lock = threading.Lock()

    def _hit(self) -> None:
        with type(self).hit_lock:
            type(self).hits += 1

    def _body(self) -> bytes:
        raw = self.headers.get("Content-Length", "0")
        try:
            length = int(raw)
        except ValueError:
            self.send_error(400)
            return b""
        if length < 0 or length > 200_000:
            self.send_error(413)
            return b""
        return self.rfile.read(length)

    def do_GET(self) -> None:
        self._hit()
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
            return
        if self.path == "/v1/models":
            if self.headers.get("Authorization") != "Bearer test-secret-value":
                self.send_response(401)
                self.end_headers()
                return
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"data":[{"id":"p42-qwen3-06b"}]}')
            return
        if self.path == "/oversized":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"x" * (conformance.MAX_BODY_BYTES + 1))
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self) -> None:
        self._hit()
        body = self._body()
        if self.path != "/v1/chat/completions":
            self.send_response(404)
            self.end_headers()
            return
        if self.headers.get("Authorization") != "Bearer test-secret-value":
            self.send_response(401)
            self.end_headers()
            return
        try:
            request_value = json.loads(body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_response(400)
            self.end_headers()
            return
        if request_value.get("stream") is True:
            raw = (
                b'data: {"choices":[{"delta":{"role":"assistant","content":null}}]}\n\n'
                b'data: {"choices":[{"delta":{"content":"fixture text"}}]}\n\n'
                b'data: [DONE]\n\n'
            )
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.end_headers()
            try:
                self.wfile.write(raw)
                self.wfile.flush()
            except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError):
                pass
            return
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"choices":[{"message":{"content":"fixture answer"}}]}')

    def log_message(self, *_: object) -> None:
        pass


class RedirectSource(BaseHTTPRequestHandler):
    target_port = 0

    def do_GET(self) -> None:
        self.send_response(302)
        self.send_header("Location", f"http://user:password@127.0.0.1:{type(self).target_port}/capture")
        self.end_headers()

    def log_message(self, *_: object) -> None:
        pass


class RedirectTarget(BaseHTTPRequestHandler):
    hits = 0
    authorization_seen = False

    def do_GET(self) -> None:
        type(self).hits += 1
        type(self).authorization_seen = self.headers.get("Authorization") is not None
        self.send_response(200)
        self.end_headers()

    def log_message(self, *_: object) -> None:
        pass


class BlockingHandler(BaseHTTPRequestHandler):
    entered = threading.Event()
    release = threading.Event()

    def do_GET(self) -> None:
        type(self).entered.set()
        type(self).release.wait(2.0)
        try:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"late")
        except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError):
            pass

    def log_message(self, *_: object) -> None:
        pass


class DripHandler(BaseHTTPRequestHandler):
    entered = threading.Event()
    release = threading.Event()

    def do_POST(self) -> None:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if 0 <= length <= 200_000:
            self.rfile.read(length)
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.end_headers()
        try:
            self.wfile.write(b"d")
            self.wfile.flush()
            type(self).entered.set()
            type(self).release.wait(2.0)
            self.wfile.write(b"ata: [DONE]\n\n")
            self.wfile.flush()
        except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError):
            pass

    def log_message(self, *_: object) -> None:
        pass


def start_server(handler: type[BaseHTTPRequestHandler]) -> tuple[QuietServer, threading.Thread]:
    server = QuietServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, thread


def stop_server(server: QuietServer, thread: threading.Thread) -> None:
    server.shutdown()
    thread.join(2.0)
    server.server_close()


class ConformanceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        Fixture.hits = 0
        cls.server, cls.thread = start_server(Fixture)
        cls.port = cls.server.server_port

    @classmethod
    def tearDownClass(cls) -> None:
        stop_server(cls.server, cls.thread)

    def test_sse_arbitrary_boundaries_real_multiline_null_and_usage(self) -> None:
        raw = (
            b'data: {"choices":\n'
            b'data: [{"delta":{"role":"assistant","content":null}}]}\n\n'
            b'data: {"choices":[{"delta":{"reasoning_content":"hidden","content":"A"}}]}\n\n'
            b'data: {"choices":[],"usage":{"prompt_tokens":1,"completion_tokens":1,"total_tokens":2}}\n\n'
            b'data: [DONE]\n\n'
        )
        chunks = [raw[index:index + 1] for index in range(len(raw))]
        self.assertEqual(conformance.parse_sse(chunks), ("A", True))

    def test_sse_missing_done_after_done_and_nested_type_errors(self) -> None:
        cases = [
            b'data: {"choices":[{"delta":{"content":"x"}}]}\n\n',
            b'data: {"choices":[]}\n\ndata: [DONE]\n\n',
            b'data: {"choices":[{"delta":"scalar"}]}\n\ndata: [DONE]\n\n',
            b'data: {"choices":[{"delta":{"content":7}}]}\n\ndata: [DONE]\n\n',
            b'data: [DONE]\n\ndata: {"choices":[{"delta":{"content":"late"}}]}\n\n',
            b'data: [DONE]\n\ndata: [DONE]\n\n',
            b'data: {not-json}\n\ndata: [DONE]\n\n',
            b'data: {"choices":[{"delta":{"content":"x"}}]}',
        ]
        for raw in cases:
            with self.subTest(raw=raw):
                with self.assertRaises(conformance.SafeError):
                    conformance.parse_sse([raw])

    def test_http_public_health_auth_schema_size_and_actual_redirect_rejection(self) -> None:
        self.assertEqual(conformance.health(self.port)["state"], "observed")
        self.assertEqual(conformance.auth_rejection(self.port)["state"], "observed")
        self.assertEqual(conformance.identity(self.port, "test-secret-value")["state"], "observed")
        self.assertEqual(conformance.completion(self.port, "test-secret-value")["state"], "observed")
        with self.assertRaises(conformance.SafeError):
            conformance.request(self.port, "GET", "/oversized", None, None)

        RedirectTarget.hits = 0
        RedirectTarget.authorization_seen = False
        target, target_thread = start_server(RedirectTarget)
        RedirectSource.target_port = target.server_port
        source, source_thread = start_server(RedirectSource)
        try:
            with self.assertRaises(conformance.SafeError) as caught:
                conformance.request(source.server_port, "GET", "/redirect", None, "forwarding-must-not-happen")
            self.assertIn("redirect", str(caught.exception).lower())
            self.assertEqual(RedirectTarget.hits, 0)
            self.assertFalse(RedirectTarget.authorization_seen)
        finally:
            stop_server(source, source_thread)
            stop_server(target, target_thread)

    def test_coordinated_socket_timeout_is_not_connection_refusal(self) -> None:
        BlockingHandler.entered = threading.Event()
        BlockingHandler.release = threading.Event()
        server, thread = start_server(BlockingHandler)
        try:
            with ThreadPoolExecutor(max_workers=1) as pool:
                future = pool.submit(conformance.request, server.server_port, "GET", "/", None, None, 0.05)
                self.assertTrue(BlockingHandler.entered.wait(1.0), "fixture did not accept the request")
                with self.assertRaises(conformance.SafeError) as caught:
                    future.result(timeout=1.0)
                self.assertEqual(str(caught.exception), "client socket timeout")
        finally:
            BlockingHandler.release.set()
            stop_server(server, thread)

    def test_stream_total_deadline_bounds_a_drip_during_read(self) -> None:
        DripHandler.entered = threading.Event()
        DripHandler.release = threading.Event()
        server, thread = start_server(DripHandler)
        original = conformance.MAX_STREAM_SECONDS
        conformance.MAX_STREAM_SECONDS = 0.12
        try:
            with self.assertRaises(conformance.SafeError) as caught:
                conformance.streaming(server.server_port, "test-secret-value")
            self.assertTrue(DripHandler.entered.is_set())
            self.assertIn("elapsed", str(caught.exception))
        finally:
            conformance.MAX_STREAM_SECONDS = original
            DripHandler.release.set()
            stop_server(server, thread)

    def test_early_disconnect_closes_response_then_recovery_succeeds(self) -> None:
        disconnected = conformance.early_disconnect(self.port, "test-secret-value")
        self.assertEqual(disconnected["state"], "observed")
        self.assertFalse(disconnected["serverCancellationObserved"])
        recovered = conformance.completion(self.port, "test-secret-value", "recovery_after_disconnect")
        self.assertEqual(recovered["state"], "observed")

    def test_cli_preserves_existing_output_before_network_and_writes_secret_free_receipt(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            existing = Path(directory) / "existing.json"
            existing.write_text("owned-data", encoding="utf-8")
            before = Fixture.hits
            with mock.patch.dict(os.environ, {"P42_SERVING_API_KEY": "test-secret-value"}, clear=False):
                with contextlib.redirect_stderr(io.StringIO()):
                    code = conformance.main(["--port", str(self.port), "--output", str(existing.resolve())])
            self.assertEqual(code, 2)
            self.assertEqual(existing.read_text(encoding="utf-8"), "owned-data")
            self.assertEqual(Fixture.hits, before)

            receipt_path = Path(directory) / "new-receipt.json"
            with mock.patch.dict(os.environ, {"P42_SERVING_API_KEY": "test-secret-value"}, clear=False):
                with contextlib.redirect_stdout(io.StringIO()):
                    code = conformance.main(["--port", str(self.port), "--output", str(receipt_path.resolve())])
            self.assertEqual(code, 0)
            receipt_text = receipt_path.read_text(encoding="utf-8")
            receipt = json.loads(receipt_text)
            self.assertNotIn("test-secret-value", receipt_text)
            self.assertNotIn("fictional village", receipt_text.lower())
            self.assertFalse(receipt["secretRecorded"])
            self.assertFalse(receipt["requestContentsRecorded"])
            self.assertIn("not-observed", {item["state"] for item in receipt["checks"]})

    def test_fail_closed_paths_nonfinite_json_and_exclusive_writer(self) -> None:
        for path in ("http://example.invalid/", "//example.invalid/x", "/a\\b", "/x\r\ny"):
            with self.subTest(path=path):
                with self.assertRaises(conformance.SafeError):
                    conformance.endpoint(path)
        for raw in (b'{"x":NaN}', b'{"x":Infinity}', b'[]', b'{'):
            with self.subTest(raw=raw):
                with self.assertRaises(conformance.SafeError):
                    conformance.json_object(raw)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "receipt.json"
            conformance.write_exclusive(path, {"state": "observed"})
            original = path.read_bytes()
            with self.assertRaises(FileExistsError):
                conformance.write_exclusive(path, {"state": "failed"})
            self.assertEqual(path.read_bytes(), original)


if __name__ == "__main__":
    unittest.main(verbosity=2)
