@echo off
setlocal

echo YardPromoJa Phase 62 - Safe Category Icon Polish

if exist "C:\Users\home\nodejs\node.exe" (
  "C:\Users\home\nodejs\node.exe" scripts\phase-62-safe-category-icon-polish.js
) else (
  node scripts\phase-62-safe-category-icon-polish.js
)

if errorlevel 1 (
  echo.
  echo Phase 62 failed. Send a screenshot of this terminal output.
  exit /b 1
)

echo.
echo Phase 62 complete.
echo Restart dev server if needed:
echo C:\Users\home\nodejs\npm.cmd run dev
echo.
echo Test:
echo http://localhost:3000
