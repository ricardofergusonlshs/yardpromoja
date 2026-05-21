# YardPromoJa final local smoke test
# Run after "npm run dev" is running.

$routes = @(
  "http://localhost:3000/",
  "http://localhost:3000/browse",
  "http://localhost:3000/browse?category=Food",
  "http://localhost:3000/browse?category=Sale",
  "http://localhost:3000/link-up",
  "http://localhost:3000/campaigns",
  "http://localhost:3000/campaigns/share-to-win-weekend-tickets",
  "http://localhost:3000/login",
  "http://localhost:3000/login?mode=signup",
  "http://localhost:3000/contact",
  "http://localhost:3000/saved",
  "http://localhost:3000/claim?promo=test",
  "http://localhost:3000/report?promo=test",
  "http://localhost:3000/robots.txt",
  "http://localhost:3000/sitemap.xml",
  "http://localhost:3000/manifest.webmanifest",
  "http://localhost:3000/opengraph-image",
  "http://localhost:3000/twitter-image"
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

Write-Host ""
Write-Host "Next: run npm run build" -ForegroundColor Yellow
