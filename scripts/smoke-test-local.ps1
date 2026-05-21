# YardPromoJa local route smoke test helper
# Run this while npm run dev is running.

$routes = @(
  "http://localhost:3000/",
  "http://localhost:3000/browse",
  "http://localhost:3000/browse?category=Food",
  "http://localhost:3000/link-up",
  "http://localhost:3000/campaigns",
  "http://localhost:3000/login",
  "http://localhost:3000/contact",
  "http://localhost:3000/saved",
  "http://localhost:3000/claim?promo=test",
  "http://localhost:3000/report?promo=test",
  "http://localhost:3000/this-page-should-not-exist"
)

foreach ($route in $routes) {
  try {
    $response = Invoke-WebRequest -Uri $route -UseBasicParsing -TimeoutSec 20
    Write-Host "OK $($response.StatusCode) $route" -ForegroundColor Green
  } catch {
    $status = $_.Exception.Response.StatusCode.value__
    if ($status -eq 404 -and $route -like "*this-page-should-not-exist*") {
      Write-Host "OK 404 custom not-found route loaded: $route" -ForegroundColor Yellow
    } else {
      Write-Host "FAIL $route" -ForegroundColor Red
      Write-Host $_.Exception.Message -ForegroundColor Red
    }
  }
}
