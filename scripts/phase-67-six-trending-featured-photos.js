const fs = require("fs");
const path = require("path");

const root = process.cwd();
const globalsPath = path.join(root, "app", "globals.css");

const IGNORE_DIRS = new Set(["node_modules", ".next", ".git", "out", "dist", "build"]);

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function backup(file, suffix) {
  if (exists(file) && !exists(`${file}.${suffix}`)) {
    fs.copyFileSync(file, `${file}.${suffix}`);
  }
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

function walk(dir, files = []) {
  if (!exists(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, files);
      continue;
    }

    if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }

  return files;
}

function hasTrendingSignal(text, file) {
  const lower = `${file}\n${text}`.toLowerCase();

  return (
    lower.includes("trending") ||
    lower.includes("promos people are checking") ||
    lower.includes("featured promos") ||
    lower.includes("activepromos") ||
    lower.includes("active promos")
  );
}

function patchTrendingLimit(file) {
  let text = read(file);
  const original = text;

  if (!hasTrendingSignal(text, file)) {
    return false;
  }

  // Main case: selected promos are capped with .slice(0, 4)
  text = text.replace(/(\.slice\s*\(\s*0\s*,\s*)4(\s*\))/g, "$16$2");

  // Common variable names.
  text = text.replace(/(\b(?:TRENDING_LIMIT|TRENDING_COUNT|FEATURED_LIMIT|FEATURED_COUNT|HOME_TRENDING_LIMIT|MAX_TRENDING|MAX_FEATURED)\b\s*=\s*)4\b/g, "$16");

  // Object config style only when the nearby name says trending/featured.
  text = text.replace(/(\b(?:trendingLimit|trendingCount|featuredLimit|featuredCount|maxTrending|maxFeatured)\b\s*:\s*)4\b/g, "$16");

  // React prop style only when the prop name is obviously for count/limit.
  text = text.replace(/(\b(?:limit|count|maxItems|itemsToShow)\s*=\s*{)4(})/g, (match, a, b, offset, whole) => {
    const window = whole.slice(Math.max(0, offset - 500), Math.min(whole.length, offset + 500)).toLowerCase();
    if (window.includes("trending") || window.includes("featured") || window.includes("promos people are checking")) {
      return `${a}6${b}`;
    }
    return match;
  });

  if (text !== original) {
    backup(file, "phase67-backup");
    write(file, text);
    return true;
  }

  return false;
}

if (!exists(globalsPath)) {
  console.error("Could not find app/globals.css. Run this from the project root.");
  process.exit(1);
}

// Patch the visible count in relevant JS/JSX files.
const candidateFiles = [
  path.join(root, "app", "page.js"),
  path.join(root, "app", "page.jsx"),
  path.join(root, "app", "components", "AdsGrid.js"),
  path.join(root, "components", "AdsGrid.js"),
  path.join(root, "app", "components", "HomeSections.js"),
  path.join(root, "components", "HomeSections.js"),
  ...walk(path.join(root, "app", "components")),
  ...walk(path.join(root, "components")),
  ...walk(path.join(root, "lib"))
];

const uniqueFiles = [...new Set(candidateFiles.filter(exists))];

const patchedFiles = [];
for (const file of uniqueFiles) {
  if (patchTrendingLimit(file)) {
    patchedFiles.push(path.relative(root, file));
  }
}

// Add layout CSS for 6 cards.
backup(globalsPath, "phase67-backup");

let css = read(globalsPath);

css = removeBlock(
  css,
  "/* === YardPromoJa Phase 67 Six Trending Featured Photos === */",
  "/* === End YardPromoJa Phase 67 Six Trending Featured Photos === */"
);

const block = `/* === YardPromoJa Phase 67 Six Trending Featured Photos === */
/*
  Shows the Trending Now section as 6 landscape cards:
  - 3 columns x 2 rows on wide screens
  - keeps image-overlay look from Phase 65
  - CSS-only layout adjustment, no page sections removed
*/

/* Parent grid holding trending promo cards */
[class*="trending" i] :where(div, section):has(> a[href^="/ad/"]),
[class*="AdsGrid" i] :where(div, section):has(> a[href^="/ad/"]),
[class*="adsgrid" i] :where(div, section):has(> a[href^="/ad/"]) {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 14px !important;
  align-items: stretch !important;
}

/* Slightly reduce landscape height so 6 cards fit cleanly */
[class*="trending" i] a[href^="/ad/"],
[class*="AdsGrid" i] a[href^="/ad/"],
[class*="adsgrid" i] a[href^="/ad/"] {
  min-height: clamp(168px, 14vw, 218px) !important;
  aspect-ratio: 16 / 9 !important;
}

/* Keep title readable at the smaller six-card size */
[class*="trending" i] a[href^="/ad/"] h3,
[class*="trending" i] a[href^="/ad/"] h4,
[class*="AdsGrid" i] a[href^="/ad/"] h3,
[class*="AdsGrid" i] a[href^="/ad/"] h4,
[class*="adsgrid" i] a[href^="/ad/"] h3,
[class*="adsgrid" i] a[href^="/ad/"] h4 {
  font-size: clamp(1.05rem, 1.45vw, 1.55rem) !important;
  line-height: 0.96 !important;
}

/* Keep lower-center text compact */
[class*="trending" i] a[href^="/ad/"] > :last-child,
[class*="AdsGrid" i] a[href^="/ad/"] > :last-child,
[class*="adsgrid" i] a[href^="/ad/"] > :last-child {
  left: 14px !important;
  right: 14px !important;
  bottom: 12px !important;
  gap: 4px !important;
}

[class*="trending" i] a[href^="/ad/"] p,
[class*="AdsGrid" i] a[href^="/ad/"] p,
[class*="adsgrid" i] a[href^="/ad/"] p {
  font-size: 0.76rem !important;
  line-height: 1.18 !important;
}

/* Medium screens: 2 columns x 3 rows */
@media (max-width: 1180px) {
  [class*="trending" i] :where(div, section):has(> a[href^="/ad/"]),
  [class*="AdsGrid" i] :where(div, section):has(> a[href^="/ad/"]),
  [class*="adsgrid" i] :where(div, section):has(> a[href^="/ad/"]) {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  [class*="trending" i] a[href^="/ad/"],
  [class*="AdsGrid" i] a[href^="/ad/"],
  [class*="adsgrid" i] a[href^="/ad/"] {
    min-height: 210px !important;
  }
}

/* Phone: single column */
@media (max-width: 680px) {
  [class*="trending" i] :where(div, section):has(> a[href^="/ad/"]),
  [class*="AdsGrid" i] :where(div, section):has(> a[href^="/ad/"]),
  [class*="adsgrid" i] :where(div, section):has(> a[href^="/ad/"]) {
    grid-template-columns: 1fr !important;
  }
}
/* === End YardPromoJa Phase 67 Six Trending Featured Photos === */`;

css = `${css.trimEnd()}\n\n${block}\n`;
write(globalsPath, css);

console.log("Phase 67 applied.");
console.log("");
if (patchedFiles.length) {
  console.log("Updated trending/featured count in:");
  patchedFiles.forEach((file) => console.log(`- ${file}`));
} else {
  console.log("No .slice(0, 4) trending limit was found automatically.");
  console.log("CSS layout was still added.");
  console.log("");
  console.log("Manual step if only 4 cards still show:");
  console.log("Search for .slice(0, 4) near Trending Now / activePromos and change it to .slice(0, 6).");
}
console.log("");
console.log("Updated app/globals.css");
console.log("Backups created with .phase67-backup");
