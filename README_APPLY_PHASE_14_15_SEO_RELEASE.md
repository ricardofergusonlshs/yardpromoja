# YardPromoJa Phase 14 + 15 — SEO/PWA + Release Ready

This combines the next two phases in one ZIP.

## Phase 14: SEO/PWA readiness

Adds:

```text
app/robots.js
app/sitemap.js
app/manifest.js
app/opengraph-image.js
app/twitter-image.js
```

This gives the app:

- `/robots.txt`
- `/sitemap.xml`
- `/manifest.webmanifest`
- generated homepage Open Graph image
- generated Twitter/X image
- PWA install metadata
- app shortcuts for Browse, Link-Up, Post Promo, and Campaigns

## Phase 15: Final release/testing support

Adds:

```text
scripts/final-smoke-test-local.ps1
scripts/check-yardpromo-release.ps1
docs/PHASE_14_15_FINAL_RELEASE_CHECKLIST.md
```

These help you test routes and check required files before deployment.

## Also included

```text
app/yp-dark.css
```

This carries forward the latest styling and adds only a small phase note. No visual redesign is done in this combined phase.

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- browse filters
- link-up logic
- campaign forms/votes/shares
- ad detail page JavaScript
- ad detail Open Graph thumbnail logic
- database schema

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

## Test

Start your dev server if it is not already running:

Command Prompt:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

PowerShell:

```powershell
& "C:\Users\home\nodejs\npm.cmd" run dev
```

Open:

```text
http://localhost:3000/robots.txt
http://localhost:3000/sitemap.xml
http://localhost:3000/manifest.webmanifest
http://localhost:3000/opengraph-image
http://localhost:3000/twitter-image
```

Optional smoke test in PowerShell while dev server is running:

```powershell
.\scripts\final-smoke-test-local.ps1
```

Optional file check:

```powershell
.\scripts\check-yardpromo-release.ps1
```

Then run:

```cmd
npm run build
```

## Vercel reminders

In Vercel Environment Variables, confirm:

```text
NEXT_PUBLIC_SITE_URL=https://yardpromoja.com
```

Do not change your Supabase keys unless they are already wrong.
