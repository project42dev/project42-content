#requires -Version 7.6
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$Workspace,
    [string]$ArtifactCache
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RuntimeName = 'llama-b10964-bin-win-cpu-x64.zip'
$RuntimeUrl = 'https://github.com/ggml-org/llama.cpp/releases/download/b10964/llama-b10964-bin-win-cpu-x64.zip'
$RuntimeBytes = [int64]18427629
$RuntimeHash = '917f39c076402c421224824607397af20f53625a60defc20e8dd22446bf4c5d7'
$ModelName = 'Qwen3-0.6B-Q8_0.gguf'
$ModelUrl = 'https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/resolve/23749fefcc72300e3a2ad315e1317431b06b590a/Qwen3-0.6B-Q8_0.gguf'
$ModelBytes = [int64]639446688
$ModelHash = '9465e63a22add5354d9bb4b99e90117043c7124007664907259bd16d043bb031'

function Get-FullPath([string]$Path) {
    if (-not [IO.Path]::IsPathRooted($Path)) {
        throw "Path must be absolute: $Path"
    }
    return [IO.Path]::GetFullPath($Path)
}

function Get-Sha256([string]$Path) {
    return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Assert-PinnedFile([string]$Path, [int64]$Bytes, [string]$Sha256) {
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "Pinned artifact is missing: $Path"
    }
    $item = Get-Item -LiteralPath $Path
    if ($item.Length -ne $Bytes) {
        throw "Pinned artifact size failed for $Path. Expected $Bytes bytes, observed $($item.Length)."
    }
    $observed = Get-Sha256 $Path
    if ($observed -ne $Sha256) {
        throw "Pinned artifact hash failed for $Path."
    }
}

function Write-NewUtf8([string]$Path, [string]$Text) {
    $encoding = [Text.UTF8Encoding]::new($false)
    $stream = [IO.File]::Open($Path, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
    try {
        $writer = [IO.StreamWriter]::new($stream, $encoding)
        try { $writer.Write($Text) } finally { $writer.Dispose() }
    } finally {
        if ($null -ne $stream) { $stream.Dispose() }
    }
}

function Copy-NewFile([string]$Source, [string]$Destination) {
    if (Test-Path -LiteralPath $Destination) {
        throw "Refusing to overwrite: $Destination"
    }
    [IO.File]::Copy($Source, $Destination, $false)
}

function Receive-PublicHttpsFile([string]$Url, [string]$Destination) {
    if (Test-Path -LiteralPath $Destination) {
        throw "Refusing to overwrite download destination: $Destination"
    }

    $handler = [Net.Http.HttpClientHandler]::new()
    $handler.AllowAutoRedirect = $false
    $client = [Net.Http.HttpClient]::new($handler)
    $client.Timeout = [TimeSpan]::FromMinutes(45)
    $client.DefaultRequestHeaders.UserAgent.ParseAdd('Project42-ServingLab/1.0')
    $current = [Uri]$Url

    try {
        for ($redirects = 0; $redirects -le 8; $redirects++) {
            if ($current.Scheme -ne 'https' -or -not [string]::IsNullOrEmpty($current.UserInfo)) {
                throw "Unsafe download URL rejected: $current"
            }

            $response = $client.GetAsync($current, [Net.Http.HttpCompletionOption]::ResponseHeadersRead).GetAwaiter().GetResult()
            try {
                $code = [int]$response.StatusCode
                if ($code -in 301,302,303,307,308) {
                    if ($redirects -eq 8 -or $null -eq $response.Headers.Location) {
                        throw 'Download redirect limit or missing redirect location.'
                    }
                    $next = if ($response.Headers.Location.IsAbsoluteUri) {
                        $response.Headers.Location
                    } else {
                        [Uri]::new($current, $response.Headers.Location)
                    }
                    if ($next.Scheme -ne 'https' -or -not [string]::IsNullOrEmpty($next.UserInfo)) {
                        throw "Unsafe redirect rejected: $next"
                    }
                    $current = $next
                    continue
                }

                if (-not $response.IsSuccessStatusCode) {
                    throw "Download failed with HTTP $code from $current"
                }

                $input = $response.Content.ReadAsStream()
                $output = [IO.File]::Open($Destination, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
                try { $input.CopyTo($output) } finally { $output.Dispose(); $input.Dispose() }
                return
            } finally {
                $response.Dispose()
            }
        }
        throw 'Download redirect limit exceeded.'
    } finally {
        $client.Dispose()
        $handler.Dispose()
    }
}

function Get-ZipEntryRelativePath([IO.Compression.ZipArchiveEntry]$Entry) {
    $name = $Entry.FullName.Replace('\','/')
    if ([string]::IsNullOrWhiteSpace($name)) { throw 'ZIP contains an empty entry name.' }
    if ($name.StartsWith('/') -or $name.Contains(':')) { throw "Unsafe ZIP entry: $name" }
    $parts = $name.Split('/', [StringSplitOptions]::RemoveEmptyEntries)
    if ($parts.Count -eq 0 -or $parts -contains '..' -or $parts -contains '.') {
        throw "Unsafe ZIP entry: $name"
    }
    return ($parts -join [IO.Path]::DirectorySeparatorChar)
}

function Expand-PinnedRuntime([string]$ZipPath, [string]$Destination) {
    if (Test-Path -LiteralPath $Destination) { throw "Refusing to overwrite runtime directory: $Destination" }
    [void][IO.Directory]::CreateDirectory($Destination)
    $root = [IO.Path]::GetFullPath($Destination)
    $prefix = $root.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
    $seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $archive = [IO.Compression.ZipFile]::OpenRead($ZipPath)
    try {
        foreach ($entry in $archive.Entries) {
            $relative = Get-ZipEntryRelativePath $entry
            if (-not $seen.Add($relative)) { throw "Duplicate ZIP entry: $relative" }
            $target = [IO.Path]::GetFullPath((Join-Path $root $relative))
            if (-not $target.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) {
                throw "ZIP entry escapes the runtime directory: $($entry.FullName)"
            }
            $isDirectory = $entry.FullName.EndsWith('/') -or $entry.FullName.EndsWith('\')
            if ($isDirectory) {
                [void][IO.Directory]::CreateDirectory($target)
                continue
            }
            $parent = [IO.Path]::GetDirectoryName($target)
            [void][IO.Directory]::CreateDirectory($parent)
            $source = $entry.Open()
            $output = [IO.File]::Open($target, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
            try { $source.CopyTo($output) } finally { $output.Dispose(); $source.Dispose() }
        }
    } finally {
        $archive.Dispose()
    }
    if (-not (Test-Path -LiteralPath (Join-Path $root 'llama-server.exe') -PathType Leaf)) {
        throw 'Pinned runtime ZIP did not contain runtime/llama-server.exe at its root.'
    }
}

function Assert-RuntimeTree([string]$ZipPath, [string]$RuntimePath) {
    if (-not (Test-Path -LiteralPath $RuntimePath -PathType Container)) { throw 'Runtime directory is missing.' }
    $expected = [Collections.Generic.Dictionary[string,string]]::new([StringComparer]::OrdinalIgnoreCase)
    $sha = [Security.Cryptography.SHA256]::Create()
    $archive = [IO.Compression.ZipFile]::OpenRead($ZipPath)
    try {
        foreach ($entry in $archive.Entries) {
            $relative = Get-ZipEntryRelativePath $entry
            if ($entry.FullName.EndsWith('/') -or $entry.FullName.EndsWith('\')) { continue }
            if ($expected.ContainsKey($relative)) { throw "Duplicate ZIP file entry: $relative" }
            $stream = $entry.Open()
            try { $digest = [Convert]::ToHexString($sha.ComputeHash($stream)).ToLowerInvariant() } finally { $stream.Dispose() }
            $expected.Add($relative, $digest)
        }
    } finally {
        $archive.Dispose()
        $sha.Dispose()
    }

    $actual = Get-ChildItem -LiteralPath $RuntimePath -File -Recurse
    if ($actual.Count -ne $expected.Count) {
        throw "Runtime tree file count failed. Expected $($expected.Count), observed $($actual.Count)."
    }
    foreach ($file in $actual) {
        $relative = [IO.Path]::GetRelativePath($RuntimePath, $file.FullName)
        if (-not $expected.ContainsKey($relative)) { throw "Unexpected runtime file: $relative" }
        if ((Get-Sha256 $file.FullName) -ne $expected[$relative]) { throw "Runtime file hash failed: $relative" }
    }
}

$root = Get-FullPath $Workspace
$artifacts = Join-Path $root 'artifacts'
$runtimeZip = Join-Path $artifacts $RuntimeName
$modelPath = Join-Path $root 'model.gguf'
$runtimePath = Join-Path $root 'runtime'
$manifestPath = Join-Path $root 'workspace-manifest.json'

if (Test-Path -LiteralPath $root) {
    Assert-PinnedFile $runtimeZip $RuntimeBytes $RuntimeHash
    Assert-PinnedFile $modelPath $ModelBytes $ModelHash
    Assert-RuntimeTree $runtimeZip $runtimePath
    if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
        throw 'Existing files match artifacts, but the exclusive setup manifest is missing. Refusing to modify the directory.'
    }
    Write-Host "Existing workspace independently verified; no file was changed: $root"
    exit 0
}

$parent = [IO.Path]::GetDirectoryName($root.TrimEnd([IO.Path]::DirectorySeparatorChar))
if (-not (Test-Path -LiteralPath $parent -PathType Container)) {
    throw "Workspace parent must already exist: $parent"
}
[void][IO.Directory]::CreateDirectory($root)
$stage = Join-Path $root ('setup-stage-' + [guid]::NewGuid().ToString('N'))
[void][IO.Directory]::CreateDirectory($stage)
$stageZip = Join-Path $stage $RuntimeName
$stageModel = Join-Path $stage $ModelName
$stageRuntime = Join-Path $stage 'runtime'

if ([string]::IsNullOrWhiteSpace($ArtifactCache)) {
    Receive-PublicHttpsFile $RuntimeUrl $stageZip
    Assert-PinnedFile $stageZip $RuntimeBytes $RuntimeHash
    Receive-PublicHttpsFile $ModelUrl $stageModel
    Assert-PinnedFile $stageModel $ModelBytes $ModelHash
} else {
    $cache = Get-FullPath $ArtifactCache
    $cacheZip = Join-Path $cache $RuntimeName
    $cacheModel = Join-Path $cache $ModelName
    Assert-PinnedFile $cacheZip $RuntimeBytes $RuntimeHash
    Assert-PinnedFile $cacheModel $ModelBytes $ModelHash
    Copy-NewFile $cacheZip $stageZip
    Copy-NewFile $cacheModel $stageModel
    Assert-PinnedFile $stageZip $RuntimeBytes $RuntimeHash
    Assert-PinnedFile $stageModel $ModelBytes $ModelHash
}

Expand-PinnedRuntime $stageZip $stageRuntime
Assert-RuntimeTree $stageZip $stageRuntime

[void][IO.Directory]::CreateDirectory($artifacts)
if (Test-Path -LiteralPath $runtimeZip) { throw "Refusing to overwrite: $runtimeZip" }
if (Test-Path -LiteralPath $modelPath) { throw "Refusing to overwrite: $modelPath" }
if (Test-Path -LiteralPath $runtimePath) { throw "Refusing to overwrite: $runtimePath" }
[IO.File]::Move($stageZip, $runtimeZip)
[IO.File]::Move($stageModel, $modelPath)
[IO.Directory]::Move($stageRuntime, $runtimePath)

Assert-PinnedFile $runtimeZip $RuntimeBytes $RuntimeHash
Assert-PinnedFile $modelPath $ModelBytes $ModelHash
Assert-RuntimeTree $runtimeZip $runtimePath

$manifest = [ordered]@{
    schemaVersion = 1
    runtime = [ordered]@{
        asset = $RuntimeName
        bytes = $RuntimeBytes
        sha256 = $RuntimeHash
        release = 'v0.4.1'
        build = 'b10964'
        commit = 'b29c606e28a01b1bc8c1351026a0fa6e616bf6c4'
    }
    model = [ordered]@{
        sourceFile = $ModelName
        workspaceFile = 'model.gguf'
        bytes = $ModelBytes
        sha256 = $ModelHash
        revision = '23749fefcc72300e3a2ad315e1317431b06b590a'
    }
}
Write-NewUtf8 $manifestPath ($manifest | ConvertTo-Json -Depth 6)
Write-Host "Created and independently verified serving workspace: $root"
Write-Host "Setup staging evidence was preserved at: $stage"
