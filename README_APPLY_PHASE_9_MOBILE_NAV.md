# YardPromoJa Phase 9 — Mobile, Navigation, and Final Polish

This is a CSS-only phase.

## Files included

```text
app/yp-dark.css
docs/PHASE_9_TEST_CHECKLIST.md
README_APPLY_PHASE_9_MOBILE_NAV.md
```

## What this phase does

- Polishes the sticky dark header.
- Makes the mobile nav horizontally scrollable instead of crowded.
- Polishes the launch banner on desktop and mobile.
- Polishes the dark footer.
- Adds final responsive fixes for:
  - homepage
  - browse cards
  - link-up page
  - ad detail page
- Reduces clipped buttons.
- Improves focus states and mobile spacing.
- Adds a print-friendly fallback for ad detail pages.

## Protected

This phase does not touch:

- JavaScript app logic
- Supabase keys
- auth
- admin
- dashboard
- create promo
- browse filtering logic
- link-up logic
- ad detail share/thumbnail logic
- campaigns
- metadata

## Apply

Copy the included `app` folder into your project root and replace files.

This replaces:

```text
app/yp-dark.css
```

It preserves the previous dark homepage, link-up, browse, and ad detail styling, then appends Phase 9 responsive polish.

## Start

If the server is already running, just refresh the browser.

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
http://localhost:3000
http://localhost:3000/browse
http://localhost:3000/browse?category=Food
http://localhost:3000/link-up
http://localhost:3000/ad/YOUR_PROMO_SLUG
```

Test desktop width, tablet width, and phone width.

Then run:

```cmd
npm run build
```
