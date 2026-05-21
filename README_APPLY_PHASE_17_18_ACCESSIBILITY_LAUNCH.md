# YardPromoJa Phase 17 + 18 — Accessibility Polish + Final Launch Pack

This combines the next two phases into one ZIP.

## Phase 17

Accessibility and performance CSS polish.

Updates:

```text
app/yp-dark.css
```

Adds:

- stronger focus states
- better tap targets
- reduced motion support
- safer media sizing
- long text overflow protection
- table scrollbar polish
- print-friendly fallback

## Phase 18

Final launch support pack.

Adds:

```text
scripts/accessibility-mobile-check.ps1
scripts/launch-commands.ps1
docs/FINAL_LAUNCH_CHECKLIST.md
docs/LAUNCH_NOTES.md
README_APPLY_PHASE_17_18_ACCESSIBILITY_LAUNCH.md
```

## Protected

This phase does not touch:

- Supabase keys
- auth/login/signup logic
- admin/dashboard logic
- create promo logic
- browse filters
- link-up logic
- campaign forms/votes/shares
- ad detail JavaScript
- ad detail Open Graph thumbnail logic
- database schema

## Apply

Copy the included `app`, `scripts`, and `docs` folders into your project root.

This replaces:

```text
app/yp-dark.css
```

## Test

If your dev server is already running, refresh.

If you need to restart:

Command Prompt:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

Then test:

```text
http://localhost:3000
http://localhost:3000/browse
http://localhost:3000/link-up
http://localhost:3000/campaigns
http://localhost:3000/ad/YOUR_PROMO_SLUG
```

Optional PowerShell check:

```powershell
.\scripts\accessibility-mobile-check.ps1
```

Then run:

```cmd
npm run build
```
