@echo off
setlocal

echo YardPromoJa Phase 65 - Trending Landscape Overlay Cards

if exist "C:\Users\home\nodejs\node.exe" (
  "C:\Users\home\nodejs\node.exe" scripts\phase-65-trending-landscape-overlay.js
) else (
  node scripts\phase-65-trending-landscape-overlay.js
)

if errorlevel 1 (
  echo.
  echo Phase 65 failed. Send a screenshot of this terminal output.
  exit /b 1
)

echo.
echo Phase 65 complete.
echo Restart dev server if needed:
echo C:\Users\home\nodejs\npm.cmd run dev
echo.
echo Test:
echo http://localhost:3000
