import Link from "next/link";
import { PARISHES } from "./parishData";
import styles from "./parish.module.css";

export const metadata = {
  title: "Explore Jamaica by Parish | YardPromoJa",
  description:
    "Browse Jamaican promos, food spots, events, services, campaigns, stays, and weekend moves by parish.",
};

export default function ParishIndexPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>🌴 Parish Pulse</p>
          <h1>Explore Jamaica by parish.</h1>
          <p>
            Choose a parish and find promos, food spots, events, sale offers,
            services, campaigns, weekend moves, and link-up ideas nearby.
          </p>
        </div>

        <Link className={styles.goldButton} href="/browse">
          Browse all promos
        </Link>
      </section>

      <section className={styles.parishGrid} aria-label="Jamaica parishes">
        {PARISHES.map((parish) => (
          <Link className={styles.parishCard} href={`/parish/${parish.slug}`} key={parish.slug}>
            <img src={parish.image} alt="" />
            <span />
            <strong>{parish.name}</strong>
            <small>{parish.region}</small>
            <em>{parish.listings}</em>
          </Link>
        ))}
      </section>
    </main>
  );
}
