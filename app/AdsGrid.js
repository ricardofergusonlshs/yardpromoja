"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabaseClient";
import { sampleAds as fallbackAds } from "../lib/yardpromoData";

function getImage(ad) {
  return (
    ad?.poster_image_url ||
    ad?.image_url ||
    ad?.posterUrl ||
    ad?.image ||
    "/assets/yardpromo-brand-preview.png"
  );
}

function getSlug(ad) {
  if (ad?.slug) return ad.slug;

  const title = ad?.title || ad?.name || ad?.id || "yardpromo-event";

  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTitle(ad) {
  return ad?.title || ad?.name || "YardPromo Event";
}

function getCategory(ad) {
  return ad?.category || ad?.type || "Promo";
}

function getLocation(ad) {
  return ad?.location || ad?.venue || ad?.parish || "Jamaica";
}

function getDate(ad) {
  return (
    ad?.event_date ||
    ad?.date ||
    ad?.starts_at ||
    ad?.start_time ||
    ad?.eventDate ||
    ""
  );
}

function formatDate(ad) {
  const value = getDate(ad);

  if (!value) return "Coming soon";

  try {
    const d = new Date(value);

    if (!Number.isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");

      return `${yyyy}-${mm}-${dd} • ${hh}:${min}`;
    }
  } catch {
    // Use fallback below.
  }

  return String(value);
}

function getInterested(ad) {
  return ad?.interested_count || ad?.interested || ad?.views || 286;
}

function getRsvps(ad) {
  return ad?.rsvp_count || ad?.rsvps || ad?.replies || 74;
}

function getHeat(ad) {
  return ad?.heat_score || ad?.heat || "100/100";
}

function getPrice(ad) {
  return ad?.price || ad?.ticket_price || ad?.cost || "JMD $2,500 presold";
}

function normalizeAd(ad, index) {
  return {
    id: ad?.id || `fallback-${index}`,
    slug: getSlug(ad),
    title: getTitle(ad),
    category: getCategory(ad),
    location: getLocation(ad),
    image: getImage(ad),
    date: formatDate(ad),
    interested: getInterested(ad),
    rsvps: getRsvps(ad),
    heat: getHeat(ad),
    price: getPrice(ad),
    is_featured: ad?.is_featured ?? ad?.featured ?? false,
  };
}

export default function AdsGrid({ limit = 6, ads: providedAds, section = "" }) {
  const safeFallbackAds = Array.isArray(fallbackAds) ? fallbackAds : [];

  const [ads, setAds] = useState(() =>
    (providedAds && providedAds.length ? providedAds : safeFallbackAds)
      .slice(0, limit)
      .map(normalizeAd)
  );

  useEffect(() => {
    let mounted = true;

    async function loadAds() {
      if (providedAds && providedAds.length) {
        if (mounted) {
          setAds(providedAds.slice(0, limit).map(normalizeAd));
        }
        return;
      }

      try {
        const supabase = createClient();

        let query = supabase
  .from("ads")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(limit);

if (section === "premium") {
  query = query.eq("is_premium", true);
}

if (section === "weekend") {
  query = query.eq("is_weekend_pick", true);
}

if (section === "featured") {
  query = query.eq("is_featured", true);
}

const { data, error } = await query;

        if (error || !data || data.length === 0) {
          if (mounted) {
            setAds(safeFallbackAds.slice(0, limit).map(normalizeAd));
          }
          return;
        }

        if (mounted) {
          setAds(data.slice(0, limit).map(normalizeAd));
        }
      } catch {
        if (mounted) {
          setAds(safeFallbackAds.slice(0, limit).map(normalizeAd));
        }
      }
    }

    loadAds();

    return () => {
      mounted = false;
    };
  }, [limit, providedAds, safeFallbackAds]);

  if (!ads || ads.length === 0) {
    return (
      <div className="empty">
        <h3>No promos yet</h3>
        <p className="muted">Promos will appear here soon.</p>
      </div>
    );
  }

  return (
    <div className={`ads-grid grid ${limit === 2 ? "grid-2" : "grid-3"}`}>
      {ads.map((ad, index) => (
        <article className="promo-card card" key={ad.id || ad.slug || index}>
          <Link
            href={`/ad/${ad.slug}`}
            className="promo-media card-img"
            aria-label={`View ${ad.title}`}
          >
            <img src={ad.image} alt={ad.title} />

            {ad.is_featured && (
              <span className="featured-badge featured-tag">Featured</span>
            )}

            <span className="date-pill">{ad.date}</span>
          </Link>

          <div className="promo-body card-body">
            <p className="promo-category meta">{ad.category}</p>

            <h3>{ad.title}</h3>

            <p className="promo-location location-chip">{ad.location}</p>

            <div className="promo-stats promo-mini-stats">
              <span>{ad.interested} interested</span>
              <span>{ad.rsvps} RSVPs</span>
              <span>{ad.heat} Heat</span>
            </div>

            <p className="promo-date">{ad.date}</p>
            <p className="promo-price">{ad.price}</p>

            <Link className="details-btn btn btn-primary" href={`/ad/${ad.slug}`}>
              View Details
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}