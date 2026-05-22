# YardPromoJa Phase 67 - Six Trending Featured Photos

This phase adds two more featured photos to the Trending Now section.

## What it does

- Changes the Trending Now promo limit from 4 to 6 where it can find the matching code.
- Adjusts the Trending Now card layout to show 6 landscape cards cleanly.
- Uses 3 columns x 2 rows on wide screens.
- Uses 2 columns on medium screens.
- Uses 1 column on phones.
- Does not remove page sections.

## Files edited by script

Potentially:

```text
app/page.js
components/...
app/components/...
lib/...
app/globals.css
```

The script only edits JS/JSX files that contain trending/featured signals.

## Backups

Backups are created with:

```text
.phase67-backup
```

Example:

```text
app/page.js.phase67-backup
app/globals.css.phase67-backup
```

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-67-six-trending-featured-photos.cmd
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

- Trending Now shows 6 featured/promo cards.
- Cards remain landscape.
- Text stays lower-center.
- Right-side panels remain unchanged.

## If it still shows only 4

Search your project for:

```text
.slice(0, 4)
```

Near the Trending Now or active promos code, change:

```js
.slice(0, 4)
```

to:

```js
.slice(0, 6)
```

Then restart the dev server.
