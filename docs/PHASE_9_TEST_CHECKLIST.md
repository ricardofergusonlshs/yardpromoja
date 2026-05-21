# Phase 9 Test Checklist

## Desktop

- Header stays fixed/sticky.
- Logo looks clean.
- Nav links fit.
- Post Your Promo button stands out.
- Launch banner looks clean.
- Homepage cards do not clip.
- Browse cards do not clip.
- Link-Up page still works.
- Ad detail share pack still works.
- Footer looks dark and premium.

## Mobile

- Header does not cover content badly.
- Nav scrolls horizontally.
- Launch banner stacks cleanly.
- Homepage search/buttons fit.
- Category chips scroll cleanly.
- Browse cards stack.
- Plan Link-Up buttons are visible.
- Ad detail poster/details stack.
- More Actions is closed by default.
- Share Pack only appears when selected.
- Claim/Report buttons fit.
- Footer links wrap cleanly.

## Functional checks

- /browse?category=Food loads.
- /link-up loads.
- /link-up?promo=... loads.
- /ad/[slug] loads.
- Copy/share/download flyer actions still work.
- Open Graph/social thumbnail files were not touched.

## Build

Run:

```cmd
npm run build
```

If build fails, save the red error and fix only the related file.
