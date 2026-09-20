#requires -Version 7.0
[CmdletBinding()]
param([Parameter(Mandatory)][string]$Workspace)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-AbsolutePath([string]$Path) {
    if (-not [IO.Path]::IsPathRooted($Path)) { throw "Path must be absolute: $Path" }
    return [IO.Path]::GetFullPath($Path)
}
function Write-NewUtf8([string]$Path, [string]$Text) {
    $stream = [IO.File]::Open($Path, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
    try {
        $writer = [IO.StreamWriter]::new($stream, [Text.UTF8Encoding]::new($false))
        try { $writer.Write($Text) } finally { $writer.Dispose() }
    } finally { if ($null -ne $stream) { $stream.Dispose() } }
}

. (Join-Path $PSScriptRoot 'Serving-Time.ps1')

$root = Get-AbsolutePath $Workspace
$statePath = Join-Path $root 'server-state.json'
$canonicalExe = [IO.Path]::GetFullPath((Join-Path $root 'runtime/llama-server.exe'))
if (-not (Test-Path -LiteralPath $statePath -PathType Leaf)) {
    throw 'No server-state.json exists. Refusing to search for or kill any process.'
}

$state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
$recordedExe = [IO.Path]::GetFullPath([string]$state.exePath)
if ($recordedExe -ne $canonicalExe) { throw 'Recorded executable is not the canonical workspace executable; refusing to stop.' }
if ([string]$state.alias -ne 'p42-qwen3-06b') { throw 'Recorded alias is invalid; refusing to stop.' }
$recordedPort = [int]$state.port
if ($recordedPort -lt 1024 -or $recordedPort -gt 65535) { throw 'Recorded port is invalid; refusing to stop.' }
$recordedStart = ConvertTo-UtcDateTime $state.startTimeUtc
$recordedPid = [int]$state.pid
$process = Get-Process -Id $recordedPid -ErrorAction SilentlyContinue

if ($null -ne $process) {
    $actualPath = try { [IO.Path]::GetFullPath($process.Path) } catch { '' }
    $actualStart = try { $process.StartTime.ToUniversalTime() } catch { [datetime]::MinValue }
    if ($actualPath -ne $canonicalExe) { throw 'PID executable path does not match the canonical workspace executable; refusing to stop.' }
    if ([Math]::Abs(($actualStart - $recordedStart).TotalSeconds) -gt 1) { throw 'PID start time does not match the recorded process; refusing to stop.' }

    $process.Kill($true)
    if (-not $process.WaitForExit(15000)) { throw 'Owned server did not exit within 15 seconds.' }
}

$evidenceRoot = Join-Path $root 'evidence'
if (-not (Test-Path -LiteralPath $evidenceRoot)) { [void][IO.Directory]::CreateDirectory($evidenceRoot) }
$stopDirectory = Join-Path $evidenceRoot ('stop-' + [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssfffffffZ') + '-' + [guid]::NewGuid().ToString('N'))
[void][IO.Directory]::CreateDirectory($stopDirectory)
$archivedState = Join-Path $stopDirectory 'server-state.json'
if (Test-Path -LiteralPath $archivedState) { throw 'Archive collision; refusing to overwrite evidence.' }
[IO.File]::Move($statePath, $archivedState)

$result = [ordered]@{
    observedAtUtc = [DateTime]::UtcNow.ToString('o')
    pid = $recordedPid
    startTimeUtc = $recordedStart.ToString('o')
    exePath = $canonicalExe
    port = $recordedPort
    alias = 'p42-qwen3-06b'
    processWasPresent = ($null -ne $process)
    stopOutcome = if ($null -eq $process) { 'recorded-process-already-absent' } else { 'owned-process-stopped' }
}
Write-NewUtf8 (Join-Path $stopDirectory 'stop-observation.json') ($result | ConvertTo-Json)
Write-Host "Stop evidence preserved at: $stopDirectory"
Write-Host $result.stopOutcome
