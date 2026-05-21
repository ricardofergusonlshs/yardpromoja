# YardPromoJa deployed smoke test
# Usage:
# .\scripts\smoke-test-deployed.ps1 https://yardpromoja.com

param(
  [string]$BaseUrl = "https://yardpromoja.com"
)

$BaseUrl = $BaseUrl.TrimEnd("/")

$routes = @(
  "/",
  "/browse",
  "/browse?category=Food",
  "/browse?category=Sale",
  "/link-up",
  "/campaigns",
  "/login",
  "/contact",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/opengraph-image",
  "/twitter-image",
  "/health",
  "/api/health"
)

Write-Host "Testing $BaseUrl" -ForegroundColor Cyan
Write-Host ""

foreach ($route in $routes) {
  $url = "$BaseUrl$route"

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 25
    Write-Host "OK $($response.StatusCode) $url" -ForegroundColor Green
  } catch {
    Write-Host "FAIL $url" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
  }
}
