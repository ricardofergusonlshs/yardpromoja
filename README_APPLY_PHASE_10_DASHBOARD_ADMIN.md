# YardPromoJa Phase 10 — Dashboard/Admin Safe Polish

This is a CSS-only phase.

## Files included

```text
app/yp-dark.css
docs/PHASE_10_TEST_CHECKLIST.md
README_APPLY_PHASE_10_DASHBOARD_ADMIN.md
```

## What this phase does

- Polishes dashboard/admin cards, tables, forms, tabs, filters, and empty states.
- Keeps tables horizontally scrollable on phone.
- Improves dashboard/admin mobile layout.
- Keeps the new dark YardPromoJa header/footer polish from previous phases.
- Does not touch JavaScript, Supabase queries, auth, roles, or admin logic.

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup
- admin role logic
- dashboard functions
- admin actions
- create promo logic
- ad detail share thumbnails
- share pack logic
- browse filters
- link-up logic
- campaign logic
- database schema

## Apply

Copy the included `app` folder into your project root and replace files.

This replaces:

```text
app/yp-dark.css
```

## Start

If the server is already running, refresh your browser.

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

```text
http://localhost:3000/dashboard
http://localhost:3000/admin
http://localhost:3000/create
http://localhost:3000
http://localhost:3000/browse
http://localhost:3000/link-up
http://localhost:3000/ad/YOUR_PROMO_SLUG
```

Then run:

```cmd
npm run build
```
