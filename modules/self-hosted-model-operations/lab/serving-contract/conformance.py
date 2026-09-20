"""Conformance client for the pinned local llama.cpp serving lab.

Python 3.11+ standard library only. Live checks use real HTTP requests. Synthetic
inference belongs only in test_conformance.py and is never reported as live
inference evidence.
"""
from __future__ import annotations

import argparse
import http.client
import json
import math
import os
import socket
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any, Iterable

HOST = "127.0.0.1"
ALIAS = "p42-qwen3-06b"
RUNTIME_ASSET = "llama-b10964-bin-win-cpu-x64.zip"
RUNTIME_BYTES = 18_427_629
RUNTIME_SHA256 = "917f39c076402c421224824607397af20f53625a60defc20e8dd22446bf4c5d7"
RUNTIME_COMMIT = "b29c606e28a01b1bc8c1351026a0fa6e616bf6c4"
MODEL_FILE = "Qwen3-0.6B-Q8_0.gguf"
MODEL_BYTES = 639_446_688
MODEL_SHA256 = "9465e63a22add5354d9bb4b99e90117043c7124007664907259bd16d043bb031"
MODEL_REVISION = "23749fefcc72300e3a2ad315e1317431b06b590a"
MAX_BODY_BYTES = 2_000_000
MAX_STREAM_BYTES = 1_000_000
MAX_STREAM_SECONDS = 30.0
DEFAULT_TIMEOUT_SECONDS = 30.0
OVERLOAD_TIMEOUT_SECONDS = 12.0


class SafeError(Exception):
    """An error safe to include in a secret-free receipt."""


def _finite(value: Any) -> Any:
    if isinstance(value, float) and not math.isfinite(value):
        raise SafeError("response contained a non-finite JSON number")
    if isinstance(value, dict):
        return {str(key): _finite(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_finite(item) for item in value]
    return value


def json_object(raw: bytes) -> dict[str, Any]:
    try:
        decoded = raw.decode("utf-8")
        value = _finite(json.loads(decoded, parse_constant=lambda _: (_ for _ in ()).throw(ValueError())))
    except (UnicodeDecodeError, json.JSONDecodeError, ValueError, SafeError) as exc:
        raise SafeError("response was not finite UTF-8 JSON") from exc
    if not isinstance(value, dict):
        raise SafeError("response JSON was not an object")
    return value


def _validate_usage(usage: Any) -> None:
    if not isinstance(usage, dict):
        raise SafeError("empty SSE choices required a usage object")
    for name in ("prompt_tokens", "completion_tokens", "total_tokens"):
        value = usage.get(name)
        if not isinstance(value, int) or isinstance(value, bool) or value < 0:
            raise SafeError("SSE usage token counts were missing or invalid")


def parse_sse(chunks: Iterable[bytes], max_bytes: int = MAX_STREAM_BYTES) -> tuple[str, bool]:
    """Parse bounded SSE chunks and require a terminal [DONE] event.

    Network chunk boundaries have no semantic meaning. Multiple data fields in
    one event are joined with a newline according to SSE rules. Role-only and
    reasoning-only deltas may contain content:null and contribute no text.
    Empty choices are accepted only for a final usage-shaped event.
    """
    buffer = bytearray()
    total = 0
    for chunk in chunks:
        if not isinstance(chunk, (bytes, bytearray, memoryview)):
            raise SafeError("SSE transport yielded a non-byte chunk")
        total += len(chunk)
        if total > max_bytes:
            raise SafeError("SSE response exceeded the total byte limit")
        buffer.extend(chunk)

    normalized = bytes(buffer).replace(b"\r\n", b"\n")
    if b"\r" in normalized:
        raise SafeError("SSE response used unsupported bare carriage returns")

    pieces: list[str] = []
    done = False
    events = normalized.split(b"\n\n")
    trailing = events.pop()
    if trailing.strip():
        raise SafeError("SSE response ended with a truncated event")

    for event in events:
        data_lines: list[bytes] = []
        for line in event.split(b"\n"):
            if line.startswith(b"data:"):
                value = line[5:]
                if value.startswith(b" "):
                    value = value[1:]
                data_lines.append(value)
        if not data_lines:
            continue
        data = b"\n".join(data_lines)
        if data == b"[DONE]":
            if done:
                raise SafeError("SSE contained duplicate DONE events")
            done = True
            continue
        if done:
            raise SafeError("SSE data appeared after DONE")

        event_object = json_object(data)
        choices = event_object.get("choices")
        if not isinstance(choices, list):
            raise SafeError("SSE choices was missing or was not a list")
        if not choices:
            _validate_usage(event_object.get("usage"))
            continue
        for choice in choices:
            if not isinstance(choice, dict):
                raise SafeError("SSE choice was not an object")
            delta = choice.get("delta")
            if not isinstance(delta, dict):
                raise SafeError("SSE delta was missing or was not an object")
            if "role" in delta and not isinstance(delta["role"], str):
                raise SafeError("SSE delta role was not text")
            if "reasoning_content" in delta and delta["reasoning_content"] is not None and not isinstance(delta["reasoning_content"], str):
                raise SafeError("SSE reasoning content had an invalid type")
            content = delta.get("content")
            if content is None:
                continue
            if not isinstance(content, str):
                raise SafeError("SSE content had an invalid type")
            pieces.append(content)

    if not done:
        raise SafeError("SSE stream ended without DONE")
    return "".join(pieces), True


def endpoint(path: str) -> str:
    if (
        not isinstance(path, str)
        or not path.startswith("/")
        or path.startswith("//")
        or "\\" in path
        or "@" in path
        or "://" in path
        or "\r" in path
        or "\n" in path
    ):
        raise SafeError("unsafe endpoint was rejected")
    return path


def validate_redirect(location: str) -> None:
    if (
        not isinstance(location, str)
        or not location.startswith("/")
        or location.startswith("//")
        or "@" in location
        or "://" in location
        or "\\" in location
        or "\r" in location
        or "\n" in location
    ):
        raise SafeError("unsafe redirect target was rejected")


def bounded_read(response: http.client.HTTPResponse, limit: int = MAX_BODY_BYTES) -> bytes:
    body = response.read(limit + 1)
    if len(body) > limit:
        raise SafeError("HTTP response exceeded the byte limit")
    return body


def request(
    port: int,
    method: str,
    path: str,
    body: bytes | None,
    secret: str | None,
    timeout: float = DEFAULT_TIMEOUT_SECONDS,
    stream: bool = False,
):
    if not isinstance(port, int) or isinstance(port, bool) or not 1024 <= port <= 65535:
        raise SafeError("port must be an integer from 1024 through 65535")
    if not isinstance(timeout, (int, float)) or not math.isfinite(timeout) or timeout <= 0:
        raise SafeError("HTTP timeout must be a positive finite number")
    safe_path = endpoint(path)
    headers = {"Accept": "application/json", "Connection": "close"}
    if body is not None:
        headers["Content-Type"] = "application/json"
        headers["Content-Length"] = str(len(body))
    if secret is not None:
        headers["Authorization"] = "Bearer " + secret

    connection = http.client.HTTPConnection(HOST, port, timeout=float(timeout))
    try:
        connection.request(method, safe_path, body=body, headers=headers)
        response = connection.getresponse()
        if 300 <= response.status < 400:
            location = response.getheader("Location")
            if location is not None:
                validate_redirect(location)
            response.close()
            raise SafeError("HTTP redirect was rejected without forwarding credentials")
        if stream:
            if not 200 <= response.status < 300:
                status = response.status
                response.close()
                raise SafeError("stream request returned HTTP " + str(status))
            return connection, response
        data = bounded_read(response)
        return response.status, response.getheaders(), data
    except socket.timeout as exc:
        connection.close()
        raise SafeError("client socket timeout") from exc
    except SafeError:
        connection.close()
        raise
    except (OSError, TimeoutError, http.client.HTTPException) as exc:
        connection.close()
        raise SafeError("transport failure: " + type(exc).__name__) from exc
    finally:
        if not stream:
            connection.close()


def result(name: str, state: str, detail: str, **extra: Any) -> dict[str, Any]:
    if state not in {"observed", "failed", "not-observed"}:
        raise ValueError("invalid result state")
    value: dict[str, Any] = {"name": name, "state": state, "detail": detail}
    value.update(extra)
    return value


def payload(fictional_prompt: str, stream: bool = False) -> bytes:
    value = {
        "model": ALIAS,
        "messages": [{"role": "user", "content": fictional_prompt}],
        "max_tokens": 64,
        "temperature": 0,
        "stream": stream,
        "chat_template_kwargs": {"enable_thinking": False},
    }
    return json.dumps(value, separators=(",", ":"), allow_nan=False).encode("utf-8")


def health(port: int) -> dict[str, Any]:
    status, _, body = request(port, "GET", "/health", None, None)
    value = json_object(body)
    if status != 200 or value.get("status") != "ok":
        return result("health_public", "failed", "public health was not HTTP 200 with status ok")
    return result("health_public", "observed", "public readiness was HTTP 200 with status ok; this was not an authentication test")


def auth_rejection(port: int) -> dict[str, Any]:
    status, _, _ = request(port, "GET", "/v1/models", None, "invalid-project42-key")
    if status not in (401, 403):
        return result("authentication_rejection", "failed", "an invalid key returned HTTP " + str(status))
    return result("authentication_rejection", "observed", "an invalid key was rejected by an authenticated endpoint", httpStatus=status)


def identity(port: int, secret: str) -> dict[str, Any]:
    status, _, body = request(port, "GET", "/v1/models", None, secret)
    if status != 200:
        raise SafeError("model identity request returned HTTP " + str(status))
    value = json_object(body)
    data = value.get("data")
    if not isinstance(data, list):
        raise SafeError("model identity data was missing or was not a list")
    ids = []
    for item in data:
        if not isinstance(item, dict) or not isinstance(item.get("id"), str):
            raise SafeError("model identity item had an invalid schema")
        ids.append(item["id"])
    if ALIAS not in ids:
        raise SafeError("expected model alias was absent")
    return result("server_identity", "observed", "expected alias was observed; an alias is not cryptographic artifact evidence", alias=ALIAS)


def completion(port: int, secret: str, name: str = "bounded_completion") -> dict[str, Any]:
    status, _, body = request(
        port,
        "POST",
        "/v1/chat/completions",
        payload("In the fictional village Echo, answer with one short sentence about its library."),
        secret,
    )
    if status != 200:
        raise SafeError("completion request returned HTTP " + str(status))
    value = json_object(body)
    choices = value.get("choices")
    if not isinstance(choices, list) or not choices or not isinstance(choices[0], dict):
        raise SafeError("completion choices was missing, empty, or malformed")
    message = choices[0].get("message")
    if not isinstance(message, dict):
        raise SafeError("completion message was missing or malformed")
    content = message.get("content")
    if not isinstance(content, str) or not content.strip():
        raise SafeError("actual generated content was empty or non-text")
    return result(name, "observed", "actual bounded generated content was nonempty", contentLength=len(content))


def _set_remaining_socket_timeout(
    connection: http.client.HTTPConnection,
    response: http.client.HTTPResponse,
    deadline: float,
) -> None:
    remaining = deadline - time.monotonic()
    if remaining <= 0:
        raise SafeError("SSE total elapsed limit was exceeded")

    stream_socket = None
    response_fp = getattr(response, "fp", None)
    response_raw = getattr(response_fp, "raw", None)
    if response_raw is not None:
        stream_socket = getattr(response_raw, "_sock", response_raw)
    if stream_socket is None:
        stream_socket = connection.sock
    if stream_socket is None or not hasattr(stream_socket, "settimeout"):
        raise SafeError("stream socket was unavailable")
    stream_socket.settimeout(remaining)


def streaming(port: int, secret: str) -> dict[str, Any]:
    started = time.monotonic()
    deadline = started + MAX_STREAM_SECONDS
    connection, response = request(
        port,
        "POST",
        "/v1/chat/completions",
        payload("On the fictional island Foxtrot, answer with one short sentence about its bells.", True),
        secret,
        timeout=min(DEFAULT_TIMEOUT_SECONDS, MAX_STREAM_SECONDS),
        stream=True,
    )
    raw = bytearray()
    try:
        while True:
            _set_remaining_socket_timeout(connection, response, deadline)
            try:
                chunk = response.read1(4096)
            except socket.timeout as exc:
                raise SafeError("SSE total elapsed limit was exceeded during a socket read") from exc
            if not chunk:
                break
            if len(raw) + len(chunk) > MAX_STREAM_BYTES:
                raise SafeError("SSE response exceeded the total byte limit")
            raw.extend(chunk)
    finally:
        response.close()
        connection.close()
    content, done = parse_sse([raw])
    if not done or not content.strip():
        raise SafeError("stream lacked terminal DONE or actual nonempty generated content")
    return result(
        "stream",
        "observed",
        "SSE had terminal DONE and actual nonempty generated content",
        contentLength=len(content),
        durationSeconds=round(time.monotonic() - started, 6),
    )


def early_disconnect(port: int, secret: str) -> dict[str, Any]:
    connection, response = request(
        port,
        "POST",
        "/v1/chat/completions",
        payload("The fictional character Golf describes a quiet garden in several sentences.", True),
        secret,
        stream=True,
    )
    first = b""
    try:
        first = response.read1(1)
        if not first:
            raise SafeError("early-disconnect stream ended before one response byte was read")
    finally:
        response.close()
        connection.close()
    return result(
        "early_disconnect",
        "observed",
        "the client closed both response and connection after successful HTTP and one response byte; server-side cancellation was not directly observed",
        serverCancellationObserved=False,
    )


def timeout_observation(port: int, secret: str) -> dict[str, Any]:
    try:
        request(
            port,
            "POST",
            "/v1/chat/completions",
            payload("A fictional story named Hotel begins with a lantern."),
            secret,
            timeout=0.05,
        )
    except SafeError as exc:
        category = str(exc)
        if category == "client socket timeout":
            return result("client_timeout", "observed", "the client socket deadline expired; this does not prove server cancellation")
        return result("client_timeout", "not-observed", "the attempt produced a non-timeout transport outcome: " + category)
    return result("client_timeout", "not-observed", "the server replied before the intentionally short client deadline")


def overload(port: int, secret: str) -> dict[str, Any]:
    def one() -> int | str:
        try:
            status, _, _ = request(
                port,
                "POST",
                "/v1/chat/completions",
                payload("The fictional object India is a red kite. Reply briefly."),
                secret,
                timeout=OVERLOAD_TIMEOUT_SECONDS,
            )
            return status
        except SafeError as exc:
            text = str(exc)
            if text == "client socket timeout":
                return "client-timeout"
            if text.startswith("transport failure:"):
                return text
            return "safe-error"

    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = [pool.submit(one) for _ in range(4)]
        outcomes = [future.result() for future in as_completed(futures)]
    return result(
        "overload_observation",
        "observed",
        "four concurrent outcomes were sampled; no queue, capacity, gateway, or rate-limit guarantee is inferred",
        outcomes=outcomes,
        rateLimitGuarantee=False,
    )


def _write_all(fd: int, raw: bytes) -> None:
    view = memoryview(raw)
    while view:
        written = os.write(fd, view)
        if written <= 0:
            raise OSError("receipt descriptor accepted no bytes")
        view = view[written:]


def write_receipt_fd(fd: int, receipt: dict[str, Any]) -> None:
    raw = (json.dumps(receipt, sort_keys=True, allow_nan=False, indent=2) + "\n").encode("utf-8")
    _write_all(fd, raw)
    os.fsync(fd)


def write_exclusive(path: Path, receipt: dict[str, Any]) -> None:
    fd = os.open(str(path), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    try:
        write_receipt_fd(fd, receipt)
    finally:
        os.close(fd)


def _safe_add(checks: list[dict[str, Any]], name: str, operation: Any) -> None:
    try:
        checks.append(operation())
    except SafeError as exc:
        checks.append(result(name, "failed", str(exc)))
    except Exception as exc:
        checks.append(result(name, "failed", "unexpected local exception: " + type(exc).__name__))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run live local serving conformance checks")
    parser.add_argument("--port", type=int, required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args(argv)

    secret = os.environ.get("P42_SERVING_API_KEY")
    if not secret:
        print("P42_SERVING_API_KEY is required", file=sys.stderr)
        return 2
    if not 1024 <= args.port <= 65535:
        print("port must be from 1024 through 65535", file=sys.stderr)
        return 2

    output = Path(args.output).expanduser()
    if not output.is_absolute() or not output.parent.is_dir():
        print("output must be a new absolute path in an existing directory", file=sys.stderr)
        return 2

    try:
        receipt_fd = os.open(str(output), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except OSError as exc:
        print("exclusive receipt preflight failed: " + type(exc).__name__, file=sys.stderr)
        return 2

    started = time.monotonic()
    checks: list[dict[str, Any]] = []
    try:
        _safe_add(checks, "health_public", lambda: health(args.port))
        _safe_add(checks, "authentication_rejection", lambda: auth_rejection(args.port))
        _safe_add(checks, "server_identity", lambda: identity(args.port, secret))
        _safe_add(checks, "bounded_completion", lambda: completion(args.port, secret))
        _safe_add(checks, "stream", lambda: streaming(args.port, secret))
        _safe_add(checks, "early_disconnect", lambda: early_disconnect(args.port, secret))
        _safe_add(checks, "recovery_after_disconnect", lambda: completion(args.port, secret, "recovery_after_disconnect"))
        _safe_add(checks, "client_timeout", lambda: timeout_observation(args.port, secret))
        _safe_add(checks, "overload_observation", lambda: overload(args.port, secret))
        checks.append(result(
            "server_side_cancellation",
            "not-observed",
            "client closure was exercised, but this port-only client has no server-owned cancellation telemetry",
        ))
        checks.append(result(
            "stop_restart_recovery",
            "not-observed",
            "run the documented ownership-checked stop, old-port failure, restart, and fresh receipt procedure separately",
        ))
        checks.append(result(
            "artifact_hashes",
            "not-observed",
            "the required CLI interface has no workspace argument; retain setup byte-count and SHA-256 evidence separately",
        ))

        receipt = {
            "schemaVersion": "serving-contract-conformance-v3",
            "observedAtUtc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "host": HOST,
            "port": args.port,
            "serverAliasExpected": ALIAS,
            "secretRecorded": False,
            "requestContentsRecorded": False,
            "pins": {
                "runtimeAsset": RUNTIME_ASSET,
                "runtimeBytes": RUNTIME_BYTES,
                "runtimeSha256": RUNTIME_SHA256,
                "runtimeCommit": RUNTIME_COMMIT,
                "modelFile": MODEL_FILE,
                "modelBytes": MODEL_BYTES,
                "modelSha256": MODEL_SHA256,
                "modelRevision": MODEL_REVISION,
            },
            "checks": checks,
            "durationSeconds": round(time.monotonic() - started, 6),
            "durationIsPerformanceGuarantee": False,
            "scope": "local lab only, not production security or full OpenAI compatibility certification",
        }
        write_receipt_fd(receipt_fd, receipt)
    except (OSError, ValueError) as exc:
        print("receipt write failed: " + type(exc).__name__, file=sys.stderr)
        return 1
    finally:
        os.close(receipt_fd)

    print(str(output))
    return 1 if any(item["state"] == "failed" for item in checks) else 0


if __name__ == "__main__":
    raise SystemExit(main())
