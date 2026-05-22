# YardPromoJa Phase 68 - Force Correct Jamaica Map

This phase replaces the wrong drawn Jamaica map with a correct Google map embed.

It is stronger than the earlier map phase because it:

- installs the `JamaicaParishMap` component in both likely folders
- replaces imports to point to the forced component
- searches for direct usage of `jamaica-parish-map.png/svg`
- replaces direct old map image usage with the new component
- creates backups before editing

## Files installed

```text
components/JamaicaParishMap.js
components/JamaicaParishMap.module.css
app/components/JamaicaParishMap.js
app/components/JamaicaParishMap.module.css
```

## Files potentially patched

```text
app/page.js
app/map/page.js
app/components/*
components/*
```

Only files that reference `JamaicaParishMap` or `jamaica-parish-map.png/svg` are patched.

## Backups

Backups are created with:

```text
.phase68-backup
```

Example:

```text
app/page.js.phase68-backup
components/JamaicaParishMap.js.phase68-backup
```

## Apply

Copy the included `components`, `app`, `scripts`, and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-68-force-correct-jamaica-map.cmd
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

- The wrong drawn map disappears.
- A correct Google map of Jamaica appears in the same card area.
- The parish section layout stays the same.

## If the old map still appears

Search in VS Code for:

```text
jamaica-parish-map
```

If you find an image tag like:

```jsx
<Image src="/assets/jamaica-parish-map.png" ... />
```

replace that image tag with:

```jsx
<JamaicaParishMap />
```

and make sure the file has:

```jsx
import JamaicaParishMap from "@/components/JamaicaParishMap";
```
