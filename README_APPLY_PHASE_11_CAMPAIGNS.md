# YardPromoJa Phase 11 — Campaigns & Giveaways Polish

This is a CSS-only phase.

## Files included

```text
app/yp-dark.css
docs/PHASE_11_TEST_CHECKLIST.md
README_APPLY_PHASE_11_CAMPAIGNS.md
```

## What this phase does

- Polishes `/campaigns`.
- Polishes `/campaigns/[slug]`.
- Makes campaign cards match the dark YardPromoJa premium direction.
- Makes campaign detail pages feel like the Link-Up/Home/Browse pages.
- Improves vote, RSVP, share-to-win, hashtag challenge, rules, and stat presentation.
- Keeps mobile stacking clean.

## Protected

This phase does not touch:

- Campaign form logic
- Vote logic
- RSVP logic
- Share/copy logic
- localStorage session logic
- Supabase keys
- auth/admin/dashboard
- create promo
- browse
- ad detail Open Graph thumbnails
- ad detail share pack
- database schema

## Apply

Copy the included `app` folder into your project root and replace files.

This replaces:

```text
app/yp-dark.css
```

## Start

If your dev server is already running, just refresh the browser.

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
http://localhost:3000/campaigns
http://localhost:3000/campaigns/share-to-win-weekend-tickets
http://localhost:3000/campaigns/vote-for-next-dj
http://localhost:3000/campaigns/join-the-guest-list
http://localhost:3000/campaigns/yardpromo-hashtag-challenge
```

Then test existing routes:

```text
http://localhost:3000
http://localhost:3000/browse
http://localhost:3000/link-up
http://localhost:3000/ad/YOUR_PROMO_SLUG
```

Then run:

```cmd
npm run build
```
