import styles from "./JamaicaParishMap.module.css";

export default function JamaicaParishMap({ className = "" }) {
  return (
    <div className={`${styles.mapShell} ${className || ""}`}>
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
