# YardPromoJa Phase 54 — CSS-only Modern Hero Text Fix

Your Phase 53 script failed because PowerShell hit a parser error from encoded punctuation inside a replacement string.

This phase avoids that completely.

## What this phase does

It only appends CSS to:

```text
app/globals.css
```

It does not edit `app/page.js`.

## Result

The old hero headline is visually replaced:

```text
SOCIAL MEDIA GETS ATTENTION.
YARDPROMOJA TURNS IT INTO ACTION.
```

with:

```text
What's happening
in Jamaica?
```

The subtitle becomes:

```text
Find amazing places, events, restaurants, adventures and hidden gems near you.
```

It also makes the existing search bar more like the reference:

- rounded glass search container
- transparent fields
- yellow circular search button
- smoother modern styling

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Run:

```powershell
.\scripts\phase-54-css-only-modern-hero-fix.ps1
```

When PowerShell asks:

```text
[D] Do not run [R] Run once [S] Suspend [?] Help
```

type:

```text
R
```

## Start the site

Because your PowerShell cannot currently find `npm`, use this:

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

Then open:

```text
http://localhost:3000
```

Hard refresh:

```text
Ctrl + F5
```

## Backup

The script creates:

```text
app/globals.css.phase54-backup
```

## Build

Run:

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```
