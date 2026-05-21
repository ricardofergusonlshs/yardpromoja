# YardPromoJa Phase 3 — Link-Up Integration

This phase keeps the same safe approach as the first two ZIPs.

## What this phase changes

- Adds a **Plan Link-Up** action beside View Details on homepage promo cards.
- Adds a **Plan Link-Up** action beside View Details on Browse promo cards.
- Adds a reusable `PlanAroundPromoButton` component for the ad detail page.
- Adds a safe fallback image at `public/assets/yardpromo-brand-preview.png` to stop the 404 warning.
- Adds CSS for the new promo card action layout.
- Keeps `/ad/[slug]/page.js` untouched so Open Graph share thumbnails stay protected.

## Files included

- `app/AdsGrid.js`
- `app/browse/page.js`
- `app/components/PlanAroundPromoButton.js`
- `app/yp-dark.css`
- `public/assets/yardpromo-brand-preview.png`
- `snippets/AdDetailClient-plan-button-snippet.txt`

## Apply steps

1. Stop the local server with Ctrl + C.
2. Unzip this package.
3. Copy the `app` folder into your project root.
4. Copy the `public` folder into your project root.
5. Restart:

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
npm run dev
```

If your terminal is Command Prompt instead of PowerShell, use:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

## Test

Open:

- `http://localhost:3000`
- `http://localhost:3000/browse`
- `http://localhost:3000/browse?category=Food`
- `http://localhost:3000/link-up`
- Click **Plan Link-Up** from a promo card.
- Confirm it opens `/link-up?promo=...`.
- Confirm **View Details** still opens `/ad/[slug]`.

## Optional ad detail integration

The file `snippets/AdDetailClient-plan-button-snippet.txt` gives the safe manual snippet for adding **Plan around this promo** to the ad detail page.

Do not add it to `app/ad/[slug]/page.js`; that file must remain the server metadata wrapper for share thumbnails.

## Build

After testing locally:

```powershell
npm run build
```
