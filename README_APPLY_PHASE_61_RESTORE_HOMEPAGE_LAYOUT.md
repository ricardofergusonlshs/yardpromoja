# YardPromoJa Phase 61 - Restore Homepage Layout

Phase 60 changed too much of `app/page.js`. It likely replaced the full section that contained the category rail **and** the sections below it, so the homepage looked empty after the category strip.

This phase restores the homepage from the automatic Phase 60 backup.

## What this phase does

It restores:

```text
app/page.js
```

from:

```text
app/page.js.phase60-backup
```

It also creates a backup of the broken version:

```text
app/page.js.phase61-broken-backup
```

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-61-restore-homepage-layout.cmd
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

- Homepage content below the category strip returns.
- Trending cards and right-side panels return.
- Page layout returns to the pre-Phase-60 state.

## Next step

After this is fixed, the next category icon phase should be safer:

- do not replace the whole category section
- only restyle the existing category strip
- or manually replace only the small icon labels one by one
