const fs = require("fs");
const path = require("path");

const root = process.cwd();
const globalsPath = path.join(root, "app", "globals.css");

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

if (!fs.existsSync(globalsPath)) {
  console.error("Could not find app/globals.css. Run this from the project root.");
  process.exit(1);
}

fs.copyFileSync(globalsPath, `${globalsPath}.phase66-backup`);

let css = read(globalsPath);

css = removeBlock(
  css,
  "/* === YardPromoJa Phase 66 Campaigns Offers Landscape === */",
  "/* === End YardPromoJa Phase 66 Campaigns Offers Landscape === */"
);

const block = `/* === YardPromoJa Phase 66 Campaigns Offers Landscape === */
/*
  Makes Campaigns & Offers use the space better as a landscape panel.
  CSS-only: does not edit app/page.js.
*/

/* Try to catch the Campaigns & Offers shell by common class names. */
[class*="campaign" i][class*="offer" i],
[class*="offers" i][class*="campaign" i],
[class*="campaigns" i][class*="offers" i] {
  width: 100% !important;
  min-height: 0 !important;
}

/* Common homepage right rail: second card is Campaigns & Offers. */
main aside > section:nth-of-type(2),
main aside > div:nth-of-type(2) {
  min-height: 0 !important;
}

/* Put the three offer blocks side by side when space allows. */
[class*="campaign" i][class*="offer" i] > div:last-child,
[class*="offers" i][class*="campaign" i] > div:last-child,
[class*="campaigns" i][class*="offers" i] > div:last-child,
main aside > section:nth-of-type(2) > div:last-child,
main aside > div:nth-of-type(2) > div:last-child {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 12px !important;
  align-items: stretch !important;
}

/* Landscape tiles. */
[class*="campaign" i][class*="offer" i] > div:last-child > *,
[class*="offers" i][class*="campaign" i] > div:last-child > *,
[class*="campaigns" i][class*="offers" i] > div:last-child > *,
main aside > section:nth-of-type(2) > div:last-child > *,
main aside > div:nth-of-type(2) > div:last-child > * {
  min-height: 116px !important;
  height: auto !important;
  padding: 18px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  border-radius: 18px !important;
  overflow: hidden !important;
  position: relative !important;
}

/* Add subtle premium depth to each offer tile. */
[class*="campaign" i][class*="offer" i] > div:last-child > *::before,
[class*="offers" i][class*="campaign" i] > div:last-child > *::before,
[class*="campaigns" i][class*="offers" i] > div:last-child > *::before,
main aside > section:nth-of-type(2) > div:last-child > *::before,
main aside > div:nth-of-type(2) > div:last-child > *::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 86% 18%, rgba(255, 212, 0, 0.18), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.055), transparent 46%);
  opacity: 0.9;
}

/* Keep text above decorative layer. */
[class*="campaign" i][class*="offer" i] > div:last-child > * > *,
[class*="offers" i][class*="campaign" i] > div:last-child > * > *,
[class*="campaigns" i][class*="offers" i] > div:last-child > * > *,
main aside > section:nth-of-type(2) > div:last-child > * > *,
main aside > div:nth-of-type(2) > div:last-child > * > * {
  position: relative !important;
  z-index: 1 !important;
}

/* Header row: title left, View All right. */
[class*="campaign" i][class*="offer" i] > :first-child,
[class*="offers" i][class*="campaign" i] > :first-child,
[class*="campaigns" i][class*="offers" i] > :first-child,
main aside > section:nth-of-type(2) > :first-child,
main aside > div:nth-of-type(2) > :first-child {
  display: flex !important;
  align-items: start !important;
  justify-content: space-between !important;
  gap: 20px !important;
}

/* Reduce title height so the whole card feels landscape. */
[class*="campaign" i][class*="offer" i] h2,
[class*="offers" i][class*="campaign" i] h2,
[class*="campaigns" i][class*="offers" i] h2,
main aside > section:nth-of-type(2) h2,
main aside > div:nth-of-type(2) h2 {
  max-width: 620px !important;
  margin-bottom: 14px !important;
  font-size: clamp(1.75rem, 2.7vw, 2.75rem) !important;
  line-height: 0.92 !important;
  letter-spacing: -0.055em !important;
}

[class*="campaign" i][class*="offer" i] h3,
[class*="offers" i][class*="campaign" i] h3,
[class*="campaigns" i][class*="offers" i] h3,
main aside > section:nth-of-type(2) h3,
main aside > div:nth-of-type(2) h3 {
  margin: 0 0 8px !important;
  font-size: clamp(1.05rem, 1.25vw, 1.35rem) !important;
  line-height: 1.02 !important;
  letter-spacing: -0.035em !important;
}

/* Stack back on narrower screens. */
@media (max-width: 1180px) {
  [class*="campaign" i][class*="offer" i] > div:last-child,
  [class*="offers" i][class*="campaign" i] > div:last-child,
  [class*="campaigns" i][class*="offers" i] > div:last-child,
  main aside > section:nth-of-type(2) > div:last-child,
  main aside > div:nth-of-type(2) > div:last-child {
    grid-template-columns: 1fr !important;
  }

  [class*="campaign" i][class*="offer" i] > div:last-child > *,
  [class*="offers" i][class*="campaign" i] > div:last-child > *,
  [class*="campaigns" i][class*="offers" i] > div:last-child > *,
  main aside > section:nth-of-type(2) > div:last-child > *,
  main aside > div:nth-of-type(2) > div:last-child > * {
    min-height: 90px !important;
  }
}
/* === End YardPromoJa Phase 66 Campaigns Offers Landscape === */`;

css = `${css.trimEnd()}\n\n${block}\n`;
write(globalsPath, css);

console.log("Phase 66 added to app/globals.css");
console.log("Backup created: app/globals.css.phase66-backup");
console.log("This phase did not edit app/page.js.");
