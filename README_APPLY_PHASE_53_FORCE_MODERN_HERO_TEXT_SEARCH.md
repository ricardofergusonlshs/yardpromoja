# YardPromoJa Phase 53 — Force Modern Hero Text + Search

Phase 52 did not change your visible text because your real homepage JSX did not match the first script pattern.

This phase is stronger.

## It does two things

1. Tries to patch `app/page.js` directly.
2. Adds a CSS fallback to `app/globals.css` that visually forces the modern headline even if the JSX structure is custom.

## New visible hero text

```text
What’s happening
in Jamaica?
```

Subtitle:

```text
Find amazing places, events, restaurants, adventures and hidden gems near you.
```

## Search

This phase also includes the modern search component:

```text
app/components/HomeSearchPanel.js
app/components/HomeSearchPanel.module.css
```

The script tries to replace the old form if it finds:

```text
What are you looking for?
```

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

Then run:

```powershell
.\scripts\phase-53-force-modern-hero-text-search.ps1
```

Restart:

```cmd
Ctrl + C
npm run dev
```

If npm is not recognized, run:

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

Hard refresh:

```text
Ctrl + F5
```

## Expected result

The old headline should no longer appear visually:

```text
Social media gets attention.
YardPromoJa turns it into action.
```

You should see:

```text
What’s happening
in Jamaica?
```

## Backups created by script

```text
app/page.js.phase53-backup
app/globals.css.phase53-backup
```

## Build

Run:

```cmd
npm run build
```
