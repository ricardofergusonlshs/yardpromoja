# YardPromoJa Phase 59 - Homepage Only Hero Safe Fix

Phase 58 failed because PowerShell parsed one of the text replacement lines incorrectly.

This phase avoids PowerShell parsing issues by using a `.cmd` runner and a Node.js script.

## What it fixes

- Removes broad Phase 53/54/57/58 CSS blocks from `app/globals.css`
- Adds safe homepage-only CSS classes
- Patches only `app/page.js`
- Prevents `What's happening in Jamaica?` from appearing on `/browse` or other pages

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Run this from the project root:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-59-homepage-only-hero-safe.cmd
```

## Restart the site

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

## Test

Homepage:

```text
http://localhost:3000
```

Browse:

```text
http://localhost:3000/browse
```

Expected:

- Homepage can use the modern "What's happening in Jamaica?" hero.
- Browse should NOT show that homepage hero.
- Browse should return to its own normal layout.

## Backups created

```text
app/globals.css.phase59-backup
app/page.js.phase59-backup
```

## If homepage text still does not change

Open `app/page.js`, find the old hero `<h1>`, and replace only that `<h1>` with:

```jsx
<h1 className="ypHomeHeroTitle">
  <span className="ypHomeHeroLine">What&apos;s happening</span>
  <span className="ypHomeHeroJamaica">in Jamaica?</span>
</h1>
```

The CSS is already installed by this phase.
