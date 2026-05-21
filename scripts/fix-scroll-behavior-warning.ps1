# YardPromoJa Phase 27
# Fix Next.js warning:
# Detected `scroll-behavior: smooth` on the `<html>` element.
#
# This script safely adds:
# data-scroll-behavior="smooth"
# to the first <html ...> tag in app/layout.js if it is missing.
#
# Run from your project root.

$layoutPath = "app\layout.js"

if (!(Test-Path $layoutPath)) {
  Write-Host "Could not find app/layout.js. Run this from your project root." -ForegroundColor Red
  exit 1
}

$content = Get-Content $layoutPath -Raw

if ($content -match 'data-scroll-behavior\s*=') {
  Write-Host "app/layout.js already has data-scroll-behavior. No change needed." -ForegroundColor Green
  exit 0
}

if ($content -notmatch '<html\b') {
  Write-Host "Could not find an <html> tag in app/layout.js. Please edit it manually." -ForegroundColor Red
  exit 1
}

$backupPath = "app\layout.js.phase27-backup"
Copy-Item $layoutPath $backupPath -Force

# Add the attribute to the first <html ...> tag only.
# Works for:
# <html lang="en">
# <html>
# <html lang="en" suppressHydrationWarning>
$updated = [regex]::Replace(
  $content,
  '<html\b(?![^>]*data-scroll-behavior)([^>]*)>',
  '<html$1 data-scroll-behavior="smooth">',
  1
)

Set-Content -Path $layoutPath -Value $updated -Encoding UTF8

Write-Host "Updated app/layout.js" -ForegroundColor Green
Write-Host "Backup created at app/layout.js.phase27-backup" -ForegroundColor Yellow
Write-Host ""
Write-Host "Now run:" -ForegroundColor Cyan
Write-Host "npm run build"
