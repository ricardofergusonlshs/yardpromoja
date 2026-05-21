# YardPromoJa Phase 2 Update

This ZIP is the next safe phase after the dark homepage and `/link-up` route update.

## What changed

- Fixed the homepage search field so it sends `q=` to `/browse`.
- Added a safer `/browse/page.js` that reads query params with `useSearchParams`, supports `q` and `search`, and catches Supabase loading errors instead of crashing the page.
- Fixed the duplicate `useEffect` issue in `/link-up/LinkUpClient.js`.
- Added stronger CSS polish for:
  - homepage above-the-fold spacing,
  - dark browse page styling,
  - mobile-friendly browse filters,
  - more focused Link-Up Planner presentation.

## Files included

- `app/page.js`
- `app/browse/page.js`
- `app/link-up/page.js`
- `app/link-up/LinkUpClient.js`
- `app/components/AuthNav.js`
- `app/layout.js`
- `app/yp-dark.css`

## How to apply

Copy the `app` folder into the root of your project and replace files when Windows asks.

Project root example:

```powershell
C:\Projects\yardpromo-nextjs-supabase-starter
```

Then restart the development server:

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
npm run dev
```

## Test these pages

```text
http://localhost:3000
http://localhost:3000/link-up
http://localhost:3000/browse
http://localhost:3000/browse?category=Food
http://localhost:3000/browse?category=Sale
```

## Build test

```powershell
npm run build
```

## Notes

This phase does not touch `app/ad/[slug]/page.js` or `app/ad/[slug]/AdDetailClient.js`, so it should not affect your Open Graph/social thumbnail setup or ad detail share actions.
