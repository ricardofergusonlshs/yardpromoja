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

fs.copyFileSync(globalsPath, `${globalsPath}.phase63-backup`);

let css = read(globalsPath);

css = removeBlock(
  css,
  "/* === YardPromoJa Phase 63 Real Image Category Icons === */",
  "/* === End YardPromoJa Phase 63 Real Image Category Icons === */"
);

const block = `/* === YardPromoJa Phase 63 Real Image Category Icons === */
/*
  Safe image-icon phase:
  - Does NOT edit app/page.js.
  - Does NOT replace the category rail.
  - Keeps the existing card size and layout.
  - Hides the emoji/AI-looking symbol inside the existing icon circle.
  - Uses real SVG image files from /public/assets/category-icons/.
*/

/* Keep icon holder same size. Only replace the symbol inside visually. */
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
  color: transparent !important;
  font-size: 0 !important;
  text-shadow: none !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: 23px 23px !important;
}

/* If the old icon has nested spans/svg/text, hide them without changing holder size. */
.homeCategoryRail a > :first-child *,
.categoryRail a > :first-child *,
.categoryStrip a > :first-child *,
.categoriesRail a > :first-child *,
.categoriesStrip a > :first-child *,
[class*="categoryRail"] a > :first-child *,
[class*="categoryStrip"] a > :first-child *,
[class*="categoriesRail"] a > :first-child *,
[class*="categoriesStrip"] a > :first-child *,
.homeCategoryRail button > :first-child *,
.categoryRail button > :first-child *,
.categoryStrip button > :first-child *,
.categoriesRail button > :first-child *,
.categoriesStrip button > :first-child *,
[class*="categoryRail"] button > :first-child *,
[class*="categoryStrip"] button > :first-child *,
[class*="categoriesRail"] button > :first-child *,
[class*="categoriesStrip"] button > :first-child * {
  opacity: 0 !important;
}

/* Real image icons by card order. This preserves existing format and size. */
.homeCategoryRail a:nth-of-type(1) > :first-child,
.categoryRail a:nth-of-type(1) > :first-child,
.categoryStrip a:nth-of-type(1) > :first-child,
.categoriesRail a:nth-of-type(1) > :first-child,
.categoriesStrip a:nth-of-type(1) > :first-child,
[class*="categoryRail"] a:nth-of-type(1) > :first-child,
[class*="categoryStrip"] a:nth-of-type(1) > :first-child,
[class*="categoriesRail"] a:nth-of-type(1) > :first-child,
[class*="categoriesStrip"] a:nth-of-type(1) > :first-child {
  background-image: url("/assets/category-icons/events.svg") !important;
}

.homeCategoryRail a:nth-of-type(2) > :first-child,
.categoryRail a:nth-of-type(2) > :first-child,
.categoryStrip a:nth-of-type(2) > :first-child,
.categoriesRail a:nth-of-type(2) > :first-child,
.categoriesStrip a:nth-of-type(2) > :first-child,
[class*="categoryRail"] a:nth-of-type(2) > :first-child,
[class*="categoryStrip"] a:nth-of-type(2) > :first-child,
[class*="categoriesRail"] a:nth-of-type(2) > :first-child,
[class*="categoriesStrip"] a:nth-of-type(2) > :first-child {
  background-image: url("/assets/category-icons/food.svg") !important;
}

.homeCategoryRail a:nth-of-type(3) > :first-child,
.categoryRail a:nth-of-type(3) > :first-child,
.categoryStrip a:nth-of-type(3) > :first-child,
.categoriesRail a:nth-of-type(3) > :first-child,
.categoriesStrip a:nth-of-type(3) > :first-child,
[class*="categoryRail"] a:nth-of-type(3) > :first-child,
[class*="categoryStrip"] a:nth-of-type(3) > :first-child,
[class*="categoriesRail"] a:nth-of-type(3) > :first-child,
[class*="categoriesStrip"] a:nth-of-type(3) > :first-child {
  background-image: url("/assets/category-icons/sale-offers.svg") !important;
}

.homeCategoryRail a:nth-of-type(4) > :first-child,
.categoryRail a:nth-of-type(4) > :first-child,
.categoryStrip a:nth-of-type(4) > :first-child,
.categoriesRail a:nth-of-type(4) > :first-child,
.categoriesStrip a:nth-of-type(4) > :first-child,
[class*="categoryRail"] a:nth-of-type(4) > :first-child,
[class*="categoryStrip"] a:nth-of-type(4) > :first-child,
[class*="categoriesRail"] a:nth-of-type(4) > :first-child,
[class*="categoriesStrip"] a:nth-of-type(4) > :first-child {
  background-image: url("/assets/category-icons/campaigns.svg") !important;
}

.homeCategoryRail a:nth-of-type(5) > :first-child,
.categoryRail a:nth-of-type(5) > :first-child,
.categoryStrip a:nth-of-type(5) > :first-child,
.categoriesRail a:nth-of-type(5) > :first-child,
.categoriesStrip a:nth-of-type(5) > :first-child,
[class*="categoryRail"] a:nth-of-type(5) > :first-child,
[class*="categoryStrip"] a:nth-of-type(5) > :first-child,
[class*="categoriesRail"] a:nth-of-type(5) > :first-child,
[class*="categoriesStrip"] a:nth-of-type(5) > :first-child {
  background-image: url("/assets/category-icons/beauty.svg") !important;
}

.homeCategoryRail a:nth-of-type(6) > :first-child,
.categoryRail a:nth-of-type(6) > :first-child,
.categoryStrip a:nth-of-type(6) > :first-child,
.categoriesRail a:nth-of-type(6) > :first-child,
.categoriesStrip a:nth-of-type(6) > :first-child,
[class*="categoryRail"] a:nth-of-type(6) > :first-child,
[class*="categoryStrip"] a:nth-of-type(6) > :first-child,
[class*="categoriesRail"] a:nth-of-type(6) > :first-child,
[class*="categoriesStrip"] a:nth-of-type(6) > :first-child {
  background-image: url("/assets/category-icons/fashion.svg") !important;
}

.homeCategoryRail a:nth-of-type(7) > :first-child,
.categoryRail a:nth-of-type(7) > :first-child,
.categoryStrip a:nth-of-type(7) > :first-child,
.categoriesRail a:nth-of-type(7) > :first-child,
.categoriesStrip a:nth-of-type(7) > :first-child,
[class*="categoryRail"] a:nth-of-type(7) > :first-child,
[class*="categoryStrip"] a:nth-of-type(7) > :first-child,
[class*="categoriesRail"] a:nth-of-type(7) > :first-child,
[class*="categoriesStrip"] a:nth-of-type(7) > :first-child {
  background-image: url("/assets/category-icons/transport.svg") !important;
}

.homeCategoryRail a:nth-of-type(8) > :first-child,
.categoryRail a:nth-of-type(8) > :first-child,
.categoryStrip a:nth-of-type(8) > :first-child,
.categoriesRail a:nth-of-type(8) > :first-child,
.categoriesStrip a:nth-of-type(8) > :first-child,
[class*="categoryRail"] a:nth-of-type(8) > :first-child,
[class*="categoryStrip"] a:nth-of-type(8) > :first-child,
[class*="categoriesRail"] a:nth-of-type(8) > :first-child,
[class*="categoriesStrip"] a:nth-of-type(8) > :first-child {
  background-image: url("/assets/category-icons/stay.svg") !important;
}

.homeCategoryRail a:nth-of-type(9) > :first-child,
.categoryRail a:nth-of-type(9) > :first-child,
.categoryStrip a:nth-of-type(9) > :first-child,
.categoriesRail a:nth-of-type(9) > :first-child,
.categoriesStrip a:nth-of-type(9) > :first-child,
[class*="categoryRail"] a:nth-of-type(9) > :first-child,
[class*="categoryStrip"] a:nth-of-type(9) > :first-child,
[class*="categoriesRail"] a:nth-of-type(9) > :first-child,
[class*="categoriesStrip"] a:nth-of-type(9) > :first-child {
  background-image: url("/assets/category-icons/weekend.svg") !important;
}

.homeCategoryRail a:nth-of-type(10) > :first-child,
.categoryRail a:nth-of-type(10) > :first-child,
.categoryStrip a:nth-of-type(10) > :first-child,
.categoriesRail a:nth-of-type(10) > :first-child,
.categoriesStrip a:nth-of-type(10) > :first-child,
[class*="categoryRail"] a:nth-of-type(10) > :first-child,
[class*="categoryStrip"] a:nth-of-type(10) > :first-child,
[class*="categoriesRail"] a:nth-of-type(10) > :first-child,
[class*="categoriesStrip"] a:nth-of-type(10) > :first-child {
  background-image: url("/assets/category-icons/parish.svg") !important;
}

/* Same mapping if the category items are buttons instead of links. */
.homeCategoryRail button:nth-of-type(1) > :first-child,
.categoryRail button:nth-of-type(1) > :first-child,
.categoryStrip button:nth-of-type(1) > :first-child,
.categoriesRail button:nth-of-type(1) > :first-child,
.categoriesStrip button:nth-of-type(1) > :first-child,
[class*="categoryRail"] button:nth-of-type(1) > :first-child,
[class*="categoryStrip"] button:nth-of-type(1) > :first-child,
[class*="categoriesRail"] button:nth-of-type(1) > :first-child,
[class*="categoriesStrip"] button:nth-of-type(1) > :first-child {
  background-image: url("/assets/category-icons/events.svg") !important;
}

.homeCategoryRail button:nth-of-type(2) > :first-child,
.categoryRail button:nth-of-type(2) > :first-child,
.categoryStrip button:nth-of-type(2) > :first-child,
.categoriesRail button:nth-of-type(2) > :first-child,
.categoriesStrip button:nth-of-type(2) > :first-child,
[class*="categoryRail"] button:nth-of-type(2) > :first-child,
[class*="categoryStrip"] button:nth-of-type(2) > :first-child,
[class*="categoriesRail"] button:nth-of-type(2) > :first-child,
[class*="categoriesStrip"] button:nth-of-type(2) > :first-child {
  background-image: url("/assets/category-icons/food.svg") !important;
}

.homeCategoryRail button:nth-of-type(3) > :first-child,
.categoryRail button:nth-of-type(3) > :first-child,
.categoryStrip button:nth-of-type(3) > :first-child,
.categoriesRail button:nth-of-type(3) > :first-child,
.categoriesStrip button:nth-of-type(3) > :first-child,
[class*="categoryRail"] button:nth-of-type(3) > :first-child,
[class*="categoryStrip"] button:nth-of-type(3) > :first-child,
[class*="categoriesRail"] button:nth-of-type(3) > :first-child,
[class*="categoriesStrip"] button:nth-of-type(3) > :first-child {
  background-image: url("/assets/category-icons/sale-offers.svg") !important;
}

.homeCategoryRail button:nth-of-type(4) > :first-child,
.categoryRail button:nth-of-type(4) > :first-child,
.categoryStrip button:nth-of-type(4) > :first-child,
.categoriesRail button:nth-of-type(4) > :first-child,
.categoriesStrip button:nth-of-type(4) > :first-child,
[class*="categoryRail"] button:nth-of-type(4) > :first-child,
[class*="categoryStrip"] button:nth-of-type(4) > :first-child,
[class*="categoriesRail"] button:nth-of-type(4) > :first-child,
[class*="categoriesStrip"] button:nth-of-type(4) > :first-child {
  background-image: url("/assets/category-icons/campaigns.svg") !important;
}

.homeCategoryRail button:nth-of-type(5) > :first-child,
.categoryRail button:nth-of-type(5) > :first-child,
.categoryStrip button:nth-of-type(5) > :first-child,
.categoriesRail button:nth-of-type(5) > :first-child,
.categoriesStrip button:nth-of-type(5) > :first-child,
[class*="categoryRail"] button:nth-of-type(5) > :first-child,
[class*="categoryStrip"] button:nth-of-type(5) > :first-child,
[class*="categoriesRail"] button:nth-of-type(5) > :first-child,
[class*="categoriesStrip"] button:nth-of-type(5) > :first-child {
  background-image: url("/assets/category-icons/beauty.svg") !important;
}

.homeCategoryRail button:nth-of-type(6) > :first-child,
.categoryRail button:nth-of-type(6) > :first-child,
.categoryStrip button:nth-of-type(6) > :first-child,
.categoriesRail button:nth-of-type(6) > :first-child,
.categoriesStrip button:nth-of-type(6) > :first-child,
[class*="categoryRail"] button:nth-of-type(6) > :first-child,
[class*="categoryStrip"] button:nth-of-type(6) > :first-child,
[class*="categoriesRail"] button:nth-of-type(6) > :first-child,
[class*="categoriesStrip"] button:nth-of-type(6) > :first-child {
  background-image: url("/assets/category-icons/fashion.svg") !important;
}

.homeCategoryRail button:nth-of-type(7) > :first-child,
.categoryRail button:nth-of-type(7) > :first-child,
.categoryStrip button:nth-of-type(7) > :first-child,
.categoriesRail button:nth-of-type(7) > :first-child,
.categoriesStrip button:nth-of-type(7) > :first-child,
[class*="categoryRail"] button:nth-of-type(7) > :first-child,
[class*="categoryStrip"] button:nth-of-type(7) > :first-child,
[class*="categoriesRail"] button:nth-of-type(7) > :first-child,
[class*="categoriesStrip"] button:nth-of-type(7) > :first-child {
  background-image: url("/assets/category-icons/transport.svg") !important;
}

.homeCategoryRail button:nth-of-type(8) > :first-child,
.categoryRail button:nth-of-type(8) > :first-child,
.categoryStrip button:nth-of-type(8) > :first-child,
.categoriesRail button:nth-of-type(8) > :first-child,
.categoriesStrip button:nth-of-type(8) > :first-child,
[class*="categoryRail"] button:nth-of-type(8) > :first-child,
[class*="categoryStrip"] button:nth-of-type(8) > :first-child,
[class*="categoriesRail"] button:nth-of-type(8) > :first-child,
[class*="categoriesStrip"] button:nth-of-type(8) > :first-child {
  background-image: url("/assets/category-icons/stay.svg") !important;
}

.homeCategoryRail button:nth-of-type(9) > :first-child,
.categoryRail button:nth-of-type(9) > :first-child,
.categoryStrip button:nth-of-type(9) > :first-child,
.categoriesRail button:nth-of-type(9) > :first-child,
.categoriesStrip button:nth-of-type(9) > :first-child,
[class*="categoryRail"] button:nth-of-type(9) > :first-child,
[class*="categoryStrip"] button:nth-of-type(9) > :first-child,
[class*="categoriesRail"] button:nth-of-type(9) > :first-child,
[class*="categoriesStrip"] button:nth-of-type(9) > :first-child {
  background-image: url("/assets/category-icons/weekend.svg") !important;
}

.homeCategoryRail button:nth-of-type(10) > :first-child,
.categoryRail button:nth-of-type(10) > :first-child,
.categoryStrip button:nth-of-type(10) > :first-child,
.categoriesRail button:nth-of-type(10) > :first-child,
.categoriesStrip button:nth-of-type(10) > :first-child,
[class*="categoryRail"] button:nth-of-type(10) > :first-child,
[class*="categoryStrip"] button:nth-of-type(10) > :first-child,
[class*="categoriesRail"] button:nth-of-type(10) > :first-child,
[class*="categoriesStrip"] button:nth-of-type(10) > :first-child {
  background-image: url("/assets/category-icons/parish.svg") !important;
}
/* === End YardPromoJa Phase 63 Real Image Category Icons === */`;

css = `${css.trimEnd()}\n\n${block}\n`;
write(globalsPath, css);

console.log("Phase 63 real image category icons added to app/globals.css");
console.log("Backup created: app/globals.css.phase63-backup");
console.log("Image assets expected at: public/assets/category-icons/");
console.log("");
console.log("This phase did not edit app/page.js, so it cannot remove homepage sections or change card size.");
