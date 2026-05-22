# YardPromoJa Phase 58 - Homepage Only Hero Text

You were right: the "What's happening in Jamaica?" hero should only be on the first page, not on every page.

The earlier CSS-only fix was too broad and affected pages like `/browse`.

## What this phase fixes

This phase:

- removes the broad Phase 53/54/57 global CSS blocks
- patches only `app/page.js`, which is the homepage
- adds safe class-based CSS that only affects the homepage title
- keeps `/browse`, `/map`, `/reels`, `/parish`, and other pages from being changed

## Files edited by the script

```text
app/globals.css
app/page.js
```

## Backups created

```text
app/globals.css.phase58-backup
app/page.js.phase58-backup
```

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Run:

```powershell
cd C:\Projects\yardpromo-nextjs-supabase-starter
.\scripts\phase-58-homepage-only-hero.ps1
```

If PowerShell asks:

```text
[D] Do not run [R] Run once [S] Suspend [?] Help
```

type:

```text
R
```

## Start the site

```powershell
$env:Path = "C:\Users\home\nodejs;$env:Path"
C:\Users\home\nodejs\npm.cmd run dev
```

## Test

Open homepage:

```text
http://localhost:3000
```

Expected:

```text
What's happening
in Jamaica?
```

Open browse:

```text
http://localhost:3000/browse
```

Expected:

- Browse page should NOT show the homepage hero.
- Browse should keep its own page layout.

Hard refresh both pages:

```text
Ctrl + F5
```

## If homepage text does not change

That means your `app/page.js` headline markup is too custom for the script pattern.

In that case, open `app/page.js`, find the old hero `<h1>`, and replace it manually with:

```jsx
<h1 className="ypHomeHeroTitle">
  <span className="ypHomeHeroLine">What&apos;s happening</span>
  <span className="ypHomeHeroJamaica">in Jamaica?</span>
</h1>
```

The CSS is already added by this phase.
