# Phase 45 Test Checklist

## Map asset

Confirm this file exists:

```text
public/assets/jamaica-parish-map.png
```

## Replace references

Run:

```powershell
.\scripts\phase-45-switch-map-to-png.ps1
```

## Homepage

Test:

```text
http://localhost:3000
```

Scroll to By Parish.

Expected:

- Map displays as PNG.
- No missing image icon.
- Map still fits inside the card.

## Parish pages

Test:

```text
http://localhost:3000/parish
http://localhost:3000/parish/st-elizabeth
http://localhost:3000/parish/portland
```

## Build

Run:

```cmd
npm run build
```
