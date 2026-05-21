# YardPromoJa Phase 16 — Deployment Hardening

This phase adds production hardening and health-check support.

## Files included

```text
vercel.json
app/health/route.js
app/api/health/route.js
scripts/production-check.ps1
scripts/smoke-test-deployed.ps1
docs/ENVIRONMENT_SETUP.md
docs/ROLLBACK_NOTES.md
README_APPLY_PHASE_16_DEPLOYMENT_HARDENING.md
```

## What this phase does

- Adds `/health`.
- Adds `/api/health`.
- Adds safe Vercel security/cache headers.
- Adds production readiness script.
- Adds deployed smoke test script.
- Adds environment setup notes.
- Adds rollback notes.

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
- CSS styling

## Apply

Copy the included files/folders into your project root.

This adds:

```text
vercel.json
app/health/route.js
app/api/health/route.js
scripts/production-check.ps1
scripts/smoke-test-deployed.ps1
docs/ENVIRONMENT_SETUP.md
docs/ROLLBACK_NOTES.md
```

## Local test

Start dev server:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

Open:

```text
http://localhost:3000/health
http://localhost:3000/api/health
```

Run:

```powershell
.\scripts\production-check.ps1
```

Then:

```cmd
npm run build
```

## After deploy

Run:

```powershell
.\scripts\smoke-test-deployed.ps1 https://yardpromoja.com
```

## Vercel reminder

Confirm:

```text
NEXT_PUBLIC_SITE_URL=https://yardpromoja.com
```

Do not change Supabase keys unless they are already wrong.
