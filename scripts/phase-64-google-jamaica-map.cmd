@echo off
setlocal

echo YardPromoJa Phase 64 - Google Jamaica Map Replacement

if exist "C:\Users\home\nodejs\node.exe" (
  "C:\Users\home\nodejs\node.exe" scripts\phase-64-google-jamaica-map.js
) else (
  node scripts\phase-64-google-jamaica-map.js
)

if errorlevel 1 (
  echo.
  echo Phase 64 failed. Send a screenshot of this terminal output.
  exit /b 1
)

echo.
echo Phase 64 complete.
echo Restart dev server if needed:
echo C:\Users\home\nodejs\npm.cmd run dev
echo.
echo Test:
echo http://localhost:3000
echo http://localhost:3000/map
