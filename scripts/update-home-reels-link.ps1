# YardPromoJa Phase 29 homepage reels link updater
# Run from your project root after applying Phase 29.
#
# This changes the homepage "View all reels" link from /browse?format=reels to /reels.

$pagePath = "app\page.js"

if (!(Test-Path $pagePath)) {
  Write-Host "Could not find app/page.js. Run this from your project root." -ForegroundColor Red
  exit 1
}

$content = Get-Content $pagePath -Raw

if ($content -match 'href="/reels"') {
  Write-Host "Homepage already links to /reels." -ForegroundColor Green
  exit 0
}

$backupPath = "app\page.js.phase29-reels-link-backup"
Copy-Item $pagePath $backupPath -Force

$content = $content -replace 'href="/browse\?format=reels"', 'href="/reels"'
$content = $content -replace 'href=\{"/browse\?format=reels"\}', 'href="/reels"'

Set-Content -Path $pagePath -Value $content -Encoding UTF8

Write-Host "Updated homepage reels link to /reels." -ForegroundColor Green
Write-Host "Backup created: app/page.js.phase29-reels-link-backup" -ForegroundColor Yellow
