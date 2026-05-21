import JamaicaParishMap from "@/components/JamaicaParishMap";
import styles from "./map.module.css";

export const metadata = {
  title: "Jamaica Map | YardPromoJa",
  description: "Preview the Jamaica parish map PNG used by YardPromoJa.",
};

export default function MapPreviewPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.kicker}>YardPromoJa</p>
        <h1 className={styles.title}>Jamaica parish map</h1>
        <p className={styles.copy}>
          PNG map replacement for the next phase. Use this route to preview the
          asset before placing it on the homepage.
        </p>

        <JamaicaParishMap priority />
      </div>
    </main>
  );
}
