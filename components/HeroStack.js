"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { activeAds, cleanAd, sampleAds } from "@/lib/yardpromoData";
import styles from "./HeroStack.module.css";

function getSafePoster(ad) {
  return (
    ad?.poster_image_url ||
    ad?.image_url ||
    ad?.posterUrl ||
    ad?.image ||
    "/assets/yardpromo-brand-preview.png"
  );
}

function getSafeSlug(ad) {
  return ad?.slug || ad?.id || "yardpromo-event";
}

function getSafeTitle(ad) {
  return ad?.title || ad?.name || "YardPromo Event";
}

function getSafeCategory(ad) {
  return ad?.category || ad?.type || "Featured Promo";
}

function getSafeLocation(ad) {
  return ad?.location || ad?.venue || ad?.parish || "Jamaica";
}

function getSafeDate(ad) {
  return ad?.event_date || ad?.date || ad?.starts_at || ad?.start_time || "";
}

function normalizeHeroAd(ad, index) {
  return {
    ...ad,
    id: ad?.id || ad?.slug || `hero-${index}`,
    slug: getSafeSlug(ad),
    title: getSafeTitle(ad),
    category: getSafeCategory(ad),
    location: getSafeLocation(ad),
    date: getSafeDate(ad),
    poster_image_url: getSafePoster(ad),
  };
}

function wrapIndex(index, total) {
  return ((index % total) + total) % total;
}

export default function HeroStack() {
  const fallbackItems = useMemo(() => {
    return activeAds(sampleAds)
      .filter((ad) => ad.is_featured)
      .concat(activeAds(sampleAds).filter((ad) => !ad.is_featured))
      .slice(0, 5)
      .map(cleanAd)
      .map(normalizeHeroAd);
  }, []);

  const [items, setItems] = useState(fallbackItems);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .in("status", ["active", "approved"])
          .order("is_featured", { ascending: false })
          .limit(5);

        if (!error && alive && data && data.length > 0) {
          setItems(data.map(cleanAd).map(normalizeHeroAd));
        }
      } catch (error) {
        console.info(
          "YardPromo hero demo posters are being used because Supabase is unavailable."
        );
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  const posterItems = useMemo(() => {
    const merged = [...items, ...fallbackItems].map(normalizeHeroAd);
    return merged.length >= 3 ? merged : fallbackItems;
  }, [fallbackItems, items]);

  const total = posterItems.length || 1;
  const active = posterItems[wrapIndex(activeIndex, total)];
  const previous = posterItems[wrapIndex(activeIndex - 1, total)];
  const next = posterItems[wrapIndex(activeIndex + 1, total)];

  function goNext() {
    setActiveIndex((current) => wrapIndex(current + 1, total));
  }

  function goPrevious() {
    setActiveIndex((current) => wrapIndex(current - 1, total));
  }

  function goTo(index) {
    setActiveIndex(wrapIndex(index, total));
  }

  useEffect(() => {
    if (paused || total <= 1) return undefined;

    const interval = window.setInterval(() => {
      goNext();
    }, 4600);

    return () => window.clearInterval(interval);
  }, [paused, total]);

  function onTouchStart(event) {
    setTouchStart(event.touches?.[0]?.clientX ?? null);
  }

  function onTouchEnd(event) {
    if (touchStart === null) return;

    const endX = event.changedTouches?.[0]?.clientX ?? touchStart;
    const delta = endX - touchStart;

    if (Math.abs(delta) > 45) {
      if (delta < 0) goNext();
      else goPrevious();
    }

    setTouchStart(null);
  }

  return (
    <div
      className={styles.stack}
      aria-label="Featured promos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.glow} aria-hidden="true" />

      <button
        type="button"
        className={`${styles.arrow} ${styles.leftArrow}`}
        onClick={goPrevious}
        aria-label="Previous featured promo"
      >
        ‹
      </button>

      <div className={styles.stage}>
        <Poster ad={previous} position="left" />
        <Poster ad={next} position="right" />
        <Poster ad={active} position="center" featured />
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.rightArrow}`}
        onClick={goNext}
        aria-label="Next featured promo"
      >
        ›
      </button>

      <div className={styles.dots} aria-label="Featured promo carousel">
        {posterItems.slice(0, Math.min(total, 5)).map((item, index) => (
          <button
            key={`${item.slug}-${index}`}
            type="button"
            className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ""}`}
            onClick={() => goTo(index)}
            aria-label={`Show promo ${index + 1}`}
            aria-current={index === activeIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
}

function Poster({ ad, position, featured = false }) {
  return (
    <Link
      href={`/ad/${ad.slug}`}
      className={`${styles.poster} ${styles[position]} ${
        featured ? styles.featuredPoster : ""
      }`}
      aria-label={`View ${ad.title}`}
    >
      <img src={ad.poster_image_url} alt={`${ad.title} poster`} />

      <span className={styles.imageFade} />

      {featured ? (
        <span className={styles.info}>
          <span className={styles.badge}>{ad.category}</span>
          <strong>{ad.title}</strong>
          <small>
            {ad.date ? `${formatShortDate(ad.date)} • ` : ""}
            {ad.location}
          </small>
          <span className={styles.cta}>View Promo</span>
        </span>
      ) : (
        <span className={styles.sideLabel}>{ad.title}</span>
      )}
    </Link>
  );
}

function formatShortDate(value) {
  if (!value) return "";

  try {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  } catch {
    // Use raw value below.
  }

  return String(value);
}
