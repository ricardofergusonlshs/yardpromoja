# YardPromoJa asset check
# Run from your project root.

$files = @(
  "public\assets\favicon.png",
  "public\assets\apple-touch-icon.png",
  "public\assets\yardpromo-icon.png",
  "public\assets\yardpromo-app-icon.png",
  "public\favicon.png",
  "public\apple-touch-icon.png"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    Write-Host "OK   $file" -ForegroundColor Green
  } else {
    Write-Host "MISS $file" -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "Then test:" -ForegroundColor Cyan
Write-Host "http://localhost:3000/assets/apple-touch-icon.png"
Write-Host "http://localhost:3000/assets/yardpromo-icon.png"
Write-Host "http://localhost:3000/manifest.webmanifest"
