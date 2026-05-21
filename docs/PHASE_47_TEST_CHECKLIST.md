# Phase 47 Test Checklist

## Error should be gone

Open:

```text
http://localhost:3000/map
```

Expected:

- No styled-jsx Server Component error.
- Map page loads.

## Confirm search

In VS Code search:

```text
styled-jsx
```

Expected:

- No active `components/JamaicaParishMap.js` result using `styled-jsx`.
- README files may still mention it. That is fine.

## Confirm PNG

Confirm file exists:

```text
public/assets/jamaica-parish-map.png
```

## Homepage

Open:

```text
http://localhost:3000
```

Expected:

- Homepage still loads.

## Build

Run:

```cmd
npm run build
```
