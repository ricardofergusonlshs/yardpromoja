"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { categories } from "@/lib/yardpromoData";

function getImage(ad) {
  return (
    ad?.poster_image_url ||
    ad?.image_url ||
    ad?.flyer_url ||
    ad?.cover_image ||
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

function getDateValue(ad) {
  return ad?.event_date || ad?.date || ad?.starts_at || ad?.start_time || "";
}

function formatDate(ad) {
  const value = getDateValue(ad);

  if (!value) return "Coming soon";

  try {
    const d = new Date(
      String(value).includes("T") ? value : `${value}T00:00:00`
    );

    if (!Number.isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");

      return `${yyyy}-${mm}-${dd}${ad?.event_time ? ` • ${ad.event_time}` : ""}`;
    }
  } catch {
    // Use fallback below.
  }

  return String(value);
}

function getInterested(ad) {
  return Number(ad?.interested_count || ad?.interested || 0);
}

function getRsvps(ad) {
  return Number(ad?.rsvp_count || ad?.rsvps || 0);
}

function getHeat(ad) {
  return ad?.heat_score || ad?.heat || "0/100";
}

function getPrice(ad) {
  return ad?.price || ad?.ticket_price || ad?.cost || "Contact for details";
}

function normalizeAd(ad, index) {
  return {
    id: ad?.id || `ad-${index}`,
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
    raw: ad,
  };
}

function isPublicLiveAd(ad) {
  const status = String(ad?.status || "").toLowerCase();

  return (
    status === "active" ||
    status === "approved" ||
    status === "published"
  );
}

function matchesCategory(ad, category) {
  if (!category) return true;

  const wanted = String(category).toLowerCase();
  const adCategory = String(ad?.category || ad?.type || "").toLowerCase();
  const title = String(ad?.title || ad?.name || "").toLowerCase();
  const description = String(ad?.description || "").toLowerCase();

  if (wanted === "party") {
    return (
      adCategory.includes("party") ||
      adCategory.includes("dancehall") ||
      title.includes("party") ||
      description.includes("party")
    );
  }

  if (wanted === "concert") {
    return (
      adCategory.includes("concert") ||
      adCategory.includes("reggae") ||
      adCategory.includes("stage show") ||
      title.includes("concert") ||
      title.includes("live")
    );
  }

  return (
    adCategory.includes(wanted) ||
    title.includes(wanted) ||
    description.includes(wanted)
  );
}

function matchesPrice(ad, price) {
  if (!price) return true;

  const wanted = String(price).toLowerCase();
  const value = String(
    ad?.price || ad?.ticket_price || ad?.cost || ""
  ).toLowerCase();

  if (wanted === "free") {
    return (
      value.includes("free") ||
      value === "0" ||
      value === "jmd 0" ||
      value === "$0" ||
      ad?.free_entry === true
    );
  }

  return value.includes(wanted);
}

function matchesSearch(ad, q) {
  if (!q) return true;

  const wanted = String(q).toLowerCase();

  return [
    ad?.title,
    ad?.name,
    ad?.category,
    ad?.type,
    ad?.venue,
    ad?.location,
    ad?.parish,
    ad?.description,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(wanted));
}

function BrowseCard({ ad }) {
  return (
    <article className="promo-card card">
      <Link
        href={`/ad/${ad.slug}`}
        className="promo-media card-img"
        aria-label={`View ${ad.title}`}
      >
        <img src={ad.image} alt={ad.title} />

        {ad.is_featured ? (
          <span className="featured-badge featured-tag">Featured</span>
        ) : null}

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
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const price = searchParams.get("price") || "";
  const q = searchParams.get("q") || "";

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadAds() {
      setLoading(true);

      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (alive) {
          setAds((data || []).filter(isPublicLiveAd).map(normalizeAd));
        }
      } catch (error) {
        console.error("Browse load error:", error);

        if (alive) {
          setAds([]);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadAds();

    return () => {
      alive = false;
    };
  }, []);

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const raw = ad.raw || ad;

      return (
        matchesCategory(raw, category) &&
        matchesPrice(raw, price) &&
        matchesSearch(raw, q)
      );
    });
  }, [ads, category, price, q]);

  const activeLabel =
    category || price || q
      ? [category, price, q].filter(Boolean).join(" / ")
      : "All promos";

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero">
          <p className="kicker" style={{ color: "#f7c600" }}>
            Browse
          </p>

          <h1>Search active approved YardPromo listings.</h1>

          <p>
            Explore live events, services, venues, campaigns, and local deals
            from across Jamaica.
          </p>
        </div>

        <div className="section-head" style={{ marginTop: 28 }}>
          <div>
            <p className="kicker">Showing</p>
            <h2>{activeLabel}</h2>
          </div>

          <Link className="btn btn-light" href="/browse">
            Clear filters
          </Link>
        </div>

        <div className="mood-grid" style={{ marginBottom: 24 }}>
          <Link className="mood-pill" href="/browse">
            All
          </Link>

          {categories.slice(0, 8).map((item) => (
            <Link
              className="mood-pill"
              href={`/browse?category=${encodeURIComponent(item)}`}
              key={item}
            >
              {item}
            </Link>
          ))}

          <Link className="mood-pill" href="/browse?price=free">
            Free entry
          </Link>
        </div>

        {loading ? (
          <div className="empty">
            <h3>Loading promos...</h3>
            <p className="muted">Fetching live YardPromo listings.</p>
          </div>
        ) : null}

        {!loading && filteredAds.length === 0 ? (
          <div className="empty">
            <h3>No promos found</h3>
            <p className="muted">
              Try another category or clear the filter to view all promos.
            </p>
          </div>
        ) : null}

        {!loading && filteredAds.length > 0 ? (
          <div className="ads-grid grid grid-3">
            {filteredAds.map((ad, index) => (
              <BrowseCard key={ad.id || ad.slug || index} ad={ad} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <section className="section">
          <div className="container">
            <div className="empty">
              <h3>Loading browse...</h3>
              <p className="muted">Preparing YardPromo listings.</p>
            </div>
          </div>
        </section>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}