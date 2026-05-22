"use client";

import Link from "next/link";
import styles from "./ModernCategoryRail.module.css";

const icons = {
  events: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </svg>
  ),
  food: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 3v8" />
      <path d="M8 3v8" />
      <path d="M4 7h4" />
      <path d="M6 11v10" />
      <path d="M16 3c2 2.4 3 5 3 8 0 3-1.2 5-3 5V3Z" />
      <path d="M16 16v5" />
    </svg>
  ),
  offers: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V4h9l8.6 8.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="8.5" r="1.4" />
      <path d="M12 8h5" />
      <path d="M10 12h7" />
    </svg>
  ),
  campaigns: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h3l10 5V6L7 11H4v2Z" />
      <path d="M7 13v6" />
      <path d="M19 9c1 .8 1.5 1.8 1.5 3S20 14.2 19 15" />
    </svg>
  ),
  beauty: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 20 6.5-6.5" />
      <path d="m14 4 6 6" />
      <path d="M9 15 15 9" />
      <path d="M3.5 8.5 7 12" />
      <path d="M12 17l3.5 3.5" />
    </svg>
  ),
  fashion: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 4 6 6 3 7l2 5 3-1v9h8v-9l3 1 2-5-3-1-3-2" />
      <path d="M9 4c.7 1.3 1.7 2 3 2s2.3-.7 3-2" />
    </svg>
  ),
  transport: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 11 7 6h10l2 5" />
      <path d="M4 11h16v7H4z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M8 11h8" />
    </svg>
  ),
  stay: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20V8" />
      <path d="M20 20v-6a3 3 0 0 0-3-3H9v9" />
      <path d="M4 14h16" />
      <path d="M4 9h5a3 3 0 0 1 3 3v2" />
    </svg>
  ),
  weekend: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
      <path d="M8 14h3" />
      <path d="M13 14h3" />
      <path d="M8 17h3" />
    </svg>
  ),
  parish: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
};

const categories = [
  { label: "Events & Parties", href: "/browse?category=Events%20%26%20Parties", icon: "events" },
  { label: "Food & Drinks", href: "/browse?category=Food%20%26%20Drinks", icon: "food" },
  { label: "Sale Offers", href: "/browse?category=Sale%20Offers", icon: "offers" },
  { label: "Campaigns", href: "/campaigns", icon: "campaigns" },
  { label: "Beauty", href: "/browse?category=Beauty", icon: "beauty" },
  { label: "Fashion", href: "/browse?category=Fashion", icon: "fashion" },
  { label: "Transport", href: "/browse?category=Transport", icon: "transport" },
  { label: "Stay", href: "/browse?category=Stay", icon: "stay" },
  { label: "Weekend", href: "/weekend", icon: "weekend" },
  { label: "Parish Pulse", href: "/map", icon: "parish" },
];

export default function ModernCategoryRail() {
  return (
    <section className={styles.shell} aria-label="Browse YardPromoJa categories">
      <div className={styles.track}>
        {categories.map((category) => (
          <Link key={category.label} className={styles.card} href={category.href}>
            <span className={styles.iconWrap}>{icons[category.icon]}</span>
            <span className={styles.label}>{category.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
