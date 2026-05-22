# YardPromoJa Phase 60 - Modern Real Category Icons

This phase replaces the emoji / AI-looking category strip with a cleaner modern rail using real inline SVG icons.

## Goal

Old look:

```text
emoji icons inside glowing circles
```

New look:

```text
clean line icons
modern glass cards
less AI-looking
more premium / app-like
```

## Files added

```text
app/components/ModernCategoryRail.js
app/components/ModernCategoryRail.module.css
scripts/phase-60-modern-real-category-icons.cmd
scripts/phase-60-modern-real-category-icons.js
```

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-60-modern-real-category-icons.cmd
```

## Restart

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

## Test

Open:

```text
http://localhost:3000
```

Hard refresh:

```text
Ctrl + F5
```

## If the old category strip still appears

The script may not have found your exact old category JSX.

Open:

```text
app/page.js
```

Add this import near the top:

```jsx
import ModernCategoryRail from "./components/ModernCategoryRail";
```

Then replace the old category strip with:

```jsx
<ModernCategoryRail />
```

## Backup

The script creates:

```text
app/page.js.phase60-backup
```
