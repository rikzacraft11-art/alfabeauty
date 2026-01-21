#!/usr/bin/env pwsh
# Generate Paket A PASS + Evidence locally (Windows-friendly).
#
# What it does:
# - Runs Playwright smoke tests and stores the HTML report + test artifacts under:
#     artifacts/paket-a/evidence-pack/02-uat/
# - (Optional) Captures website security headers snapshot (local) into:
#     artifacts/paket-a/evidence-pack/03-security/
# - (Optional) Runs telemetry proxy smoke (Next proxy -> Lead API + /metrics proof) into:
#     artifacts/paket-a/evidence-pack/04-performance-rum/
# - (Optional) Updates UAT index (02-uat/index.md) for UAT-A-05 and UAT-A-06.
#
# Notes:
# - This script is designed for local evidence generation. Final sign-off should also capture staging/prod evidence.
# - Evidence files are meant to be committed to the repo (audit trail).

[CmdletBinding()]
param(
	[string]$RunDate = "",  # default: yyyy-MM-dd
	[switch]$SkipHeaders,
	[switch]$SkipTelemetry,
	[switch]$SkipUatIndexUpdate,

	# Headers capture runs a Next.js production server temporarily.
	[int]$HeadersPort = 3001,

	# Headers capture runs a Next.js production server temporarily.
	[int]$HeadersPort = 3001
)

$ErrorActionPreference = 'Stop'

function Get-RepoRoot {
	return Split-Path -Parent $PSScriptRoot
}

function Ensure-Dir([string]$Path) {
	if (-not (Test-Path $Path)) {
		New-Item -ItemType Directory -Force -Path $Path | Out-Null
	}
}

function New-UniqueDir([string]$BasePath) {
	if (-not (Test-Path $BasePath)) {
		New-Item -ItemType Directory -Force -Path $BasePath | Out-Null
		return $BasePath
	}
	for ($i = 2; $i -le 99; $i++) {
		$p = "${BasePath}_${i}"
		if (-not (Test-Path $p)) {
			New-Item -ItemType Directory -Force -Path $p | Out-Null
			return $p
		}
	}
	throw "unable_to_create_unique_dir:$BasePath"
}

function Try-GetGitCommit([string]$RepoRoot) {
	try {
		$commit = (& git -C $RepoRoot rev-parse --short HEAD 2>$null) | Select-Object -First 1
		if ($commit) { return $commit.Trim() }
		return ""
	} catch {
		return ""
	}
}

function Get-ListenConn([int]$Port) {
	return Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
}

function Resolve-FreePort {
	param(
		[Parameter(Mandatory = $true)][int]$Preferred,
		[int]$Min = 3000,
		[int]$Max = 3999,
		[string]$Label = ""
	)

	if (-not (Get-ListenConn $Preferred)) {
		return $Preferred
	}

	for ($p = $Min; $p -le $Max; $p++) {
		if (-not (Get-ListenConn $p)) {
			if (-not [string]::IsNullOrWhiteSpace($Label)) {
				Write-Host ("[ports] {0}: preferred {1} is in use; using {2}" -f $Label, $Preferred, $p) -ForegroundColor Yellow
			}
			return $p
		}
	}
	throw "no_free_port_available:$Preferred ($Label)"
}

function Assert-ExpectedNextOrFree {
	param(
		[Parameter(Mandatory = $true)][int]$Port
	)

	$conn = Get-ListenConn $Port
	if (-not $conn) {
		return $false
	}

	try {
		# This app uses locale-prefixed URLs only; / is intentionally non-routable.
		$resp = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/en" -UseBasicParsing -TimeoutSec 5
		if ($resp.StatusCode -ne 200) {
			throw "unexpected_status:$($resp.StatusCode)"
		}
		if ($resp.Content -match "/_next/static/") {
			return $true
		}
		throw "port_$Port_in_use_but_not_nextjs"
	} catch {
		throw "port_in_use:$Port (Next.js) but does not look like the expected app. Stop the process and retry. Details: $($_.Exception.Message)"
	}
}



function Update-UatIndex {
	param(
		[Parameter(Mandatory = $true)][string]$IndexPath,
		[Parameter(Mandatory = $true)][string]$RunDate,
		[Parameter(Mandatory = $true)][string]$EvidenceRelLink,
		[string]$Commit = ""
	)

	if (-not (Test-Path $IndexPath)) {
		throw "uat_index_not_found:$IndexPath"
	}

	$content = Get-Content -Path $IndexPath -Raw -Encoding UTF8

	$bt = [char]96 # backtick character for Markdown code formatting

	$row05 = "| UAT-A-05 | PASS | $RunDate | local | $bt$EvidenceRelLink$bt | Playwright smoke: WhatsApp CTA always works |"
	$row06 = "| UAT-A-06 | PASS | $RunDate | local | $bt$EvidenceRelLink$bt | Playwright smoke: Become Partner lead path |"

	# Replace rows by UAT ID (keeps the rest of the table intact).
	$content = [regex]::Replace(
		$content,
		"(?m)^\|\s*UAT-A-05\s*\|.*$",
		[System.Text.RegularExpressions.MatchEvaluator]{ param($m) $row05 }
	)
	$content = [regex]::Replace(
		$content,
		"(?m)^\|\s*UAT-A-06\s*\|.*$",
		[System.Text.RegularExpressions.MatchEvaluator]{ param($m) $row06 }
	)

	if (-not [string]::IsNullOrWhiteSpace($Commit)) {
		$content = [regex]::Replace($content, "(?m)^- Version/commit:.*$", "- Version/commit: $Commit")
	}

	$runner = "$env:USERNAME@$env:COMPUTERNAME"
	$content = [regex]::Replace($content, "(?m)^- Runner:.*$", "- Runner: $runner")

	Set-Content -Path $IndexPath -Value $content -Encoding UTF8
}

$repoRoot = Get-RepoRoot
$frontendDir = Join-Path $repoRoot 'frontend'
$tmpDir = Join-Path $repoRoot 'tmp'
$evidenceRoot = Join-Path $repoRoot 'artifacts\paket-a\evidence-pack'
$uatDir = Join-Path $evidenceRoot '02-uat'

if ([string]::IsNullOrWhiteSpace($RunDate)) {
	$RunDate = Get-Date -Format 'yyyy-MM-dd'
}

if (-not (Test-Path $frontendDir)) { throw "frontend directory not found at: $frontendDir" }
if (-not (Test-Path $evidenceRoot)) { throw "evidence pack not found at: $evidenceRoot" }
if (-not (Test-Path $uatDir)) { throw "evidence dir not found at: $uatDir" }
Ensure-Dir $tmpDir

$commit = Try-GetGitCommit $repoRoot

# --- 1) Playwright smoke tests -> evidence pack ---
$playwrightWebPort = 3000
if ($reuseNext) {
	Write-Host "[e2e] reusing existing Next.js dev server on :$playwrightWebPort" -ForegroundColor Yellow
}

$reportDirBase = Join-Path $uatDir "${RunDate}_playwright-report"
$resultsDirBase = Join-Path $uatDir "${RunDate}_playwright-test-results"

$reportDir = New-UniqueDir $reportDirBase
$resultsDir = New-UniqueDir $resultsDirBase

$playwrightLog = Join-Path $uatDir "${RunDate}_playwright_smoke.log"
if (Test-Path $playwrightLog) {
	# Keep prior runs; avoid overwriting.
	$playwrightLog = Join-Path $uatDir "${RunDate}_playwright_smoke_${(Get-Date -Format 'HHmmss')}.log"
}

Write-Host "[e2e] running Playwright smoke tests..." -ForegroundColor Cyan

$origCI = $env:CI
$origHtml = $env:PLAYWRIGHT_HTML_REPORT_DIR
$origOut = $env:PLAYWRIGHT_OUTPUT_DIR
$origReuse = $env:PLAYWRIGHT_REUSE_EXISTING_SERVER

try {
	$env:CI = '1'
	$env:PLAYWRIGHT_HTML_REPORT_DIR = $reportDir
	$env:PLAYWRIGHT_OUTPUT_DIR = $resultsDir
	if ($reuseNext) {
		$env:PLAYWRIGHT_REUSE_EXISTING_SERVER = 'true'
	}

	# Run from repo root (Playwright webServer uses frontend package scripts).
	$cmd = "npm --prefix `"$frontendDir`" run test:e2e"
	"[cmd] $cmd" | Out-File -FilePath $playwrightLog -Encoding UTF8

	& $env:ComSpec /c $cmd 2>&1 | Tee-Object -FilePath $playwrightLog -Append

	if ($LASTEXITCODE -ne 0) {
		throw "playwright_failed:$LASTEXITCODE (see log: $playwrightLog)"
	}
} finally {
	$env:CI = $origCI
	$env:PLAYWRIGHT_HTML_REPORT_DIR = $origHtml
	$env:PLAYWRIGHT_OUTPUT_DIR = $origOut
	$env:PLAYWRIGHT_REUSE_EXISTING_SERVER = $origReuse
}

# Evidence markdown for UAT.
$uatEvidenceFile = Join-Path $uatDir "${RunDate}_playwright_smoke.md"
if (Test-Path $uatEvidenceFile) {
	$uatEvidenceFile = Join-Path $uatDir "${RunDate}_playwright_smoke_${(Get-Date -Format 'HHmmss')}.md"
}

$reportRel = (Resolve-Path $reportDir).Path.Replace($repoRoot + "\\", "")
$resultsRel = (Resolve-Path $resultsDir).Path.Replace($repoRoot + "\\", "")
$logRel = (Resolve-Path $playwrightLog).Path.Replace($repoRoot + "\\", "")

$md = @()
$md += "# Evidence - Playwright smoke (Paket A)"
$md += ""
$md += "- **Date:** $RunDate"
$md += "- **Environment:** Local (Windows)"
$md += "- **Spec ref:** docs-paket-a/paket-a.md -> UAT-A-05 (WhatsApp CTA) + UAT-A-06 (Become Partner lead path)"
if (-not [string]::IsNullOrWhiteSpace($commit)) { $md += "- **Version/commit:** $commit" }
$md += "- **How generated:** scripts/generate-paket-a-evidence-local.ps1"
$md += ""
$md += "## Artifacts"
$md += "- HTML report: $reportRel (open index.html)"
$md += "- Test results: $resultsRel (screenshots/videos on failure)"
$md += "- Command log: $logRel"
$md += ""
$md += "## Notes"
$md += "- This run uses Playwright to smoke-test the public website flows."
$md += "- For final delivery, repeat on staging/prod as part of release sign-off."

Set-Content -Path $uatEvidenceFile -Value ($md -join "`n") -Encoding UTF8
Write-Host "[evidence] written: $uatEvidenceFile" -ForegroundColor Green

# --- 2) Update UAT index (optional) ---
if (-not $SkipUatIndexUpdate) {
	$uatIndex = Join-Path $uatDir 'index.md'
	$evidenceRelLink = "02-uat/" + (Split-Path -Leaf $uatEvidenceFile)
	Update-UatIndex -IndexPath $uatIndex -RunDate $RunDate -EvidenceRelLink $evidenceRelLink -Commit $commit
	Write-Host "[evidence] updated: $uatIndex" -ForegroundColor Green
}

# --- 3) Security headers snapshot (optional) ---
if (-not $SkipHeaders) {
	$headersPortToUse = Resolve-FreePort -Preferred $HeadersPort -Min 3001 -Max 3099 -Label 'headers snapshot'
	Write-Host "[security] capturing website headers snapshot (local)..." -ForegroundColor Cyan
	& (Join-Path $repoRoot 'scripts\\capture-website-headers-local.ps1') -Port $headersPortToUse | Out-Host
}



Write-Host "[done] Paket A evidence generated." -ForegroundColor Green
