const fs = require("fs");
const path = require("path");

const root = process.cwd();
const pagePath = path.join(root, "app", "page.js");
const phase60Backup = `${pagePath}.phase60-backup`;
const phase61BrokenBackup = `${pagePath}.phase61-broken-backup`;

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

if (!exists(pagePath)) {
  console.error("Could not find app/page.js. Run this from the project root.");
  process.exit(1);
}

fs.copyFileSync(pagePath, phase61BrokenBackup);
console.log("Backed up current broken page to app/page.js.phase61-broken-backup");

if (exists(phase60Backup)) {
  fs.copyFileSync(phase60Backup, pagePath);
  console.log("Restored app/page.js from app/page.js.phase60-backup");
  console.log("Your homepage sections should return.");
} else {
  console.log("app/page.js.phase60-backup was not found.");
  console.log("Attempting a safe cleanup of ModernCategoryRail import only.");

  let page = read(pagePath);

  page = page.replace(/import\s+ModernCategoryRail\s+from\s+["'][^"']+ModernCategoryRail["'];?\s*/g, "");
  page = page.replace(/<ModernCategoryRail\s*\/>\s*/g, "{/* ModernCategoryRail removed by Phase 61. Restore the original category JSX manually if needed. */}");

  write(pagePath, page);

  console.log("Removed ModernCategoryRail import/usage, but original category section may need manual restore.");
}

console.log("");
console.log("Important:");
console.log("Phase 60 replaced too much of app/page.js.");
console.log("This phase restores the page layout first.");
console.log("Next icon phase should restyle the existing strip without replacing the whole section.");
