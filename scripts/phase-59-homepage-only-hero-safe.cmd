@echo off
setlocal

echo YardPromoJa Phase 59 - Homepage Only Hero Safe Runner

if exist "C:\Users\home\nodejs\node.exe" (
  "C:\Users\home\nodejs\node.exe" scripts\phase-59-homepage-only-hero-safe.js
) else (
  node scripts\phase-59-homepage-only-hero-safe.js
)

if errorlevel 1 (
  echo.
  echo Phase 59 failed. Send a screenshot of this terminal output.
  exit /b 1
)

echo.
echo Phase 59 complete.
echo.
echo Start the dev server with:
echo C:\Users\home\nodejs\npm.cmd run dev
echo.
echo Test:
echo http://localhost:3000
echo http://localhost:3000/browse
