# YardPromoJa Phase 5 — Homepage Goal Reference Alignment

This phase moves the homepage closer to the uploaded dark premium YardPromoJa target image.

## Included files

- `app/page.js`
- `app/yp-dark.css`
- `docs/GOAL_REFERENCE_HOMEPAGE.png`

The image in `docs/GOAL_REFERENCE_HOMEPAGE.png` is only a reminder of the visual goal. It is not used by the live website.

## What changed

- Homepage lower content now follows the target layout more closely:
  - Trending Now wide section
  - Plan the Link-Up middle card
  - Campaigns & Offers right card
  - Promote Your Business card in the right column
  - Stats strip below
- Hero title now separates YardPromoJa into yellow/green styling closer to the reference.
- Category strip looks more like the reference photo.
- Buttons are more structured and closer to the mockup.
- Existing links/routes are preserved.

## Preserved

- Supabase setup
- Auth behavior
- Admin/dashboard routes
- Browse route
- Ad detail route
- Open Graph/share thumbnail setup
- Existing AdsGrid behavior
- Plan Link-Up route integration

## Apply

Copy the `app` folder into the project root and replace files when prompted.

Then run:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

Test:

```text
http://localhost:3000
http://localhost:3000/link-up
http://localhost:3000/browse
http://localhost:3000/browse?category=Food
```

Then run:

```cmd
npm run build
```
