# YardPromoJa Phase 47 — Remove Map styled-jsx Completely

Your error is still showing:

```text
'styled-jsx' cannot be imported from a Server Component module.
Import trace:
./components/JamaicaParishMap.js
./app/map/page.js
```

Phase 46 tried to add `"use client"`, but the safer fix is to remove `styled-jsx` completely.

## What this phase does

This phase replaces:

```text
components/JamaicaParishMap.js
components/JamaicaParishMap.module.css
```

The new component:

- does not use `styled-jsx`
- does not need `"use client"`
- is safe to import from `app/map/page.js`
- uses the PNG map asset from Phase 45
- links parish pins to `/parish/[slug]`

## Apply

Copy the included `components`, `scripts`, and `docs` folders into your project root.

Then run:

```powershell
.\scripts\phase-47-remove-map-styled-jsx.ps1
```

The script backs up the old component as:

```text
components/JamaicaParishMap.js.phase47-backup
```

It also removes old duplicate `app/components/JamaicaParishMap.js` or `.jsx` files if they exist.

## Restart

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
