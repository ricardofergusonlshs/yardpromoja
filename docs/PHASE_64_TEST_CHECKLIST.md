# Phase 64 Test Checklist

## Homepage

Open:

```text
http://localhost:3000
```

Expected:

- By Parish section still appears.
- The map card shows a Google map of Jamaica.
- Parish cards still appear on the left.
- Explore Your Parish card still appears below/right.

## Map page

Open:

```text
http://localhost:3000/map
```

Expected:

- Google map preview loads.
- No styled-jsx/server component error.

## Build

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```

Expected:

- Build completes.
