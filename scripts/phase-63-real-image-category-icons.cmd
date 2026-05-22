@echo off
setlocal

echo YardPromoJa Phase 63 - Real Image Category Icons

if exist "C:\Users\home\nodejs\node.exe" (
  "C:\Users\home\nodejs\node.exe" scripts\phase-63-real-image-category-icons.js
) else (
  node scripts\phase-63-real-image-category-icons.js
)

if errorlevel 1 (
  echo.
  echo Phase 63 failed. Send a screenshot of this terminal output.
  exit /b 1
)

echo.
echo Phase 63 complete.
echo Restart dev server if needed:
echo C:\Users\home\nodejs\npm.cmd run dev
echo.
echo Test:
echo http://localhost:3000
