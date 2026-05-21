# YardPromoJa Link-Up Planner Phase Update

This ZIP contains a safe phased update based on the dark YardPromoJa homepage and Plan the Link-Up mockups.

## Files included

- `app/page.js`
- `app/link-up/page.js`
- `app/link-up/LinkUpClient.js`
- `app/components/AuthNav.js`
- `app/layout.js`
- `app/yp-dark.css`

## What this phase changes

1. Replaces the homepage with a dark premium YardPromoJa interface.
2. Adds a new `/link-up` route.
3. Adds `/link-up?promo=[slug]` support.
4. Adds a Plan the Link-Up button on the homepage.
5. Adds category quick links, trending promo section, campaign/offer panel, stats strip, and CTA.
6. Updates navigation links through `AuthNav.js` while keeping existing auth/admin/uploader logic.
7. Keeps existing Supabase setup and does not change any keys.
8. Does not touch `app/ad/[slug]/page.js` or `app/ad/[slug]/AdDetailClient.js`, so your Open Graph/social thumbnail split stays protected.

## How to apply

Copy the `app` folder from this ZIP into your project root:

```powershell
Copy-Item -Recurse -Force .\app\* C:\Projects\yardpromo-nextjs-supabase-starter\app\
```

Or copy the files manually into the same paths.

## Test

Run:

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/link-up
```

Then run:

```powershell
npm run build
```

## Important

This phase intentionally does not edit the ad detail page because that page currently holds important actions and Open Graph thumbnail behavior. Update that page in a separate phase after this homepage/link-up phase is stable.


## Phase 1.1 display note
If the new dark page looks very tiny/narrow in your browser, first reset browser zoom:

```text
Ctrl + 0
```

Then hard refresh:

```text
Ctrl + F5
```

This v2 package also adds a dedicated `.yp-container` layout wrapper so the new homepage and `/link-up` page stay wide on desktop and clean on mobile.
