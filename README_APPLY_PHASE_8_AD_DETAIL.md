# YardPromoJa Phase 8 — Ad Detail Visual Polish

This is a CSS-only phase.

## Files included

```text
app/yp-dark.css
docs/GOAL_REFERENCE_AD_DETAIL.md
README_APPLY_PHASE_8_AD_DETAIL.md
```

## What this phase does

- Makes `/ad/[slug]` feel closer to the dark premium YardPromoJa interface.
- Polishes the poster/detail hero section.
- Keeps poster left and details/actions right on desktop.
- Stacks cleanly on mobile.
- Improves More Actions, Share Pack, Claim, Report, Directions, Campaigns & Offers, Contact, and Suggestions presentation.
- Keeps the existing ad detail JavaScript behavior untouched.

## Protected

This phase does not touch:

- `app/ad/[slug]/page.js`
- `generateMetadata`
- Open Graph/social share thumbnails
- Supabase keys
- auth logic
- admin
- dashboard
- create promo
- browse
- campaigns
- share pack function
- WhatsApp/Facebook/X/TikTok/download flyer actions
- claim/report functions

## Apply

Copy the included `app` folder into your project root and replace files.

This replaces:

```text
app/yp-dark.css
```

It keeps the Phase 6 homepage and link-up dark styling, then adds Phase 8 ad detail polish at the bottom.

## Start

If a dev server is already running, do not start another one. Just refresh the browser.

If you need to start it:

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
http://localhost:3000/ad/YOUR_PROMO_SLUG
http://localhost:3000
http://localhost:3000/link-up
http://localhost:3000/browse
```

Check these on the ad detail page:

- Poster still shows.
- Interested and RSVP still work.
- More Actions is closed by default.
- Open Share Pack appears only when selected.
- WhatsApp/Facebook/X/TikTok/copy/download flyer still work.
- Claim this promo and Report promo still show as buttons.
- Directions still works.
- Campaigns & sale offers still shows.
- Contact still shows.
- You may also need still shows.
- Mobile layout stacks cleanly.

Then run:

```cmd
npm run build
```
