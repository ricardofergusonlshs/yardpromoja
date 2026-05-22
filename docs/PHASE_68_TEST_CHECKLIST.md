# Phase 68 Test Checklist

## Homepage

Open:

```text
http://localhost:3000
```

Expected:

- By Parish section still appears.
- Wrong drawn map is gone.
- Google map of Jamaica appears.

## Map page

Open:

```text
http://localhost:3000/map
```

Expected:

- Google map loads.
- No styled-jsx error.
- No missing component import error.

## Search check

In VS Code, search:

```text
jamaica-parish-map
```

Expected:

- No old image tag is still being used for the homepage map.

## Build

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```
