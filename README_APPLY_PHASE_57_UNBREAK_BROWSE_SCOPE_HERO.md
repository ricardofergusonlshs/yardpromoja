# YardPromoJa Phase 57 - Unbreak Browse and Scope Hero Text

Your screenshot shows `/browse` got affected by the Phase 54 CSS-only hero fix.

That happened because Phase 54 used broad selectors like:

```text
body main h1:first-of-type
body main section:first-of-type h1
```

Those selectors changed the browse page hero too, creating the white block and oversized "What's happening in Jamaica?" text.

## What this phase does

It edits only:

```text
app/globals.css
```

It:

- removes the broad Phase 54 CSS block
- removes the broad Phase 53 CSS block if it exists
- adds safer scoped hero CSS that only targets known homepage hero wrapper classes
- restores `/browse` so it is not hijacked by homepage text styling

## Apply

Copy the included `scripts` and `docs` folders into your project root.

Run:

```powershell
.\scripts\phase-57-unbreak-browse-scope-hero.ps1
```

If PowerShell asks:

```text
[D] Do not run [R] Run once [S] Suspend [?] Help
```

type:

```text
R
```

## Test

Open:

```text
http://localhost:3000/browse
```

Hard refresh:

```text
Ctrl + F5
```

Expected:

- Browse page should no longer show the giant white hero box.
- Browse page should not be forced to "What's happening in Jamaica?"

Then test homepage:

```text
http://localhost:3000
```

## Backup

The script creates:

```text
app/globals.css.phase57-backup
```

## Note

If the homepage text returns to the old wording after this, that is better than breaking `/browse`. Next step would be a direct targeted patch to your actual homepage JSX, not a broad global CSS patch.
