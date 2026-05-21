# YardPromoJa Phase 53
# Stronger fix for homepage text/search:
# 1) Tries to patch app/page.js directly.
# 2) Adds CSS fallback that visually forces the modern headline if the JSX pattern is custom.
#
# Run from project root:
# .\scripts\phase-53-force-modern-hero-text-search.ps1

$Page = "app\page.js"
$Globals = "app\globals.css"

function Add-Import-If-Missing {
  param([string]$Content)

  if ($Content.Contains("<HomeSearchPanel") -and !$Content.Contains("HomeSearchPanel from")) {
    return 'import HomeSearchPanel from "./components/HomeSearchPanel";' + "`r`n" + $Content
  }

  return $Content
}

if (Test-Path $Page) {
  Copy-Item $Page "$Page.phase53-backup" -Force
  $content = Get-Content $Page -Raw
  $original = $content

  # Replace the exact old marketing h1, even if it has spans/br tags/new lines.
  $patterns = @(
    '(?is)<h1[^>]*>.*?SOCIAL\s*MEDIA\s*GETS\s*ATTENTION.*?YARDPROMOJA.*?TURNS\s*IT\s*INTO\s*ACTION\.?.*?</h1>',
    '(?is)<h1[^>]*>.*?SOCIAL\s*MEDIA.*?YARDPROMOJA.*?ACTION\.?.*?</h1>',
    '(?is)<h1[^>]*>.*?YARDPROMOJA.*?ACTION\.?.*?</h1>'
  )

  $newHeroTitle = @'
<h1 className="ypForceHeroTitle">
  <span className="ypForceHeroMain">What&apos;s happening</span>
  <span className="ypForceHeroPlace">in Jamaica?</span>
</h1>
'@

  foreach ($pattern in $patterns) {
    if ([regex]::IsMatch($content, $pattern)) {
      $content = [regex]::Replace($content, $pattern, $newHeroTitle, 1)
      break
    }
  }

  # Replace kicker text.
  $content = $content.Replace("JAMAICA’S LINK-UP PLANNER", "🇯🇲 DISCOVER THE REAL JAMAICA")
  $content = $content.Replace("JAMAICA'S LINK-UP PLANNER", "🇯🇲 DISCOVER THE REAL JAMAICA")
  $content = $content.Replace("Jamaica’s link-up planner", "🇯🇲 Discover the real Jamaica")
  $content = $content.Replace("Jamaica's link-up planner", "🇯🇲 Discover the real Jamaica")

  # Replace subtitle copy.
  $oldCopies = @(
    "Discover events, promotions, food, fashion, transport, stays, deals and more — all in one place.",
    "Discover events, promotions, food, fashion, transport, stays, deals and more — all in one place",
    "Discover events, promotions, food, fashion, transport, stays, deals and more — all in one place.",
    "Discover events, promotions, food, fashion, transport, stays, deals and more — all in one place"
  )

  foreach ($copy in $oldCopies) {
    $content = $content.Replace($copy, "Find amazing places, events, restaurants, adventures and hidden gems near you.")
  }

  # Replace the old search form if it contains "What are you looking for?"
  if (!$content.Contains("<HomeSearchPanel")) {
    $searchPattern = '(?is)<form\b(?:(?!</form>).)*?What\s+are\s+you\s+looking\s+for\??(?:(?!</form>).)*?</form>'
    if ([regex]::IsMatch($content, $searchPattern)) {
      $content = [regex]::Replace($content, $searchPattern, '<HomeSearchPanel />', 1)
    }
  }

  $content = Add-Import-If-Missing $content

  if ($content -ne $original) {
    Set-Content -Path $Page -Value $content -Encoding UTF8
    Write-Host "Patched app\page.js hero text/search." -ForegroundColor Green
  } else {
    Write-Host "app\page.js did not match direct patterns. CSS fallback will force visual text." -ForegroundColor Yellow
  }
} else {
  Write-Host "app\page.js not found. CSS fallback will still be added if globals.css exists." -ForegroundColor Yellow
}

if (Test-Path $Globals) {
  Copy-Item $Globals "$Globals.phase53-backup" -Force
  $globalContent = Get-Content $Globals -Raw
  $marker = "/* === YardPromoJa Phase 53 Force Modern Homepage Hero === */"

  if (!$globalContent.Contains($marker)) {
    $append = @'

/* === YardPromoJa Phase 53 Force Modern Homepage Hero === */

/* Direct patched title classes */
.ypForceHeroTitle {
  margin: 0 !important;
  max-width: 760px !important;
  color: #ffffff !important;
  line-height: 0.92 !important;
  letter-spacing: -0.07em !important;
  text-transform: none !important;
  filter: drop-shadow(0 5px 18px rgba(0, 0, 0, 0.38));
}

.ypForceHeroMain,
.ypForceHeroPlace {
  display: block;
}

.ypForceHeroMain {
  color: #ffffff !important;
  font-size: clamp(3.35rem, 7.2vw, 7.35rem) !important;
  font-weight: 1000 !important;
}

.ypForceHeroPlace {
  margin-top: 0.05em;
  color: #ffd400 !important;
  font-family: "Segoe Script", "Brush Script MT", "Comic Sans MS", cursive;
  font-size: clamp(3.35rem, 7.4vw, 7.5rem) !important;
  font-style: italic;
  font-weight: 900 !important;
  letter-spacing: -0.06em !important;
  text-shadow:
    0 4px 22px rgba(255, 212, 0, 0.24),
    0 8px 34px rgba(0, 0, 0, 0.38);
  transform: rotate(-1deg);
}

/*
  CSS fallback:
  If app/page.js was not patched because the JSX is custom, this visually
  replaces the first hero headline on the homepage.
*/
.yp-hero h1,
.ypHero h1,
.hero h1,
section[class*="hero" i] h1 {
  max-width: 780px !important;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
}

.yp-hero h1 *,
.ypHero h1 *,
.hero h1 *,
section[class*="hero" i] h1 * {
  display: none !important;
}

.yp-hero h1::before,
.ypHero h1::before,
.hero h1::before,
section[class*="hero" i] h1::before {
  content: "What’s happening";
  display: block;
  color: #ffffff;
  font-size: clamp(3.35rem, 7.2vw, 7.35rem);
  font-weight: 1000;
  line-height: 0.92;
  letter-spacing: -0.07em;
  text-transform: none;
  filter: drop-shadow(0 5px 18px rgba(0, 0, 0, 0.38));
}

.yp-hero h1::after,
.ypHero h1::after,
.hero h1::after,
section[class*="hero" i] h1::after {
  content: "in Jamaica?";
  display: block;
  margin-top: 0.12em;
  color: #ffd400;
  font-family: "Segoe Script", "Brush Script MT", "Comic Sans MS", cursive;
  font-size: clamp(3.35rem, 7.4vw, 7.5rem);
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

.yp-hero h1 + p,
.ypHero h1 + p,
.hero h1 + p,
section[class*="hero" i] h1 + p {
  max-width: 660px !important;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
}

.yp-hero h1 + p::after,
.ypHero h1 + p::after,
.hero h1 + p::after,
section[class*="hero" i] h1 + p::after {
  content: "Find amazing places, events, restaurants, adventures and hidden gems near you.";
  display: block;
  color: rgba(255, 255, 255, 0.88);
  font-size: clamp(1rem, 1.35vw, 1.28rem);
  font-weight: 650;
  line-height: 1.52;
}

@media (max-width: 760px) {
  .ypForceHeroMain,
  .ypForceHeroPlace,
  .yp-hero h1::before,
  .ypHero h1::before,
  .hero h1::before,
  section[class*="hero" i] h1::before,
  .yp-hero h1::after,
  .ypHero h1::after,
  .hero h1::after,
  section[class*="hero" i] h1::after {
    font-size: clamp(2.7rem, 14vw, 4.7rem) !important;
  }
}
/* === End YardPromoJa Phase 53 Force Modern Homepage Hero === */
'@
    Add-Content -Path $Globals -Value $append -Encoding UTF8
    Write-Host "Added Phase 53 fallback CSS to app\globals.css." -ForegroundColor Green
  } else {
    Write-Host "Phase 53 fallback CSS already exists." -ForegroundColor Yellow
  }
} else {
  Write-Host "app\globals.css not found." -ForegroundColor Red
}

Write-Host ""
Write-Host "Restart dev server:" -ForegroundColor Yellow
Write-Host "Ctrl + C"
Write-Host "npm run dev"
Write-Host ""
Write-Host "If npm is not recognized, use:"
Write-Host '$env:Path = "C:\Users\home\nodejs;$env:Path"'
Write-Host "C:\Users\home\nodejs\npm.cmd run dev"
Write-Host ""
Write-Host "Then open http://localhost:3000 and hard refresh with Ctrl + F5."
