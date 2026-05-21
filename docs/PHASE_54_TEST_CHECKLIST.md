# Phase 54 Test Checklist

## Apply

Run:

```powershell
.\scripts\phase-54-css-only-modern-hero-fix.ps1
```

Type:

```text
R
```

if PowerShell asks for permission.

## Start

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

## Homepage

Open:

```text
http://localhost:3000
```

Hard refresh:

```text
Ctrl + F5
```

Expected:

- Old hero headline is visually gone.
- New headline says `What's happening` and `in Jamaica?`
- Search bar looks more rounded/glass.
- Search button is yellow and circular.

## Build

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run build
```
