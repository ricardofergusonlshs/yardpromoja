# YardPromoJa Phase 46
# Fixes:
# 'styled-jsx' cannot be imported from a Server Component module
# caused by ./components/JamaicaParishMap.js being treated as a Server Component.
#
# Run from your project root:
# .\scripts\phase-46-fix-map-styled-jsx-client.ps1

$PossibleFiles = @(
  "components\JamaicaParishMap.js",
  "components\JamaicaParishMap.jsx",
  "app\components\JamaicaParishMap.js",
  "app\components\JamaicaParishMap.jsx"
)

$FoundAny = $false

foreach ($FilePath in $PossibleFiles) {
  if (Test-Path $FilePath) {
    $FoundAny = $true
    $content = Get-Content $FilePath -Raw

    # Normalize accidental duplicate use client lines first.
    $content = $content -replace '^\s*["'']use client["''];?\s*', ''

    # Add use client at the very top. This is required because the component uses styled-jsx.
    $content = '"use client";' + "`r`n`r`n" + $content

    # Make sure it uses the PNG map asset, not SVG.
    $content = $content.Replace("/assets/jamaica-parish-map.svg", "/assets/jamaica-parish-map.png")
    $content = $content.Replace("'/assets/jamaica-parish-map.svg'", "'/assets/jamaica-parish-map.png'")
    $content = $content.Replace('"/assets/jamaica-parish-map.svg"', '"/assets/jamaica-parish-map.png"')

    Set-Content -Path $FilePath -Value $content -Encoding UTF8

    Write-Host "Fixed $FilePath" -ForegroundColor Green
  }
}

if (!$FoundAny) {
  Write-Host "Could not find JamaicaParishMap.js/jsx in components or app\components." -ForegroundColor Red
  Write-Host "Look for the file shown in the error: ./components/JamaicaParishMap.js" -ForegroundColor Yellow
  exit 1
}

if (Test-Path "public\assets\jamaica-parish-map.png") {
  Write-Host "PNG map asset found." -ForegroundColor Green
} else {
  Write-Host "Warning: public\assets\jamaica-parish-map.png not found." -ForegroundColor Yellow
  Write-Host "Apply Phase 45 again or copy the PNG into public\assets." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Now restart dev server:" -ForegroundColor Yellow
Write-Host "Ctrl + C"
Write-Host "npm run dev"
Write-Host ""
Write-Host "Then test:"
Write-Host "http://localhost:3000/map"
Write-Host "http://localhost:3000"
