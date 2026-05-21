# Phase 53 Test Checklist

## Apply

Run:

```powershell
.\scripts\phase-53-force-modern-hero-text-search.ps1
```

## Restart

```cmd
Ctrl + C
npm run dev
```

If npm is not recognized:

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

- Old `Social media gets attention` headline is gone visually.
- New `What’s happening in Jamaica?` headline appears.
- Subtitle says `Find amazing places, events, restaurants, adventures and hidden gems near you.`

## Search

Expected:

- Search should look closer to the reference if the script matched your old form.
- If search still looks old, the text will still be fixed by CSS fallback.

## Build

Run:

```cmd
npm run build
```
