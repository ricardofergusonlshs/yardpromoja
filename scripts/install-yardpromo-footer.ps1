# YardPromoJa Phase 29 footer installer
# Run from your project root.
#
# This adds YardPromoFooter to app/layout.js without overwriting your layout.
# It creates a backup first.

$layoutPath = "app\layout.js"

if (!(Test-Path $layoutPath)) {
  Write-Host "Could not find app/layout.js. Run this from your project root." -ForegroundColor Red
  exit 1
}

if (!(Test-Path "app\components\YardPromoFooter.js")) {
  Write-Host "Missing app\components\YardPromoFooter.js. Copy the Phase 29 app folder first." -ForegroundColor Red
  exit 1
}

$content = Get-Content $layoutPath -Raw

if ($content -match "YardPromoFooter") {
  Write-Host "YardPromoFooter is already installed in app/layout.js." -ForegroundColor Green
  exit 0
}

$backupPath = "app\layout.js.phase29-footer-backup"
Copy-Item $layoutPath $backupPath -Force

# Add import after the existing import block.
$importLine = 'import YardPromoFooter from "./components/YardPromoFooter";'
if ($content -notmatch [regex]::Escape($importLine)) {
  $content = [regex]::Replace(
    $content,
    '((?:^import .+\r?\n)+)',
    "`$1$importLine`r`n",
    1,
    [System.Text.RegularExpressions.RegexOptions]::Multiline
  )
}

# Prefer replacing common existing footer component names to avoid duplicate footers.
$replaced = $false
$footerPatterns = @(
  '<Footer\s*/>',
  '<SiteFooter\s*/>',
  '<AppFooter\s*/>'
)

foreach ($pattern in $footerPatterns) {
  if ($content -match $pattern) {
    $content = [regex]::Replace($content, $pattern, '<YardPromoFooter />', 1)
    $replaced = $true
    break
  }
}

# If no obvious footer exists, insert after the first {children}.
if (-not $replaced) {
  if ($content -match '\{children\}') {
    $content = [regex]::Replace($content, '\{children\}', "{children}`r`n        <YardPromoFooter />", 1)
  } else {
    Write-Host "Could not find {children}. Please add <YardPromoFooter /> manually in app/layout.js." -ForegroundColor Yellow
  }
}

Set-Content -Path $layoutPath -Value $content -Encoding UTF8

Write-Host "Installed YardPromoFooter in app/layout.js" -ForegroundColor Green
Write-Host "Backup created: app/layout.js.phase29-footer-backup" -ForegroundColor Yellow
Write-Host ""
Write-Host "Now run:" -ForegroundColor Cyan
Write-Host "npm run build"
