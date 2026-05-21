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
  "Montego Bay",
];

const categoryOptions = categories?.length
  ? categories
  : [
      "Party",
      "Dancehall",
      "Reggae",
      "Concert",
      "Business",
      "Food",
      "Sale",
      "Beauty",
      "Fashion",
      "Transport",
      "Hotel",
    ];

function makeSlug(value) {
  return String(value || "yardpromo-promo")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  return ad?.slug || makeSlug(ad?.title || ad?.name || ad?.id || "yardpromo-promo");
}

function getTitle(ad) {
  return ad?.title || ad?.name || "YardPromo Promo";
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
  const time = ad?.event_time || ad?.time || "";

  if (!value) return "Coming soon";

  try {
    const d = new Date(String(value).includes("T") ? value : `${value}T00:00:00`);

    if (!Number.isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}${time ? ` • ${time}` : ""}`;
    }
  } catch {
    // Fall through to plain value.
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
  return `${getHeatNumber(ad)}/100`;
}

function getPrice(ad) {
  return ad?.price || ad?.ticket_price || ad?.cost || "Contact for details";
}

function isPublicLiveAd(ad) {
  const status = String(ad?.status || "").toLowerCase();
  return status === "active" || status === "approved";
}

function searchableText(ad) {
  return [
    ad?.title,
    ad?.name,
    ad?.category,
    ad?.type,
    ad?.venue,
    ad?.location,
    ad?.parish,
    ad?.description,
    ad?.details,
    ad?.price,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesCategory(ad, category) {
  if (!category) return true;

  const wanted = String(category).toLowerCase();
  const text = searchableText(ad);
  const directCategory = String(ad?.category || ad?.type || "").toLowerCase();

  const aliases = {
    party: ["party", "dancehall", "nightlife", "event", "fete"],
    events: ["party", "dancehall", "reggae", "concert", "stage show", "event"],
    concert: ["concert", "reggae", "stage show", "live"],
    sale: ["sale", "deal", "discount", "offer", "special"],
    hotel: ["hotel", "stay", "villa", "guest house", "resort"],
    transport: ["transport", "taxi", "shuttle", "car rental", "parking"],
  };

  const words = aliases[wanted] || [wanted];

  return words.some((word) => directCategory.includes(word) || text.includes(word));
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
  const value = String(ad?.price || ad?.ticket_price || ad?.cost || "").toLowerCase();

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
  return searchableText(ad).includes(String(q).toLowerCase());
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
    trendingScore:
      getHeatNumber(ad) * 5 +
      getInterested(ad) * 3 +
      getRsvps(ad) * 4 +
      Number(ad?.views || 0) * 0.25 +
      Number(ad?.shares || 0) * 2 +
      (ad?.is_featured || ad?.featured ? 25 : 0),
    created_at: ad?.created_at || "",
    is_featured: ad?.is_featured ?? ad?.featured ?? false,
    raw: ad,
  };
}

function buildBrowseHref({ category = "", parish = "", price = "", sort = "", q = "" }) {
  const params = new URLSearchParams();

  if (category) params.set("category", category);
  if (parish) params.set("parish", parish);
  if (price) params.set("price", price);
  if (sort) params.set("sort", sort);
  if (q) params.set("q", q);

  const query = params.toString();
  return query ? `/browse?${query}` : "/browse";
}

function PromoBrowseCard({ ad }) {
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

        <div className="promo-card-actions">
          <Link className="details-btn btn btn-primary" href={`/ad/${ad.slug}`}>
            View Details
          </Link>

          <Link
            className="btn btn-light yp-plan-card-btn"
            href={`/link-up?promo=${encodeURIComponent(ad.slug)}`}
          >
            Plan Link-Up
          </Link>
        </div>
      </div>
    </article>
  );
}

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const parish = searchParams.get("parish") || "";
  const price = searchParams.get("price") || "";
  const sort = searchParams.get("sort") || "";
  const q = searchParams.get("q") || searchParams.get("search") || "";

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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
    let mounted = true;

    async function loadAds() {
      setLoading(true);
      setLoadError("");

      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (mounted) {
          setAds((data || []).filter(isPublicLiveAd).map(normalizeAd));
        }
      } catch (error) {
        console.error("Browse load error:", error);

        if (mounted) {
          setLoadError(error?.message || "Unable to load promos right now.");
          setAds([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAds();

    return () => {
      mounted = false;
    };
  }, []);

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

  function applyFilters(event) {
    event.preventDefault();
    router.push(
      buildBrowseHref({
        category: categoryValue,
        parish: parishValue,
        price: priceValue,
        sort: sortValue === "trending" ? "trending" : "",
        q: searchText.trim(),
      }),
      { scroll: false }
    );
  }

  function clearFilters() {
    setSearchText("");
    setCategoryValue("");
    setParishValue("");
    setSortValue("newest");
    setPriceValue("");
    router.push("/browse", { scroll: false });
  }

  const activeLabelParts = [];
  if (category) activeLabelParts.push(category);
  if (parish) activeLabelParts.push(parish);
  if (price) activeLabelParts.push(price);
  if (sort === "trending") activeLabelParts.push("Trending");
  if (q) activeLabelParts.push(q);

  const activeLabel = activeLabelParts.length ? activeLabelParts.join(" / ") : "All promos";

  const quickLinks = [
    { label: "All", href: "/browse", active: !category && !parish && !price && !sort && !q },
    { label: "Trending", href: buildBrowseHref({ category, parish, price, sort: "trending", q }), active: sort === "trending" },
    { label: "Food", href: buildBrowseHref({ category: "Food", parish, price, sort, q }), active: category === "Food" },
    { label: "Dancehall", href: buildBrowseHref({ category: "Dancehall", parish, price, sort, q }), active: category === "Dancehall" },
    { label: "Sale Offers", href: buildBrowseHref({ category: "Sale", parish, price, sort, q }), active: category === "Sale" },
    { label: "Kingston", href: buildBrowseHref({ category, parish: "Kingston", price, sort, q }), active: parish === "Kingston" },
    { label: "St. James", href: buildBrowseHref({ category, parish: "St. James", price, sort, q }), active: parish === "St. James" },
    { label: "Free entry", href: buildBrowseHref({ category, parish, price: "free", sort, q }), active: price === "free" },
  ];

  return (
    <section className="section yp-browse-page">
      <div className="yp-container">
        <div className="page-hero yp-browse-hero">
          <p className="kicker" style={{ color: "#f7c600" }}>Browse</p>
          <h1>Search active YardPromoJa listings.</h1>
          <p>
            Explore live events, services, food, campaigns, sale offers, and local
            promos across Jamaica.
          </p>
        </div>

        <form className="browse-search-panel yp-browse-search-panel" onSubmit={applyFilters}>
          <label>
            Search
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search promos, food, events, places…"
            />
          </label>

          <label>
            Category
            <select value={categoryValue} onChange={(event) => setCategoryValue(event.target.value)}>
              <option value="">All categories</option>
              {categoryOptions.map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
              <option value="Sale">Sale Offers</option>
              <option value="Fashion">Fashion</option>
              <option value="Transport">Transport</option>
              <option value="Hotel">Stay / Hotel</option>
            </select>
          </label>

          <label>
            Parish
            <select value={parishValue} onChange={(event) => setParishValue(event.target.value)}>
              <option value="">All Jamaica</option>
              {parishes.map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Sort
            <select value={sortValue} onChange={(event) => setSortValue(event.target.value)}>
              <option value="newest">Newest</option>
              <option value="trending">Trending</option>
            </select>
          </label>

          <label>
            Price
            <select value={priceValue} onChange={(event) => setPriceValue(event.target.value)}>
              <option value="">Any price</option>
              <option value="free">Free entry</option>
            </select>
          </label>

          <div className="browse-filter-actions">
            <button className="btn btn-primary" type="submit">Search / Apply</button>
            <button className="btn btn-light" type="button" onClick={clearFilters}>Clear</button>
          </div>
        </form>

        <div className="browse-quick-row yp-browse-quick-row">
          {quickLinks.map((item) => (
            <Link
              className={`mood-pill ${item.active ? "is-active" : ""}`}
              href={item.href}
              scroll={false}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
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
            <p className="muted">Fetching live YardPromoJa listings.</p>
          </div>
        ) : null}

        {!loading && loadError ? (
          <div className="empty">
            <h3>Promos could not load</h3>
            <p className="muted">{loadError}</p>
          </div>
        ) : null}

        {!loading && !loadError && filteredAds.length === 0 ? (
          <div className="empty">
            <h3>No promos found</h3>
            <p className="muted">
              Try another search, parish, category, or clear the filters to view all promos.
            </p>
          </div>
        ) : null}

        {!loading && !loadError && filteredAds.length > 0 ? (
          <div className="ads-grid grid grid-3">
            {filteredAds.map((ad, index) => (
              <PromoBrowseCard key={ad.id || ad.slug || index} ad={ad} />
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
        <section className="section yp-browse-page">
          <div className="yp-container empty">
            <h3>Loading browse...</h3>
            <p className="muted">Preparing YardPromoJa listings.</p>
          </div>
        </section>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
