# YardPromoJa Phase 51
# Fixes duplicate hero featured stamps.
#
# Run from project root after copying files:
# .\scripts\phase-51-check-single-featured-badge.ps1

$HeroJs = "app\components\HeroStack.js"
$HeroCss = "app\components\HeroStack.module.css"

if (!(Test-Path $HeroJs)) {
  Write-Host "Could not find $HeroJs" -ForegroundColor Red
  exit 1
}

if (!(Test-Path $HeroCss)) {
  Write-Host "Could not find $HeroCss" -ForegroundColor Red
  exit 1
}

$js = Get-Content $HeroJs -Raw
$css = Get-Content $HeroCss -Raw

if ($js.Contains("styles.featureBadge") -and $css.Contains(".featureBadge")) {
  Write-Host "Phase 51 single badge is installed." -ForegroundColor Green
} else {
  Write-Host "Phase 51 single badge is missing." -ForegroundColor Red
  exit 1
}

if ($css.Contains(".carousel::after") -and $css.Contains("content: none !important")) {
  Write-Host "Old generated duplicate badge is disabled." -ForegroundColor Green
}

Write-Host ""
Write-Host "Restart dev server:" -ForegroundColor Yellow
Write-Host "Ctrl + C"
Write-Host "npm run dev"
Write-Host ""
Write-Host "Then open http://localhost:3000 and hard refresh with Ctrl + F5."
