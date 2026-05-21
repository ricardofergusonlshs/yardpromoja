# YardPromoJa Phase 27 deploy guard
# Run from your project root before pushing to GitHub/Vercel.

Write-Host "YardPromoJa deploy guard" -ForegroundColor Cyan
Write-Host ""

$requiredFiles = @(
  "app\layout.js",
  "app\page.js",
  "app\yp-dark.css",
  "app\health\route.js",
  "app\api\health\route.js",
  "app\robots.js",
  "app\sitemap.js",
  "app\manifest.js",
  "app\opengraph-image.js",
  "public\assets\apple-touch-icon.png",
  "public\assets\yardpromo-icon.png",
  "public\assets\jamaica-parish-map.svg"
)

$missing = @()

foreach ($file in $requiredFiles) {
  if (Test-Path $file) {
    Write-Host "OK   $file" -ForegroundColor Green
  } else {
    Write-Host "MISS $file" -ForegroundColor Red
    $missing += $file
  }
}

Write-Host ""

if (Test-Path "app\components\AuthNav.js") {
  Write-Host "OK   app\components\AuthNav.js exists" -ForegroundColor Green
} else {
  Write-Host "NOTE app\components\AuthNav.js is missing/deleted." -ForegroundColor Yellow
  Write-Host "If you did not mean to delete it, run:" -ForegroundColor Yellow
  Write-Host "git restore app/components/AuthNav.js" -ForegroundColor Cyan
}

Write-Host ""

$layoutPath = "app\layout.js"
if (Test-Path $layoutPath) {
  $layout = Get-Content $layoutPath -Raw
  if ($layout -match 'data-scroll-behavior\s*=\s*"smooth"') {
    Write-Host "OK   layout has data-scroll-behavior smooth" -ForegroundColor Green
  } else {
    Write-Host "WARN layout is missing data-scroll-behavior smooth" -ForegroundColor Yellow
    Write-Host "Run: .\scripts\fix-scroll-behavior-warning.ps1" -ForegroundColor Cyan
  }
}

Write-Host ""

if ($missing.Count -gt 0) {
  Write-Host "Some files are missing. Add them before deployment." -ForegroundColor Red
} else {
  Write-Host "Required launch files look good." -ForegroundColor Green
}

Write-Host ""
Write-Host "Next checks:" -ForegroundColor Cyan
Write-Host "npm run build"
Write-Host "git status"
