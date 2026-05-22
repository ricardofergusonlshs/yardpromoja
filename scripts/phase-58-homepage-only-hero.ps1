# YardPromoJa Phase 58 - Homepage Only Hero Text
# Fixes the broad CSS issue so "What's happening in Jamaica?" appears only on the homepage.
#
# Run from project root:
# .\scripts\phase-58-homepage-only-hero.ps1

$Globals = "app\globals.css"
$HomePage = "app\page.js"

if (!(Test-Path $Globals)) {
  Write-Host "Could not find app\globals.css" -ForegroundColor Red
  exit 1
}

if (!(Test-Path $HomePage)) {
  Write-Host "Could not find app\page.js" -ForegroundColor Red
  exit 1
}

Copy-Item $Globals "$Globals.phase58-backup" -Force
Copy-Item $HomePage "$HomePage.phase58-backup" -Force

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

# Remove all broad homepage hero patches that could leak onto other pages.
$content = Remove-Block $content "/* === YardPromoJa Phase 53 Force Modern Homepage Hero === */" "/* === End YardPromoJa Phase 53 Force Modern Homepage Hero === */"
$content = Remove-Block $content "/* === YardPromoJa Phase 54 CSS Only Modern Hero Fix === */" "/* === End YardPromoJa Phase 54 CSS Only Modern Hero Fix === */"
$content = Remove-Block $content "/* === YardPromoJa Phase 57 Scoped Home Hero Text === */" "/* === End YardPromoJa Phase 57 Scoped Home Hero Text === */"

Set-Content -Path $Globals -Value $content -Encoding UTF8

$page = Get-Content $HomePage -Raw
$originalPage = $page

# Replace the old homepage hero h1 only inside app/page.js.
# This cannot affect /browse, /map, /reels, or other pages.
$newTitle = @'
<h1 className="ypHomeHeroTitle">
  <span className="ypHomeHeroLine">What&apos;s happening</span>
  <span className="ypHomeHeroJamaica">in Jamaica?</span>
</h1>
'@

$h1Patterns = @(
  '(?is)<h1[^>]*>.*?SOCIAL\s*MEDIA\s*GETS\s*ATTENTION.*?YARDPROMOJA.*?TURNS\s*IT\s*INTO\s*ACTION\.?.*?</h1>',
  '(?is)<h1[^>]*>.*?SOCIAL\s*MEDIA.*?YARDPROMOJA.*?ACTION\.?.*?</h1>',
  '(?is)<h1[^>]*>.*?YARDPROMOJA.*?ACTION\.?.*?</h1>'
)

$patchedTitle = $false

foreach ($pattern in $h1Patterns) {
  if ([regex]::IsMatch($page, $pattern)) {
    $page = [regex]::Replace($page, $pattern, $newTitle, 1)
    $patchedTitle = $true
    break
  }
}

# Replace old homepage subtitle text only in app/page.js.
$page = $page.Replace(
  "Discover events, promotions, food, fashion, transport, stays, deals and more — all in one place.",
  "Find amazing places, events, restaurants, adventures and hidden gems near you."
)

$page = $page.Replace(
  "Discover events, promotions, food, fashion, transport, stays, deals and more — all in one place",
  "Find amazing places, events, restaurants, adventures and hidden gems near you"
)

$page = $page.Replace(
  "JAMAICA'S LINK-UP PLANNER",
  "DISCOVER THE REAL JAMAICA"
)

$page = $page.Replace(
  "JAMAICA’S LINK-UP PLANNER",
  "DISCOVER THE REAL JAMAICA"
)

if ($page -ne $originalPage) {
  Set-Content -Path $HomePage -Value $page -Encoding UTF8
  Write-Host "Updated homepage only: app\page.js" -ForegroundColor Green
} else {
  Write-Host "No direct app\page.js text match found. Global cleanup still completed." -ForegroundColor Yellow
}

# Append class-based styles only. These classes exist only in app/page.js after patch.
$content = Get-Content $Globals -Raw
$marker = "/* === YardPromoJa Phase 58 Homepage Only Hero Text === */"

if (!$content.Contains($marker)) {
  $css = @'
/* === YardPromoJa Phase 58 Homepage Only Hero Text === */
/*
  Safe scope:
  These classes are inserted only into app/page.js, so they affect only the homepage.
*/

.ypHomeHeroTitle {
  margin: 0 !important;
  max-width: min(780px, 100%) !important;
  color: #ffffff !important;
  text-transform: none !important;
  text-wrap: balance;
  letter-spacing: -0.07em !important;
  line-height: 0.92 !important;
  filter: drop-shadow(0 5px 18px rgba(0, 0, 0, 0.38));
}

.ypHomeHeroLine,
.ypHomeHeroJamaica {
  display: block;
}

.ypHomeHeroLine {
  color: #ffffff !important;
  font-size: clamp(3.25rem, 7vw, 7.25rem) !important;
  font-weight: 1000 !important;
  line-height: 0.92 !important;
  letter-spacing: -0.07em !important;
}

.ypHomeHeroJamaica {
  margin-top: 0.08em;
  color: #ffd400 !important;
  font-family: "Segoe Script", "Brush Script MT", "Comic Sans MS", cursive;
  font-size: clamp(3.25rem, 7.25vw, 7.4rem) !important;
  font-style: italic;
  font-weight: 900 !important;
  line-height: 0.86 !important;
  letter-spacing: -0.06em !important;
  text-shadow:
    0 4px 22px rgba(255, 212, 0, 0.24),
    0 8px 34px rgba(0, 0, 0, 0.38);
  transform: rotate(-1deg);
}

@media (max-width: 760px) {
  .ypHomeHeroLine,
  .ypHomeHeroJamaica {
    font-size: clamp(2.65rem, 14vw, 4.6rem) !important;
  }
}
/* === End YardPromoJa Phase 58 Homepage Only Hero Text === */
'@

  Add-Content -Path $Globals -Value $css -Encoding UTF8
  Write-Host "Added homepage-only hero styles to app\globals.css" -ForegroundColor Green
}

Write-Host ""
Write-Host "Phase 58 complete." -ForegroundColor Green
Write-Host "Backups created:" -ForegroundColor Yellow
Write-Host "app\globals.css.phase58-backup"
Write-Host "app\page.js.phase58-backup"
Write-Host ""
Write-Host "Start/restart dev server:"
Write-Host '$env:Path = "C:\Users\home\nodejs;$env:Path"'
Write-Host "C:\Users\home\nodejs\npm.cmd run dev"
Write-Host ""
Write-Host "Test:"
Write-Host "Homepage: http://localhost:3000"
Write-Host "Browse:   http://localhost:3000/browse"
Write-Host "Hard refresh with Ctrl + F5."
