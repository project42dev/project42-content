# Serving contract conformance lab

This lab exercises actual CPU inference from a pinned Qwen3 GGUF model through a pinned llama.cpp server. The live client never substitutes synthetic model output. `test_conformance.py` uses explicitly synthetic local HTTP fixtures only to test client failure handling.

A successful receipt establishes only the tested subset for this exact local configuration and run. It is not production security testing, a capacity benchmark, a gateway test, a model-quality evaluation, or certification of full OpenAI API compatibility.

## Learning goals and serving layers

Keep these responsibilities separate:

| Layer | Responsibility in this lab |
|---|---|
| Model runtime | Load and execute the immutable GGUF artifact. |
| Inference server | Expose health, model discovery, chat completion, and SSE behavior. |
| Gateway | Not present. No gateway authorization, queue, or rate-limit guarantee exists. |
| Application adapter | The standard-library client maps the tested HTTP subset into safe evidence. |
| Public endpoint | Not present. The server is restricted to loopback. |

Liveness, readiness, identity, and inference are different claims. Public `GET /health` is readiness evidence for this server. It is intentionally unauthenticated and is not an authentication-failure test. Auth rejection is tested separately against `/v1/models`. The friendly alias identifies the expected served contract, but only byte counts and cryptographic hashes identify artifacts.

## Exact artifacts and server contract

The setup lifecycle must verify these exact artifacts before installation:

* Runtime archive: `llama-b10964-bin-win-cpu-x64.zip`
* Runtime size: `18427629` bytes
* Runtime SHA-256: `917f39c076402c421224824607397af20f53625a60defc20e8dd22446bf4c5d7`
* Runtime commit: `b29c606e28a01b1bc8c1351026a0fa6e616bf6c4`
* Model file: `Qwen3-0.6B-Q8_0.gguf`
* Model size: `639446688` bytes
* Model SHA-256: `9465e63a22add5354d9bb4b99e90117043c7124007664907259bd16d043bb031`
* Model repository revision: `23749fefcc72300e3a2ad315e1317431b06b590a`

The workspace must contain `runtime/llama-server.exe` and `model.gguf`. The server lifecycle contract is:

* Windows x64 and PowerShell 7.6 or newer.
* CPython 3.13.9 Windows with a conventional standard-library runtime exposing the `python` command for this client.
* The qualified environment is PowerShell 7.6.6, .NET 10.0.12, Windows x64, and CPython 3.13.9. Other PowerShell, .NET, and Python patch or minor versions are not independently qualified by this lab. The supplied Python inventory passes all 25 tests under ordinary `python -m unittest` with normal module imports.
* Host `127.0.0.1` only.
* Port from 1024 through 65535.
* Alias `p42-qwen3-06b`.
* CPU threads 2.
* Context size 2048.
* GPU layers 0.
* Parallel slots 1.
* Web UI disabled.
* The API secret originates only in `P42_SERVING_API_KEY`.
* The start script passes that secret to the child as `LLAMA_API_KEY`, never as a command-line argument.
* No secret may appear in logs, receipts, or `server-state.json`.
* `server-state.json` contains only `pid`, `startTimeUtc`, `exePath`, `port`, and `alias`.
* Existing files are never overwritten without artifact ownership verification.
* A process is never stopped merely because it uses the expected port or has a recorded PID. Ownership must be verified first.

The pinned llama.cpp server documentation describes the loopback host default, port, alias, CPU and GPU options, parallelism, disabled Web UI, `LLAMA_API_KEY`, public `/health`, and OpenAI-compatible `/v1/chat/completions` endpoint:

* https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md
* https://github.com/ggml-org/llama.cpp/releases/tag/b10964
* https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/tree/23749fefcc72300e3a2ad315e1317431b06b590a

## Safety invariants

The lifecycle scripts and Python client are supplied in this lab folder. Use a new absolute workspace. The examples below use `C:\p42-serving-lab-new`; choose another new absolute path if that path already exists.

The API key must not be placed in command history as a script argument. Set it in the current process environment by an approved local secret-loading method. The literal value below is illustrative and must not be reused:

```powershell
$env:P42_SERVING_API_KEY = Read-Host -AsSecureString | ConvertFrom-SecureString -AsPlainText
```

PowerShell records the command but not the interactively entered value. Clear the variable when the lab is finished:

```powershell
Remove-Item Env:P42_SERVING_API_KEY
```

All inference prompts used by `conformance.py` concern fictional villages, islands, characters, stories, and objects. Receipts record no prompts, response text, request bodies, authorization values, or caller content. They record only bounded content lengths, safe outcome categories, expected public metadata, and evidence states.

The output receipt path must be absolute, must not already exist, and must have an existing parent directory. The client opens it with exclusive creation before making any network request. It retains that same descriptor through the final write. It does not delete and reopen the path, so another owner cannot replace an intentionally released reservation between preflight and write.

## Setup, start, and protected tests

From PowerShell 7 in this directory, use this complete sequence. Setup verifies a completed owned workspace idempotently and refuses a partial or foreign workspace. The generated key remains available for Start and the ownership-checked Stop, and nested cleanup removes the secret even if Stop throws:

```powershell
$workspace = 'C:\p42-serving-lab-new'
./Setup-ServingLab.ps1 -Workspace $workspace
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$started = $false
try {
    $bytes = [byte[]]::new(32)
    $rng.GetBytes($bytes)
    $env:P42_SERVING_API_KEY = [Convert]::ToHexString($bytes)
    [Array]::Clear($bytes, 0, $bytes.Length)

    ./Start-ServingLab.ps1 -Workspace $workspace -Port 11842
    $started = $true
    python -m unittest -v test_conformance.py
    if ($LASTEXITCODE -ne 0) { throw "unittest exited with code $LASTEXITCODE" }
}
finally {
    try {
        if ($started) { ./Stop-ServingLab.ps1 -Workspace $workspace }
    }
    finally {
        Remove-Item Env:P42_SERVING_API_KEY -ErrorAction SilentlyContinue
        $rng.Dispose()
    }
}
```

Before the server is accepted, retain setup evidence showing both exact byte counts and both SHA-256 values. A model alias is not a substitute for those hashes. Re-running Setup on an actual verified complete workspace performs independent verification and changes nothing. Setup refuses a partial or foreign workspace rather than overwriting it.

`test_conformance.py` contains eight tests. They use local synthetic servers and do not establish that a model was loaded or inference occurred. A failed protected test is a client defect that must be repaired before running live conformance. The three adapter test files contain 17 tests: 7 in `test_adapter_exercise.py`, 5 in `test_adapter_changed.py`, and 5 in `test_adapter_rollback_boundaries.py`. All four Python test files therefore contain 25 tests. A test result is visible as a failure or `not-observed`; the runner does not weaken checks by converting failures to PASS.

## Run actual live conformance

Create a new evidence directory and run this standalone live sequence. It supplies the workspace, port, and receipt explicitly, generates the key before Start, retains the same key for the client and Stop, and performs nested cleanup:

```powershell
$workspace = 'C:\p42-serving-lab-new'
$evidenceRoot = 'C:\p42-serving-evidence-live-v2'
New-Item -ItemType Directory -Path $evidenceRoot -ErrorAction Stop
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$started = $false
try {
    $bytes = [byte[]]::new(32)
    $rng.GetBytes($bytes)
    $env:P42_SERVING_API_KEY = [Convert]::ToHexString($bytes)
    [Array]::Clear($bytes, 0, $bytes.Length)

    ./Start-ServingLab.ps1 -Workspace $workspace -Port 11842
    $started = $true
    python conformance.py --port 11842 --output (Join-Path $evidenceRoot 'receipt-live-11842.json')
    if ($LASTEXITCODE -ne 0) { throw "conformance.py exited with code $LASTEXITCODE" }
}
finally {
    try {
        if ($started) { ./Stop-ServingLab.ps1 -Workspace $workspace }
    }
    finally {
        Remove-Item Env:P42_SERVING_API_KEY -ErrorAction SilentlyContinue
        $rng.Dispose()
    }
}
```

The live request settings are deliberately qualified for this Qwen model:

* `max_tokens` is 64.
* `temperature` is 0.
* `chat_template_kwargs` contains `{"enable_thinking": false}`.

These settings avoid treating reasoning-only output as an answer when a small token budget is exhausted. The client still requires actual nonempty generated text.

### Timing budgets and observed failures

An ordinary non-streaming CPU request uses a 30-second client timeout. This is the classroom budget for bounded requests, not a performance guarantee and not a Service Level Objective (SLO). An observed run exceeded the previous 8-second client timeout. The cause of that timeout is unestablished, so this observation does not attribute it to CPU contention or any other specific cause. The 30-second value is not established as a benchmark or SLO.

The streaming check retains its absolute 30-second elapsed-time bound, including its socket reads. The `timeout_observation` check retains its deliberate 0.05-second timeout. The four-request overload observation retains its explicit 12-second timeout. These are different test settings and must not be interpreted as service guarantees.

If an ordinary request exceeds its 30-second lab budget, the check must be recorded with state `failed`. Timeouts and other failures remain visible. The client must not retry them, hide them, or convert them to PASS.

The command checks:

1. Public health returns HTTP 200 and JSON status `ok`.
2. An invalid key is rejected by authenticated `/v1/models` with HTTP 401 or 403.
3. Authenticated model discovery includes alias `p42-qwen3-06b`.
4. A bounded non-streaming request returns actual nonempty text.
5. A bounded stream is parsed independently of network chunk boundaries.
6. Role-only, reasoning-only, and `content:null` deltas contribute no answer text.
7. Numeric or object content, scalar deltas, malformed JSON, missing keys, missing `[DONE]`, duplicate `[DONE]`, and data after `[DONE]` fail closed.
8. A usage-only event with empty choices is accepted only when it has valid nonnegative integer token counts.
9. Stream response bytes and total elapsed time are bounded. The remaining total deadline is applied to every blocking socket read, so a slow drip cannot extend the run forever.
10. An early disconnect occurs only after a successful HTTP response and one received byte. Both the response read handle and connection are closed.
11. A fresh completion after that disconnect establishes service recovery.
12. An intentionally short client deadline is classified as a client socket timeout only when that is the actual transport outcome. Connection refusal and other transport failures are not mislabeled as timeouts.
13. Four concurrent requests produce overload observations. They do not establish a gateway rate limit, queue policy, throughput promise, or capacity guarantee.

A failed check remains `failed`. A check that cannot be established by the client is `not-observed`. Neither state is silently converted to PASS. Durations come from a monotonic clock and describe only that run. They are not performance guarantees.

## Interpret cancellation, timeout, and overload correctly

The early-disconnect check proves that the client successfully began an HTTP stream and then closed its response and connection. It does not prove that the server cancelled generation internally. Proving server-side cancellation requires server-owned telemetry tied to the request or another authoritative server observation, so the receipt reports that claim as `not-observed`.

A client timeout means the client's socket deadline expired. It does not imply server cancellation. A refused connection means no listener accepted the connection. Another transport exception is a third category. The client records these separately.

Concurrent request outcomes are observations under one local sample. Because this lab has no gateway, it provides no gateway rate-limit guarantee. HTTP outcomes from four requests cannot establish a general capacity or fairness promise.

## Stop, restart, and recovery proof

The port-only client cannot safely stop a process. Use the lifecycle scripts, which must verify workspace and process ownership.

Run stop, endpoint observation, restart, conformance, and final owned cleanup as one sequence. The same generated key is retained throughout, and a Stop failure is not swallowed:

```powershell
$workspace = 'C:\p42-serving-lab-new'
$evidenceRoot = 'C:\p42-serving-evidence-restart-v2'
New-Item -ItemType Directory -Path $evidenceRoot -ErrorAction Stop
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$running = $false
try {
    $bytes = [byte[]]::new(32)
    $rng.GetBytes($bytes)
    $env:P42_SERVING_API_KEY = [Convert]::ToHexString($bytes)
    [Array]::Clear($bytes, 0, $bytes.Length)

    ./Start-ServingLab.ps1 -Workspace $workspace -Port 11842
    $running = $true
    python conformance.py --port 11842 --output (Join-Path $evidenceRoot 'receipt-before-restart.json')
    if ($LASTEXITCODE -ne 0) { throw "conformance.py exited with code $LASTEXITCODE" }

    ./Stop-ServingLab.ps1 -Workspace $workspace
    $running = $false

    try {
        Invoke-RestMethod -Method Get -Uri http://127.0.0.1:11842/health -TimeoutSec 2
        throw 'Old port unexpectedly remained reachable'
    }
    catch {
        if ($_.Exception.Message -eq 'Old port unexpectedly remained reachable') { throw }
        'Old port did not answer after the ownership-checked stop.'
    }

    ./Start-ServingLab.ps1 -Workspace $workspace -Port 11842
    $running = $true
    python conformance.py --port 11842 --output (Join-Path $evidenceRoot 'receipt-after-restart.json')
    if ($LASTEXITCODE -ne 0) { throw "conformance.py exited with code $LASTEXITCODE" }
}
finally {
    try {
        if ($running) { ./Stop-ServingLab.ps1 -Workspace $workspace }
    }
    finally {
        Remove-Item Env:P42_SERVING_API_KEY -ErrorAction SilentlyContinue
        $rng.Dispose()
    }
}
```

Restart evidence is complete only when all of the following are retained together:

* Exact setup byte-count and SHA-256 evidence.
* Ownership-checked stop evidence.
* Failure of the old loopback endpoint after stop.
* Ownership-checked start evidence.
* A fresh public-health observation.
* Expected alias observation.
* Fresh actual bounded inference.
* Fresh stream evidence with nonempty content and `[DONE]`.
* Fresh recovery evidence after early disconnect.

A new PID by itself is not restart proof. Never terminate an unrelated process to make the port available.

## Worked failure and recovery task

This task demonstrates a meaningful client failure without pretending to fail model inference.

1. Run the protected tests and retain the failing test name if any.
2. In a temporary copy of `conformance.py`, locate the final missing-DONE check in `parse_sse`:

```python
if not done:
    raise SafeError("SSE stream ended without DONE")
```

3. Temporarily remove those two lines from the copy.
4. Point a copied protected test file at the changed module and run the SSE error test.
5. Observe that the missing-DONE fixture no longer raises. This is a real parser defect because a truncated stream could be accepted as complete.
6. Restore the two lines and rerun all protected tests.
7. Only after the protected suite succeeds, run the unchanged live client and use a new receipt path.

Causal feedback: generated text alone is insufficient streaming evidence. Without terminal `[DONE]`, the client cannot distinguish a complete response from a connection that ended early. Restoring the fail-closed check recovers the completion invariant.

## Changed learner task

Do this before reading the answer below.

Change a temporary copy of `parse_sse` so it supports both of these legitimate non-text events:

```text
data: {"choices":[{"delta":{"role":"assistant","content":null}}]}

data: {"choices":[],"usage":{"prompt_tokens":1,"completion_tokens":1,"total_tokens":2}}
```

Your change must still reject all of these cases:

* Scalar `delta`.
* Numeric or object `content`.
* Empty choices without valid usage token counts.
* Truncated events.
* Missing `[DONE]`.
* Duplicate `[DONE]`.
* Any data event after `[DONE]`.
* More than the configured total byte limit.

Run this protected test command against your changed copy:

```powershell
python -m unittest -v test_conformance.py
```

Then explain why role or usage metadata is not generated answer text, and why the final live check must still require nonempty text plus `[DONE]`.

## Complete answer to the changed task

For each nonempty `choices` item, first require the item and its `delta` to be objects. Validate `role` as text when present. Validate `reasoning_content` as text or null when present. Treat absent or null `content` as contributing no answer text. Accept `content` only when it is a string.

For empty choices, require a `usage` object containing nonnegative integer `prompt_tokens`, `completion_tokens`, and `total_tokens`. Do not treat that event as answer text. Reject empty choices without this shape.

Maintain parser state after each event. Reject a second `[DONE]` and reject every later data event. At end of input, raise a safe error unless `[DONE]` was observed. The live streaming check then separately requires the concatenated textual content to be nonempty. This separation permits valid metadata chunks without weakening the actual-generation invariant.

The implementation in the supplied `conformance.py` is the complete reference answer. The protected tests include actual multiline `data:` fields, one-byte transport boundaries, null content, usage-only events, malformed nested types, missing DONE, duplicate DONE, post-DONE data, a coordinated timeout, an actual rejected redirect, an oversized response, a bounded drip, early disconnect and recovery, and the actual CLI's exclusive receipt behavior.

## Compatibility and migration boundary

The tested compatibility subset is:

| Behavior | Classification |
|---|---|
| `GET /health` | Required, public readiness observation. |
| `GET /v1/models` | Required and authenticated. |
| `POST /v1/chat/completions` | Required and authenticated. |
| Request model alias | Required. |
| Text messages | Required for fictional nonsensitive prompts used here. |
| `max_tokens`, `temperature`, `stream` | Required by this adapter. |
| `chat_template_kwargs.enable_thinking` | Required by this qualified configuration. |
| SSE text deltas and `[DONE]` | Required. |
| Usage-only empty choices | Accepted only with the documented strict local schema. |
| Tools, images, audio, structured output, embeddings, and batch APIs | Unavailable in this tested contract. |
| Remote redirects | Rejected. Credentials are never forwarded. |
| Gateway rate limiting | Unavailable because there is no gateway. |

For a runtime change, keep the application request and evidence schema stable, verify candidate hashes separately, run the same protected and live suites, compare observed failures, and retain the last verified runtime, model, adapter, lifecycle evidence, and receipts for rollback. Fail closed on authentication, identity, inference, streaming, secret handling, ownership, or recovery regression.

## Limitations

`conformance.py` receives only a port and output path, so it cannot hash workspace artifacts. It includes the expected pins for comparison but reports live artifact verification as `not-observed`. It cannot directly observe server-side cancellation. Its four-request overload sample is not a benchmark or rate-limit test. Synthetic fixtures validate client behavior only. Model quality, production isolation, remote exposure, gateway policy, complete protocol compatibility, and sustained capacity are outside this lab.

**ASSUMPTIONS.** The supplied lifecycle scripts satisfy the stated ownership, exclusive artifact, pin verification, loopback, process environment, and secret-handling contract. The learner runs them on Windows x64 with PowerShell 7.6+ and uses the qualified CPython 3.13.9 Windows runtime. The receipt directory is locally controlled. Other Python patch or minor versions are not claimed as tested.

**OMITTED.** Direct workspace hashing is not added to the required port-only CLI because that interface provides no workspace path; the receipt reports it as `not-observed`, and the lab requires separate setup evidence.
