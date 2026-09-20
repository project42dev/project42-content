#requires -Version 7.0
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$Workspace,
    [Parameter(Mandatory)][ValidateRange(1024,65535)][int]$Port
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RuntimeBytes = [int64]18427629
$RuntimeHash = '917f39c076402c421224824607397af20f53625a60defc20e8dd22446bf4c5d7'
$ModelBytes = [int64]639446688
$ModelHash = '9465e63a22add5354d9bb4b99e90117043c7124007664907259bd16d043bb031'
$Alias = 'p42-qwen3-06b'

function Get-AbsolutePath([string]$Path) {
    if (-not [IO.Path]::IsPathRooted($Path)) { throw "Path must be absolute: $Path" }
    return [IO.Path]::GetFullPath($Path)
}
function Get-Sha256([string]$Path) { (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant() }
function Assert-PinnedFile([string]$Path, [int64]$Bytes, [string]$Hash) {
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { throw "Pinned file missing: $Path" }
    $item = Get-Item -LiteralPath $Path
    if ($item.Length -ne $Bytes -or (Get-Sha256 $Path) -ne $Hash) { throw "Pinned verification failed: $Path" }
}
function Get-ZipRelative([IO.Compression.ZipArchiveEntry]$Entry) {
    $name = $Entry.FullName.Replace('\','/')
    if ($name.StartsWith('/') -or $name.Contains(':')) { throw "Unsafe ZIP entry: $name" }
    $parts = $name.Split('/', [StringSplitOptions]::RemoveEmptyEntries)
    if ($parts.Count -eq 0 -or $parts -contains '..' -or $parts -contains '.') { throw "Unsafe ZIP entry: $name" }
    return ($parts -join [IO.Path]::DirectorySeparatorChar)
}
function Assert-RuntimeTree([string]$ZipPath, [string]$RuntimePath) {
    $expected = [Collections.Generic.Dictionary[string,string]]::new([StringComparer]::OrdinalIgnoreCase)
    $sha = [Security.Cryptography.SHA256]::Create()
    $archive = [IO.Compression.ZipFile]::OpenRead($ZipPath)
    try {
        foreach ($entry in $archive.Entries) {
            $relative = Get-ZipRelative $entry
            if ($entry.FullName.EndsWith('/') -or $entry.FullName.EndsWith('\')) { continue }
            if ($expected.ContainsKey($relative)) { throw "Duplicate runtime ZIP entry: $relative" }
            $stream = $entry.Open()
            try { $digest = [Convert]::ToHexString($sha.ComputeHash($stream)).ToLowerInvariant() } finally { $stream.Dispose() }
            $expected.Add($relative, $digest)
        }
    } finally { $archive.Dispose(); $sha.Dispose() }
    $files = Get-ChildItem -LiteralPath $RuntimePath -File -Recurse
    if ($files.Count -ne $expected.Count) { throw 'Extracted runtime file count does not match the pinned ZIP.' }
    foreach ($file in $files) {
        $relative = [IO.Path]::GetRelativePath($RuntimePath, $file.FullName)
        if (-not $expected.ContainsKey($relative) -or (Get-Sha256 $file.FullName) -ne $expected[$relative]) {
            throw "Extracted runtime verification failed: $relative"
        }
    }
}
function Write-NewUtf8([string]$Path, [string]$Text) {
    $stream = [IO.File]::Open($Path, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
    try {
        $writer = [IO.StreamWriter]::new($stream, [Text.UTF8Encoding]::new($false))
        try { $writer.Write($Text) } finally { $writer.Dispose() }
    } finally { if ($null -ne $stream) { $stream.Dispose() } }
}
function Test-ProcessIdentity([int]$Id, [string]$ExpectedPath, [datetime]$ExpectedStart) {
    $process = Get-Process -Id $Id -ErrorAction SilentlyContinue
    if ($null -eq $process) { return $false }
    try {
        $pathMatches = [IO.Path]::GetFullPath($process.Path) -eq [IO.Path]::GetFullPath($ExpectedPath)
        $startMatches = [Math]::Abs(($process.StartTime.ToUniversalTime() - $ExpectedStart.ToUniversalTime()).TotalSeconds) -le 1
        return $pathMatches -and $startMatches
    } catch { return $false }
}
function Test-OwnedListener([int]$Id, [int]$ListenPort) {
    $connections = @(Get-NetTCPConnection -State Listen -LocalPort $ListenPort -ErrorAction SilentlyContinue |
        Where-Object { $_.LocalAddress -eq '127.0.0.1' -and $_.OwningProcess -eq $Id })
    return $connections.Count -gt 0
}

. (Join-Path $PSScriptRoot 'Serving-Time.ps1')

$root = Get-AbsolutePath $Workspace
if (-not (Test-Path -LiteralPath $root -PathType Container)) { throw 'Workspace does not exist; run setup first.' }
$runtimePath = Join-Path $root 'runtime'
$exe = [IO.Path]::GetFullPath((Join-Path $runtimePath 'llama-server.exe'))
$model = [IO.Path]::GetFullPath((Join-Path $root 'model.gguf'))
$zip = Join-Path $root 'artifacts/llama-b10964-bin-win-cpu-x64.zip'
$statePath = Join-Path $root 'server-state.json'
if (Test-Path -LiteralPath $statePath) { throw 'server-state.json already exists. Stop or investigate the recorded server before starting.' }

Assert-PinnedFile $zip $RuntimeBytes $RuntimeHash
Assert-PinnedFile $model $ModelBytes $ModelHash
Assert-RuntimeTree $zip $runtimePath
if (-not (Test-Path -LiteralPath $exe -PathType Leaf)) { throw 'Verified runtime does not contain llama-server.exe.' }

$key = [Environment]::GetEnvironmentVariable('P42_SERVING_API_KEY', 'Process')
if ([string]::IsNullOrEmpty($key)) { throw 'P42_SERVING_API_KEY is required in the current process environment.' }

$probe = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Parse('127.0.0.1'), $Port)
try {
    $probe.Start()
} catch {
    throw "Port $Port is already occupied on loopback; no process was killed."
} finally {
    try { $probe.Stop() } catch { }
}

$evidenceRoot = Join-Path $root 'evidence'
if (-not (Test-Path -LiteralPath $evidenceRoot)) { [void][IO.Directory]::CreateDirectory($evidenceRoot) }
$session = Join-Path $evidenceRoot ('session-' + [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssfffffffZ') + '-' + [guid]::NewGuid().ToString('N'))
[void][IO.Directory]::CreateDirectory($session)
$requestPath = Join-Path $session 'launch-request.json'
$launchPath = Join-Path $session 'child-identity.json'
$abortPath = Join-Path $session 'abort.requested'
$logPath = Join-Path $session 'server.log'
$helperPath = Join-Path $PSScriptRoot 'Invoke-ServingChild.ps1'
if (-not (Test-Path -LiteralPath $helperPath -PathType Leaf)) { throw 'Invoke-ServingChild.ps1 is missing.' }

$arguments = @(
    '--model', $model,
    '--host', '127.0.0.1',
    '--port', [string]$Port,
    '--alias', $Alias,
    '--n-gpu-layers', '0',
    '--threads', '2',
    '--ctx-size', '2048',
    '--parallel', '1',
    '--no-webui',
    '--chat-template-kwargs', '{"enable_thinking":false}'
)
$requestObject = [ordered]@{
    exePath = $exe
    workingDirectory = $root
    arguments = $arguments
    logPath = $logPath
    launchPath = $launchPath
    abortPath = $abortPath
}
Write-NewUtf8 $requestPath ($requestObject | ConvertTo-Json -Depth 5)

$pwsh = [IO.Path]::GetFullPath((Get-Process -Id $PID).Path)
$helperInfo = [Diagnostics.ProcessStartInfo]::new()
$helperInfo.FileName = $pwsh
$helperInfo.UseShellExecute = $false
$helperInfo.CreateNoWindow = $true
$helperInfo.WindowStyle = 'Hidden'
[void]$helperInfo.ArgumentList.Add('-NoLogo')
[void]$helperInfo.ArgumentList.Add('-NoProfile')
[void]$helperInfo.ArgumentList.Add('-NonInteractive')
[void]$helperInfo.ArgumentList.Add('-File')
[void]$helperInfo.ArgumentList.Add($helperPath)
[void]$helperInfo.ArgumentList.Add('-Request')
[void]$helperInfo.ArgumentList.Add($requestPath)
$helperInfo.Environment.Remove('P42_SERVING_API_KEY')
$helperInfo.Environment['LLAMA_API_KEY'] = $key
$helper = [Diagnostics.Process]::new()
$helper.StartInfo = $helperInfo
if (-not $helper.Start()) { throw 'Hidden child logger failed to start.' }

$serverPid = $null
$serverStart = $null
$ready = $false
try {
    $launchWatch = [Diagnostics.Stopwatch]::StartNew()
    while ($launchWatch.Elapsed.TotalSeconds -lt 15) {
        if ($helper.HasExited) { throw "Child logger exited before server identity was recorded. See $session" }
        if (Test-Path -LiteralPath $launchPath -PathType Leaf) {
            try {
                $launch = Get-Content -LiteralPath $launchPath -Raw | ConvertFrom-Json
                $serverPid = [int]$launch.pid
                $serverStart = ConvertTo-UtcDateTime $launch.startTimeUtc
                break
            } catch { }
        }
        Start-Sleep -Milliseconds 100
    }
    if ($null -eq $serverPid) { throw 'Timed out waiting for the owned server process identity.' }

    $headers = @{ Authorization = "Bearer $key" }
    $readyWatch = [Diagnostics.Stopwatch]::StartNew()
    $healthUri = "http://127.0.0.1:$Port/health"
    $modelsUri = "http://127.0.0.1:$Port/v1/models"
    while ($readyWatch.Elapsed.TotalSeconds -lt 120) {
        if (-not (Test-ProcessIdentity $serverPid $exe $serverStart)) { throw 'Owned server exited or changed identity during startup.' }
        if ($helper.HasExited) { throw "Child logger exited during startup. See $logPath" }
        if (-not (Test-OwnedListener $serverPid $Port)) { Start-Sleep -Milliseconds 250; continue }
        try {
            $health = Invoke-RestMethod -Uri $healthUri -Method Get -TimeoutSec 2
            if ([string]$health.status -ne 'ok') { Start-Sleep -Milliseconds 250; continue }
            $models = Invoke-RestMethod -Uri $modelsUri -Method Get -Headers $headers -TimeoutSec 3
            $ids = @($models.data | ForEach-Object { [string]$_.id })
            if ($ids -notcontains $Alias) { throw 'Authenticated model identity did not contain the required alias.' }
            if (-not (Test-ProcessIdentity $serverPid $exe $serverStart) -or -not (Test-OwnedListener $serverPid $Port)) {
                throw 'Ownership changed after readiness checks.'
            }
            $ready = $true
            break
        } catch {
            if ($_.Exception.Message -match 'required alias|Ownership changed') { throw }
        }
        Start-Sleep -Milliseconds 250
    }
    if (-not $ready) { throw "Readiness timed out. Inspect $logPath" }

    $state = [ordered]@{
        pid = $serverPid
        startTimeUtc = $serverStart.ToString('o')
        exePath = $exe
        port = $Port
        alias = $Alias
    }
    Write-NewUtf8 $statePath ($state | ConvertTo-Json)
    Write-Host "Owned server is ready at http://127.0.0.1:$Port"
    Write-Host "Server evidence directory: $session"
} catch {
    try { Write-NewUtf8 $abortPath ([DateTime]::UtcNow.ToString('o')) } catch { }
    if ($null -ne $serverPid -and $null -ne $serverStart -and (Test-ProcessIdentity $serverPid $exe $serverStart)) {
        try { (Get-Process -Id $serverPid).WaitForExit(10000) } catch { }
    }
    throw
} finally {
    $key = $null
}
