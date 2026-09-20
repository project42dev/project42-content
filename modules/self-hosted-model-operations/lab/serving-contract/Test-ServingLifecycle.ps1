#requires -Version 7.6
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$Workspace,
    [Parameter(Mandatory)][string]$TestRoot,
    [ValidateRange(1024,65535)][int]$Port = 11842
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Absolute([string]$Path) {
    if (-not [IO.Path]::IsPathRooted($Path)) { throw "Path must be absolute: $Path" }
    [IO.Path]::GetFullPath($Path)
}
function New-TestDirectory([string]$Parent, [string]$Name) {
    $path = Join-Path $Parent ($Name + '-' + [guid]::NewGuid().ToString('N'))
    [void][IO.Directory]::CreateDirectory($path)
    return $path
}
function Assert-Fails([scriptblock]$Body, [string]$Pattern, [string]$Name) {
    $didFail = $false
    try { & $Body } catch {
        $didFail = $true
        if ($_.Exception.Message -notmatch $Pattern) {
            throw "$Name failed for an unexpected reason: $($_.Exception.Message)"
        }
    }
    if (-not $didFail) { throw "$Name did not detect the defect." }
    Write-Host "OBSERVED negative test: $Name"
}
function Invoke-AuthenticatedModels([int]$ListenPort, [string]$Key) {
    $headers = @{ Authorization = "Bearer $Key" }
    $result = Invoke-RestMethod -Uri "http://127.0.0.1:$ListenPort/v1/models" -Headers $headers -TimeoutSec 10
    $ids = @($result.data | ForEach-Object { [string]$_.id })
    if ($ids -notcontains 'p42-qwen3-06b') { throw 'Authenticated same-key identity check failed.' }
}

$workspaceRoot = Absolute $Workspace
$testRootPath = Absolute $TestRoot
if (-not (Test-Path -LiteralPath $workspaceRoot -PathType Container)) { throw 'Prepared workspace is required.' }
if (-not (Test-Path -LiteralPath $testRootPath -PathType Container)) { throw 'TestRoot must already exist.' }
if ([string]::IsNullOrEmpty([Environment]::GetEnvironmentVariable('P42_SERVING_API_KEY','Process'))) {
    throw 'P42_SERVING_API_KEY is required for positive lifecycle tests.'
}
if (Test-Path -LiteralPath (Join-Path $workspaceRoot 'server-state.json')) {
    throw 'Prepared workspace must be stopped before testing.'
}

$setup = Join-Path $PSScriptRoot 'Setup-ServingLab.ps1'
$start = Join-Path $PSScriptRoot 'Start-ServingLab.ps1'
$stop = Join-Path $PSScriptRoot 'Stop-ServingLab.ps1'

$preserve = New-TestDirectory $testRootPath 'existing-file-preservation'
$sentinel = Join-Path $preserve 'sentinel.txt'
[IO.File]::WriteAllText($sentinel, 'retain-exactly', [Text.UTF8Encoding]::new($false))
Assert-Fails { & $setup -Workspace $preserve } 'missing|Pinned artifact' 'existing-file preservation'
if ([IO.File]::ReadAllText($sentinel) -ne 'retain-exactly') { throw 'Existing sentinel was modified.' }

$badCache = New-TestDirectory $testRootPath 'bad-cache'
$sourceZip = Join-Path $workspaceRoot 'artifacts/llama-b10964-bin-win-cpu-x64.zip'
$badZip = Join-Path $badCache 'llama-b10964-bin-win-cpu-x64.zip'
[IO.File]::Copy($sourceZip, $badZip, $false)
$stream = [IO.File]::Open($badZip, [IO.FileMode]::Open, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
try {
    $first = $stream.ReadByte()
    if ($first -lt 0) { throw 'Runtime ZIP fixture was empty.' }
    $stream.Position = 0
    $stream.WriteByte(($first -bxor 1))
} finally { $stream.Dispose() }
$badWorkspace = Join-Path $testRootPath ('bad-artifact-workspace-' + [guid]::NewGuid().ToString('N'))
Assert-Fails { & $setup -Workspace $badWorkspace -ArtifactCache $badCache } 'hash failed' 'bad artifact byte and hash'

$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Parse('127.0.0.1'), $Port)
$listener.Start()
try {
    Assert-Fails { & $start -Workspace $workspaceRoot -Port $Port } 'occupied' 'occupied port fail-closed'
} finally { $listener.Stop() }
if (Test-Path -LiteralPath (Join-Path $workspaceRoot 'server-state.json')) { throw 'Occupied-port test unexpectedly created server state.' }

$forged = New-TestDirectory $testRootPath 'unrelated-pid'
[void][IO.Directory]::CreateDirectory((Join-Path $forged 'runtime'))
$fakeExe = Join-Path $forged 'runtime/llama-server.exe'
[IO.File]::WriteAllBytes($fakeExe, [byte[]](0))
$current = Get-Process -Id $PID
$fakeState = [ordered]@{
    pid = $PID
    startTimeUtc = $current.StartTime.ToUniversalTime().ToString('o')
    exePath = $fakeExe
    port = $Port
    alias = 'p42-qwen3-06b'
} | ConvertTo-Json
[IO.File]::WriteAllText((Join-Path $forged 'server-state.json'), $fakeState, [Text.UTF8Encoding]::new($false))
Assert-Fails { & $stop -Workspace $forged } 'path does not match|refusing' 'unrelated PID refusal'
if ($current.HasExited) { throw 'Unrelated PowerShell process was stopped.' }

$key = [Environment]::GetEnvironmentVariable('P42_SERVING_API_KEY','Process')
$positiveCompleted = $false
try {
    & $start -Workspace $workspaceRoot -Port $Port
    Invoke-AuthenticatedModels $Port $key
    & $stop -Workspace $workspaceRoot
    & $start -Workspace $workspaceRoot -Port $Port
    Invoke-AuthenticatedModels $Port $key
    & $stop -Workspace $workspaceRoot
    $positiveCompleted = $true
} finally {
    if (Test-Path -LiteralPath (Join-Path $workspaceRoot 'server-state.json')) {
        try { & $stop -Workspace $workspaceRoot } catch { Write-Warning "Safety cleanup could not stop the recorded server: $($_.Exception.Message)" }
    }
}
if (-not $positiveCompleted) { throw 'Positive start-stop-start recovery was not completed.' }
Write-Host 'OBSERVED positive lifecycle: start, same-key authenticated identity, stop, restart, identity recovery, stop.'
Write-Host "Fixtures and evidence were preserved under: $testRootPath"
