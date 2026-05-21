# YardPromoJa accessibility and mobile QA helper
# Run while npm run dev is running.
# This does a route response check and reminds you what to inspect manually.

$routes = @(
  "http://localhost:3000/",
  "http://localhost:3000/browse",
  "http://localhost:3000/link-up",
  "http://localhost:3000/campaigns",
  "http://localhost:3000/login",
  "http://localhost:3000/contact",
  "http://localhost:3000/health"
)

Write-Host "YardPromoJa accessibility/mobile route check" -ForegroundColor Cyan
Write-Host ""

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
Write-Host "Manual checks:" -ForegroundColor Yellow
Write-Host "- Press Tab through header links. Focus ring should be visible."
Write-Host "- Test phone width. No horizontal page overflow."
Write-Host "- Test More Actions on an ad detail page."
Write-Host "- Test Browse filters."
Write-Host "- Test Link-Up page buttons."
Write-Host "- Test Campaign vote/share form."
Write-Host "- Confirm text is readable on dark sections."
