# YardPromoJa release readiness helper
# Run from your project root.

$requiredFiles = @(
  "app\layout.js",
  "app\page.js",
  "app\yp-dark.css",
  "app\robots.js",
  "app\sitemap.js",
  "app\manifest.js",
  "app\opengraph-image.js",
  "app\twitter-image.js",
  "app\not-found.js",
  "app\loading.js",
  "app\error.js",
  "app\browse\page.js",
  "app\link-up\page.js",
  "app\campaigns\page.js",
  "app\ad\[slug]\page.js",
  "public\assets\yardpromo-icon.png",
  "public\assets\yardpromo-logo-horizontal.png",
  "public\assets\yardpromo-brand-preview.png"
)

Write-Host "Checking required files..." -ForegroundColor Cyan

foreach ($file in $requiredFiles) {
  if (Test-Path $file) {
    Write-Host "OK   $file" -ForegroundColor Green
  } else {
    Write-Host "MISS $file" -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "Checking environment reminder..." -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_SITE_URL should be set in Vercel to https://yardpromoja.com" -ForegroundColor Yellow
Write-Host "Supabase env variables must remain unchanged." -ForegroundColor Yellow
Write-Host ""
Write-Host "Run: npm run build" -ForegroundColor Cyan
