# YardPromoJa Phase 24 — Homepage Buttons + Footer Fix

This is a CSS-only phase.

## Files included

```text
app/yp-dark.css
docs/PHASE_24_TEST_CHECKLIST.md
README_APPLY_PHASE_24_BUTTONS_FOOTER.md
```

## Why this phase

From the latest screenshot, the site is working and the homepage is looking strong, but two presentation issues remain:

1. Some **Plan Link-Up** buttons on promo cards look too pale/disabled.
2. The footer links are crowded and can feel clipped.

## What this phase does

- Makes View Details buttons stay strong green.
- Makes Plan Link-Up buttons readable with a gold secondary style.
- Prevents buttons from looking disabled unless they are truly disabled.
- Keeps card button layout cleaner.
- Polishes footer spacing and footer link wrapping.
- Keeps footer advertiser/media-kit links highlighted if those links exist.

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
- homepage JavaScript
- hero carousel logic
- AdsGrid logic

## Apply

Copy the included `app` folder into your project root and replace:

```text
app/yp-dark.css
```

## Test

Open:

```text
http://localhost:3000
http://localhost:3000/browse
http://localhost:3000/link-up
http://localhost:3000/ad/YOUR_PROMO_SLUG
```

Check:

- View Details buttons still work.
- Plan Link-Up buttons are now readable.
- Footer links wrap cleanly.
- No horizontal overflow.

Then run:

```cmd
npm run build
```
