# YardPromoJa Phase 6 — Link-Up Page Polish

This phase focuses on making `/link-up` closer to the dark Plan the Link-Up reference image.

## Files included

- `app/link-up/page.js`
- `app/link-up/LinkUpClient.js`
- `app/yp-dark.css`
- `docs/GOAL_REFERENCE_LINKUP.png`

## What changed

- Tightened the `/link-up` hero to match the dark reference layout.
- Improved the planning filter bar.
- Made the featured starting point larger and more poster-focused.
- Added option-count chips to each plan row.
- Polished the Your Link-Up Plan rows with stronger icon circles and color groups.
- Improved Smart Suggestions, Deals & Offers, Share Your Plan, and bottom CTA cards.

## What did not change

- Supabase keys/settings were not changed.
- Auth logic was not changed.
- Admin/dashboard routes were not touched.
- Ad detail metadata and share-thumbnail files were not touched.
- Existing `/browse`, `/ad/[slug]`, `/create`, `/campaigns`, and saved promo behavior remains separate.

## Apply

Copy the `app` and `docs` folders into your project root.

Then restart:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

Test:

```text
http://localhost:3000/link-up
http://localhost:3000/link-up?promo=YOUR_PROMO_SLUG
http://localhost:3000
http://localhost:3000/browse
```

If a dev server is already running, hard refresh with `Ctrl + F5` first.
