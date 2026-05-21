import Link from "next/link";
import styles from "./JamaicaParishMap.module.css";

/**
 * Phase 47:
 * Server-safe JamaicaParishMap.
 *
 * This removes styled-jsx completely.
 * It can be imported by app/map/page.js without needing "use client".
 * It uses the PNG map asset from Phase 45.
 */

const PARISHES = [
  { name: "Kingston", slug: "kingston", x: 76, y: 64 },
  { name: "St. Andrew", slug: "st-andrew", x: 73, y: 61 },
  { name: "St. Catherine", slug: "st-catherine", x: 66, y: 58 },
  { name: "Clarendon", slug: "clarendon", x: 57, y: 57 },
  { name: "Manchester", slug: "manchester", x: 48, y: 62 },
  { name: "St. Elizabeth", slug: "st-elizabeth", x: 38, y: 67 },
  { name: "Westmoreland", slug: "westmoreland", x: 21, y: 61 },
  { name: "Hanover", slug: "hanover", x: 26, y: 49 },
  { name: "St. James", slug: "st-james", x: 34, y: 48 },
  { name: "Trelawny", slug: "trelawny", x: 46, y: 44 },
  { name: "St. Ann", slug: "st-ann", x: 56, y: 39 },
  { name: "St. Mary", slug: "st-mary", x: 65, y: 43 },
  { name: "Portland", slug: "portland", x: 82, y: 48 },
  { name: "St. Thomas", slug: "st-thomas", x: 76, y: 54 },
];

export default function JamaicaParishMap({ compact = false }) {
  return (
    <section className={`${styles.wrap} ${compact ? styles.compact : ""}`}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>📍 Jamaica Parish Map</p>
          <h2>Explore by parish</h2>
        </div>

        <Link className={styles.viewAll} href="/parish">
          View all parishes
        </Link>
      </div>

      <div className={styles.mapShell}>
        <img
          className={styles.mapImage}
          src="/assets/jamaica-parish-map.png"
          alt="Map of Jamaica parishes"
        />

        <div className={styles.hotspots} aria-label="Parish links">
          {PARISHES.map((parish) => (
            <Link
              key={parish.slug}
              className={styles.pin}
              href={`/parish/${parish.slug}`}
              style={{ left: `${parish.x}%`, top: `${parish.y}%` }}
              aria-label={`Open ${parish.name} parish page`}
              title={parish.name}
            >
              <span />
              <strong>{parish.name}</strong>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/parish" className={styles.goldButton}>
          Select your parish
        </Link>
        <Link href="/browse" className={styles.darkButton}>
          Browse all promos
        </Link>
      </div>
    </section>
  );
}
