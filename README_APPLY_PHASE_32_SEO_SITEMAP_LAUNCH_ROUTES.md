# YardPromoJa Phase 32 — SEO Sitemap + Launch Routes

This phase makes the new launch routes easier for Google and social crawlers to understand.

## Adds / replaces

```text
app/sitemap.js
app/robots.js
app/seo.js
scripts/phase-32-seo-smoke-test.ps1
docs/PHASE_32_TEST_CHECKLIST.md
```

## What this phase does

- Adds the new public routes to the sitemap:
  - `/`
  - `/browse`
  - `/link-up`
  - `/campaigns`
  - `/reels`
  - `/weekend`
  - `/advertise`
  - `/advertise/packages`
  - `/media-kit`
  - `/create`
  - `/about`
  - `/contact`
  - `/privacy`
  - `/terms`

- Updates robots rules:
  - Allows public discovery routes.
  - Blocks private/admin/account/dashboard/API areas.
  - Points crawlers to `/sitemap.xml`.

- Adds a small `app/seo.js` helper for future metadata work.

## Important

This phase does not change page design or app functions.

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- browse filter logic
- link-up logic
- campaign forms/votes/shares
- ad detail JavaScript
- ad detail Open Graph thumbnail logic
- database schema
- AdsGrid logic
- HeroStack logic
- homepage page.js
- layout.js
- CSS

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

Then test locally:

```text
http://localhost:3000/robots.txt
http://localhost:3000/sitemap.xml
```

Optional smoke test:

```powershell
.\scripts\phase-32-seo-smoke-test.ps1
```

Then run:

```cmd
npm run build
```

## Live test after Vercel deploy

```text
https://yardpromoja.com/robots.txt
https://yardpromoja.com/sitemap.xml
https://yardpromoja.com/reels
https://yardpromoja.com/advertise/packages
https://yardpromoja.com/media-kit
```
