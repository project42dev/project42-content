#requires -Version 7.6
[CmdletBinding()]
param([Parameter(Mandatory)][string]$Request)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not [IO.Path]::IsPathRooted($Request)) { throw 'Request path must be absolute.' }
$requestPath = [IO.Path]::GetFullPath($Request)
$config = Get-Content -LiteralPath $requestPath -Raw | ConvertFrom-Json
$key = [Environment]::GetEnvironmentVariable('LLAMA_API_KEY', 'Process')
if ([string]::IsNullOrEmpty($key)) { throw 'Child launcher did not receive LLAMA_API_KEY.' }

Add-Type -TypeDefinition @'
using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading;

public static class P42ServingChild
{
    private static readonly object Gate = new object();

    private static void Append(StreamWriter writer, string source, string line, string secret)
    {
        if (line == null) return;
        string safe = String.IsNullOrEmpty(secret) ? line : line.Replace(secret, "[REDACTED]");
        lock (Gate)
        {
            writer.Write(DateTime.UtcNow.ToString("o"));
            writer.Write(" ");
            writer.Write(source);
            writer.Write(" ");
            writer.WriteLine(safe);
            writer.Flush();
        }
    }

    public static int Run(string exe, string working, string[] args, string logPath,
                          string launchPath, string abortPath, string secret)
    {
        var psi = new ProcessStartInfo();
        psi.FileName = exe;
        psi.WorkingDirectory = working;
        psi.UseShellExecute = false;
        psi.CreateNoWindow = true;
        psi.WindowStyle = ProcessWindowStyle.Hidden;
        psi.RedirectStandardOutput = true;
        psi.RedirectStandardError = true;
        foreach (string arg in args) psi.ArgumentList.Add(arg);
        psi.Environment.Remove("P42_SERVING_API_KEY");
        psi.Environment["LLAMA_API_KEY"] = secret;

        using (var logStream = new FileStream(logPath, FileMode.CreateNew, FileAccess.Write, FileShare.Read))
        using (var writer = new StreamWriter(logStream, new UTF8Encoding(false)))
        using (var process = new Process())
        {
            process.StartInfo = psi;
            process.OutputDataReceived += (s, e) => Append(writer, "stdout", e.Data, secret);
            process.ErrorDataReceived += (s, e) => Append(writer, "stderr", e.Data, secret);
            if (!process.Start()) throw new InvalidOperationException("llama-server process did not start.");
            DateTime started = process.StartTime.ToUniversalTime();
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();

            var launch = new { pid = process.Id, startTimeUtc = started.ToString("o") };
            byte[] json = JsonSerializer.SerializeToUtf8Bytes(launch);
            using (var launchStream = new FileStream(launchPath, FileMode.CreateNew, FileAccess.Write, FileShare.Read))
                launchStream.Write(json, 0, json.Length);

            while (!process.WaitForExit(200))
            {
                if (File.Exists(abortPath))
                {
                    try { process.Kill(true); } catch { }
                    process.WaitForExit(10000);
                    break;
                }
            }
            process.WaitForExit();
            return process.ExitCode;
        }
    }
}
'@

$arguments = @($config.arguments | ForEach-Object { [string]$_ })
try {
    [void][P42ServingChild]::Run(
        [string]$config.exePath,
        [string]$config.workingDirectory,
        $arguments,
        [string]$config.logPath,
        [string]$config.launchPath,
        [string]$config.abortPath,
        $key
    )
} finally {
    $key = $null
    [Environment]::SetEnvironmentVariable('LLAMA_API_KEY', $null, 'Process')
}
