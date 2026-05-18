"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabaseClient";

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
  return ad?.interested_count || ad?.interested || ad?.views || 0;
}

function getRsvps(ad) {
  return ad?.rsvp_count || ad?.rsvps || ad?.replies || 0;
}

function getHeat(ad) {
  return ad?.heat_score || ad?.heat || "0/100";
}

function getPrice(ad) {
  return ad?.price || ad?.ticket_price || ad?.cost || "Contact for details";
}

function normalizeAd(ad, index) {
  return {
    id: ad?.id || `live-${index}`,
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
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAds() {
      setLoading(true);

      if (providedAds && providedAds.length) {
        if (mounted) {
          setAds(providedAds.slice(0, limit).map(normalizeAd));
          setLoading(false);
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

        if (error) {
          console.error("AdsGrid Supabase error:", error.message);
          if (mounted) {
            setAds([]);
            setLoading(false);
          }
          return;
        }

        if (data && data.length > 0) {
          if (mounted) {
            setAds(data.slice(0, limit).map(normalizeAd));
            setLoading(false);
          }
          return;
        }

        // If Premium or Weekend has no selected ads yet,
        // show newest live ads instead of showing demo data.
        if (section === "premium" || section === "weekend") {
          const { data: fallbackLiveAds, error: fallbackError } = await supabase
            .from("ads")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

          if (fallbackError) {
            console.error("AdsGrid fallback Supabase error:", fallbackError.message);
            if (mounted) {
              setAds([]);
              setLoading(false);
            }
            return;
          }

          if (fallbackLiveAds && fallbackLiveAds.length > 0) {
            if (mounted) {
              setAds(fallbackLiveAds.slice(0, limit).map(normalizeAd));
              setLoading(false);
            }
            return;
          }
        }

        if (mounted) {
          setAds([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("AdsGrid load error:", error);
        if (mounted) {
          setAds([]);
          setLoading(false);
        }
      }
    }

    loadAds();

    return () => {
      mounted = false;
    };
  }, [limit, providedAds, section]);

  if (loading) {
    return (
      <div className="empty">
        <h3>Loading promos...</h3>
        <p className="muted">Fetching the latest YardPromo listings.</p>
      </div>
    );
  }

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