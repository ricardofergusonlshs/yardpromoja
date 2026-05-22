# YardPromoJa Phase 64 - Google Jamaica Map Replacement

You were right: the drawn Jamaica/parish map was not accurate enough.

This phase replaces the current `JamaicaParishMap` component with a Google Maps embed of Jamaica.

## Why this approach

Instead of copying a Google Maps screenshot, this uses the official Google Maps embed URL:

```text
https://www.google.com/maps?q=Jamaica&z=9&output=embed
```

That keeps the map accurate and avoids using an unofficial copied image.

## Files installed

The script writes these files:

```text
components/JamaicaParishMap.js
components/JamaicaParishMap.module.css
```

If your project has this folder, it also writes:

```text
app/components/JamaicaParishMap.js
app/components/JamaicaParishMap.module.css
```

## Backups

If old files exist, backups are created:

```text
components/JamaicaParishMap.js.phase64-backup
components/JamaicaParishMap.module.css.phase64-backup
app/components/JamaicaParishMap.js.phase64-backup
app/components/JamaicaParishMap.module.css.phase64-backup
```

## Apply

Copy the included `components`, `app`, `scripts`, and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-64-google-jamaica-map.cmd
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
http://localhost:3000/map
```

Hard refresh:

```text
Ctrl + F5
```

Expected:

- The wrong drawn map is gone.
- A real Google map of Jamaica appears inside the existing map card.
- The surrounding homepage/parish layout remains unchanged.

## Note

The Google map requires internet access in the browser. If internet is unavailable, the iframe area may not load.
