"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://yardpromoja.com"
).replace(/\/$/, "");

const planTypes = [
  "Party",
  "Food",
  "Weekend",
  "Date Night",
  "Family",
  "Business",
  "Campaign",
];

const parishes = [
  "All Jamaica",
  "Kingston",
  "St. Ann",
  "Montego Bay",
  "St. Catherine",
  "Manchester",
  "Portland",
  "Westmoreland",
  "Clarendon",
  "St. Mary",
  "Trelawny",
  "St. Elizabeth",
  "Hanover",
];

const budgets = ["Any Budget", "Free", "Budget Friendly", "Premium", "VIP"];

const rows = [
  {
    id: "main",
    number: 1,
    icon: "🎟",
    title: "Main Event",
    text: "You selected the starting point.",
    color: "green",
    keywords: [],
  },
  {
    id: "food",
    number: 2,
    icon: "🍴",
    title: "Food Before / After",
    text: "Top restaurants, food spots, and late-night options.",
    color: "gold",
    keywords: ["food", "drink", "restaurant", "brunch", "meal", "jerk", "bar"],
  },
  {
    id: "fashion",
    number: 3,
    icon: "👕",
    title: "Outfit / Fashion",
    text: "Find the perfect fit for the right night.",
    color: "purple",
    keywords: ["fashion", "clothes", "boutique", "outfit", "wear", "sale"],
  },
  {
    id: "beauty",
    number: 4,
    icon: "✂",
    title: "Beauty / Grooming",
    text: "Hair, makeup, nails, and barber near you.",
    color: "pink",
    keywords: ["beauty", "salon", "barber", "makeup", "nails", "grooming"],
  },
  {
    id: "transport",
    number: 5,
    icon: "🚕",
    title: "Transport",
    text: "Taxi, shuttle, car rental, and parking info.",
    color: "blue",
    keywords: ["transport", "taxi", "shuttle", "car rental", "parking"],
  },
  {
    id: "stay",
    number: 6,
    icon: "🛏",
    title: "Stay / Hotel",
    text: "Hotels, villas, and guest houses nearby.",
    color: "teal",
    keywords: ["hotel", "stay", "villa", "guest house", "airbnb", "resort"],
  },
  {
    id: "after",
    number: 7,
    icon: "♫",
    title: "After-party / Next Move",
    text: "Other events and after-parties happening near you.",
    color: "orange",
    keywords: ["party", "event", "dancehall", "reggae", "night", "club", "concert"],
  },
];

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isPublicAd(ad) {
  const status = normalize(ad?.status);
  return status === "active" || status === "approved";
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

function getTitle(ad) {
  return ad?.title || ad?.name || "YardPromo Promo";
}

function getSlug(ad) {
  return ad?.slug || makeSlug(getTitle(ad) || ad?.id || "yardpromo-promo");
}

function getCategory(ad) {
  return ad?.category || ad?.type || "Promo";
}

function getLocation(ad) {
  return ad?.location || ad?.venue || ad?.parish || "Jamaica";
}

function getDate(ad) {
  return ad?.event_date || ad?.date || ad?.starts_at || ad?.start_time || "";
}

function formatDate(ad) {
  const date = getDate(ad);
  const time = ad?.event_time || ad?.time || "";

  if (!date) return "Date coming soon";

  if (String(date).includes("T")) {
    try {
      const d = new Date(date);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString("en-JM", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch {
      return String(date);
    }
  }

  return `${date}${time ? ` • ${time}` : ""}`;
}

function searchableText(ad) {
  return [
    getTitle(ad),
    getCategory(ad),
    getLocation(ad),
    ad?.parish,
    ad?.venue,
    ad?.description,
    ad?.details,
    ad?.price,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function adMatchesKeywords(ad, keywords = []) {
  const text = searchableText(ad);
  return keywords.some((word) => text.includes(String(word).toLowerCase()));
}

function adMatchesSlug(ad, slug) {
  if (!slug) return false;

  const target = decodeURIComponent(String(slug));
  const targetSlug = makeSlug(target);

  return (
    String(ad?.id || "") === target ||
    String(ad?.slug || "") === target ||
    makeSlug(ad?.slug || "") === targetSlug ||
    makeSlug(getTitle(ad)) === targetSlug ||
    targetSlug.startsWith(`${makeSlug(getTitle(ad))}-`)
  );
}

function planUrl(ad) {
  const promo = ad ? `?promo=${encodeURIComponent(getSlug(ad))}` : "";
  return `${SITE_URL}/link-up${promo}`;
}

function filterByParish(ad, parish) {
  if (!parish || parish === "All Jamaica") return true;
  const text = `${getLocation(ad)} ${ad?.parish || ""}`.toLowerCase();
  return text.includes(parish.toLowerCase());
}

function derivePlanType(value) {
  const text = normalize(value);

  if (text.includes("food")) return "Food";
  if (text.includes("weekend")) return "Weekend";
  if (text.includes("campaign")) return "Campaign";
  if (text.includes("business")) return "Business";
  if (text.includes("family")) return "Family";
  if (text.includes("date")) return "Date Night";

  return "Party";
}

function MiniAd({ ad }) {
  if (!ad) return null;

  return (
    <Link className="yp-mini-ad" href={`/ad/${getSlug(ad)}`}>
      <img src={getImage(ad)} alt={getTitle(ad)} />
      <span>{getTitle(ad)}</span>
    </Link>
  );
}

export default function LinkUpClient({ initialPromoSlug = "", initialNeed = "" }) {
  const [ads, setAds] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(initialPromoSlug);
  const [planType, setPlanType] = useState(() => derivePlanType(initialNeed));
  const [parish, setParish] = useState("All Jamaica");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("Any Budget");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAds() {
      setLoading(true);

      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(80);

        if (error) {
          console.error("Link-Up Supabase error:", error.message);
          if (mounted) setAds([]);
          return;
        }

        const liveAds = (data || []).filter(isPublicAd);

        if (mounted) {
          setAds(liveAds);
          if (!selectedSlug && liveAds.length) {
            setSelectedSlug(getSlug(liveAds[0]));
          }
        }
      } catch (error) {
        console.error("Link-Up load error:", error);
        if (mounted) setAds([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAds();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedAd = useMemo(() => {
    return ads.find((ad) => adMatchesSlug(ad, selectedSlug)) || ads[0] || null;
  }, [ads, selectedSlug]);

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => filterByParish(ad, parish));
  }, [ads, parish]);

  const planRows = useMemo(() => {
    const selectedKey = selectedAd ? getSlug(selectedAd) : "";

    return rows.map((row) => {
      if (row.id === "main") {
        return {
          ...row,
          items: selectedAd ? [selectedAd] : [],
        };
      }

      const matches = filteredAds
        .filter((ad) => getSlug(ad) !== selectedKey)
        .filter((ad) => adMatchesKeywords(ad, row.keywords))
        .slice(0, 3);

      return {
        ...row,
        items: matches,
      };
    });
  }, [filteredAds, selectedAd]);

  const suggestions = useMemo(() => {
    const selectedKey = selectedAd ? getSlug(selectedAd) : "";
    return filteredAds
      .filter((ad) => getSlug(ad) !== selectedKey)
      .slice(0, 5);
  }, [filteredAds, selectedAd]);

  const offers = useMemo(() => {
    return filteredAds
      .filter((ad) =>
        adMatchesKeywords(ad, ["sale", "deal", "discount", "offer", "special"])
      )
      .slice(0, 4);
  }, [filteredAds]);

  function handlePlan(event) {
    event.preventDefault();

    const keywordMap = {
      Party: ["party", "event", "dancehall", "reggae", "concert", "night"],
      Food: ["food", "restaurant", "brunch", "drink"],
      Weekend: ["weekend", "party", "event"],
      "Date Night": ["date", "restaurant", "dinner", "lounge"],
      Family: ["family", "kids", "community"],
      Business: ["business", "service", "shop"],
      Campaign: ["campaign", "giveaway", "vote", "win"],
    };

    const match =
      filteredAds.find((ad) => adMatchesKeywords(ad, keywordMap[planType])) ||
      filteredAds[0];

    if (match) {
      setSelectedSlug(getSlug(match));
      setNotice("Your link-up plan was updated.");
    } else {
      setNotice("No matching promos yet. Browse promos to start your plan.");
    }
  }

  async function copyPlanLink() {
    try {
      await navigator.clipboard.writeText(planUrl(selectedAd));
      setNotice("Plan link copied.");
    } catch {
      setNotice("Unable to copy the plan link.");
    }
  }

  function shareWhatsApp() {
    const text = selectedAd
      ? `Plan the link-up around ${getTitle(selectedAd)}: ${planUrl(selectedAd)}`
      : `Plan the link-up with YardPromoJa: ${planUrl(null)}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        planUrl(selectedAd)
      )}`,
      "_blank"
    );
  }

  function downloadPlan() {
    const lines = [
      "YardPromoJa Link-Up Plan",
      "=========================",
      selectedAd ? `Main Event: ${getTitle(selectedAd)}` : "Main Event: Not selected",
      selectedAd ? `Location: ${getLocation(selectedAd)}` : "",
      selectedAd ? `Date: ${formatDate(selectedAd)}` : "",
      "",
      ...planRows.map((row) => {
        const names = row.items.length
          ? row.items.map((item) => getTitle(item)).join(", ")
          : "No matching promos yet";
        return `${row.number}. ${row.title}: ${names}`;
      }),
      "",
      `Plan link: ${planUrl(selectedAd)}`,
    ].filter(Boolean);

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yardpromoja-link-up-plan.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function savePlan() {
    try {
      localStorage.setItem(
        "yardpromoja-linkup-plan",
        JSON.stringify({
          selectedSlug: selectedAd ? getSlug(selectedAd) : "",
          planType,
          parish,
          date,
          budget,
          savedAt: new Date().toISOString(),
        })
      );
      setNotice("Plan saved on this device.");
    } catch {
      setNotice("Unable to save this plan on this device.");
    }
  }

  return (
    <div className="yp-linkup-page">
      <section className="yp-linkup-hero">
        <div className="container">
          <p className="yp-mini-kicker">YardPromoJa planner</p>
          <h1>
            Plan the <span>Link-Up</span>
          </h1>
          <p>
            Build the perfect plan around any event, promo, or weekend move.
            We’ll help you with food, fashion, transport, stays, deals and more.
          </p>

          <form className="yp-linkup-filters" onSubmit={handlePlan}>
            <label>
              <span>What are you planning?</span>
              <select value={planType} onChange={(event) => setPlanType(event.target.value)}>
                {planTypes.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Parish / Location</span>
              <select value={parish} onChange={(event) => setParish(event.target.value)}>
                {parishes.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Date</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>

            <label>
              <span>Budget</span>
              <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                {budgets.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" className="yp-btn yp-btn-gold">
              Plan My Link-Up →
            </button>
          </form>
        </div>
      </section>

      <section className="yp-linkup-section">
        <div className="container yp-linkup-featured-grid">
          <div className="yp-dark-card yp-linkup-featured">
            <p className="yp-kicker">★ Featured starting point</p>

            {loading ? (
              <div className="yp-empty-dark">Loading active promos...</div>
            ) : selectedAd ? (
              <div className="yp-featured-event">
                <img src={getImage(selectedAd)} alt={getTitle(selectedAd)} />

                <div>
                  <h2>{getTitle(selectedAd)}</h2>
                  <p className="yp-feature-meta">📍 {getLocation(selectedAd)}</p>
                  <p className="yp-feature-meta">📅 {formatDate(selectedAd)}</p>

                  <div className="yp-feature-actions">
                    <button
                      type="button"
                      className="yp-btn yp-btn-green"
                      onClick={() => {
                        setSelectedSlug(getSlug(selectedAd));
                        setNotice("This promo is now your starting point.");
                      }}
                    >
                      Use this event as my plan
                    </button>

                    <Link className="yp-btn yp-btn-outline" href={`/ad/${getSlug(selectedAd)}`}>
                      View Promo
                    </Link>

                    <Link className="yp-btn yp-btn-outline" href={`/ad/${getSlug(selectedAd)}#rsvp`}>
                      RSVP
                    </Link>

                    <button type="button" className="yp-btn yp-btn-outline" onClick={savePlan}>
                      Save Date
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="yp-empty-dark">
                Choose a promo from Browse to start your link-up plan.
              </div>
            )}
          </div>

          <aside className="yp-dark-card yp-about-event">
            <p className="yp-kicker">About this event</p>

            {selectedAd ? (
              <>
                <p>
                  {selectedAd?.description ||
                    selectedAd?.details ||
                    "This promo can become the starting point for a complete YardPromoJa link-up plan."}
                </p>

                <ul>
                  <li>♫ {getCategory(selectedAd)}</li>
                  <li>📍 {getLocation(selectedAd)}</li>
                  <li>🎟 {selectedAd?.price || selectedAd?.ticket_price || "Contact for details"}</li>
                  <li>👥 {selectedAd?.age || selectedAd?.age_limit || "All guests as allowed by promoter"}</li>
                </ul>

                <div className="yp-social-mini">
                  <button type="button" onClick={shareWhatsApp}>WhatsApp</button>
                  <button type="button" onClick={shareFacebook}>Facebook</button>
                  <button type="button" onClick={copyPlanLink}>Copy</button>
                </div>
              </>
            ) : (
              <p className="muted">Select a promo to see details here.</p>
            )}
          </aside>
        </div>
      </section>

      <section className="yp-linkup-section">
        <div className="container yp-linkup-main-grid">
          <div className="yp-dark-card yp-linkup-plan">
            <div className="yp-section-head">
              <div>
                <p className="yp-kicker">Your Link-Up Plan</p>
                <h2>Build the full move.</h2>
              </div>
            </div>

            <div className="yp-linkup-plan-rows">
              {planRows.map((row) => (
                <div className={`yp-linkup-plan-row ${row.color}`} key={row.id}>
                  <span className="yp-row-number">{row.number}</span>

                  <div className="yp-row-icon">{row.icon}</div>

                  <div className="yp-row-copy">
                    <strong>{row.title}</strong>
                    <span>{row.text}</span>
                  </div>

                  <div className="yp-row-items">
                    {row.items.length ? (
                      row.items.map((item) => <MiniAd ad={item} key={`${row.id}-${getSlug(item)}`} />)
                    ) : (
                      <span className="yp-row-empty">No matching promos yet</span>
                    )}
                  </div>

                  <Link
                    className="yp-row-view"
                    href={
                      row.id === "main" && selectedAd
                        ? `/ad/${getSlug(selectedAd)}`
                        : `/browse?category=${encodeURIComponent(row.title)}`
                    }
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <aside className="yp-linkup-sidebar">
            <div className="yp-dark-card">
              <p className="yp-kicker">Smart suggestions for you</p>

              <div className="yp-side-list">
                {suggestions.length ? (
                  suggestions.map((ad) => (
                    <Link href={`/ad/${getSlug(ad)}`} key={`suggestion-${getSlug(ad)}`}>
                      <img src={getImage(ad)} alt={getTitle(ad)} />
                      <span>
                        <strong>{getTitle(ad)}</strong>
                        <em>{getLocation(ad)}</em>
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="yp-empty-dark small">No suggestions yet.</div>
                )}
              </div>

              <Link className="yp-btn yp-btn-green yp-full-btn" href="/browse">
                See More Suggestions
              </Link>
            </div>

            <div className="yp-dark-card">
              <p className="yp-kicker">Deals & Offers</p>

              <div className="yp-side-list compact">
                {offers.length ? (
                  offers.map((ad) => (
                    <Link href={`/ad/${getSlug(ad)}`} key={`offer-${getSlug(ad)}`}>
                      <img src={getImage(ad)} alt={getTitle(ad)} />
                      <span>
                        <strong>{getTitle(ad)}</strong>
                        <em>{ad?.price || "View offer"}</em>
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="yp-empty-dark small">No sale offers yet.</div>
                )}
              </div>

              <Link className="yp-btn yp-btn-outline yp-full-btn" href="/browse?category=Sale">
                View All Offers
              </Link>
            </div>

            <div className="yp-dark-card yp-plan-summary">
              <p className="yp-kicker">Your plan summary</p>
              <div>
                <strong>{planRows.length}</strong>
                <span>Categories</span>
              </div>
              <div>
                <strong>{planRows.reduce((total, row) => total + row.items.length, 0)}</strong>
                <span>Options Found</span>
              </div>
              <button type="button" className="yp-btn yp-btn-gold yp-full-btn" onClick={savePlan}>
                Save Plan
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section className="yp-linkup-section">
        <div className="container yp-dark-card yp-linkup-share">
          <div>
            <p className="yp-kicker">Share your plan</p>
            <h2>Let your crew know where the vibe is.</h2>
          </div>

          <div className="yp-share-buttons">
            <button type="button" className="yp-btn yp-btn-green" onClick={shareWhatsApp}>
              Share on WhatsApp
            </button>
            <button type="button" className="yp-btn yp-btn-blue" onClick={shareFacebook}>
              Share on Facebook
            </button>
            <button type="button" className="yp-btn yp-btn-outline" onClick={copyPlanLink}>
              Copy Plan Link
            </button>
            <button type="button" className="yp-btn yp-btn-outline" onClick={downloadPlan}>
              Download Plan
            </button>
          </div>
        </div>
      </section>

      <section className="yp-linkup-section">
        <div className="container yp-linkup-bottom-cta">
          <Link href="/create">
            <strong>Post Your Promo</strong>
            <span>Get seen. Get booked. Grow your brand.</span>
          </Link>
          <Link href="/advertise">
            <strong>Advertise With Us</strong>
            <span>Promote your business to Jamaican audiences.</span>
          </Link>
          <Link href="/contact">
            <strong>Need Help?</strong>
            <span>Contact the YardPromoJa team.</span>
          </Link>
        </div>
      </section>

      {notice ? <div className="yp-toast">{notice}</div> : null}
    </div>
  );
}
