const fs = require("fs");
const path = require("path");

const root = process.cwd();

const componentSource = `import styles from "./JamaicaParishMap.module.css";

export default function JamaicaParishMap({ className = "" }) {
  return (
    <div className={\`\${styles.mapShell} \${className || ""}\`}>
      <iframe
        className={styles.mapFrame}
        title="Correct map of Jamaica"
        src="https://www.google.com/maps?q=Jamaica&t=m&z=8&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a
        className={styles.openMap}
        href="https://www.google.com/maps/place/Jamaica"
        target="_blank"
        rel="noreferrer"
        aria-label="Open Jamaica in Google Maps"
      >
        Open map
      </a>
    </div>
  );
}
`;

const cssSource = `.mapShell {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 310px;
  overflow: hidden;
  border-radius: inherit;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 212, 0, 0.08), transparent 46%),
    linear-gradient(180deg, rgba(7, 18, 12, 0.98), rgba(3, 9, 6, 0.98));
}

.mapShell::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.10),
    inset 0 0 58px rgba(0, 0, 0, 0.14);
}

.mapFrame {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 310px;
  border: 0;
  filter: saturate(1.04) contrast(1.03);
}

.openMap {
  position: absolute;
  right: 14px;
  bottom: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(56, 212, 48, 0.38);
  border-radius: 999px;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(56, 212, 48, 0.92), rgba(18, 126, 22, 0.94));
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.28);
  font-size: 12px;
  font-weight: 950;
  line-height: 1;
  text-decoration: none;
  transition: transform 160ms ease, filter 160ms ease;
}

.openMap:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

@media (max-width: 760px) {
  .mapShell,
  .mapFrame {
    min-height: 270px;
  }

  .openMap {
    right: 12px;
    bottom: 12px;
  }
}
`;

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

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function backup(file) {
  if (exists(file) && !exists(`${file}.phase68-backup`)) {
    fs.copyFileSync(file, `${file}.phase68-backup`);
  }
}

function writeComponentPair(dir) {
  ensureDir(dir);

  const jsPath = path.join(dir, "JamaicaParishMap.js");
  const cssPath = path.join(dir, "JamaicaParishMap.module.css");

  backup(jsPath);
  backup(cssPath);

  write(jsPath, componentSource);
  write(cssPath, cssSource);

  console.log(`Installed correct Google map component: ${path.relative(root, jsPath)}`);
}

function walk(dir, files = []) {
  if (!exists(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, files);
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }

  return files;
}

function addImportIfNeeded(file, text) {
  if (text.includes("JamaicaParishMap")) {
    if (/import\s+JamaicaParishMap\s+from\s+["']/.test(text)) return text;
  }

  const importLine = `import JamaicaParishMap from "@/components/JamaicaParishMap";\n`;

  if (text.trimStart().startsWith('"use client";') || text.trimStart().startsWith("'use client';")) {
    return text.replace(/(['"]use client['"];?\s*)/, `$1\n${importLine}`);
  }

  return importLine + text;
}

function patchFile(file) {
  let text = read(file);
  const original = text;

  const hasOldMap =
    /jamaica-parish-map\.(png|svg|jpg|jpeg|webp)/i.test(text) ||
    /<JamaicaParishMap\b/i.test(text) ||
    /JamaicaParishMap/i.test(text);

  if (!hasOldMap) return false;

  // Replace direct static image usage of the old/wrong map.
  text = text.replace(
    /<Image\b[\s\S]*?src\s*=\s*(?:{)?["'][^"']*jamaica-parish-map\.(?:png|svg|jpg|jpeg|webp)["'](?:})?[\s\S]*?\/>/gi,
    "<JamaicaParishMap />"
  );

  text = text.replace(
    /<img\b[\s\S]*?src\s*=\s*(?:{)?["'][^"']*jamaica-parish-map\.(?:png|svg|jpg|jpeg|webp)["'](?:})?[\s\S]*?\/?>/gi,
    "<JamaicaParishMap />"
  );

  // If a component was already used, leave it but make sure import resolves to the forced component.
  text = text.replace(
    /import\s+JamaicaParishMap\s+from\s+["'][^"']+["'];?/g,
    'import JamaicaParishMap from "@/components/JamaicaParishMap";'
  );

  if (text.includes("<JamaicaParishMap")) {
    text = addImportIfNeeded(file, text);
  }

  if (text !== original) {
    backup(file);
    write(file, text);
    return true;
  }

  return false;
}

// Install the forced component in both likely locations.
writeComponentPair(path.join(root, "components"));
writeComponentPair(path.join(root, "app", "components"));

// Patch inline/static image usages across app/components/components.
const candidateFiles = [
  path.join(root, "app", "page.js"),
  path.join(root, "app", "page.jsx"),
  path.join(root, "app", "map", "page.js"),
  path.join(root, "app", "map", "page.jsx"),
  ...walk(path.join(root, "app")),
  ...walk(path.join(root, "components"))
];

const uniqueFiles = [...new Set(candidateFiles.filter(exists))];

const patched = [];
for (const file of uniqueFiles) {
  if (patchFile(file)) {
    patched.push(path.relative(root, file));
  }
}

console.log("");
if (patched.length) {
  console.log("Patched old/wrong map references in:");
  patched.forEach((f) => console.log(`- ${f}`));
} else {
  console.log("No inline old map reference found. Component replacement was still installed.");
}

console.log("");
console.log("Backups created with .phase68-backup where files existed.");
console.log("Test:");
console.log("http://localhost:3000");
console.log("http://localhost:3000/map");
