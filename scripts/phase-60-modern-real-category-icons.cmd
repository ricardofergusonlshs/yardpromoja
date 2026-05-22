@echo off
setlocal

echo YardPromoJa Phase 60 - Modern real category icons

if exist "C:\Users\home\nodejs\node.exe" (
  "C:\Users\home\nodejs\node.exe" scripts\phase-60-modern-real-category-icons.js
) else (
  node scripts\phase-60-modern-real-category-icons.js
)

if errorlevel 1 (
  echo.
  echo Phase 60 failed. Send a screenshot of this terminal output.
  exit /b 1
)

echo.
echo Phase 60 complete.
echo Restart dev server if needed:
echo C:\Users\home\nodejs\npm.cmd run dev
