#!/usr/bin/env pwsh
# Capture Website (HTML) security headers snapshot (local) into Paket A evidence pack.
# This is useful to prove app-level headers are configured; staging/prod should still be captured over HTTPS.

[CmdletBinding()]
param(
  [int]$Port = 3001,
  [int]$MaxWaitSeconds = 45
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$frontendDir = Join-Path $repoRoot 'frontend'
$evidenceDir = Join-Path $repoRoot 'artifacts\paket-a\evidence-pack\03-security'

if (-not (Test-Path $frontendDir)) {
  throw "frontend directory not found at: $frontendDir"
}
if (-not (Test-Path $evidenceDir)) {
  throw "evidence directory not found at: $evidenceDir"
}

# Ensure build exists.
Write-Host "[frontend] build..." -ForegroundColor Cyan
npm --prefix $frontendDir run build | Out-Host

if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) {
  throw "port_in_use:$Port"
}

# Start server in background (capture logs so failures are diagnosable).
# On Windows PowerShell, `npm` is typically a shim (.cmd/.ps1) and cannot be started directly via Start-Process.
Write-Host "[frontend] start (prod) on port $Port..." -ForegroundColor Cyan
$stdout = Join-Path $env:TEMP "alfab_next_start_${Port}_out.log"
$stderr = Join-Path $env:TEMP "alfab_next_start_${Port}_err.log"

$cmd = "npm run start -- -p $Port"
$p = Start-Process -FilePath $env:ComSpec -WorkingDirectory $frontendDir -ArgumentList @("/c", $cmd) -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr

function Stop-Frontend {
  if ($p -and -not $p.HasExited) {
    Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
  }
  # Kill any leftover listener on the port (best-effort).
  Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1 |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}

try {
  $base = "http://localhost:$Port"
  $deadline = (Get-Date).AddSeconds($MaxWaitSeconds)
  $resp = $null

  while ((Get-Date) -lt $deadline) {
    if ($p.HasExited) {
      $code = $p.ExitCode
      $outTail = if (Test-Path $stdout) { (Get-Content $stdout -Tail 50 -ErrorAction SilentlyContinue) -join "`n" } else { "" }
      $errTail = if (Test-Path $stderr) { (Get-Content $stderr -Tail 50 -ErrorAction SilentlyContinue) -join "`n" } else { "" }
      throw "next_start_exited:$code`n--- stdout (tail) ---`n$outTail`n--- stderr (tail) ---`n$errTail"
    }
    try {
      # This app uses locale-prefixed routes only; / is intentionally non-routable.
      $resp = Invoke-WebRequest -Uri "$base/en" -Method GET -UseBasicParsing -TimeoutSec 2
      break
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }

  if (-not $resp) {
    $outTail = if (Test-Path $stdout) { (Get-Content $stdout -Tail 50 -ErrorAction SilentlyContinue) -join "`n" } else { "" }
    $errTail = if (Test-Path $stderr) { (Get-Content $stderr -Tail 50 -ErrorAction SilentlyContinue) -join "`n" } else { "" }
    throw "server_not_ready`n--- stdout (tail) ---`n$outTail`n--- stderr (tail) ---`n$errTail"
  }

  $keys = @(
    "content-type",
    "content-security-policy",
    "x-content-type-options",
    "referrer-policy",
    "strict-transport-security",
    "permissions-policy",
    "x-frame-options"
  )

  $snapshot = [ordered]@{
    date = (Get-Date).ToString('yyyy-MM-dd')
    environment = "Local dev (Windows)"
    url = $resp.BaseResponse.ResponseUri.AbsoluteUri
    status = $resp.StatusCode
    headers = [ordered]@{}
    notes = @(
      "Local snapshot proves app-level header config. Staging/prod over HTTPS should still be captured for final sign-off.",
      "HSTS is meaningful only over HTTPS; presence here is configuration proof only."
    )
  }

  foreach ($k in $keys) {
    $v = $resp.Headers[$k]
    if ($v) { $snapshot.headers[$k] = $v }
  }

  $json = $snapshot | ConvertTo-Json -Depth 8

  $outFile = Join-Path $evidenceDir "$(Get-Date -Format 'yyyy-MM-dd')_website_headers_snapshot_local.md"

  $md = @()
  $md += "# Security evidence - Website (HTML) response headers snapshot (local)"
  $md += ""
  $md += "- **Date:** $(Get-Date -Format 'yyyy-MM-dd')"
  $md += "- **Environment:** Local dev (Windows)"
  $md += '- **Spec reference:** `docs-paket-a/paket-a.md` -> 15 (Security headers baseline)'
  $md += '- **How generated:** `scripts/capture-website-headers-local.ps1`'
  $md += ""
  $md += "## Captured headers (subset)"
  $md += ""
  $md += '```json'
  $md += $json
  $md += '```'
  $md += ""
  $md += "## Notes"
  $md += "- This is a **local** snapshot to prove headers are configured in the app." 
  $md += "- Capture **staging/prod** snapshot over **HTTPS** for final sign-off." 

  Set-Content -Path $outFile -Value ($md -join "`n") -Encoding UTF8

  Write-Host "[evidence] written: $outFile" -ForegroundColor Green
  Write-Output $outFile
} finally {
  Stop-Frontend
}
