$ErrorActionPreference = "Stop"

$root = Get-Location
$pageSource = Join-Path $root "files\page.js"
$cssSource = Join-Path $root "files\dark-homepage.css"
$pageTarget = Join-Path $root "app\page.js"
$cssTarget = Join-Path $root "app\globals.css"

if (!(Test-Path $pageSource)) {
  throw "Missing files\page.js. Extract the ZIP in your project root first."
}

if (!(Test-Path $cssSource)) {
  throw "Missing files\dark-homepage.css. Extract the ZIP in your project root first."
}

if (!(Test-Path $pageTarget)) {
  throw "Cannot find app\page.js. Make sure you are in the YardPromo project root."
}

if (!(Test-Path $cssTarget)) {
  throw "Cannot find app\globals.css. Make sure you are in the YardPromo project root."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item $pageTarget "$pageTarget.backup-$timestamp" -Force
Copy-Item $cssTarget "$cssTarget.backup-$timestamp" -Force

Copy-Item $pageSource $pageTarget -Force

$css = Get-Content $cssTarget -Raw
$marker = "YardPromoJa dark discovery homepage upgrade"

if ($css -notlike "*$marker*") {
  Add-Content -Path $cssTarget -Value "`r`n"
  Get-Content $cssSource | Add-Content -Path $cssTarget
  Write-Host "CSS appended to app\globals.css"
} else {
  Write-Host "Dark homepage CSS already exists in app\globals.css; skipped append."
}

Write-Host ""
Write-Host "Done. Backups created with timestamp $timestamp"
Write-Host "Next:"
Write-Host '  & "C:\Users\home\nodejs\npm.cmd" run build'
Write-Host '  & "C:\Users\home\nodejs\npm.cmd" run dev'
