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

fs.copyFileSync(globalsPath, `${globalsPath}.phase62-backup`);

let css = read(globalsPath);

css = removeBlock(
  css,
  "/* === YardPromoJa Phase 62 Safe Category Icon Polish === */",
  "/* === End YardPromoJa Phase 62 Safe Category Icon Polish === */"
);

const block = `/* === YardPromoJa Phase 62 Safe Category Icon Polish === */
/*
  Safe phase:
  Does NOT edit app/page.js.
  Does NOT replace the category section.
  Only polishes the existing category rail/cards.

  The selectors are intentionally focused on the category area near the top of the homepage.
  If your exact class names differ, this may lightly improve the strip without breaking layout.
*/

/* Category rail wrapper / strip */
.homeCategoryRail,
.categoryRail,
.categoryStrip,
.categoriesRail,
.categoriesStrip,
[class*="categoryRail"],
[class*="categoryStrip"],
[class*="categoriesRail"],
[class*="categoriesStrip"] {
  border-block: 1px solid rgba(255, 255, 255, 0.08) !important;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012)),
    rgba(5, 10, 8, 0.72) !important;
  backdrop-filter: blur(18px);
}

/* Category scroll track */
.homeCategoryRail > *,
.categoryRail > *,
.categoryStrip > *,
.categoriesRail > *,
.categoriesStrip > *,
[class*="categoryRail"] > *,
[class*="categoryStrip"] > *,
[class*="categoriesRail"] > *,
[class*="categoriesStrip"] > * {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 212, 0, 0.5) rgba(255, 255, 255, 0.08);
}

/* Category cards */
.homeCategoryRail a,
.categoryRail a,
.categoryStrip a,
.categoriesRail a,
.categoriesStrip a,
[class*="categoryRail"] a,
[class*="categoryStrip"] a,
[class*="categoriesRail"] a,
[class*="categoriesStrip"] a,
.homeCategoryRail button,
.categoryRail button,
.categoryStrip button,
.categoriesRail button,
.categoriesStrip button,
[class*="categoryRail"] button,
[class*="categoryStrip"] button,
[class*="categoriesRail"] button,
[class*="categoriesStrip"] button {
  min-height: 98px !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 22px !important;
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 212, 0, 0.11), transparent 46%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.03)),
    rgba(17, 22, 19, 0.82) !important;
  box-shadow:
    0 18px 36px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
}

.homeCategoryRail a:hover,
.categoryRail a:hover,
.categoryStrip a:hover,
.categoriesRail a:hover,
.categoriesStrip a:hover,
[class*="categoryRail"] a:hover,
[class*="categoryStrip"] a:hover,
[class*="categoriesRail"] a:hover,
[class*="categoriesStrip"] a:hover,
.homeCategoryRail button:hover,
.categoryRail button:hover,
.categoryStrip button:hover,
.categoriesRail button:hover,
.categoriesStrip button:hover,
[class*="categoryRail"] button:hover,
[class*="categoryStrip"] button:hover,
[class*="categoriesRail"] button:hover,
[class*="categoriesStrip"] button:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 212, 0, 0.44) !important;
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 212, 0, 0.18), transparent 46%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.105), rgba(255, 255, 255, 0.04)),
    rgba(17, 22, 19, 0.92) !important;
  box-shadow:
    0 24px 54px rgba(0, 0, 0, 0.34),
    0 0 28px rgba(255, 212, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
}

/* Icon circles inside the category cards */
.homeCategoryRail a > :first-child,
.categoryRail a > :first-child,
.categoryStrip a > :first-child,
.categoriesRail a > :first-child,
.categoriesStrip a > :first-child,
[class*="categoryRail"] a > :first-child,
[class*="categoryStrip"] a > :first-child,
[class*="categoriesRail"] a > :first-child,
[class*="categoriesStrip"] a > :first-child,
.homeCategoryRail button > :first-child,
.categoryRail button > :first-child,
.categoryStrip button > :first-child,
.categoriesRail button > :first-child,
.categoriesStrip button > :first-child,
[class*="categoryRail"] button > :first-child,
[class*="categoryStrip"] button > :first-child,
[class*="categoriesRail"] button > :first-child,
[class*="categoriesStrip"] button > :first-child {
  width: 46px !important;
  height: 46px !important;
  display: grid !important;
  place-items: center !important;
  border: 1px solid rgba(255, 212, 0, 0.18) !important;
  border-radius: 16px !important;
  color: #ffd400 !important;
  background:
    radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.18), transparent 32%),
    linear-gradient(135deg, rgba(255, 212, 0, 0.16), rgba(56, 212, 48, 0.08)),
    rgba(255, 255, 255, 0.045) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 12px 24px rgba(0, 0, 0, 0.24) !important;
  filter: none !important;
}

/*
  Tone down emoji-like icons if they remain.
  This does not remove them; it makes them flatter and less toy-like.
*/
.homeCategoryRail a > :first-child,
.categoryRail a > :first-child,
.categoryStrip a > :first-child,
.categoriesRail a > :first-child,
.categoriesStrip a > :first-child,
[class*="categoryRail"] a > :first-child,
[class*="categoryStrip"] a > :first-child,
[class*="categoriesRail"] a > :first-child,
[class*="categoriesStrip"] a > :first-child {
  font-size: 19px !important;
  text-shadow: none !important;
}

/* Labels */
.homeCategoryRail a,
.categoryRail a,
.categoryStrip a,
.categoriesRail a,
.categoriesStrip a,
[class*="categoryRail"] a,
[class*="categoryStrip"] a,
[class*="categoriesRail"] a,
[class*="categoriesStrip"] a {
  color: rgba(255, 255, 255, 0.96) !important;
  font-weight: 950 !important;
  letter-spacing: -0.025em !important;
  text-decoration: none !important;
}

/* Prevent this polish from creating huge blank space. */
.homeCategoryRail,
.categoryRail,
.categoryStrip,
.categoriesRail,
.categoriesStrip,
[class*="categoryRail"],
[class*="categoryStrip"],
[class*="categoriesRail"],
[class*="categoriesStrip"] {
  margin-bottom: 0 !important;
}
/* === End YardPromoJa Phase 62 Safe Category Icon Polish === */`;

css = `${css.trimEnd()}\n\n${block}\n`;
write(globalsPath, css);

console.log("Phase 62 safe category polish added to app/globals.css");
console.log("Backup created: app/globals.css.phase62-backup");
console.log("");
console.log("This phase did not edit app/page.js, so it cannot remove homepage sections.");
