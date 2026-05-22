# Phase 57 Test Checklist

## Apply

```powershell
.\scripts\phase-57-unbreak-browse-scope-hero.ps1
```

## Test browse

Open:

```text
http://localhost:3000/browse
```

Expected:

- Browse page is no longer hijacked by homepage CSS.
- No giant white hero block.
- Browse filters are visible/usable.

## Test homepage

Open:

```text
http://localhost:3000
```

Expected:

- Homepage still loads.
- Hero carousel still works.

## Hard refresh

```text
Ctrl + F5
```

## Build

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```
