# Phase 59 Test Checklist

## Run

```powershell
.\scripts\phase-59-homepage-only-hero-safe.cmd
```

## Restart dev server

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

## Test homepage

```text
http://localhost:3000
```

Expected:

- Homepage loads.
- Hero carousel works.
- Modern homepage hero title may appear.

## Test browse

```text
http://localhost:3000/browse
```

Expected:

- Browse does not show the homepage hero title.
- Browse layout is restored.
- Filters/cards are usable.

## Build

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```
