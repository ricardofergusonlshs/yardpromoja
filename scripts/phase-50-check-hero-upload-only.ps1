# YardPromoJa Phase 50
# HeroStack should use uploaded promo/flyer/post images only.
#
# Run from project root after copying files:
# .\scripts\phase-50-check-hero-upload-only.ps1

$Hero = "app\components\HeroStack.js"

if (!(Test-Path $Hero)) {
  Write-Host "Could not find app\components\HeroStack.js" -ForegroundColor Red
  exit 1
}

$content = Get-Content $Hero -Raw

if ($content.Contains("Phase 50") -and $content.Contains("PROMO_UPLOAD_IMAGE_FIELDS")) {
  Write-Host "HeroStack Phase 50 is installed." -ForegroundColor Green
} else {
  Write-Host "HeroStack Phase 50 does not appear to be installed." -ForegroundColor Red
  exit 1
}

if ($content.Contains("/assets/reels/") -and $content.Contains("BLOCKED_IMAGE_HINTS")) {
  Write-Host "Reel/parish/brand image blockers are active." -ForegroundColor Green
}

Write-Host ""
Write-Host "Restart dev server:" -ForegroundColor Yellow
Write-Host "Ctrl + C"
Write-Host "npm run dev"
Write-Host ""
Write-Host "Then open:"
Write-Host "http://localhost:3000"
Write-Host ""
Write-Host "Hard refresh with Ctrl + F5."
