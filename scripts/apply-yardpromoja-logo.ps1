# YardPromoJa logo update helper
# Run from: C:\Projects\yardpromo-nextjs-supabase-starter

$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path "public\brand" | Out-Null

Copy-Item ".\public\brand\yardpromo-icon.png" "public\brand\yardpromo-icon.png" -Force
Copy-Item ".\public\brand\yardpromo-logo-horizontal.png" "public\brand\yardpromo-logo-horizontal.png" -Force
Copy-Item ".\public\brand\yardpromo-app-icon.png" "public\brand\yardpromo-app-icon.png" -Force
Copy-Item ".\public\brand\yardpromo-wordmark.png" "public\brand\yardpromo-wordmark.png" -Force
Copy-Item ".\public\favicon.png" "public\favicon.png" -Force
Copy-Item ".\public\favicon.ico" "public\favicon.ico" -Force
Copy-Item ".\public\apple-touch-icon.png" "public\apple-touch-icon.png" -Force
Copy-Item ".\public\icon.png" "public\icon.png" -Force
Copy-Item ".\public\manifest-icon.png" "public\manifest-icon.png" -Force
Copy-Item ".\public\manifest.webmanifest" "public\manifest.webmanifest" -Force

# Update app/layout.js safely
$layoutPath = "app\layout.js"
$layout = Get-Content $layoutPath -Raw

$layout = $layout -replace 'applicationName: "YardPromo Jamaica"', 'applicationName: "YardPromoJa"'
$layout = $layout -replace 'title: "YardPromo Jamaica \| Find What’s Happening"', 'title: "YardPromoJa | Find What’s Happening"'
$layout = $layout -replace 'title: "YardPromo Jamaica"', 'title: "YardPromoJa"'
$layout = $layout -replace 'title: "YardPromo"', 'title: "YardPromoJa"'
$layout = $layout -replace 'images: \["/assets/yardpromo-brand-presentation.png"\]', 'images: ["/brand/yardpromo-logo-horizontal.png"]'
$layout = $layout -replace 'icon: "/assets/yardpromo-app-icon.png"', 'icon: "/favicon.png"'
$layout = $layout -replace 'apple: "/assets/yardpromo-app-icon.png"', 'apple: "/apple-touch-icon.png"'
$layout = $layout -replace 'src="/assets/yardpromo-app-icon.png"', 'src="/brand/yardpromo-icon.png"'
$layout = $layout -replace 'src="/assets/yardpromo-wordmark.png"', 'src="/brand/yardpromo-logo-horizontal.png"'
$layout = $layout -replace 'alt="YardPromo logo"', 'alt="YardPromoJa"'
$layout = $layout -replace 'alt="YardPromo"', 'alt="YardPromoJa"'
$layout = $layout -replace 'Jamaican promotion platform', 'BROADCAST • PROMOTE • CONNECT'
$layout = $layout -replace 'YardPromo Jamaica', 'YardPromoJa'

Set-Content $layoutPath $layout -Encoding UTF8

# Add small safe logo CSS if missing
$cssPath = "app\globals.css"
$css = Get-Content $cssPath -Raw

if ($css -notmatch "\.brand-wordmark-img") {
  Add-Content $cssPath @'

/* YardPromoJa logo asset sizing */
.brand-wordmark-img {
  height: auto;
  max-width: 260px;
  object-fit: contain;
}

.brand-icon-img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  border-radius: 14px;
}

.footer-logo-row img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  border-radius: 14px;
}

@media (max-width: 640px) {
  .brand-wordmark-img {
    max-width: 205px;
  }

  .brand-icon-img,
  .footer-logo-row img {
    width: 42px;
    height: 42px;
  }
}
'@
}

Write-Host "YardPromoJa logo assets and code references updated."
Write-Host "Now run:"
Write-Host "git status"
Write-Host "git add public/brand public/favicon.png public/favicon.ico public/apple-touch-icon.png public/icon.png public/manifest-icon.png public/manifest.webmanifest app/layout.js app/globals.css"
Write-Host "git commit -m `"Update YardPromoJa logo assets`""
Write-Host "git push origin main"
