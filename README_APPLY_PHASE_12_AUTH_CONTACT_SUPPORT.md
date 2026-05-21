# YardPromoJa Phase 12 — Auth, Contact, Saved, Claim/Report, Support Polish

This is a CSS-only phase.

## Files included

```text
app/yp-dark.css
docs/PHASE_12_TEST_CHECKLIST.md
README_APPLY_PHASE_12_AUTH_CONTACT_SUPPORT.md
```

## What this phase does

- Polishes login/signup style.
- Polishes contact/support-style pages.
- Polishes saved promos empty/cards where applicable.
- Polishes claim/report forms.
- Polishes advertise/pricing-style cards.
- Polishes legal/content page panels.
- Keeps mobile layouts clean.

## Protected

This phase does not touch:

- login/signup logic
- auth redirects
- next redirect support
- Supabase keys
- admin/dashboard logic
- create promo logic
- browse filters
- link-up logic
- ad detail share thumbnails
- share pack function
- campaigns
- database schema

## Apply

Copy the included `app` folder into your project root and replace files.

This replaces:

```text
app/yp-dark.css
```

## Start

If the server is already running, refresh your browser.

If you need to restart:

Command Prompt:

```cmd
set PATH=C:\Users\home\nodejs;%PATH%
npm run dev
```

PowerShell:

```powershell
& "C:\Users\home\nodejs\npm.cmd" run dev
```

## Test

```text
http://localhost:3000/login
http://localhost:3000/login?mode=signup
http://localhost:3000/contact
http://localhost:3000/saved
http://localhost:3000/claim?promo=test
http://localhost:3000/report?promo=test
http://localhost:3000/advertise
http://localhost:3000/pricing
http://localhost:3000/terms
http://localhost:3000/privacy
```

Then run:

```cmd
npm run build
```
