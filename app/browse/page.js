"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { categories } from "@/lib/yardpromoData";

const parishes = [
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

const categoryOptions = categories?.length
  ? categories
  : ["Party", "Dancehall", "Reggae", "Concert", "Business", "Food"];

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

function getParish(ad) {
  return ad?.parish || ad?.location || ad?.venue || "Jamaica";
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

      return `${yyyy}-${mm}-${dd}${
        ad?.event_time ? ` • ${ad.event_time}` : ""
      }`;
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

function getHeatNumber(ad) {
  const raw = ad?.heat_score || ad?.heat || 0;

  if (typeof raw === "string" && raw.includes("/")) {
    return Number(raw.split("/")[0]) || 0;
  }

  return Number(raw) || 0;
}

function getHeat(ad) {
  const heat = getHeatNumber(ad);
  return `${heat}/100`;
}

function getPrice(ad) {
  return ad?.price || ad?.ticket_price || ad?.cost || "Contact for details";
}

function getTrendingScore(ad) {
  const heat = getHeatNumber(ad);
  const interested = Number(ad?.interested_count || ad?.interested || 0);
  const rsvps = Number(ad?.rsvp_count || ad?.rsvps || 0);
  const views = Number(ad?.views || 0);
  const clicks = Number(ad?.clicks || 0);
  const shares = Number(ad?.shares || 0);
  const featuredBoost = ad?.is_featured || ad?.featured ? 25 : 0;

  return (
    heat * 5 +
    rsvps * 4 +
    interested * 3 +
    views * 0.25 +
    clicks * 0.5 +
    shares * 2 +
    featuredBoost
  );
}

function normalizeAd(ad, index) {
  return {
    id: ad?.id || `ad-${index}`,
    slug: getSlug(ad),
    title: getTitle(ad),
    category: getCategory(ad),
    parish: getParish(ad),
    location: getLocation(ad),
    image: getImage(ad),
    date: formatDate(ad),
    created_at: ad?.created_at || "",
    interested: getInterested(ad),
    rsvps: getRsvps(ad),
    heat: getHeat(ad),
    price: getPrice(ad),
    trendingScore: getTrendingScore(ad),
    is_featured: ad?.is_featured ?? ad?.featured ?? false,
    raw: ad,
  };
}

function isPublicLiveAd(ad) {
  const status = String(ad?.status || "").toLowerCase();
  return status === "active" || status === "approved";
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

function matchesParish(ad, parish) {
  if (!parish) return true;

  const wanted = String(parish).toLowerCase();

  return [ad?.parish, ad?.location, ad?.venue]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(wanted));
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

function buildBrowseHref({ category, parish, price, sort, q }) {
  const params = new URLSearchParams();

  if (category) params.set("category", category);
  if (parish) params.set("parish", parish);
  if (price) params.set("price", price);
  if (sort) params.set("sort", sort);
  if (q) params.set("q", q);

  const query = params.toString();

  return query ? `/browse?${query}` : "/browse";
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

function QuickChip({ href, active, children }) {
  return (
    <Link
      className={`mood-pill ${active ? "is-active" : ""}`}
      href={href}
      scroll={false}
    >
      {children}
    </Link>
  );
}

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const parish = searchParams.get("parish") || "";
  const price = searchParams.get("price") || "";
  const sort = searchParams.get("sort") || "";
  const q = searchParams.get("q") || "";

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState(q);
  const [categoryValue, setCategoryValue] = useState(category);
  const [parishValue, setParishValue] = useState(parish);
  const [sortValue, setSortValue] = useState(sort || "newest");
  const [priceValue, setPriceValue] = useState(price);

  useEffect(() => {
    setSearchText(q);
    setCategoryValue(category);
    setParishValue(parish);
    setSortValue(sort || "newest");
    setPriceValue(price);
  }, [category, parish, price, q, sort]);

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

  function applyFilters(event) {
    event.preventDefault();

    const href = buildBrowseHref({
      category: categoryValue,
      parish: parishValue,
      price: priceValue,
      sort: sortValue === "trending" ? "trending" : "",
      q: searchText.trim(),
    });

    router.push(href, { scroll: false });
  }

  function clearFilters() {
    setSearchText("");
    setCategoryValue("");
    setParishValue("");
    setSortValue("newest");
    setPriceValue("");

    router.push("/browse", { scroll: false });
  }

  const filteredAds = useMemo(() => {
    const list = ads.filter((ad) => {
      const raw = ad.raw || ad;

      return (
        matchesCategory(raw, category) &&
        matchesParish(raw, parish) &&
        matchesPrice(raw, price) &&
        matchesSearch(raw, q)
      );
    });

    if (sort === "trending") {
      return [...list].sort((a, b) => b.trendingScore - a.trendingScore);
    }

    return [...list].sort((a, b) => {
      const bTime = new Date(b.created_at || 0).getTime();
      const aTime = new Date(a.created_at || 0).getTime();
      return bTime - aTime;
    });
  }, [ads, category, parish, price, q, sort]);

  const activeLabelParts = [];

  if (category) activeLabelParts.push(category);
  if (parish) activeLabelParts.push(parish);
  if (price) activeLabelParts.push(price);
  if (sort === "trending") activeLabelParts.push("Trending");
  if (q) activeLabelParts.push(q);

  const activeLabel = activeLabelParts.length
    ? activeLabelParts.join(" / ")
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

        <form className="browse-search-panel" onSubmit={applyFilters}>
          <div className="browse-search-main">
            <label>
              Search
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search promos, venues, parishes…"
              />
            </label>
          </div>

          <div className="browse-filter-selects">
            <label>
              Category
              <select
                value={categoryValue}
                onChange={(e) => setCategoryValue(e.target.value)}
              >
                <option value="">All categories</option>
                {categoryOptions.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Parish
              <select
                value={parishValue}
                onChange={(e) => setParishValue(e.target.value)}
              >
                <option value="">All Jamaica</option>
                {parishes.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sort
              <select
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="trending">Trending</option>
              </select>
            </label>

            <label>
              Price
              <select
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
              >
                <option value="">Any price</option>
                <option value="free">Free entry</option>
              </select>
            </label>
          </div>

          <div className="browse-filter-actions">
            <button className="btn btn-primary" type="submit">
              Search / Apply
            </button>

            <button
              className="btn btn-light"
              type="button"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </form>

        <div className="browse-quick-row">
          <QuickChip href="/browse" active={!category && !parish && !price && !sort && !q}>
            All
          </QuickChip>

          <QuickChip
            href={buildBrowseHref({ category, parish, price, sort: "trending", q })}
            active={sort === "trending"}
          >
            Trending
          </QuickChip>

          <QuickChip
            href={buildBrowseHref({ category: "Food", parish, price, sort, q })}
            active={category === "Food"}
          >
            Food
          </QuickChip>

          <QuickChip
            href={buildBrowseHref({ category: "Dancehall", parish, price, sort, q })}
            active={category === "Dancehall"}
          >
            Dancehall
          </QuickChip>

          <QuickChip
            href={buildBrowseHref({ category, parish: "Kingston", price, sort, q })}
            active={parish === "Kingston"}
          >
            Kingston
          </QuickChip>

          <QuickChip
            href={buildBrowseHref({ category, parish: "St. James", price, sort, q })}
            active={parish === "St. James"}
          >
            St. James
          </QuickChip>

          <QuickChip
            href={buildBrowseHref({ category, parish, price: "free", sort, q })}
            active={price === "free"}
          >
            Free entry
          </QuickChip>
        </div>

        <div className="section-head browse-results-head">
          <div>
            <p className="kicker">Showing</p>
            <h2>{activeLabel}</h2>
          </div>

          <Link className="btn btn-light" href="/browse" scroll={false}>
            Clear filters
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
              Try another search, parish, category, or clear the filters to view
              all promos.
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