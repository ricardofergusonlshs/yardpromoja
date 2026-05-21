# Phase 11 Test Checklist

## /campaigns

- Hero looks dark premium.
- Campaign cards are readable.
- Featured badge appears cleanly.
- Open Campaign buttons work.
- Mobile stacks to one column.

## /campaigns/[slug]

Test these sample routes if they exist:

```text
/campaigns/share-to-win-weekend-tickets
/campaigns/vote-for-next-dj
/campaigns/join-the-guest-list
/campaigns/yardpromo-hashtag-challenge
```

Check:

- Share Campaign button still works.
- Copy Caption button still works.
- WhatsApp button still works.
- Vote form still works.
- RSVP form still works.
- Share-to-win entry form still works.
- Hashtag entry form still works.
- Duplicate vote protection still works on same device.
- Rules show cleanly.
- Mobile layout stacks cleanly.

## Existing routes

- / still loads.
- /browse still loads.
- /link-up still loads.
- /ad/[slug] still loads.
- Share Pack still works.
- Open Graph thumbnail code was not touched.

## Build

Run:

```cmd
npm run build
```

If build fails, fix only the file named in the red error.
