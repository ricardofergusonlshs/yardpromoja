# YardPromoJa Phase 62 - Safe Category Icon Polish

Phase 60 replaced too much of the homepage section. This phase is safer.

## What it does

It edits only:

```text
app/globals.css
```

It does **not** edit:

```text
app/page.js
```

So it cannot remove your homepage sections again.

## Result

It gives the existing category cards a cleaner, more modern look:

- less emoji/toy-like
- premium glass card style
- cleaner icon circle
- smoother hover
- keeps the current layout and content intact

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-62-safe-category-icon-polish.cmd
```

## Restart

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

## Test

Open:

```text
http://localhost:3000
```

Hard refresh:

```text
Ctrl + F5
```

Expected:

- Homepage content remains visible.
- Category strip remains in the correct place.
- Cards look more modern.
- No sections disappear.

## Truly real icons

CSS can polish the icon area, but to fully replace emojis with real icons, edit only the existing category data/icon rendering.

See:

```text
docs/MANUAL_SAFE_REAL_ICON_METHOD.md
```
