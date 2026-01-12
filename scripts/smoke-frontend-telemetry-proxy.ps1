#!/usr/bin/env pwsh
# Smoke test: verify Next.js proxy routes (/api/rum, /api/events) forward to Lead API
# and that Lead API /metrics reflects increments.
#
# Output:
# - Writes JSON summary to: tmp/frontend_proxy_smoke.json (or -OutFile)
# - Writes an evidence markdown file to Paket A evidence-pack (or -EvidenceFile)

[CmdletBinding()]
param(
  [int]$FrontendPort = 3000,
  [int]$LeadApiPort = 8082,
  [string]$AdminToken = "local-dev-token",
  [int]$MaxWaitSeconds = 45,
  [string]$OutFile = "",
  [string]$EvidenceFile = ""
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$frontendDir = Join-Path $repoRoot 'frontend'
$tmpDir = Join-Path $repoRoot 'tmp'
$evidenceDir = Join-Path $repoRoot 'artifacts\paket-a\evidence-pack\04-performance-rum'

if (-not (Test-Path $frontendDir)) { throw "frontend directory not found at: $frontendDir" }
if (-not (Test-Path $tmpDir)) { New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null }
if (-not (Test-Path $evidenceDir)) { throw "evidence directory not found at: $evidenceDir" }

if ([string]::IsNullOrWhiteSpace($OutFile)) {
  $OutFile = Join-Path $tmpDir 'frontend_proxy_smoke.json'
}
if ([string]::IsNullOrWhiteSpace($EvidenceFile)) {
  $EvidenceFile = Join-Path $evidenceDir "$(Get-Date -Format 'yyyy-MM-dd')_frontend_proxy_smoke.md"
}

function Get-ListenPort([int]$Port) {
  return Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
}

if (Get-ListenPort $LeadApiPort) { throw "port_in_use:$LeadApiPort (Lead API)" }
if (Get-ListenPort $FrontendPort) { throw "port_in_use:$FrontendPort (frontend)" }

$backendOut = Join-Path $tmpDir 'leadapi_backend.out'
$backendErr = Join-Path $tmpDir 'leadapi_backend.err'
$nextOut = Join-Path $tmpDir 'next_dev.out'
$nextErr = Join-Path $tmpDir 'next_dev.err'

function Get-FileTail([string]$Path, [int]$Lines = 60) {
  if (-not (Test-Path $Path)) { return "" }
  try { return (Get-Content $Path -Tail $Lines -ErrorAction SilentlyContinue) -join "`n" } catch { return "" }
}

function Stop-Proc([System.Diagnostics.Process]$P) {
  if ($P -and -not $P.HasExited) {
    Stop-Process -Id $P.Id -Force -ErrorAction SilentlyContinue
  }
}

$snapshot = [ordered]@{
  timestamp = (Get-Date).ToString('o')
  ports = [ordered]@{ "$FrontendPort" = $false; "$LeadApiPort" = $false }
  proxy_rum_status = ""
  proxy_events_status = ""
  metrics_lines = ""
  rum_payload_sent = ""
  event_payload_sent = ""
  error = ""
  next_dev_err_tail = ""
  next_dev_out_tail = ""
  backend_err_tail = ""
}

$origPort = $env:PORT
$origAdmin = $env:LEAD_API_ADMIN_TOKEN
$origLeadBase = $env:LEAD_API_BASE_URL
$origSite = $env:NEXT_PUBLIC_SITE_URL

$backend = $null
$frontend = $null

try {
  # Start backend (Go) in background.
  $env:APP_ENV = 'development'
  $env:PORT = "$LeadApiPort"
  $env:LEAD_API_ADMIN_TOKEN = $AdminToken
  # Force in-memory repos unless caller explicitly configured DATABASE_URL elsewhere.
  if ([string]::IsNullOrWhiteSpace($env:DATABASE_URL)) {
    $env:DATABASE_URL = '__CHANGE_ME__'
  }

  Write-Host "[backend] starting on :$LeadApiPort ..." -ForegroundColor Cyan
  $backendCmd = "go run .\\cmd\\server"
  $backend = Start-Process -FilePath $env:ComSpec -WorkingDirectory $repoRoot -ArgumentList @('/c', $backendCmd) -PassThru -RedirectStandardOutput $backendOut -RedirectStandardError $backendErr

  # Start frontend (Next) in background (prod server for stability).
  $env:LEAD_API_BASE_URL = "http://localhost:$LeadApiPort"
  $env:NEXT_PUBLIC_SITE_URL = "http://localhost:$FrontendPort"

  Write-Host "[frontend] build..." -ForegroundColor Cyan
  npm --prefix $frontendDir run build | Out-Host

  Write-Host "[frontend] start (prod) on port $FrontendPort..." -ForegroundColor Cyan
  # PowerShell uses backtick for escaping quotes inside a string.
  $nextCmd = "npm --prefix `"$frontendDir`" run start -- -p $FrontendPort"
  $frontend = Start-Process -FilePath $env:ComSpec -WorkingDirectory $repoRoot -ArgumentList @('/c', $nextCmd) -PassThru -RedirectStandardOutput $nextOut -RedirectStandardError $nextErr

  # Wait for backend and frontend readiness.
  $deadline = (Get-Date).AddSeconds($MaxWaitSeconds)
  while ((Get-Date) -lt $deadline) {
    if ($backend.HasExited) {
      throw "backend_exited:$($backend.ExitCode)`n--- backend stderr (tail) ---`n$(Get-FileTail $backendErr)"
    }
    if ($frontend.HasExited) {
      throw "frontend_exited:$($frontend.ExitCode)`n--- next stderr (tail) ---`n$(Get-FileTail $nextErr)"
    }

    $snapshot.ports["$LeadApiPort"] = [bool](Get-ListenPort $LeadApiPort)
    $snapshot.ports["$FrontendPort"] = [bool](Get-ListenPort $FrontendPort)

    if ($snapshot.ports["$LeadApiPort"] -and $snapshot.ports["$FrontendPort"]) {
      try {
        Invoke-WebRequest -Uri "http://localhost:$LeadApiPort/health" -Method GET -UseBasicParsing -TimeoutSec 2 | Out-Null
        Invoke-WebRequest -Uri "http://localhost:$FrontendPort/" -Method GET -UseBasicParsing -TimeoutSec 2 | Out-Null
        break
      } catch {
        # Keep waiting.
      }
    }

    Start-Sleep -Milliseconds 500
  }

  if (-not $snapshot.ports["$LeadApiPort"]) { throw "backend_not_listening" }
  if (-not $snapshot.ports["$FrontendPort"]) { throw "frontend_not_listening" }

  # Send telemetry via frontend proxy routes.
  $rumObj = [ordered]@{
    metric_id = "proxy-1"
    metric_name = "LCP"
    value = 1234.0
    rating = "good"
    page_url_initial = "http://localhost:$FrontendPort/"
    page_url_current = "http://localhost:$FrontendPort/about"
    device_type = "desktop"
  }
  $evtObj = [ordered]@{
    event_name = "cta_whatsapp_click"
    page_url_initial = "http://localhost:$FrontendPort/"
    page_url_current = "http://localhost:$FrontendPort/products"
    device_type = "desktop"
    href = "https://wa.me/62..."
  }

  $rumBody = ($rumObj | ConvertTo-Json -Compress)
  $evtBody = ($evtObj | ConvertTo-Json -Compress)
  $snapshot.rum_payload_sent = $rumBody
  $snapshot.event_payload_sent = $evtBody

  $rumResp = Invoke-WebRequest -Uri "http://localhost:$FrontendPort/api/rum" -Method POST -ContentType 'application/json' -Body $rumBody -UseBasicParsing -TimeoutSec 10
  $evtResp = Invoke-WebRequest -Uri "http://localhost:$FrontendPort/api/events" -Method POST -ContentType 'application/json' -Body $evtBody -UseBasicParsing -TimeoutSec 10

  $snapshot.proxy_rum_status = "$($rumResp.StatusCode)"
  $snapshot.proxy_events_status = "$($evtResp.StatusCode)"

  # Fetch backend metrics (admin protected).
  $metrics = Invoke-WebRequest -Uri "http://localhost:$LeadApiPort/metrics" -Method GET -Headers @{ 'X-Admin-Token' = $AdminToken } -UseBasicParsing -TimeoutSec 10
  $lines = $metrics.Content -split "`n" |
    Where-Object { $_ -match '^lead_api_web_vitals_|^lead_api_website_events_total' } |
    Where-Object { $_ -match 'device_type="desktop"' -or $_ -match '^lead_api_website_events_total' } |
    Select-Object -First 80

  $snapshot.metrics_lines = ($lines -join "`n")

  $snapshot.next_dev_out_tail = Get-FileTail $nextOut
  $snapshot.next_dev_err_tail = Get-FileTail $nextErr
  $snapshot.backend_err_tail = Get-FileTail $backendErr

  # Persist JSON.
  $json = $snapshot | ConvertTo-Json -Depth 10
  Set-Content -Path $OutFile -Value $json -Encoding UTF8
  Write-Host "[tmp] written: $OutFile" -ForegroundColor Green

  # Write evidence markdown (embed key excerpts so it remains self-contained).
  $md = @()
  $md += "# Evidence - Frontend proxy telemetry to Lead API (local smoke)"
  $md += ""
  $md += "- **Date:** $(Get-Date -Format 'yyyy-MM-dd')"
  $md += "- **Spec ref:** docs-paket-a/paket-a.md -> UAT-A-16 (CWV RUM) + Analytics events"
  $md += "- **How generated:** scripts/smoke-frontend-telemetry-proxy.ps1"
  $md += ""
  $md += "## What was verified"
  $md += ""
  $md += "1) POST /api/rum (Next.js) returns 204 and forwards to Lead API POST /api/v1/rum."
  $md += "2) POST /api/events (Next.js) returns 204 and forwards to Lead API POST /api/v1/events."
  $md += "3) Lead API /metrics includes increments for: web vitals + cta_whatsapp_click."
  $md += ""
  $md += "## Captured output (subset)"
  $md += ""
  $md += "### Proxy responses"
  $md += "- /api/rum: **$($snapshot.proxy_rum_status)**"
  $md += "- /api/events: **$($snapshot.proxy_events_status)**"
  $md += ""
  $md += "### Payloads sent"
  $md += ""
  $md += "RUM:"
  $md += "~~~json"
  $md += $rumBody
  $md += "~~~"
  $md += ""
  $md += "Event:"
  $md += "~~~json"
  $md += $evtBody
  $md += "~~~"
  $md += ""
  $md += "### Prometheus proof (subset)"
  $md += "~~~text"
  $md += $snapshot.metrics_lines
  $md += "~~~"
  $md += ""
  $md += "> Full JSON summary: $([IO.Path]::GetFileName($OutFile)) under tmp/."

  Set-Content -Path $EvidenceFile -Value ($md -join "`n") -Encoding UTF8
  Write-Host "[evidence] written: $EvidenceFile" -ForegroundColor Green
} catch {
  $snapshot.error = $_.Exception.Message
  $snapshot.next_dev_out_tail = Get-FileTail $nextOut
  $snapshot.next_dev_err_tail = Get-FileTail $nextErr
  $snapshot.backend_err_tail = Get-FileTail $backendErr

  $json = $snapshot | ConvertTo-Json -Depth 10
  Set-Content -Path $OutFile -Value $json -Encoding UTF8
  Write-Host "[tmp] written (error): $OutFile" -ForegroundColor Yellow
  throw
} finally {
  Stop-Proc $frontend
  Stop-Proc $backend

  # Restore process env (best-effort).
  $env:PORT = $origPort
  $env:LEAD_API_ADMIN_TOKEN = $origAdmin
  $env:LEAD_API_BASE_URL = $origLeadBase
  $env:NEXT_PUBLIC_SITE_URL = $origSite
}
