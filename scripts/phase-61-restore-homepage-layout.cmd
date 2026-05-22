@echo off
setlocal

echo YardPromoJa Phase 61 - Restore Homepage Layout after Phase 60

if exist "C:\Users\home\nodejs\node.exe" (
  "C:\Users\home\nodejs\node.exe" scripts\phase-61-restore-homepage-layout.js
) else (
  node scripts\phase-61-restore-homepage-layout.js
)

if errorlevel 1 (
  echo.
  echo Phase 61 failed. Send a screenshot of this terminal output.
  exit /b 1
)

echo.
echo Phase 61 complete.
echo.
echo Restart dev server if needed:
echo C:\Users\home\nodejs\npm.cmd run dev
echo.
echo Test:
echo http://localhost:3000
