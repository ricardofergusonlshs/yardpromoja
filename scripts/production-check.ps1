# YardPromoJa Phase 16 production readiness check
# Run from your project root.

Write-Host "YardPromoJa production readiness check" -ForegroundColor Cyan
Write-Host ""

$requiredFiles = @(
  "app\layout.js",
  "app\page.js",
  "app\browse\page.js",
  "app\link-up\page.js",
  "app\ad\[slug]\page.js",
  "app\campaigns\page.js",
  "app\robots.js",
  "app\sitemap.js",
  "app\manifest.js",
  "app\opengraph-image.js",
  "app\twitter-image.js",
  "app\health\route.js",
  "app\api\health\route.js",
  "public\assets\yardpromo-icon.png",
  "public\assets\yardpromo-logo-horizontal.png",
  "public\assets\yardpromo-brand-preview.png"
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

if ($missing.Count -gt 0) {
  Write-Host "Some required files are missing. Add them before deployment." -ForegroundColor Red
} else {
  Write-Host "Required files look good." -ForegroundColor Green
}

Write-Host ""
Write-Host "Environment reminders for Vercel:" -ForegroundColor Yellow
Write-Host "NEXT_PUBLIC_SITE_URL=https://yardpromoja.com"
Write-Host "NEXT_PUBLIC_SUPABASE_URL=your existing Supabase URL"
Write-Host "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY=your existing key"
Write-Host ""
Write-Host "Do not change Supabase keys unless they are already wrong." -ForegroundColor Yellow
Write-Host ""
Write-Host "Next commands:" -ForegroundColor Cyan
Write-Host "npm run build"
Write-Host "git status"
Write-Host "git add ."
Write-Host "git commit -m `"Phase 16 deployment hardening`""
Write-Host "git push"
