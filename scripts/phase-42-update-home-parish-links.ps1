# YardPromoJa Phase 42
# Updates homepage parish cards so each card opens its own /parish/[slug] page.
# Run from project root:
# .\scripts\phase-42-update-home-parish-links.ps1

$PagePath = "app\page.js"

if (!(Test-Path $PagePath)) {
  Write-Host "Could not find app\page.js. Run this from your project root." -ForegroundColor Red
  exit 1
}

$content = Get-Content $PagePath -Raw

$replacements = @{
  'href: "/browse?parish=Kingston"' = 'href: "/parish/kingston"'
  'href: "/browse?parish=St.%20Catherine"' = 'href: "/parish/st-catherine"'
  'href: "/browse?parish=Manchester"' = 'href: "/parish/manchester"'
  'href: "/browse?parish=Clarendon"' = 'href: "/parish/clarendon"'
  'href: "/browse?parish=St.%20Ann"' = 'href: "/parish/st-ann"'
  'href: "/browse?parish=Trelawny"' = 'href: "/parish/trelawny"'
  'href: "/browse?parish=St.%20James"' = 'href: "/parish/st-james"'
  'href: "/browse?parish=Hanover"' = 'href: "/parish/hanover"'
  'href: "/browse?parish=Westmoreland"' = 'href: "/parish/westmoreland"'
  'href: "/browse?parish=St.%20Elizabeth"' = 'href: "/parish/st-elizabeth"'
  'href: "/browse?parish=St.%20Mary"' = 'href: "/parish/st-mary"'
  'href: "/browse?parish=Portland"' = 'href: "/parish/portland"'
}

foreach ($old in $replacements.Keys) {
  $content = $content.Replace($old, $replacements[$old])
}

$content = $content.Replace('<Link href="/browse">View all parishes</Link>', '<Link href="/parish">View all parishes</Link>')
$content = $content.Replace('className="yp-btn yp-btn-green yp-full-btn" href="/browse"', 'className="yp-btn yp-btn-green yp-full-btn" href="/parish"')

Set-Content -Path $PagePath -Value $content -Encoding UTF8

Write-Host "Phase 42 parish homepage links updated." -ForegroundColor Green
Write-Host "Test: http://localhost:3000/parish/st-elizabeth" -ForegroundColor Yellow
