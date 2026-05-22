# Phase 58 Test Checklist

## Apply

```powershell
.\scripts\phase-58-homepage-only-hero.ps1
```

## Start dev server

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

## Homepage

Open:

```text
http://localhost:3000
```

Expected:

- Homepage may show `What's happening in Jamaica?`
- Hero carousel still works.
- Search still works.

## Browse

Open:

```text
http://localhost:3000/browse
```

Expected:

- Browse does not show the homepage hero.
- Browse page layout is restored.
- Browse filters/cards are usable.

## Other pages

Check:

```text
http://localhost:3000/map
http://localhost:3000/reels
http://localhost:3000/weekend
```

Expected:

- These pages should not inherit the homepage hero title.

## Build

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```
