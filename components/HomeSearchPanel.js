"use client";

import Link from "next/link";
import styles from "./HomeSearchPanel.module.css";

const filters = [
  { label: "Events", href: "/browse?category=Events", icon: CalendarIcon },
  { label: "Food", href: "/browse?category=Food", icon: UtensilsIcon },
  { label: "Services", href: "/browse?category=Services", icon: ToolsIcon },
  { label: "Businesses", href: "/browse?category=Business", icon: StoreIcon },
  { label: "Deals", href: "/browse?category=Deals", icon: TagIcon },
  { label: "Weekend", href: "/weekend", icon: StarIcon },
  { label: "All Categories", href: "/browse", icon: GridIcon },
];

export default function HomeSearchPanel() {
  return (
    <section className={styles.shell} aria-label="Search YardPromoJa">
      <form className={styles.searchRow} action="/browse" method="GET">
        <label className={styles.searchInput}>
          <SearchIcon />
          <span className={styles.srOnly}>Search promos</span>
          <input
            name="q"
            type="search"
            placeholder="Search events, food, services, businesses, deals..."
            autoComplete="off"
          />
        </label>

        <button className={styles.searchButton} type="submit">
          <SearchIcon />
          Search
        </button>

        <Link href="/browse?near=me" className={styles.nearButton}>
          <PinIcon />
          Near Me
        </Link>
      </form>

      <nav className={styles.filterRow} aria-label="Quick promo filters">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <Link className={styles.filterPill} href={filter.href} key={filter.label}>
              <Icon />
              {filter.label}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="m16.2 16.2 4.3 4.3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-6.2 7-12A7 7 0 1 0 5 9c0 5.8 7 12 7 12Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.35" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.4" stroke="currentColor" strokeWidth="2.1" />
      <path d="M8 3.8v4M16 3.8v4M4.5 10h15" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

function UtensilsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3v8M10 3v8M5 3v6.3c0 1.8 1.6 3.2 3.5 3.2S12 11.1 12 9.3V3M8.5 12.5V21M17 3c1.7 1.4 2.4 3.5 2.4 6.2v1.1H17V21" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m14.5 5 4.5 4.5M16.6 3.6l3.8 3.8-9.7 9.7-3.8-3.8 9.7-9.7Z" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m7.1 13.3-3.4 3.4a2 2 0 0 0 2.8 2.8l3.4-3.4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 10.5V20h14v-9.5M4 10.5h16l-1.6-6.1H5.6L4 10.5Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <path d="M8 20v-5h8v5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.2 12.1 12.1 20.2a2.4 2.4 0 0 1-3.4 0L3.8 15.3a2.4 2.4 0 0 1 0-3.4l8.1-8.1H19a1.2 1.2 0 0 1 1.2 1.2v7.1Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <circle cx="16.4" cy="7.6" r="1.2" fill="currentColor" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 3.6 2.5 5 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8 2.5-5Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="2.1" />
      <rect x="14" y="4" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="2.1" />
      <rect x="4" y="14" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="2.1" />
      <rect x="14" y="14" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="2.1" />
    </svg>
  );
}
