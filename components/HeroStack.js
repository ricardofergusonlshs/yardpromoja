"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function getPromoImage(promo) {
  return (
    promo?.poster_image_url ||
    promo?.image_url ||
    promo?.posterUrl ||
    promo?.image ||
    promo?.poster ||
    "/assets/yardpromo-brand-preview.png"
  );
}

function getPromoHref(promo) {
  if (promo?.href) return promo.href;
  if (promo?.url) return promo.url;
  if (promo?.slug) return `/ad/${promo.slug}`;
  if (promo?.id) return `/ad/${promo.id}`;
  return "/browse";
}

function getPromoDate(promo) {
  const raw = promo?.event_date || promo?.eventDate || promo?.start_date || promo?.date || promo?.created_at;

  if (!raw) return "Coming soon";

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return String(raw);

  return parsed.toLocaleDateString("en-JM", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getPromoLocation(promo) {
  const parts = [promo?.venue || promo?.location, promo?.parish].filter(Boolean);
  return parts.length ? parts.join(" • ") : "Jamaica";
}

export default function HeroStack({
  promos = [],
  featuredPromos = [],
  ads = [],
  autoPlay = true,
  intervalMs = 5200,
}) {
  const promoList = useMemo(() => {
    const source =
      Array.isArray(promos) && promos.length
        ? promos
        : Array.isArray(featuredPromos) && featuredPromos.length
          ? featuredPromos
          : Array.isArray(ads) && ads.length
            ? ads
            : [];

    return source.filter(Boolean);
  }, [promos, featuredPromos, ads]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const promoCount = promoList.length;
  const activePromo = promoCount ? promoList[currentIndex] || promoList[0] : null;

  useEffect(() => {
    if (!promoCount) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((value) => (value >= promoCount ? 0 : value));
  }, [promoCount]);

  useEffect(() => {
    if (!autoPlay || promoCount <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((value) => (value + 1) % promoCount);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [autoPlay, intervalMs, promoCount]);

  function goToPrevious() {
    if (promoCount <= 1) return;
    setCurrentIndex((value) => (value === 0 ? promoCount - 1 : value - 1));
  }

  function goToNext() {
    if (promoCount <= 1) return;
    setCurrentIndex((value) => (value + 1) % promoCount);
  }

  if (!activePromo) {
    return (
      <section className="yp-featured-shell">
        <div className="yp-empty-card">
          <p>Featured promos</p>
          <h3>No featured promos yet</h3>
          <span>Check back soon for what&apos;s happening around Jamaica.</span>
        </div>
        <style jsx>{baseStyles}</style>
      </section>
    );
  }

  return (
    <section className="yp-featured-shell" aria-label="Featured promos">
      <div className="yp-featured-card">
        <div className="yp-card-topline">
          <span>Featured promos</span>
        </div>

        <Link href={getPromoHref(activePromo)} className="yp-image-link">
          <img src={getPromoImage(activePromo)} alt={activePromo?.title || "Featured promo"} />

          <div className="yp-image-gradient" />

          <div className="yp-promo-panel">
            <span className="yp-category">{activePromo?.category || "Promo"}</span>
            <h3>{activePromo?.title || "Featured promo"}</h3>
            <p>{getPromoDate(activePromo)} · {getPromoLocation(activePromo)}</p>
            <span className="yp-view-button">View Promo</span>
          </div>
        </Link>

        {promoCount > 1 ? (
          <>
            <button className="yp-arrow yp-arrow-left" type="button" onClick={goToPrevious} aria-label="Previous promo">
              ‹
            </button>
            <button className="yp-arrow yp-arrow-right" type="button" onClick={goToNext} aria-label="Next promo">
              ›
            </button>
          </>
        ) : null}
      </div>

      {promoCount > 1 ? (
        <div className="yp-dots" aria-label="Choose featured promo">
          {promoList.map((promo, index) => (
            <button
              key={promo?.id || promo?.slug || index}
              type="button"
              className={index === currentIndex ? "active" : ""}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Show promo ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      ) : null}

      <style jsx>{baseStyles}</style>
    </section>
  );
}

const baseStyles = `
  .yp-featured-shell {
    position: relative;
    width: 100%;
  }

  .yp-featured-card,
  .yp-empty-card {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 32px;
    background:
      radial-gradient(circle at top right, rgba(48, 216, 67, 0.16), transparent 34%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.035));
    box-shadow: 0 34px 90px rgba(0, 0, 0, 0.42);
  }

  .yp-featured-card {
    padding: clamp(14px, 2vw, 20px);
  }

  .yp-empty-card {
    min-height: 420px;
    display: grid;
    place-content: center;
    text-align: center;
    color: white;
    padding: 32px;
  }

  .yp-empty-card p,
  .yp-card-topline span {
    display: inline-flex;
    align-items: center;
    width: max-content;
    min-height: 34px;
    border: 1px solid rgba(255, 208, 0, 0.48);
    border-radius: 999px;
    padding: 0 14px;
    color: #fff;
    background: rgba(0, 0, 0, 0.26);
    font-weight: 900;
    letter-spacing: -0.02em;
  }

  .yp-card-topline {
    position: absolute;
    top: 26px;
    left: 26px;
    z-index: 5;
  }

  .yp-image-link {
    position: relative;
    display: block;
    min-height: 440px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 24px;
    color: inherit;
    text-decoration: none;
    background: #07110d;
  }

  .yp-image-link img {
    display: block;
    width: 100%;
    height: clamp(430px, 42vw, 560px);
    min-height: 440px;
    object-fit: cover;
    transform: scale(1.01);
  }

  .yp-image-gradient {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(0, 0, 0, 0.48), transparent 42%, rgba(0, 0, 0, 0.18)),
      linear-gradient(180deg, transparent 34%, rgba(0, 0, 0, 0.72));
    pointer-events: none;
  }

  .yp-promo-panel {
    position: absolute;
    left: clamp(18px, 4vw, 48px);
    right: clamp(18px, 12vw, 140px);
    bottom: clamp(18px, 4vw, 46px);
    z-index: 4;
    max-width: 560px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 26px;
    background: rgba(8, 12, 10, 0.58);
    padding: clamp(18px, 3vw, 28px);
    color: white;
    backdrop-filter: blur(18px);
    box-shadow: 0 18px 52px rgba(0, 0, 0, 0.38);
  }

  .yp-category {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    border-radius: 999px;
    padding: 0 12px;
    background: rgba(255, 208, 0, 0.16);
    color: #ffd000;
    font-size: 0.72rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .yp-promo-panel h3 {
    margin: 14px 0 10px;
    max-width: 500px;
    color: white;
    font-size: clamp(1.9rem, 4vw, 3.4rem);
    line-height: 0.92;
    font-weight: 1000;
    letter-spacing: -0.07em;
    text-transform: uppercase;
  }

  .yp-promo-panel p {
    margin: 0 0 20px;
    color: rgba(255, 255, 255, 0.76);
    font-weight: 800;
  }

  .yp-view-button {
    display: inline-flex;
    min-height: 48px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 0 28px;
    background: #ffd000;
    color: #050505;
    font-weight: 950;
    box-shadow: 0 14px 36px rgba(255, 208, 0, 0.24);
  }

  .yp-arrow {
    position: absolute;
    top: 50%;
    z-index: 6;
    width: 48px;
    height: 48px;
    transform: translateY(-50%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    background: rgba(8, 12, 10, 0.68);
    color: white;
    cursor: pointer;
    display: grid;
    place-items: center;
    font-size: 2rem;
    line-height: 1;
    backdrop-filter: blur(12px);
  }

  .yp-arrow:hover {
    border-color: rgba(255, 208, 0, 0.48);
    background: rgba(0, 0, 0, 0.84);
  }

  .yp-arrow-left {
    left: clamp(20px, 3vw, 38px);
  }

  .yp-arrow-right {
    right: clamp(20px, 3vw, 38px);
  }

  .yp-dots {
    display: flex;
    justify-content: center;
    gap: 9px;
    margin-top: -40px;
    padding-bottom: 20px;
    position: relative;
    z-index: 8;
  }

  .yp-dots button {
    width: 10px;
    height: 36px;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.48);
    cursor: pointer;
  }

  .yp-dots button.active {
    background: #ffd000;
    box-shadow: 0 0 24px rgba(255, 208, 0, 0.7);
  }

  @media (max-width: 760px) {
    .yp-image-link,
    .yp-image-link img {
      min-height: 520px;
    }

    .yp-promo-panel {
      right: 18px;
      max-width: none;
    }

    .yp-arrow {
      width: 42px;
      height: 42px;
    }
  }
`;
