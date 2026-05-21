# YardPromoJa Phase 27 — Scroll Warning Cleanup + Deploy Guard

This phase cleans the yellow Next.js warning and adds final deploy guard scripts.

## The warning

Your terminal shows:

```text
Detected `scroll-behavior: smooth` on the `<html>` element.
```

This is not a build error, but we can silence it properly by adding this attribute to the `<html>` tag in `app/layout.js`:

```jsx
data-scroll-behavior="smooth"
```

## Files included

```text
scripts/fix-scroll-behavior-warning.ps1
scripts/deploy-guard.ps1
scripts/local-health-smoke.ps1
docs/PHASE_27_TEST_CHECKLIST.md
README_APPLY_PHASE_27_SCROLL_WARNING_DEPLOY_GUARD.md
```

## Important

This phase does **not** replace `app/layout.js`.

Instead, it includes a safe script that edits your current `app/layout.js` in place and creates a backup:

```text
app/layout.js.phase27-backup
```

This avoids overwriting your metadata, fonts, providers, or Supabase setup.

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Then run this from VS Code terminal:

```powershell
.\scripts\fix-scroll-behavior-warning.ps1
```

Then run:

```cmd
npm run build
```

## Deploy guard

Before pushing to GitHub/Vercel, run:

```powershell
.\scripts\deploy-guard.ps1
```

Optional local route check while dev server is running:

```powershell
.\scripts\local-health-smoke.ps1
```

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- browse filters
- link-up logic
- campaign forms/votes/shares
- ad detail JavaScript
- ad detail Open Graph thumbnail logic
- database schema
- CSS
- homepage JavaScript
- AdsGrid logic
- HeroStack logic
