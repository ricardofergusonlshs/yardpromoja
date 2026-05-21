# YardPromoJa Phase 45
# Switch Jamaica map references from SVG to PNG.
# Run from project root:
# .\scripts\phase-45-switch-map-to-png.ps1

$Old = "/assets/jamaica-parish-map.svg"
$New = "/assets/jamaica-parish-map.png"

$Files = Get-ChildItem -Path "app" -Recurse -Include *.js,*.jsx,*.ts,*.tsx,*.css -File -ErrorAction SilentlyContinue

foreach ($file in $Files) {
  $content = Get-Content $file.FullName -Raw
  if ($content.Contains($Old)) {
    $updated = $content.Replace($Old, $New)
    Set-Content -Path $file.FullName -Value $updated -Encoding UTF8
    Write-Host "Updated $($file.FullName)" -ForegroundColor Green
  }
}

if (Test-Path "public\assets\jamaica-parish-map.png") {
  Write-Host "PNG map found at public\assets\jamaica-parish-map.png" -ForegroundColor Green
} else {
  Write-Host "PNG map missing. Copy public\assets\jamaica-parish-map.png into your project first." -ForegroundColor Red
  exit 1
}

Write-Host "Done. Hard refresh browser with Ctrl + F5." -ForegroundColor Yellow
