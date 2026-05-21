# YardPromoJa Hotfix — twitter-image build error

This fixes the build error caused by:

```text
app/twitter-image.js
```

The broken file re-exported route image config from `opengraph-image.js`. Next.js can fail when a special file like `twitter-image.js` re-exports route segment config from another route file.

## Apply

Copy the included `app` folder into your project root and replace:

```text
app/twitter-image.js
```

## Then test

```cmd
npm run build
```

If it still fails, delete `app/twitter-image.js` completely. The Open Graph image will still work through `app/opengraph-image.js`.
