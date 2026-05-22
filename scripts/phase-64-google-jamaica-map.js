const fs = require("fs");
const path = require("path");

const root = process.cwd();

const componentSource = `import styles from "./JamaicaParishMap.module.css";

export default function JamaicaParishMap({ className = "", title = "Google map of Jamaica" }) {
  return (
    <div className={\`\${styles.mapShell} \${className || ""}\`}>
      <iframe
        className={styles.mapFrame}
        title={title}
        src="https://www.google.com/maps?q=Jamaica&z=9&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      <div className={styles.mapBadge}>Google Map</div>

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
  min-height: 280px;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 212, 0, 0.08), transparent 45%),
    linear-gradient(180deg, rgba(8, 20, 14, 0.96), rgba(4, 10, 7, 0.98));
}

.mapShell::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.10),
    inset 0 0 50px rgba(0, 0, 0, 0.18);
}

.mapFrame {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 280px;
  border: 0;
  filter: saturate(1.06) contrast(1.02);
}

.mapBadge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 13px;
  border: 1px solid rgba(255, 212, 0, 0.28);
  border-radius: 999px;
  color: #ffd400;
  background:
    linear-gradient(135deg, rgba(0, 0, 0, 0.78), rgba(8, 18, 12, 0.64));
  box-shadow: 0 14px 26px rgba(0, 0, 0, 0.26);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.openMap {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 15px;
  border: 1px solid rgba(56, 212, 48, 0.34);
  border-radius: 999px;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(56, 212, 48, 0.88), rgba(20, 132, 23, 0.9));
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.26);
  font-size: 12px;
  font-weight: 950;
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
    min-height: 260px;
  }

  .mapBadge {
    top: 12px;
    left: 12px;
  }

  .openMap {
    right: 12px;
    bottom: 12px;
  }
}
`;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function backupIfExists(file) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, `${file}.phase64-backup`);
  }
}

function writeComponentPair(dir) {
  ensureDir(dir);

  const jsPath = path.join(dir, "JamaicaParishMap.js");
  const cssPath = path.join(dir, "JamaicaParishMap.module.css");

  backupIfExists(jsPath);
  backupIfExists(cssPath);

  fs.writeFileSync(jsPath, componentSource, "utf8");
  fs.writeFileSync(cssPath, cssSource, "utf8");

  console.log(`Installed Google map component in ${path.relative(root, dir)}`);
}

const rootComponentsDir = path.join(root, "components");
const appComponentsDir = path.join(root, "app", "components");

// Most Next aliases use /components. Install there first.
writeComponentPair(rootComponentsDir);

// Also install in app/components if that folder exists or if your app has used it before.
if (fs.existsSync(appComponentsDir)) {
  writeComponentPair(appComponentsDir);
}

console.log("");
console.log("Backups created with .phase64-backup when old files existed.");
console.log("This uses the official Google Maps embed URL instead of a copied/static screenshot.");
console.log("");
console.log("Test:");
console.log("http://localhost:3000");
console.log("http://localhost:3000/map");
