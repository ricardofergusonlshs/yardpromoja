# YardPromoJa Phase 13 — System Pages + Build Readiness Polish

This phase adds safe app-level system pages and styling.

## Files included

```text
app/not-found.js
app/loading.js
app/error.js
app/yp-dark.css
scripts/smoke-test-local.ps1
docs/PHASE_13_TEST_CHECKLIST.md
README_APPLY_PHASE_13_SYSTEM_PAGES.md
```

## What this phase does

- Adds a branded 404 page.
- Adds a branded loading page.
- Adds a branded error fallback page.
- Adds matching CSS for those pages.
- Adds a local PowerShell route smoke-test script.
- Keeps the previous CSS from Phase 12 and appends Phase 13 styles.

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup
- admin/dashboard logic
- create promo logic
- browse filters
- link-up logic
- ad detail Open Graph thumbnails
- ad detail share pack
- campaign logic
- database schema

## Apply

Copy the included `app` and `scripts` folders into your project root and replace files.

This adds:

```text
app/not-found.js
app/loading.js
app/error.js
scripts/smoke-test-local.ps1
```

This replaces:

```text
app/yp-dark.css
```

## Start

If your dev server is already running, refresh your browser.

If you need to restart:

Command Prompt:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

PowerShell:

```powershell
& "C:\Users\home\nodejs\npm.cmd" run dev
```

## Test

Open:

```text
http://localhost:3000/this-page-should-not-exist
```

You should see the new YardPromoJa 404 page.

Then test core routes:

```text
http://localhost:3000
http://localhost:3000/browse
http://localhost:3000/link-up
http://localhost:3000/campaigns
http://localhost:3000/login
```

Optional local smoke test in PowerShell while dev server is running:

```powershell
.\scripts\smoke-test-local.ps1
```

Then run:

```cmd
npm run build
```
