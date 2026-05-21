"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./HomeSearchPanel.module.css";

const categories = [
  "All Categories",
  "Events & Parties",
  "Food & Drinks",
  "Sale Offers",
  "Campaigns",
  "Beauty",
  "Fashion",
  "Transport",
  "Stay",
  "Weekend",
  "Parish Pulse",
];

const locations = [
  "All Locations",
  "Kingston",
  "St. Andrew",
  "St. Catherine",
  "Clarendon",
  "Manchester",
  "St. Elizabeth",
  "Westmoreland",
  "Hanover",
  "St. James",
  "Trelawny",
  "St. Ann",
  "St. Mary",
  "Portland",
  "St. Thomas",
];

const popularSearches = ["Beach", "Events", "Jerk Chicken", "Nightlife", "Waterfalls", "Hiking"];

function realValue(value, emptyValue) {
  const cleaned = String(value || "").trim();
  return cleaned && cleaned !== emptyValue ? cleaned : "";
}

export default function HomeSearchPanel() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");

  function submitSearch(event) {
    event?.preventDefault();

    const params = new URLSearchParams();
    const q = realValue(query, "");
    const cat = realValue(category, "All Categories");
    const loc = realValue(location, "All Locations");

    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    if (loc) params.set("location", loc);

    router.push(`/browse${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function quickSearch(term) {
    const params = new URLSearchParams();
    params.set("q", term);
    router.push(`/browse?${params.toString()}`);
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.searchBar} onSubmit={submitSearch}>
        <label className={styles.mainField}>
          <span className={styles.bigIcon} aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What are you looking for?"
            aria-label="What are you looking for?"
          />
        </label>

        <label className={styles.selectField}>
          <span className={styles.icon} aria-hidden="true">▦</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Select category"
          >
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className={styles.selectField}>
          <span className={styles.icon} aria-hidden="true">⌖</span>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            aria-label="Select location"
          >
            {locations.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <button className={styles.submit} type="submit" aria-label="Search">
          🔍
        </button>
      </form>

      <div className={styles.popular}>
        <span>Popular searches:</span>
        {popularSearches.map((term) => (
          <button key={term} type="button" onClick={() => quickSearch(term)}>
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
