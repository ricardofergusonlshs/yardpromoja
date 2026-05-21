# YardPromoJa local health smoke test
# Run while npm run dev is running.

$routes = @(
  "http://localhost:3000/",
  "http://localhost:3000/health",
  "http://localhost:3000/api/health",
  "http://localhost:3000/manifest.webmanifest",
  "http://localhost:3000/assets/apple-touch-icon.png",
  "http://localhost:3000/assets/jamaica-parish-map.svg"
)

foreach ($route in $routes) {
  try {
    $response = Invoke-WebRequest -Uri $route -UseBasicParsing -TimeoutSec 25
    Write-Host "OK $($response.StatusCode) $route" -ForegroundColor Green
  } catch {
    Write-Host "FAIL $route" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
  }
}
