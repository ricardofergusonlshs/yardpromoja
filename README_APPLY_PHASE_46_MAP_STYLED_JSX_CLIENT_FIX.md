# YardPromoJa Phase 46 — Map styled-jsx Client Fix

Your screenshot shows this error:

```text
'styled-jsx' cannot be imported from a Server Component module.
Import trace:
./components/JamaicaParishMap.js
./app/map/page.js
```

## Why this happened

`components/JamaicaParishMap.js` uses `styled-jsx`.

In Next.js App Router, files are Server Components by default unless they start with:

```js
"use client";
```

Because the component uses `styled-jsx`, it needs to be marked as a Client Component.

## What this phase does

The script:

- finds `JamaicaParishMap.js` or `.jsx`
- adds `"use client";` at the top
- switches map references from SVG to PNG
- checks if `public/assets/jamaica-parish-map.png` exists

## Files included

```text
scripts/phase-46-fix-map-styled-jsx-client.ps1
docs/PHASE_46_TEST_CHECKLIST.md
README_APPLY_PHASE_46_MAP_STYLED_JSX_CLIENT_FIX.md
```

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Then run:

```powershell
.\scripts\phase-46-fix-map-styled-jsx-client.ps1
```

Then restart the dev server:

```cmd
Ctrl + C
npm run dev
```

## Test

Open:

```text
http://localhost:3000/map
http://localhost:3000
```

Hard refresh:

```text
Ctrl + F5
```

## Build

Run:

```cmd
npm run build
```

## Protected

This phase does not touch:

- Supabase keys
- auth/admin
- dashboard
- database schema
- HeroStack
- AdsGrid
- parish page logic
