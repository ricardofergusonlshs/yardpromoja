# YardPromoJa Phase 49
# Adds elite homepage hero layout polish to globals.css.
# This is intentionally CSS-only so the existing app logic keeps working.
#
# Run from project root:
# .\scripts\phase-49-elite-hero-homepage-polish.ps1

$GlobalsPath = "app\globals.css"

if (!(Test-Path $GlobalsPath)) {
  Write-Host "Could not find app\globals.css." -ForegroundColor Red
  exit 1
}

$content = Get-Content $GlobalsPath -Raw
$marker = "/* === YardPromoJa Phase 49 Elite Hero Format === */"

if ($content.Contains($marker)) {
  Write-Host "Phase 49 global hero polish already exists." -ForegroundColor Yellow
  exit 0
}

$append = @'

/* === YardPromoJa Phase 49 Elite Hero Format === */
/*
  CSS-only homepage hero polish.
  These selectors intentionally target the common class names already used across
  the YardPromoJa phases. They improve the look without touching JS logic.
*/

.yp-hero,
.ypHero,
.hero,
[class*="hero"] {
  position: relative;
}

.yp-hero::before,
.ypHero::before,
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 61% 18%, rgba(255, 212, 0, 0.13), transparent 20%),
    radial-gradient(circle at 78% 58%, rgba(53, 208, 68, 0.08), transparent 24%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.12), transparent 38%, rgba(0, 0, 0, 0.20));
}

.yp-hero h1,
.ypHero h1,
.hero h1 {
  max-width: 760px;
  text-wrap: balance;
  letter-spacing: -0.075em !important;
  filter: drop-shadow(0 5px 18px rgba(0, 0, 0, 0.38));
}

.yp-hero p,
.ypHero p,
.hero p {
  max-width: 610px;
}

.yp-hero input,
.ypHero input,
.hero input,
.yp-hero select,
.ypHero select,
.hero select {
  min-height: 52px;
  border-color: rgba(255, 255, 255, 0.14) !important;
  background: rgba(255, 255, 255, 0.10) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.09),
    0 14px 34px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(12px);
}

.yp-hero input:focus,
.ypHero input:focus,
.hero input:focus,
.yp-hero select:focus,
.ypHero select:focus,
.hero select:focus {
  border-color: rgba(255, 212, 0, 0.54) !important;
  box-shadow:
    0 0 0 4px rgba(255, 212, 0, 0.12),
    0 14px 34px rgba(0, 0, 0, 0.22) !important;
}

.yp-hero button,
.ypHero button,
.hero button,
.yp-hero a,
.ypHero a,
.hero a {
  transition:
    transform 170ms ease,
    box-shadow 170ms ease,
    border-color 170ms ease,
    background 170ms ease;
}

.yp-hero button:hover,
.ypHero button:hover,
.hero button:hover,
.yp-hero a:hover,
.ypHero a:hover,
.hero a:hover {
  transform: translateY(-1px);
}

@media (min-width: 980px) {
  .yp-hero,
  .ypHero,
  .hero {
    min-height: 640px;
  }
}
/* === End YardPromoJa Phase 49 Elite Hero Format === */
'@

Add-Content -Path $GlobalsPath -Value $append -Encoding UTF8

Write-Host "Phase 49 elite homepage hero polish appended to app\globals.css." -ForegroundColor Green
Write-Host "Now hard refresh with Ctrl + F5." -ForegroundColor Yellow
