"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./HeroStackCarousel.module.css";

const fallbackPromos = [
  {
    id: "fallback-beach",
    title: "Beach Cooler Fete",
    category: "Event",
    date: "May 25",
    location: "Fort Clarence Beach",
    image: "/assets/hero-beach-fete.jpg",
    href: "/browse",
  },
  {
    id: "fallback-sumfest",
    title: "Reggae Sumfest",
    category: "Concert",
    date: "July 14 – 20",
    location: "Montego Bay",
    image: "/assets/hero-reggae-sumfest.jpg",
    href: "/browse",
  },
  {
    id: "fallback-food",
    title: "Food Explosion",
    category: "Food",
    date: "May 31",
    location: "Hope Gardens, Kingston",
    image: "/assets/hero-food-explosion.jpg",
    href: "/browse",
  },
];

function normalizePromo(promo, index) {
  if (!promo) return fallbackPromos[index % fallbackPromos.length];

  const image =
    promo.image ||
    promo.image_url ||
    promo.imageUrl ||
    promo.flyer_url ||
    promo.flyerUrl ||
    promo.cover_image ||
    promo.coverImage ||
    fallbackPromos[index % fallbackPromos.length].image;

  const title =
    promo.title ||
    promo.name ||
    promo.promo_title ||
    fallbackPromos[index % fallbackPromos.length].title;

  const category =
    promo.category ||
    promo.type ||
    promo.promo_type ||
    fallbackPromos[index % fallbackPromos.length].category;

  const date =
    promo.date ||
    promo.event_date ||
    promo.start_date ||
    promo.displayDate ||
    fallbackPromos[index % fallbackPromos.length].date;

  const location =
    promo.location ||
    promo.parish ||
    promo.venue ||
    promo.address ||
    fallbackPromos[index % fallbackPromos.length].location;

  const slugOrId = promo.slug || promo.id || promo.uid;
  const href =
    promo.href ||
    promo.url ||
    (slugOrId ? `/ad/${slugOrId}` : fallbackPromos[index % fallbackPromos.length].href);

  return {
    ...promo,
    id: promo.id || promo.slug || promo.uid || `promo-${index}`,
    title,
    category,
    date,
    location,
    image,
    href,
  };
}

function getIndex(index, total) {
  return ((index % total) + total) % total;
}

/**
 * HeroStackCarousel
 *
 * Drop this component into your homepage hero right column.
 *
 * Example:
 * <HeroStackCarousel promos={heroPromos || ads || premiumPromos} />
 *
 * It safely accepts many common promo field names:
 * title/name, image/image_url/flyer_url, category/type,
 * location/parish/venue, date/event_date/start_date, slug/id/href.
 */
export default function HeroStackCarousel({
  promos = [],
  autoPlay = true,
  interval = 4500,
}) {
  const items = useMemo(() => {
    const source = Array.isArray(promos) && promos.length ? promos : fallbackPromos;
    const normalized = source.map(normalizePromo);

    while (normalized.length < 3) {
      normalized.push(normalizePromo(fallbackPromos[normalized.length], normalized.length));
    }

    return normalized;
  }, [promos]);

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const stackRef = useRef(null);

  const total = items.length;
  const activePromo = items[getIndex(active, total)];
  const leftPromo = items[getIndex(active - 1, total)];
  const rightPromo = items[getIndex(active + 1, total)];

  const goNext = useCallback(() => {
    setActive((current) => getIndex(current + 1, total));
  }, [total]);

  const goPrevious = useCallback(() => {
    setActive((current) => getIndex(current - 1, total));
  }, [total]);

  const goTo = useCallback(
    (index) => {
      setActive(getIndex(index, total));
    },
    [total]
  );

  useEffect(() => {
    if (!autoPlay || isPaused || total <= 1) return undefined;

    const timer = window.setInterval(goNext, interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, goNext, interval, isPaused, total]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (!stackRef.current) return;
      const isFocusedInside = stackRef.current.contains(document.activeElement);
      if (!isFocusedInside) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious]);

  function handlePointerDown(event) {
    setDragStart(event.clientX || event.touches?.[0]?.clientX || 0);
  }

  function handlePointerUp(event) {
    if (dragStart === null) return;

    const endX = event.clientX || event.changedTouches?.[0]?.clientX || 0;
    const delta = endX - dragStart;

    if (Math.abs(delta) > 45) {
      if (delta < 0) goNext();
      else goPrevious();
    }

    setDragStart(null);
  }

  return (
    <section
      ref={stackRef}
      className={styles.stackShell}
      aria-label="Featured YardPromoJa promos"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className={styles.glowOne} aria-hidden="true" />
      <div className={styles.glowTwo} aria-hidden="true" />

      <button
        type="button"
        className={`${styles.arrowButton} ${styles.arrowLeft}`}
        onClick={goPrevious}
        aria-label="Show previous promo"
      >
        ‹
      </button>

      <div className={styles.stackStage}>
        <PromoPoster promo={leftPromo} position="left" onClick={goPrevious} />
        <PromoPoster promo={rightPromo} position="right" onClick={goNext} />
        <PromoPoster promo={activePromo} position="center" isActive />
      </div>

      <button
        type="button"
        className={`${styles.arrowButton} ${styles.arrowRight}`}
        onClick={goNext}
        aria-label="Show next promo"
      >
        ›
      </button>

      <div className={styles.dots} aria-label="Promo carousel navigation">
        {items.slice(0, Math.min(total, 6)).map((promo, index) => (
          <button
            type="button"
            key={promo.id || index}
            className={`${styles.dot} ${index === active ? styles.dotActive : ""}`}
            onClick={() => goTo(index)}
            aria-label={`Show promo ${index + 1}`}
            aria-current={index === active ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  );
}

function PromoPoster({ promo, position, isActive = false, onClick }) {
  const content = (
    <>
      <img
        className={styles.posterImage}
        src={promo.image}
        alt={promo.title}
        loading={isActive ? "eager" : "lazy"}
      />

      <div className={styles.imageShade} />

      {isActive && (
        <div className={styles.activeOverlay}>
          <span className={styles.badge}>{promo.category}</span>
          <h3>{promo.title}</h3>

          <div className={styles.metaLine}>
            {promo.date && <span>{promo.date}</span>}
            {promo.date && promo.location && <span className={styles.metaDivider} />}
            {promo.location && <span>{promo.location}</span>}
          </div>

          <span className={styles.viewButton}>View Promo</span>
        </div>
      )}
    </>
  );

  const className = `${styles.poster} ${styles[position]} ${
    isActive ? styles.activePoster : ""
  }`;

  if (isActive) {
    return (
      <Link href={promo.href} className={className} aria-label={`View ${promo.title}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={`Preview ${promo.title}`}
    >
      {content}
    </button>
  );
}
