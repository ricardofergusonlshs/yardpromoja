# YardPromoJa Phase 30 smoke test
# Run while npm run dev is running.

$routes = @(
  "http://localhost:3000/advertise/packages",
  "http://localhost:3000/media-kit",
  "http://localhost:3000/advertise",
  "http://localhost:3000/reels",
  "http://localhost:3000/browse",
  "http://localhost:3000/link-up"
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
