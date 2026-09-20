# Pinned local model serving lifecycle

This lab runs an actual pinned Qwen3 model with a pinned llama.cpp CPU server on Windows x64. It teaches artifact identity, readiness, authentication, failure, cancellation evidence, restart, and recovery. It is a loopback-only learning lab, not a production security design and not certification of complete OpenAI API compatibility.

## What is fixed

The runtime is `llama-b10964-bin-win-cpu-x64.zip`, 18,427,629 bytes, SHA-256 `917f39c076402c421224824607397af20f53625a60defc20e8dd22446bf4c5d7`, build `b10964`, release `v0.4.1`, commit `b29c606e28a01b1bc8c1351026a0fa6e616bf6c4`.

The model is `Qwen3-0.6B-Q8_0.gguf`, 639,446,688 bytes, SHA-256 `9465e63a22add5354d9bb4b99e90117043c7124007664907259bd16d043bb031`, from revision `23749fefcc72300e3a2ad315e1317431b06b590a`.

Official sources:

- [Pinned llama.cpp server documentation](https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md)
- [Pinned llama.cpp repository commit](https://github.com/ggml-org/llama.cpp/tree/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4)
- [Pinned Qwen GGUF revision](https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/tree/23749fefcc72300e3a2ad315e1317431b06b590a)

Setup retains the verified runtime ZIP. Setup and Start compare every extracted runtime file against the ZIP contents rather than trusting a mutable local manifest. They also verify the model and ZIP sizes and hashes. The alias `p42-qwen3-06b` is a friendly server identity, not cryptographic proof of the underlying files.

The server binds only to `127.0.0.1` and uses two CPU threads, context size 2048, zero GPU layers, parallelism one, and no web UI. `/health` is intentionally public. Authentication is tested on `/v1/models` and `/v1/chat/completions`, not on `/health`.

## Requirements and resource planning

Use Windows x64, PowerShell 7.6+, and CPython 3.13.9 Windows with a conventional standard-library runtime exposing the `python` command. The qualified environment is PowerShell 7.6.6, .NET 10.0.12, Windows x64, and CPython 3.13.9. Other PowerShell, .NET, and Python patch or minor versions are not independently qualified by this lab. All 25 tests pass under ordinary `python -m unittest` with normal module imports. Setup downloads 18,427,629 runtime bytes and 639,446,688 model bytes, plus HTTPS response overhead. Redirects are followed only to HTTPS URLs without URL credentials, for at most eight redirects. No API secret is attached to artifact downloads.

Allow disk space for the approximately 658 MB of pinned downloads, the extracted runtime, and preserved setup and lifecycle evidence. Exact peak memory, startup time, and inference duration are UNKNOWN because they depend on the computer and workload. Establish them by measuring the target computer with the shared conformance client and operating-system resource tools. Observed monotonic durations are evidence from one run, not performance guarantees.

## Setup

Choose a new absolute workspace whose parent already exists:

```powershell
$workspace = 'C:\p42-labs\serving-workspace'
./Setup-ServingLab.ps1 -Workspace $workspace
```

Setup creates files exclusively and does not overwrite an existing unverified directory. It uses staging only below the requested workspace and preserves staging evidence. It does not use the system temporary directory, recursively delete files, install a service, or persist a global environment variable.

To use an existing artifact cache without downloading the files again, place files with these exact names in one cache directory:

- `llama-b10964-bin-win-cpu-x64.zip`
- `Qwen3-0.6B-Q8_0.gguf`

Then run:

```powershell
./Setup-ServingLab.ps1 -Workspace 'C:\p42-labs\serving-workspace-2' `
  -ArtifactCache 'D:\p42-artifact-cache'
```

The cache is read only. Its files and the copied files must pass the pinned size and SHA-256 checks. Re-running Setup on a completed workspace performs independent verification and changes nothing. A partial or foreign workspace is refused so evidence is not silently replaced.

## Start, conformance, and stop

Create the secret only at runtime in the current PowerShell process. The script contains no hardcoded secret value. Do not place the key in a command argument, script, receipt, or transcript. Keep the same generated key for Start, the conformance client, and the ownership-checked Stop, then remove it only after Stop completes:

```powershell
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$started = $false
try {
    $bytes = [byte[]]::new(32)
    $rng.GetBytes($bytes)
    $env:P42_SERVING_API_KEY = [Convert]::ToHexString($bytes)
    [Array]::Clear($bytes, 0, $bytes.Length)

    ./Start-ServingLab.ps1 -Workspace $workspace -Port 11842
    $started = $true
    python conformance.py --port 11842 --output 'C:\p42-labs\receipt.json'
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

The nested `finally` always removes the environment secret and disposes the RNG after an attempted owned cleanup, including when Stop throws. A Stop error is not swallowed. The same generated key is retained for Start, the conformance client, and Stop. The supplied scripts also include the `Serving-Time.ps1` dependency, `Invoke-ServingChild`, and the timestamp-helper test; all scripts are provided.

`Start-ServingLab.ps1` transfers the value to the child as `LLAMA_API_KEY` through `ProcessStartInfo.Environment`. No key argument is added. The hidden logger drains standard output and error asynchronously in its own process, replaces an accidental literal occurrence of the key with `[REDACTED]`, and keeps running after Start returns. Logs are written to a unique evidence directory, so old logs are not overwritten.

Start fails closed when the port is already occupied. During readiness polling it verifies all of these conditions:

1. The recorded PID still has the canonical workspace executable path and a process start time within the one-second comparison tolerance.
2. That PID owns the loopback listener on the requested port.
3. Public `/health` reports ready.
4. Authenticated `/v1/models` contains `p42-qwen3-06b`.
5. Process and listener ownership still match after the HTTP checks.

This prevents an unrelated healthy service from being mistaken for the newly launched process. On success, `server-state.json` contains only `pid`, `startTimeUtc`, `exePath`, `port`, and `alias`. It contains no secret.

Stop reads only `server-state.json`. It validates that the recorded executable is the canonical executable under the workspace, then compares PID, executable path, and process start time using the one-second comparison tolerance. It never kills by process name. A mismatch is a refusal, not permission to stop another process. After a verified stop, the state and stop observation move into a unique evidence directory, allowing a later restart without overwriting evidence.

The supplied `conformance.py` is in this lab folder. Run it with the same `P42_SERVING_API_KEY` environment used to start and stop the server and only fictional, nonsensitive request messages. Its output path must be new. Its receipt must contain no caller message content and no secret. The qualified Python run uses ordinary `python -m unittest` module discovery and normal imports.

## Required conformance evidence

A complete receipt reports each check separately as `observed`, `failed`, or `not-observed`. It must not manufacture PASS for a check that did not execute. The required proof is:

- pinned runtime and model byte counts and SHA-256 hashes
- server PID, executable path, start time, loopback listener, port, and alias
- public health readiness, described as public rather than as an authentication failure
- missing-key and wrong-key rejection on authenticated endpoints
- authenticated `/v1/models` identity
- an actual bounded `/v1/chat/completions` result with nonempty generated content
- an SSE completion buffered across arbitrary network chunks, with nonempty generated content and a final `[DONE]`
- early client disconnect, followed by a successful service recovery request
- client timeout reported separately from server cancellation
- overload observations, including failures or absence of an observed overload response
- an explicit statement that this lab has no gateway rate-limit guarantee
- stop, restart, and post-restart recovery

A socket read boundary is not an SSE event boundary. The client must retain incomplete bytes, parse complete SSE records, and require `[DONE]`. A client timeout proves only that the client stopped waiting. It does not prove that the server cancelled generation. An early disconnect must be followed by a new bounded request to determine whether service recovered.

With parallelism one, concurrent requests can expose queueing or overload behavior, but the exact result must be observed rather than promised. There is no gateway in this lab, so it provides no gateway rate limiting, TLS termination, multi-user authorization, or production audit controls.

## Independent lifecycle tests

First prepare the real workspace once. Create a new empty test root whose contents may be retained as evidence. With the server stopped, run this complete sequence. It generates the key before the lifecycle test, supplies the workspace, test root, and port explicitly, and retains the same key for any ownership-checked cleanup:

```powershell
$testRoot = 'C:\p42-labs\serving-lifecycle-test-evidence-v2'
New-Item -ItemType Directory -Path $testRoot -ErrorAction Stop
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try {
    $bytes = [byte[]]::new(32)
    $rng.GetBytes($bytes)
    $env:P42_SERVING_API_KEY = [Convert]::ToHexString($bytes)
    [Array]::Clear($bytes, 0, $bytes.Length)

    ./Test-ServingLifecycle.ps1 -Workspace $workspace -TestRoot $testRoot -Port 11842
}
finally {
    try {
        $statePath = Join-Path $workspace 'server-state.json'
        if (Test-Path -LiteralPath $statePath -PathType Leaf) {
            ./Stop-ServingLab.ps1 -Workspace $workspace
        }
    }
    finally {
        Remove-Item Env:P42_SERVING_API_KEY -ErrorAction SilentlyContinue
        $rng.Dispose()
    }
}
```

The test does not download the 640 MB model again. It performs these independent checks:

- an existing foreign directory and sentinel are preserved
- a copied runtime ZIP with one changed byte is rejected by its pinned hash
- an occupied loopback port prevents startup
- a forged state naming the current PowerShell PID is refused without killing it
- the real verified server starts, accepts authenticated identity with the same key, stops, restarts, recovers identity, and stops again

Each negative test must observe the expected failure. Catching an assertion generated by the test itself does not count. Fixtures and evidence remain under the explicit test root; the script performs no recursive cleanup.

## Meaningful failure and recovery exercise

### Baseline task

Start on port 11842 and run the supplied conformance suite with a newly generated key and a new receipt directory. This standalone sequence retains the same key through Start, the client, and the ownership-checked Stop:

```powershell
$receiptRoot = 'C:\p42-labs\serving-receipts-baseline-v2'
New-Item -ItemType Directory -Path $receiptRoot -ErrorAction Stop
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$started = $false
try {
    $bytes = [byte[]]::new(32)
    $rng.GetBytes($bytes)
    $env:P42_SERVING_API_KEY = [Convert]::ToHexString($bytes)
    [Array]::Clear($bytes, 0, $bytes.Length)

    ./Start-ServingLab.ps1 -Workspace $workspace -Port 11842
    $started = $true
    python conformance.py --port 11842 --output (Join-Path $receiptRoot 'receipt-11842.json')
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

Review the receipt before drawing a conclusion. A real nonempty completion establishes inference for that request. It does not establish every OpenAI field, tool calling, multimodal behavior, production capacity, or safety behavior.

### Changed task: move to port 11901

The complete change is to start an owned baseline process, stop it through its verified state, restart the same verified artifacts on the new port, and rerun every endpoint and recovery check against that port. This standalone sequence generates the key first, uses that same key for every Start, client, and Stop operation, checks explicitly for state before each conditional cleanup, and does not swallow a Stop failure:

```powershell
$receiptRoot = 'C:\p42-labs\serving-receipts-port-change-v2'
New-Item -ItemType Directory -Path $receiptRoot -ErrorAction Stop
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try {
    $bytes = [byte[]]::new(32)
    $rng.GetBytes($bytes)
    $env:P42_SERVING_API_KEY = [Convert]::ToHexString($bytes)
    [Array]::Clear($bytes, 0, $bytes.Length)

    ./Start-ServingLab.ps1 -Workspace $workspace -Port 11842
    $statePath = Join-Path $workspace 'server-state.json'
    if (-not (Test-Path -LiteralPath $statePath -PathType Leaf)) {
        throw 'Expected owned server state after the baseline start.'
    }
    ./Stop-ServingLab.ps1 -Workspace $workspace

    ./Start-ServingLab.ps1 -Workspace $workspace -Port 11901
    python conformance.py --port 11901 --output (Join-Path $receiptRoot 'receipt-11901.json')
    if ($LASTEXITCODE -ne 0) { throw "conformance.py exited with code $LASTEXITCODE" }
}
finally {
    try {
        $statePath = Join-Path $workspace 'server-state.json'
        if (Test-Path -LiteralPath $statePath -PathType Leaf) {
            ./Stop-ServingLab.ps1 -Workspace $workspace
        }
    }
    finally {
        Remove-Item Env:P42_SERVING_API_KEY -ErrorAction SilentlyContinue
        $rng.Dispose()
    }
}
```

Do not ignore a missing-state error and do not kill by process name. If a sequence expects a running owned server, require `server-state.json` to exist before invoking Stop. If no state exists during conditional final cleanup, there is no recorded process for Stop to verify.

The causal expectation is narrow: changing `-Port` changes the loopback listener and the URLs used by conformance. It does not change the model hash, runtime hash, alias, authentication source, context size, threads, GPU layers, or parallelism. Verification is complete only if `server-state.json` records port 11901, its PID/path/start-time ownership checks succeed, the owned PID listens on `127.0.0.1:11901`, authenticated identity still reports `p42-qwen3-06b`, actual bounded and streaming inference are observed, and restart recovery is recorded. A public health response by itself is insufficient.

## Common failures and causal recovery

- **Pinned size or hash failure:** The bytes are not the required artifact even if the filename looks correct. Preserve the failed workspace, obtain the exact pinned artifact, and use a new workspace. Do not edit the manifest to match bad bytes.
- **Unsafe or excessive redirect:** Setup refused the transfer before trusting content. Check proxy and network policy, then retrieve the canonical public artifact through an approved HTTPS path. The final bytes must still pass the pin.
- **Runtime tree mismatch:** A DLL, executable, or other runtime file is missing, changed, or extra. Recreate a new workspace from the verified ZIP. Copying only `llama-server.exe` is not sufficient.
- **Missing key:** Set `P42_SERVING_API_KEY` in the same PowerShell process and retry. Do not add `--api-key` to the command.
- **Occupied port:** Another process owns the requested port. Choose a different port or stop that process through its own ownership procedure. This lab will not kill it.
- **Readiness timeout or early exit:** Inspect the unique redacted `server.log`. Check CPU and memory availability and artifact verification. Report failure unless a later fresh start and conformance run demonstrate recovery.
- **Stop refusal:** PID reuse, a forged state, or changed executable identity may be present. Preserve the evidence and investigate. Do not bypass the refusal with a name-based kill.
- **Client timeout:** Record a client timeout. Do not relabel it server cancellation. Send a fresh bounded request to observe whether service recovered.
- **Overload not observed:** Record `not-observed`. Do not invent a rate-limit capability or status code.

## Compatibility boundary

The pinned llama.cpp documentation describes `/v1/chat/completions` as an OpenAI-compatible chat endpoint and `/completion` as a native endpoint. This lab tests only its named subset. It does not certify full OpenAI compatibility, all roles or parameters, tool calls, structured output, multimodal input, exact token accounting, every error body, or production authorization policy.

## ASSUMPTIONS.

The learner has Windows x64, PowerShell 7.6+, CPython 3.13.9 Windows, permission to create the chosen absolute directories, and either network access to the canonical public artifact URLs or a cache containing the exact pinned files. CPython 3.13.9 Windows is the qualification; other Python patch or minor versions are not claimed as tested. The supplied `conformance.py` in this lab folder implements the stated integration contract.

## OMITTED.

No successful learner execution, performance result, memory figure, cancellation result, overload result, or compatibility capability is claimed without a generated receipt.
