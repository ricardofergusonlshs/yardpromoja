# YardPromoJa Phase 31 asset check
# Run from your project root while npm run dev is running.

$routes = @(
  "http://localhost:3000/assets/parishes/st-elizabeth.png",
  "http://localhost:3000/assets/parishes/st-mary.png",
  "http://localhost:3000/assets/parishes/westmoreland.png",
  "http://localhost:3000/assets/parishes/st-james.png",
  "http://localhost:3000/assets/parishes/hanover.png",
  "http://localhost:3000/assets/reels/hiking-jamaica.png",
  "http://localhost:3000/assets/reels/yardie-brunch.png",
  "http://localhost:3000/assets/reels/blue-lagoon.png",
  "http://localhost:3000/assets/jamaica-parish-map.svg",
  "http://localhost:3000/assets/apple-touch-icon.png"
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
