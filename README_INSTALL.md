# YardPromoJa Updated Homepage Page File

This ZIP updates your uploaded `app/page.js` structure to use the new exact-style components:

- `YardPromoSearchBox`
- `YardPromoHomeSections`

Your uploaded page currently imports `AdsGrid`, `HeroStack`, and `categories`, then manually renders Premium Picks, Weekend, Campaigns, and Popular Categories sections. This replacement keeps your hero and `HeroStack`, adds the exact search box after the hero, and replaces the Premium/Weekend/Parish/Category blocks with `YardPromoHomeSections`.

## Files included

```text
app/page.js
README_INSTALL.md
```

## Required component files

This page expects these components to exist:

```text
app/components/YardPromoSearchBox.jsx
app/components/YardPromoSearchBox.module.css
app/components/YardPromoHomeSections.jsx
app/components/YardPromoHomeSections.module.css
```

These are from the ZIPs I gave you earlier:
- `yardpromoja-exact-search-box.zip`
- `yardpromoja-exact-home-sections.zip`

## Install

1. Back up your current page:

```powershell
copy app\page.js app\page.backup.js
```

2. Copy this ZIP's `app/page.js` into your project:

```text
C:\Projects\yardpromo-nextjs-supabase-starter\app\page.js
```

3. Make sure the two component ZIPs above were copied into `app/components`.

4. Run:

```powershell
npm run dev
```

## Notes

This page does not touch Supabase, auth, admin, uploader, or routes. It only changes homepage display composition.

If your current `AdsGrid` is responsible for live dynamic data, this version uses fallback/sample data inside `YardPromoHomeSections`. To use live data, pass your live arrays into:

```jsx
<YardPromoHomeSections
  premiumPromos={premiumPromos || ads || promos || []}
  weekendPromos={weekendPromos || ads || promos || []}
/>
```

Only do that if those variables exist in your current page.
