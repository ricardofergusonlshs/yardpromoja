@echo off
setlocal

echo YardPromoJa Phase 68 - Force Correct Jamaica Map

if exist "C:\Users\home\nodejs\node.exe" (
  "C:\Users\home\nodejs\node.exe" scripts\phase-68-force-correct-jamaica-map.js
) else (
  node scripts\phase-68-force-correct-jamaica-map.js
)

if errorlevel 1 (
  echo.
  echo Phase 68 failed. Send a screenshot of this terminal output.
  exit /b 1
)

echo.
echo Phase 68 complete.
echo Restart dev server if needed:
echo C:\Users\home\nodejs\npm.cmd run dev
echo.
echo Test:
echo http://localhost:3000
echo http://localhost:3000/map
