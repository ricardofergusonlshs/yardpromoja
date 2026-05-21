# Phase 46 Test Checklist

## Error fix

After running:

```powershell
.\scripts\phase-46-fix-map-styled-jsx-client.ps1
```

Restart:

```cmd
Ctrl + C
npm run dev
```

Then open:

```text
http://localhost:3000/map
```

Expected:

- No styled-jsx Server Component error.
- Jamaica map page loads.

## PNG check

Confirm this exists:

```text
public/assets/jamaica-parish-map.png
```

## Homepage check

Open:

```text
http://localhost:3000
```

Expected:

- Homepage still loads.
- Parish/map section still loads.

## Build

Run:

```cmd
npm run build
```
