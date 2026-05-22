# YardPromoJa Phase 57 - Unbreak Browse and Scope Hero Text
# Removes broad Phase 53/54 CSS that affected /browse.
# Run from project root:
# .\scripts\phase-57-unbreak-browse-scope-hero.ps1

$Globals = "app\globals.css"

if (!(Test-Path $Globals)) {
  Write-Host "Could not find app\globals.css" -ForegroundColor Red
  exit 1
}

Copy-Item $Globals "$Globals.phase57-backup" -Force
$content = Get-Content $Globals -Raw

function Remove-Block {
  param(
    [string]$Text,
    [string]$StartMarker,
    [string]$EndMarker
  )

  $start = $Text.IndexOf($StartMarker)
  while ($start -ge 0) {
    $end = $Text.IndexOf($EndMarker, $start)
    if ($end -lt 0) { break }
    $end = $end + $EndMarker.Length
    $Text = $Text.Remove($start, $end - $start)
    $start = $Text.IndexOf($StartMarker)
  }

  return $Text
}

$content = Remove-Block $content "/* === YardPromoJa Phase 54 CSS Only Modern Hero Fix === */" "/* === End YardPromoJa Phase 54 CSS Only Modern Hero Fix === */"
$content = Remove-Block $content "/* === YardPromoJa Phase 53 Force Modern Homepage Hero === */" "/* === End YardPromoJa Phase 53 Force Modern Homepage Hero === */"

$marker = "/* === YardPromoJa Phase 57 Scoped Home Hero Text === */"

if (!$content.Contains($marker)) {
  $scopedCss = @'
/* === YardPromoJa Phase 57 Scoped Home Hero Text === */
/*
  Phase 54 was too broad and affected /browse.
  This avoids generic selectors like body main h1:first-of-type.
  It only targets known homepage hero wrapper classes.
*/

.yp-modern-hero-copy,
.homeHeroCopy,
.heroCopy {
  max-width: 760px;
}

.yp-modern-hero-copy h1,
.homeHeroCopy h1,
.heroCopy h1 {
  max-width: min(760px, 100%) !important;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
  text-wrap: balance;
  overflow: visible !important;
}

.yp-modern-hero-copy h1 *,
.homeHeroCopy h1 *,
.heroCopy h1 * {
  display: none !important;
}

.yp-modern-hero-copy h1::before,
.homeHeroCopy h1::before,
.heroCopy h1::before {
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

.yp-modern-hero-copy h1::after,
.homeHeroCopy h1::after,
.heroCopy h1::after {
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

.yp-modern-hero-copy h1 + p,
.homeHeroCopy h1 + p,
.heroCopy h1 + p {
  max-width: 680px !important;
  margin-top: clamp(18px, 2vw, 24px) !important;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
}

.yp-modern-hero-copy h1 + p::after,
.homeHeroCopy h1 + p::after,
.heroCopy h1 + p::after {
  content: "Find amazing places, events, restaurants, adventures and hidden gems near you.";
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1rem, 1.35vw, 1.28rem);
  font-weight: 650;
  line-height: 1.52;
}

/* Search polish only inside known home hero copy areas. */
.yp-modern-hero-copy form,
.homeHeroCopy form,
.heroCopy form {
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

.yp-modern-hero-copy form input,
.homeHeroCopy form input,
.heroCopy form input {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: #ffffff !important;
  font-weight: 900 !important;
}

.yp-modern-hero-copy form input::placeholder,
.homeHeroCopy form input::placeholder,
.heroCopy form input::placeholder {
  color: rgba(255, 255, 255, 0.76) !important;
}

.yp-modern-hero-copy form button[type="submit"],
.homeHeroCopy form button[type="submit"],
.heroCopy form button[type="submit"] {
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
  .yp-modern-hero-copy h1::before,
  .homeHeroCopy h1::before,
  .heroCopy h1::before,
  .yp-modern-hero-copy h1::after,
  .homeHeroCopy h1::after,
  .heroCopy h1::after {
    font-size: clamp(2.65rem, 14vw, 4.6rem) !important;
  }

  .yp-modern-hero-copy form,
  .homeHeroCopy form,
  .heroCopy form {
    border-radius: 28px !important;
  }
}
/* === End YardPromoJa Phase 57 Scoped Home Hero Text === */
'@

  $content = $content + "`r`n" + $scopedCss
}

Set-Content -Path $Globals -Value $content -Encoding UTF8

Write-Host "Phase 57 applied." -ForegroundColor Green
Write-Host "Removed broad Phase 53/54 CSS that was breaking /browse." -ForegroundColor Green
Write-Host "Backup created: app\globals.css.phase57-backup" -ForegroundColor Yellow
Write-Host ""
Write-Host "Test:"
Write-Host "http://localhost:3000/browse"
Write-Host "http://localhost:3000"
Write-Host "Hard refresh with Ctrl + F5."
