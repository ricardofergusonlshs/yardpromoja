@echo off
setlocal

echo YardPromoJa Phase 67 - Six Trending Featured Photos

if exist "C:\Users\home\nodejs\node.exe" (
  "C:\Users\home\nodejs\node.exe" scripts\phase-67-six-trending-featured-photos.js
) else (
  node scripts\phase-67-six-trending-featured-photos.js
)

if errorlevel 1 (
  echo.
  echo Phase 67 failed. Send a screenshot of this terminal output.
  exit /b 1
)

echo.
echo Phase 67 complete.
echo Restart dev server if needed:
echo C:\Users\home\nodejs\npm.cmd run dev
echo.
echo Test:
echo http://localhost:3000
