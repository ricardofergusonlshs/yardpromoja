"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdsGrid from "../../AdsGrid";
import { createClient } from "../../../lib/supabaseClient";
import styles from "../parish.module.css";

const CATEGORY_LINKS = [
  { label: "Events", icon: "♫", value: "Party" },
  { label: "Food & Drinks", icon: "🍴", value: "Food" },
  { label: "Sale Offers", icon: "🏷", value: "Sale" },
  { label: "Campaigns", icon: "📣", value: "Campaign" },
  { label: "Services", icon: "🛠", value: "Services" },
  { label: "Stay", icon: "🛏", value: "Hotel" },
];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/st\./g, "st")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isLiveAd(ad) {
  const status = normalizeText(ad?.status);

  if (!status) return true;

  return ["active", "approved", "published"].includes(status);
}

function rowMatchesParish(ad, parish) {
  const aliases = [parish.name, parish.region, parish.slug, ...(parish.aliases || [])]
    .map(normalizeText)
    .filter(Boolean);

  const haystack = normalizeText(
    [
      ad?.parish,
      ad?.location,
      ad?.venue,
      ad?.address,
      ad?.city,
      ad?.area,
      ad?.region,
      ad?.title,
      ad?.name,
      ad?.business_name,
      ad?.description,
    ].join(" ")
  );

  if (!haystack) return false;

  return aliases.some((alias) => haystack.includes(alias));
}

function categoryCount(ads, keyword) {
  const cleanKeyword = normalizeText(keyword);

  return ads.filter((ad) =>
    normalizeText([ad?.category, ad?.type, ad?.business_type, ad?.title, ad?.name].join(" ")).includes(cleanKeyword)
  ).length;
}

export default function ParishPageClient({ parish, allParishes }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadParishAds() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(120);

        if (error) {
          throw error;
        }

        const filtered = (data || [])
          .filter(isLiveAd)
          .filter((ad) => rowMatchesParish(ad, parish));

        if (alive) {
          setAds(filtered);
          setLoading(false);
        }
      } catch (error) {
        console.error("Parish page load error:", error);

        if (alive) {
          setAds([]);
          setLoading(false);
        }
      }
    }

    loadParishAds();

    return () => {
      alive = false;
    };
  }, [parish]);

  const stats = useMemo(
    () => [
      { label: "Promos found", value: loading ? "..." : ads.length },
      { label: "Food spots", value: loading ? "..." : categoryCount(ads, "food") },
      { label: "Events", value: loading ? "..." : categoryCount(ads, "party") + categoryCount(ads, "event") },
      { label: "Offers", value: loading ? "..." : categoryCount(ads, "sale") + categoryCount(ads, "offer") },
    ],
    [ads, loading]
  );

  return (
    <main className={styles.page}>
      <section className={styles.detailHero}>
        <div className={styles.detailHeroCopy}>
          <p className={styles.kicker}>📍 Parish Pulse</p>
          <h1>{parish.name}</h1>
          <p>{parish.description}</p>

          <div className={styles.heroActions}>
            <Link className={styles.goldButton} href={`/browse?parish=${encodeURIComponent(parish.name)}`}>
              Browse {parish.name}
            </Link>
            <Link className={styles.greenButton} href={`/link-up?parish=${encodeURIComponent(parish.name)}`}>
              Plan a link-up
            </Link>
          </div>
        </div>

        <div className={styles.heroImageCard}>
          <img src={parish.image} alt={`${parish.name} parish`} />
          <div>
            <strong>{parish.region}</strong>
            <span>{parish.listings}</span>
          </div>
        </div>
      </section>

      <section className={styles.statsGrid} aria-label={`${parish.name} stats`}>
        {stats.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.quickLinks} aria-label={`${parish.name} quick categories`}>
        {CATEGORY_LINKS.map((item) => (
          <Link
            href={`/browse?parish=${encodeURIComponent(parish.name)}&category=${encodeURIComponent(item.value)}`}
            key={item.label}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Latest in {parish.name}</p>
              <h2>Promos, places, events, and offers.</h2>
            </div>
            <Link href={`/browse?parish=${encodeURIComponent(parish.name)}`}>View all</Link>
          </div>

          {loading ? (
            <div className={styles.emptyState}>
              <h3>Loading parish promos...</h3>
              <p>Fetching the latest listings for {parish.name}.</p>
            </div>
          ) : ads.length > 0 ? (
            <AdsGrid ads={ads} limit={12} />
          ) : (
            <div className={styles.emptyState}>
              <h3>No live promos found yet.</h3>
              <p>
                {parish.name} pages are ready. When businesses post promos with
                this parish, they will show here automatically.
              </p>
              <Link className={styles.goldButton} href="/create">
                Post your promo
              </Link>
            </div>
          )}
        </div>

        <aside className={styles.sidePanel}>
          <h3>Explore nearby parishes</h3>
          <div className={styles.nearbyList}>
            {allParishes
              .filter((item) => item.slug !== parish.slug)
              .slice(0, 6)
              .map((item) => (
                <Link href={`/parish/${item.slug}`} key={item.slug}>
                  <img src={item.image} alt="" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.region}</small>
                  </span>
                </Link>
              ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
