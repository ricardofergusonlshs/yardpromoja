# YardPromoJa launch command helper
# Run from project root.

Write-Host "YardPromoJa launch commands" -ForegroundColor Cyan
Write-Host ""

Write-Host "1) Make sure Node is available:" -ForegroundColor Yellow
Write-Host 'set PATH=C:\Users\home\nodejs;%PATH%'
Write-Host ""

Write-Host "2) Start local dev:" -ForegroundColor Yellow
Write-Host "npm run dev"
Write-Host ""

Write-Host "3) Build:" -ForegroundColor Yellow
Write-Host "npm run build"
Write-Host ""

Write-Host "4) Git commands:" -ForegroundColor Yellow
Write-Host "git status"
Write-Host "git add ."
Write-Host 'git commit -m "Finalize YardPromoJa launch polish"'
Write-Host "git push"
Write-Host ""

Write-Host "5) After Vercel deploy, test:" -ForegroundColor Yellow
Write-Host ".\scripts\smoke-test-deployed.ps1 https://yardpromoja.com"
