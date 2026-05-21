# YardPromoJa Phase 47
# Hard fixes the styled-jsx Server Component error by replacing JamaicaParishMap
# with a server-safe CSS module component.
#
# Run from project root:
# .\scripts\phase-47-remove-map-styled-jsx.ps1

$RootComponent = "components\JamaicaParishMap.js"
$RootCss = "components\JamaicaParishMap.module.css"

if (!(Test-Path "components")) {
  New-Item -ItemType Directory -Path "components" | Out-Null
}

if (Test-Path $RootComponent) {
  Copy-Item $RootComponent "$RootComponent.phase47-backup" -Force
  Write-Host "Backed up existing $RootComponent" -ForegroundColor Yellow
}

if (Test-Path "app\components\JamaicaParishMap.js") {
  Copy-Item "app\components\JamaicaParishMap.js" "app\components\JamaicaParishMap.js.phase47-backup" -Force
  Remove-Item "app\components\JamaicaParishMap.js" -Force
  Write-Host "Removed app\components\JamaicaParishMap.js to avoid duplicate old styled-jsx version." -ForegroundColor Yellow
}

if (Test-Path "app\components\JamaicaParishMap.jsx") {
  Copy-Item "app\components\JamaicaParishMap.jsx" "app\components\JamaicaParishMap.jsx.phase47-backup" -Force
  Remove-Item "app\components\JamaicaParishMap.jsx" -Force
  Write-Host "Removed app\components\JamaicaParishMap.jsx to avoid duplicate old styled-jsx version." -ForegroundColor Yellow
}

# Make sure app/map/page.js imports the root component path that already appears in your error trace.
$MapPage = "app\map\page.js"
if (Test-Path $MapPage) {
  $content = Get-Content $MapPage -Raw

  $content = $content.Replace("../components/JamaicaParishMap", "../../components/JamaicaParishMap")
  $content = $content.Replace("@/app/components/JamaicaParishMap", "@/components/JamaicaParishMap")
  $content = $content.Replace("@/components/JamaicaParishMap", "../../components/JamaicaParishMap")

  Set-Content -Path $MapPage -Value $content -Encoding UTF8
  Write-Host "Checked app\map\page.js import path." -ForegroundColor Green
}

if (!(Test-Path "public\assets\jamaica-parish-map.png")) {
  Write-Host "Warning: public\assets\jamaica-parish-map.png is missing. Re-apply Phase 45 PNG asset." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Now restart dev server:" -ForegroundColor Yellow
Write-Host "Ctrl + C"
Write-Host "npm run dev"
Write-Host ""
Write-Host "Then test:"
Write-Host "http://localhost:3000/map"
Write-Host "http://localhost:3000"
