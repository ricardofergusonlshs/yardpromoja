@echo off
setlocal

echo YardPromoJa Phase 66 - Campaigns and Offers Landscape Card

if exist "C:\Users\home\nodejs\node.exe" (
  "C:\Users\home\nodejs\node.exe" scripts\phase-66-campaigns-offers-landscape.js
) else (
  node scripts\phase-66-campaigns-offers-landscape.js
)

if errorlevel 1 (
  echo.
  echo Phase 66 failed. Send a screenshot of this terminal output.
  exit /b 1
)

echo.
echo Phase 66 complete.
echo Restart dev server if needed:
echo C:\Users\home\nodejs\npm.cmd run dev
echo.
echo Test:
echo http://localhost:3000
