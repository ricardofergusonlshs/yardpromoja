# YardPromoJa Phase 52
# Modernizes homepage hero copy and installs a reference-style search panel.
#
# Run from project root:
# .\scripts\phase-52-modernize-hero-copy-search.ps1

$Page = "app\page.js"
$Globals = "app\globals.css"

if (Test-Path $Page) {
  Copy-Item $Page "$Page.phase52-backup" -Force
  $content = Get-Content $Page -Raw

  # Replace the old uppercase marketing line if it is inside the main h1.
  $newH1 = '<h1$1>What''s happening <span>in Jamaica?</span></h1>'
  $content = [regex]::Replace(
    $content,
    '(?s)<h1([^>]*)>.*?(SOCIAL\s+MEDIA|YARDPROMOJA\s+TURNS|TURNS\s+IT\s+INTO\s+ACTION).*?</h1>',
    $newH1,
    1
  )

  # Kicker variants.
  $content = $content.Replace("JAMAICA’S LINK-UP PLANNER", "🇯🇲 DISCOVER THE REAL JAMAICA")
  $content = $content.Replace("JAMAICA'S LINK-UP PLANNER", "🇯🇲 DISCOVER THE REAL JAMAICA")
  $content = $content.Replace("Jamaica’s link-up planner", "🇯🇲 Discover the real Jamaica")
  $content = $content.Replace("Jamaica's link-up planner", "🇯🇲 Discover the real Jamaica")

  # Subtitle variants.
  $content = $content.Replace(
    "Discover events, promotions, food, fashion, transport, stays, deals and more — all in one place.",
    "Find amazing places, events, restaurants, adventures and hidden gems near you."
  )
  $content = $content.Replace(
    "Discover events, promotions, food, fashion, transport, stays, deals and more — all in one place",
    "Find amazing places, events, restaurants, adventures and hidden gems near you"
  )
  $content = $content.Replace(
    "Discover events, promotions, food, fashion, transport, stays, deals and more — all in one place.",
    "Find amazing places, events, restaurants, adventures and hidden gems near you."
  )

  # If the page does not already import HomeSearchPanel but uses it, add import.
  if ($content.Contains("<HomeSearchPanel") -and !$content.Contains("HomeSearchPanel from")) {
    $content = 'import HomeSearchPanel from "@/app/components/HomeSearchPanel";' + "`r`n" + $content
  }

  Set-Content -Path $Page -Value $content -Encoding UTF8
  Write-Host "Updated hero copy in app\page.js." -ForegroundColor Green
} else {
  Write-Host "app\page.js not found. Search panel files were still copied." -ForegroundColor Yellow
}

if (Test-Path $Globals) {
  $globalContent = Get-Content $Globals -Raw
  $marker = "/* === YardPromoJa Phase 52 Modern Hero Text === */"

  if (!$globalContent.Contains($marker)) {
    $append = @'

/* === YardPromoJa Phase 52 Modern Hero Text === */
.yp-hero h1,
.ypHero h1,
.hero h1,
[class*="hero"] h1 {
  text-transform: none !important;
  letter-spacing: -0.062em !important;
  line-height: 0.94 !important;
  text-wrap: balance;
}

.yp-hero h1 span,
.ypHero h1 span,
.hero h1 span,
[class*="hero"] h1 span {
  display: inline-block;
  color: #ffd400 !important;
  font-family: "Segoe Script", "Brush Script MT", "Comic Sans MS", cursive;
  font-style: italic;
  font-weight: 900;
  letter-spacing: -0.045em;
  text-shadow:
    0 4px 22px rgba(255, 212, 0, 0.20),
    0 8px 34px rgba(0, 0, 0, 0.38);
  transform: translateY(0.03em) rotate(-1deg);
}

.yp-hero p,
.ypHero p,
.hero p,
[class*="hero"] p {
  max-width: 680px;
}

.yp-hero [class*="kicker"],
.ypHero [class*="kicker"],
.hero [class*="kicker"],
[class*="hero"] [class*="kicker"] {
  color: #ffd400 !important;
  letter-spacing: 0.16em !important;
}
/* === End YardPromoJa Phase 52 Modern Hero Text === */
'@
    Add-Content -Path $Globals -Value $append -Encoding UTF8
    Write-Host "Appended Phase 52 hero text styling to app\globals.css." -ForegroundColor Green
  } else {
    Write-Host "Phase 52 global styling already exists." -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "Restart dev server:" -ForegroundColor Yellow
Write-Host "Ctrl + C"
Write-Host "npm run dev"
Write-Host ""
Write-Host "Then open http://localhost:3000 and hard refresh with Ctrl + F5."
