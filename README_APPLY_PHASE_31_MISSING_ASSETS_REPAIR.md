# YardPromoJa Phase 31 — Missing Assets Repair

Your screenshot shows these missing files:

```text
GET /assets/parishes/st-elizabeth.png 404
GET /assets/parishes/st-mary.png 404
GET /assets/parishes/westmoreland.png 404
GET /assets/parishes/st-james.png 404
GET /assets/reels/hiking-jamaica.png 404
GET /assets/reels/yardie-brunch.png 404
GET /assets/reels/blue-lagoon.png 404
```

That means the app code is requesting the new Parish/Reels assets, but the `public/assets` files were not copied into the project.

## Files added

```text
public/assets/parishes/*.png
public/assets/reels/*.png
public/assets/jamaica-parish-map.svg
public/assets/favicon.png
public/assets/apple-touch-icon.png
public/assets/yardpromo-icon.png
public/assets/yardpromo-app-icon.png
public/favicon.png
public/apple-touch-icon.png
scripts/phase-31-asset-check.ps1
docs/PHASE_31_TEST_CHECKLIST.md
```

## Apply

Copy the included `public` and `scripts` folders into your project root.

Do not put these files inside `app`.

Correct location example:

```text
C:\Projects\yardpromo-nextjs-supabase-starter\public\assets\parishes\st-elizabeth.png
C:\Projects\yardpromo-nextjs-supabase-starter\public\assets\reels\blue-lagoon.png
```

## Test

Start or keep your dev server running:

```cmd
npm run dev
```

Then run:

```powershell
.\scripts\phase-31-asset-check.ps1
```

Expected: all listed asset URLs return `200`.

Then open:

```text
http://localhost:3000
http://localhost:3000/reels
```

Finally:

```cmd
npm run build
```

## Protected

This phase does not touch app code, Supabase, auth, browse, link-up, campaign logic, ad detail sharing, database schema, or CSS.
