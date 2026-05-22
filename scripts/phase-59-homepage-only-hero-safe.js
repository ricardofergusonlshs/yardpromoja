const fs = require("fs");
const path = require("path");

const root = process.cwd();
const globalsPath = path.join(root, "app", "globals.css");
const pagePath = path.join(root, "app", "page.js");

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
  if (exists(file)) {
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

function uniqueAppend(text, marker, block) {
  if (text.includes(marker)) return text;
  return `${text.trimEnd()}\n\n${block}\n`;
}

if (!exists(globalsPath)) {
  console.error("Could not find app/globals.css. Run this from the project root.");
  process.exit(1);
}

if (!exists(pagePath)) {
  console.error("Could not find app/page.js. Run this from the project root.");
  process.exit(1);
}

backup(globalsPath, "phase59-backup");
backup(pagePath, "phase59-backup");

let globals = read(globalsPath);

// Remove broad CSS blocks from earlier phases. These leaked onto /browse.
globals = removeBlock(
  globals,
  "/* === YardPromoJa Phase 53 Force Modern Homepage Hero === */",
  "/* === End YardPromoJa Phase 53 Force Modern Homepage Hero === */"
);

globals = removeBlock(
  globals,
  "/* === YardPromoJa Phase 54 CSS Only Modern Hero Fix === */",
  "/* === End YardPromoJa Phase 54 CSS Only Modern Hero Fix === */"
);

globals = removeBlock(
  globals,
  "/* === YardPromoJa Phase 57 Scoped Home Hero Text === */",
  "/* === End YardPromoJa Phase 57 Scoped Home Hero Text === */"
);

globals = removeBlock(
  globals,
  "/* === YardPromoJa Phase 58 Homepage Only Hero Text === */",
  "/* === End YardPromoJa Phase 58 Homepage Only Hero Text === */"
);

const marker = "/* === YardPromoJa Phase 59 Homepage Only Hero Text === */";

const homeOnlyCss = `/* === YardPromoJa Phase 59 Homepage Only Hero Text === */
.ypHomeHeroTitle {
  margin: 0 !important;
  max-width: min(780px, 100%) !important;
  color: #ffffff !important;
  text-transform: none !important;
  text-wrap: balance;
  letter-spacing: -0.07em !important;
  line-height: 0.92 !important;
  filter: drop-shadow(0 5px 18px rgba(0, 0, 0, 0.38));
}

.ypHomeHeroLine,
.ypHomeHeroJamaica {
  display: block;
}

.ypHomeHeroLine {
  color: #ffffff !important;
  font-size: clamp(3.25rem, 7vw, 7.25rem) !important;
  font-weight: 1000 !important;
  line-height: 0.92 !important;
  letter-spacing: -0.07em !important;
}

.ypHomeHeroJamaica {
  margin-top: 0.08em;
  color: #ffd400 !important;
  font-family: "Segoe Script", "Brush Script MT", "Comic Sans MS", cursive;
  font-size: clamp(3.25rem, 7.25vw, 7.4rem) !important;
  font-style: italic;
  font-weight: 900 !important;
  line-height: 0.86 !important;
  letter-spacing: -0.06em !important;
  text-shadow:
    0 4px 22px rgba(255, 212, 0, 0.24),
    0 8px 34px rgba(0, 0, 0, 0.38);
  transform: rotate(-1deg);
}

@media (max-width: 760px) {
  .ypHomeHeroLine,
  .ypHomeHeroJamaica {
    font-size: clamp(2.65rem, 14vw, 4.6rem) !important;
  }
}
/* === End YardPromoJa Phase 59 Homepage Only Hero Text === */`;

globals = uniqueAppend(globals, marker, homeOnlyCss);
write(globalsPath, globals);

// Patch ONLY app/page.js, so other pages cannot inherit the text.
let page = read(pagePath);
const originalPage = page;

const newTitle = `<h1 className="ypHomeHeroTitle">
  <span className="ypHomeHeroLine">What&apos;s happening</span>
  <span className="ypHomeHeroJamaica">in Jamaica?</span>
</h1>`;

const oldHeroPatterns = [
  /<h1[^>]*>[\s\S]*?SOCIAL\s*MEDIA\s*GETS\s*ATTENTION[\s\S]*?YARDPROMOJA[\s\S]*?TURNS\s*IT\s*INTO\s*ACTION\.?[\s\S]*?<\/h1>/i,
  /<h1[^>]*>[\s\S]*?SOCIAL\s*MEDIA[\s\S]*?YARDPROMOJA[\s\S]*?ACTION\.?[\s\S]*?<\/h1>/i,
  /<h1[^>]*>[\s\S]*?YARDPROMOJA[\s\S]*?ACTION\.?[\s\S]*?<\/h1>/i
];

if (!page.includes("ypHomeHeroTitle")) {
  for (const pattern of oldHeroPatterns) {
    if (pattern.test(page)) {
      page = page.replace(pattern, newTitle);
      break;
    }
  }
}

page = page.replace(/JAMAICA['’]S LINK-UP PLANNER/g, "DISCOVER THE REAL JAMAICA");
page = page.replace(/Jamaica['’]s link-up planner/g, "Discover the real Jamaica");

page = page.replace(
  /Discover events, promotions, food, fashion, transport, stays, deals and more\s+[-—]\s+all in one place\.?/g,
  "Find amazing places, events, restaurants, adventures and hidden gems near you."
);

if (page !== originalPage) {
  write(pagePath, page);
  console.log("Updated homepage only: app/page.js");
} else {
  console.log("No homepage h1 pattern matched. Global cleanup still completed.");
  console.log("Manual replacement may be needed in app/page.js.");
}

console.log("Updated app/globals.css");
console.log("Backups created:");
console.log("app/globals.css.phase59-backup");
console.log("app/page.js.phase59-backup");
console.log("");
console.log("Test:");
console.log("Homepage: http://localhost:3000");
console.log("Browse:   http://localhost:3000/browse");
