# YardPromoJa Phase 4 — Homepage/Card Polish

This phase is a safe visual polish layer after the Link-Up integration.

## What it changes

- Keeps functions/routes unchanged.
- Hides the heavy white horizontal scrollbar under the category strip.
- Makes promo card action buttons stack so **Plan Link-Up** is no longer clipped.
- Keeps `View Details` working as-is.
- Makes promo card heights more consistent.
- Keeps the Link-Up sidebar cleaner on desktop.
- Adds responsive cleanup for tablet and mobile.

## Files included

- `app/yp-dark.css`

## Apply

Copy the `app` folder into your project root and replace files.

Then restart:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

Test:

- http://localhost:3000
- http://localhost:3000/browse
- http://localhost:3000/browse?category=Food
- http://localhost:3000/link-up

Then run:

```cmd
npm run build
```
