#requires -Version 7.6
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'Serving-Time.ps1')

$utc = [datetime]::SpecifyKind(
    [datetime]::ParseExact('2026-09-20T07:58:18.2054388', 'yyyy-MM-ddTHH:mm:ss.fffffff', [Globalization.CultureInfo]::InvariantCulture),
    [DateTimeKind]::Utc)
$utcText = '2026-09-20T07:58:18.2054388Z'
$offsetText = '2026-09-20T09:58:18.2054388+02:00'

$fromDateTime = ConvertTo-UtcDateTime $utc
$fromUtcText = ConvertTo-UtcDateTime $utcText
$fromOffsetText = ConvertTo-UtcDateTime $offsetText
if ($fromDateTime.Ticks -ne $fromUtcText.Ticks -or $fromUtcText.Ticks -ne $fromOffsetText.Ticks) {
    throw 'UTC DateTime, UTC ISO text, and offset ISO text did not represent the same instant.'
}
if ($fromDateTime.Kind -ne [DateTimeKind]::Utc -or $fromUtcText.Kind -ne [DateTimeKind]::Utc -or $fromOffsetText.Kind -ne [DateTimeKind]::Utc) {
    throw 'Timestamp conversion did not return UTC DateTime values.'
}

foreach ($malformed in @(
    '2026-09-20T07:58:18.2054388',
    '2026-09-20T07:58:18.2054388Z-not-valid',
    '2026-99-99T07:58:18.2054388Z')) {
    $rejected = $false
    try { [void](ConvertTo-UtcDateTime $malformed) } catch { $rejected = $true }
    if (-not $rejected) { throw "Malformed timestamp was accepted: $malformed" }
}

Write-Output 'Serving timestamp conversion tests passed.'
