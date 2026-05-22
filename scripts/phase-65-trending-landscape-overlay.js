const fs = require("fs");
const path = require("path");

const root = process.cwd();
const globalsPath = path.join(root, "app", "globals.css");

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function removeBlock(text, startMarker, endMarker) {
  let next = text;
  let start = next.indexOf(startMarker);

  while (start !== -1) {
    const end = next.indexOf(endMarker, start);
    if (end === -1) break;
    next = next.slice(0, start) + next.slice(end + endMarker.length);
    start = next.indexOf(startMarker);
  }

  return next;
}

if (!exists(globalsPath)) {
  console.error("Could not find app/globals.css. Run this from the project root.");
  process.exit(1);
}

fs.copyFileSync(globalsPath, `${globalsPath}.phase65-backup`);

let css = read(globalsPath);

css = removeBlock(
  css,
  "/* === YardPromoJa Phase 65 Trending Landscape Overlay Cards === */",
  "/* === End YardPromoJa Phase 65 Trending Landscape Overlay Cards === */"
);

const block = `/* === YardPromoJa Phase 65 Trending Landscape Overlay Cards === */
/*
  Goal:
  Make the Trending Now promo cards feel more modern:
  - landscape image across the whole card
  - text lowered and centered over the image
  - no left-image / right-text split
  - keep the existing grid/section and do not edit app/page.js
*/

[class*="trending" i] a[href^="/ad/"],
[class*="promo" i] [class*="trending" i] a[href^="/ad/"],
[class*="adsgrid" i] a[href^="/ad/"],
[class*="AdsGrid" i] a[href^="/ad/"] {
  position: relative !important;
  display: block !important;
  min-height: clamp(210px, 18vw, 270px) !important;
  aspect-ratio: 16 / 9 !important;
  overflow: hidden !important;
  border-radius: 18px !important;
  isolation: isolate !important;
  color: #ffffff !important;
  background: #07100b !important;
  box-shadow:
    0 22px 48px rgba(0, 0, 0, 0.30),
    inset 0 1px 0 rgba(255, 255, 255, 0.10) !important;
}

/* Full-card image layer */
[class*="trending" i] a[href^="/ad/"] > :first-child,
[class*="adsgrid" i] a[href^="/ad/"] > :first-child,
[class*="AdsGrid" i] a[href^="/ad/"] > :first-child {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  min-width: 0 !important;
  border-radius: inherit !important;
  overflow: hidden !important;
  z-index: 0 !important;
}

/* Actual image fill */
[class*="trending" i] a[href^="/ad/"] img,
[class*="adsgrid" i] a[href^="/ad/"] img,
[class*="AdsGrid" i] a[href^="/ad/"] img {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  object-fit: cover !important;
  object-position: center center !important;
  transform: scale(1.01);
  filter: saturate(1.06) contrast(1.03) brightness(0.88);
  transition: transform 240ms ease, filter 240ms ease;
}

/* Strong lower gradient so title is readable */
[class*="trending" i] a[href^="/ad/"]::after,
[class*="adsgrid" i] a[href^="/ad/"]::after,
[class*="AdsGrid" i] a[href^="/ad/"]::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(180deg,
      rgba(0, 0, 0, 0.06) 0%,
      rgba(0, 0, 0, 0.10) 34%,
      rgba(0, 0, 0, 0.66) 72%,
      rgba(0, 0, 0, 0.88) 100%),
    radial-gradient(circle at 50% 100%, rgba(56, 212, 48, 0.16), transparent 48%);
}

/* Place all non-image content above the image */
[class*="trending" i] a[href^="/ad/"] > :not(:first-child),
[class*="adsgrid" i] a[href^="/ad/"] > :not(:first-child),
[class*="AdsGrid" i] a[href^="/ad/"] > :not(:first-child) {
  position: relative !important;
  z-index: 2 !important;
}

/* Lower-center text panel */
[class*="trending" i] a[href^="/ad/"] > :last-child,
[class*="adsgrid" i] a[href^="/ad/"] > :last-child,
[class*="AdsGrid" i] a[href^="/ad/"] > :last-child {
  position: absolute !important;
  left: 18px !important;
  right: 18px !important;
  bottom: 15px !important;
  width: auto !important;
  max-width: none !important;
  min-height: 0 !important;
  padding: 0 !important;
  display: grid !important;
  justify-items: center !important;
  align-content: end !important;
  gap: 5px !important;
  text-align: center !important;
  background: transparent !important;
  box-shadow: none !important;
  border: 0 !important;
}

/* Category label */
[class*="trending" i] a[href^="/ad/"] > :last-child > :first-child,
[class*="adsgrid" i] a[href^="/ad/"] > :last-child > :first-child,
[class*="AdsGrid" i] a[href^="/ad/"] > :last-child > :first-child {
  color: #38d430 !important;
  font-size: 0.78rem !important;
  font-weight: 1000 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
}

/* Promo title */
[class*="trending" i] a[href^="/ad/"] h3,
[class*="trending" i] a[href^="/ad/"] h4,
[class*="adsgrid" i] a[href^="/ad/"] h3,
[class*="adsgrid" i] a[href^="/ad/"] h4,
[class*="AdsGrid" i] a[href^="/ad/"] h3,
[class*="AdsGrid" i] a[href^="/ad/"] h4 {
  margin: 0 !important;
  max-width: 92% !important;
  color: #ffffff !important;
  font-size: clamp(1.22rem, 2.1vw, 1.8rem) !important;
  font-weight: 1000 !important;
  line-height: 0.94 !important;
  letter-spacing: -0.055em !important;
  text-align: center !important;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.62) !important;
}

/* Location line */
[class*="trending" i] a[href^="/ad/"] p,
[class*="adsgrid" i] a[href^="/ad/"] p,
[class*="AdsGrid" i] a[href^="/ad/"] p {
  margin: 0 !important;
  max-width: 92% !important;
  color: rgba(255, 255, 255, 0.82) !important;
  font-size: 0.82rem !important;
  font-weight: 800 !important;
  line-height: 1.25 !important;
  text-align: center !important;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.58) !important;
}

/* Date and tiny metrics stay low but clean */
[class*="trending" i] a[href^="/ad/"] small,
[class*="trending" i] a[href^="/ad/"] time,
[class*="adsgrid" i] a[href^="/ad/"] small,
[class*="adsgrid" i] a[href^="/ad/"] time,
[class*="AdsGrid" i] a[href^="/ad/"] small,
[class*="AdsGrid" i] a[href^="/ad/"] time {
  color: #ffd400 !important;
  font-weight: 1000 !important;
}

/* Featured badge remains top-left */
[class*="trending" i] a[href^="/ad/"] [class*="badge" i],
[class*="trending" i] a[href^="/ad/"] [class*="featured" i],
[class*="adsgrid" i] a[href^="/ad/"] [class*="badge" i],
[class*="adsgrid" i] a[href^="/ad/"] [class*="featured" i],
[class*="AdsGrid" i] a[href^="/ad/"] [class*="badge" i],
[class*="AdsGrid" i] a[href^="/ad/"] [class*="featured" i] {
  position: absolute !important;
  top: 12px !important;
  left: 12px !important;
  z-index: 3 !important;
  width: auto !important;
  height: auto !important;
  min-height: 28px !important;
  padding: 0 12px !important;
  border-radius: 999px !important;
  color: #07110b !important;
  background: #ffd400 !important;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28) !important;
  font-size: 0.72rem !important;
  font-weight: 1000 !important;
}

/* Hover polish */
[class*="trending" i] a[href^="/ad/"]:hover img,
[class*="adsgrid" i] a[href^="/ad/"]:hover img,
[class*="AdsGrid" i] a[href^="/ad/"]:hover img {
  transform: scale(1.055);
  filter: saturate(1.12) contrast(1.05) brightness(0.94);
}

@media (max-width: 900px) {
  [class*="trending" i] a[href^="/ad/"],
  [class*="adsgrid" i] a[href^="/ad/"],
  [class*="AdsGrid" i] a[href^="/ad/"] {
    min-height: 220px !important;
  }
}

@media (max-width: 620px) {
  [class*="trending" i] a[href^="/ad/"],
  [class*="adsgrid" i] a[href^="/ad/"],
  [class*="AdsGrid" i] a[href^="/ad/"] {
    aspect-ratio: 4 / 3 !important;
    min-height: 230px !important;
  }

  [class*="trending" i] a[href^="/ad/"] > :last-child,
  [class*="adsgrid" i] a[href^="/ad/"] > :last-child,
  [class*="AdsGrid" i] a[href^="/ad/"] > :last-child {
    left: 14px !important;
    right: 14px !important;
    bottom: 14px !important;
  }
}
/* === End YardPromoJa Phase 65 Trending Landscape Overlay Cards === */`;

css = `${css.trimEnd()}\n\n${block}\n`;
write(globalsPath, css);

console.log("Phase 65 added to app/globals.css");
console.log("Backup created: app/globals.css.phase65-backup");
console.log("This phase did not edit app/page.js.");
