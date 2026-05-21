# YardPromoJa Phase 54
# CSS-only fix for modern homepage hero text and search.
# This avoids PowerShell parser issues from smart quotes / em dash text.
#
# Run from project root:
# .\scripts\phase-54-css-only-modern-hero-fix.ps1

$Globals = "app\globals.css"
$Marker = "/* === YardPromoJa Phase 54 CSS Only Modern Hero Fix === */"

if (!(Test-Path $Globals)) {
  Write-Host "Could not find app\globals.css" -ForegroundColor Red
  exit 1
}

$content = Get-Content $Globals -Raw

if ($content.Contains($Marker)) {
  Write-Host "Phase 54 CSS is already installed." -ForegroundColor Yellow
  exit 0
}

Copy-Item $Globals "$Globals.phase54-backup" -Force

$Css = @'
/* === YardPromoJa Phase 54 CSS Only Modern Hero Fix === */
/*
  This is intentionally CSS-only.
  It visually replaces the old homepage headline without editing app/page.js.

  Old:
  SOCIAL MEDIA GETS ATTENTION.
  YARDPROMOJA TURNS IT INTO ACTION.

  New:
  What's happening
  in Jamaica?
*/

/* Target the first homepage hero heading with several safe fallbacks. */
body main > section:first-of-type h1,
body main section:first-of-type h1:first-of-type,
body main h1:first-of-type,
.yp-hero h1,
.ypHero h1,
.hero h1,
[class*="hero" i] h1 {
  max-width: min(760px, 100%) !important;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
  text-wrap: balance;
  overflow: visible !important;
}

body main > section:first-of-type h1 *,
body main section:first-of-type h1:first-of-type *,
body main h1:first-of-type *,
.yp-hero h1 *,
.ypHero h1 *,
.hero h1 *,
[class*="hero" i] h1 * {
  display: none !important;
}

body main > section:first-of-type h1::before,
body main section:first-of-type h1:first-of-type::before,
body main h1:first-of-type::before,
.yp-hero h1::before,
.ypHero h1::before,
.hero h1::before,
[class*="hero" i] h1::before {
  content: "What's happening";
  display: block;
  color: #ffffff;
  font-size: clamp(3.25rem, 7vw, 7.25rem);
  font-weight: 1000;
  line-height: 0.92;
  letter-spacing: -0.07em;
  text-transform: none;
  filter: drop-shadow(0 5px 18px rgba(0, 0, 0, 0.38));
}

body main > section:first-of-type h1::after,
body main section:first-of-type h1:first-of-type::after,
body main h1:first-of-type::after,
.yp-hero h1::after,
.ypHero h1::after,
.hero h1::after,
[class*="hero" i] h1::after {
  content: "in Jamaica?";
  display: block;
  margin-top: 0.12em;
  color: #ffd400;
  font-family: "Segoe Script", "Brush Script MT", "Comic Sans MS", cursive;
  font-size: clamp(3.25rem, 7.25vw, 7.4rem);
  font-style: italic;
  font-weight: 900;
  line-height: 0.86;
  letter-spacing: -0.06em;
  text-transform: none;
  text-shadow:
    0 4px 22px rgba(255, 212, 0, 0.24),
    0 8px 34px rgba(0, 0, 0, 0.38);
  transform: rotate(-1deg);
}

/* Replace the old subtitle visually. */
body main > section:first-of-type h1 + p,
body main section:first-of-type h1:first-of-type + p,
body main h1:first-of-type + p,
.yp-hero h1 + p,
.ypHero h1 + p,
.hero h1 + p,
[class*="hero" i] h1 + p {
  max-width: 680px !important;
  margin-top: clamp(18px, 2vw, 24px) !important;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
}

body main > section:first-of-type h1 + p::after,
body main section:first-of-type h1:first-of-type + p::after,
body main h1:first-of-type + p::after,
.yp-hero h1 + p::after,
.ypHero h1 + p::after,
.hero h1 + p::after,
[class*="hero" i] h1 + p::after {
  content: "Find amazing places, events, restaurants, adventures and hidden gems near you.";
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1rem, 1.35vw, 1.28rem);
  font-weight: 650;
  line-height: 1.52;
}

/* Make the existing search feel closer to the reference, without replacing JSX. */
body main > section:first-of-type form,
body main section:first-of-type form:first-of-type,
.yp-hero form,
.ypHero form,
.hero form,
[class*="hero" i] form {
  width: min(980px, 100%) !important;
  min-height: 76px !important;
  margin-top: clamp(22px, 3vw, 36px) !important;
  overflow: hidden !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  border-radius: 999px !important;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.045)),
    rgba(5, 8, 7, 0.72) !important;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.13) !important;
  backdrop-filter: blur(18px);
}

/* Form children: remove the boxy segmented look. */
body main > section:first-of-type form input,
body main section:first-of-type form:first-of-type input,
.yp-hero form input,
.ypHero form input,
.hero form input,
[class*="hero" i] form input {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: #ffffff !important;
  font-weight: 900 !important;
}

body main > section:first-of-type form input::placeholder,
body main section:first-of-type form:first-of-type input::placeholder,
.yp-hero form input::placeholder,
.ypHero form input::placeholder,
.hero form input::placeholder,
[class*="hero" i] form input::placeholder {
  color: rgba(255, 255, 255, 0.76) !important;
}

body main > section:first-of-type form select,
body main section:first-of-type form:first-of-type select,
.yp-hero form select,
.ypHero form select,
.hero form select,
[class*="hero" i] form select {
  border-color: rgba(255, 255, 255, 0.12) !important;
  background-color: transparent !important;
  color: #ffffff !important;
  box-shadow: none !important;
  font-weight: 900 !important;
}

body main > section:first-of-type form select option,
body main section:first-of-type form:first-of-type select option,
.yp-hero form select option,
.ypHero form select option,
.hero form select option,
[class*="hero" i] form select option {
  color: #07110b !important;
  background: #ffffff !important;
}

/* Make the search button circular/yellow like the reference. */
body main > section:first-of-type form button[type="submit"],
body main section:first-of-type form:first-of-type button[type="submit"],
.yp-hero form button[type="submit"],
.ypHero form button[type="submit"],
.hero form button[type="submit"],
[class*="hero" i] form button[type="submit"] {
  width: 56px !important;
  min-width: 56px !important;
  height: 56px !important;
  min-height: 56px !important;
  border: 0 !important;
  border-radius: 999px !important;
  color: #07110b !important;
  background:
    radial-gradient(circle at 33% 25%, rgba(255, 255, 255, 0.42), transparent 31%),
    linear-gradient(135deg, #ffe66d, #ffd400 54%, #ffb900) !important;
  box-shadow:
    0 20px 42px rgba(255, 212, 0, 0.29),
    inset 0 1px 0 rgba(255, 255, 255, 0.42) !important;
}

@media (max-width: 760px) {
  body main > section:first-of-type h1::before,
  body main section:first-of-type h1:first-of-type::before,
  body main h1:first-of-type::before,
  .yp-hero h1::before,
  .ypHero h1::before,
  .hero h1::before,
  [class*="hero" i] h1::before,
  body main > section:first-of-type h1::after,
  body main section:first-of-type h1:first-of-type::after,
  body main h1:first-of-type::after,
  .yp-hero h1::after,
  .ypHero h1::after,
  .hero h1::after,
  [class*="hero" i] h1::after {
    font-size: clamp(2.65rem, 14vw, 4.6rem) !important;
  }

  body main > section:first-of-type form,
  body main section:first-of-type form:first-of-type,
  .yp-hero form,
  .ypHero form,
  .hero form,
  [class*="hero" i] form {
    border-radius: 28px !important;
  }
}
/* === End YardPromoJa Phase 54 CSS Only Modern Hero Fix === */
'@

Add-Content -Path $Globals -Value $Css -Encoding UTF8

Write-Host "Phase 54 CSS-only modern hero fix installed." -ForegroundColor Green
Write-Host "Backup created: app\globals.css.phase54-backup" -ForegroundColor Yellow
Write-Host ""
Write-Host "Start dev server:" -ForegroundColor Yellow
Write-Host '$env:Path = "C:\Users\home\nodejs;$env:Path"'
Write-Host "C:\Users\home\nodejs\npm.cmd run dev"
Write-Host ""
Write-Host "Then open http://localhost:3000 and hard refresh with Ctrl + F5."
