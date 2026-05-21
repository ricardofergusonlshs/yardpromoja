# YardPromoJa Phase 32 SEO smoke test
# Run while npm run dev is running.

$routes = @(
  "http://localhost:3000/robots.txt",
  "http://localhost:3000/sitemap.xml",
  "http://localhost:3000/reels",
  "http://localhost:3000/advertise/packages",
  "http://localhost:3000/media-kit",
  "http://localhost:3000/health",
  "http://localhost:3000/api/health"
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
