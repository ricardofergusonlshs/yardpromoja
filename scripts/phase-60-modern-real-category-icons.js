const fs = require("fs");
const path = require("path");

const root = process.cwd();
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

if (!exists(pagePath)) {
  console.error("Could not find app/page.js. Run from project root.");
  process.exit(1);
}

fs.copyFileSync(pagePath, `${pagePath}.phase60-backup`);

let page = read(pagePath);
let changed = false;

if (!page.includes("ModernCategoryRail from")) {
  const importLine = 'import ModernCategoryRail from "./components/ModernCategoryRail";\n';

  if (page.trimStart().startsWith('"use client";') || page.trimStart().startsWith("'use client';")) {
    page = page.replace(/(['"]use client['"];?\s*)/, `$1\n${importLine}`);
  } else {
    page = importLine + page;
  }

  changed = true;
}

if (!page.includes("<ModernCategoryRail />")) {
  const categoryWords = [
    "Events & Parties",
    "Food & Drinks",
    "Sale Offers",
    "Campaigns",
    "Beauty",
    "Fashion",
    "Transport",
    "Stay",
    "Weekend",
    "Parish"
  ];

  const candidates = [
    /<section[^>]*>[\s\S]{0,12000}Events\s*&amp;\s*Parties[\s\S]{0,12000}Parish[\s\S]{0,2500}<\/section>/i,
    /<section[^>]*>[\s\S]{0,12000}Events\s*&\s*Parties[\s\S]{0,12000}Parish[\s\S]{0,2500}<\/section>/i,
    /<div[^>]*>[\s\S]{0,12000}Events\s*&amp;\s*Parties[\s\S]{0,12000}Parish[\s\S]{0,2500}<\/div>/i,
    /<div[^>]*>[\s\S]{0,12000}Events\s*&\s*Parties[\s\S]{0,12000}Parish[\s\S]{0,2500}<\/div>/i
  ];

  let replaced = false;
  for (const pattern of candidates) {
    if (pattern.test(page)) {
      page = page.replace(pattern, "<ModernCategoryRail />");
      replaced = true;
      changed = true;
      break;
    }
  }

  if (!replaced) {
    console.log("Could not safely locate existing category strip in app/page.js.");
    console.log("ModernCategoryRail component was added, but manual placement is needed.");
    console.log("Put <ModernCategoryRail /> where the old category strip is.");
  }
}

if (changed) {
  write(pagePath, page);
  console.log("Updated app/page.js");
} else {
  console.log("app/page.js already appears updated.");
}

console.log("");
console.log("Phase 60 installed.");
console.log("Files added:");
console.log("app/components/ModernCategoryRail.js");
console.log("app/components/ModernCategoryRail.module.css");
console.log("");
console.log("If the old category strip still appears, manually replace it with:");
console.log("<ModernCategoryRail />");
