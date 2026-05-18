"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanRouteSlug(value) {
  return decodeURIComponent(String(value || "")).trim();
}

function isPublicLiveAd(ad) {
  const status = String(ad?.status || "").toLowerCase();
  return status === "active" || status === "approved";
}

function getPoster(ad) {
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

function getCategory(ad) {
  return ad?.category || ad?.type || "Promo";
}

function getLocation(ad) {
  return ad?.location || ad?.venue || ad?.parish || "Jamaica";
}

function getVenue(ad) {
  return ad?.venue || ad?.location || "Venue details coming soon";
}

function getParish(ad) {
  return ad?.parish || ad?.location || "Jamaica";
}

function getDateValue(ad) {
  return ad?.event_date || ad?.date || ad?.starts_at || ad?.start_time || "";
}

function formatDate(ad) {
  const value = getDateValue(ad);

  if (!value) return "Date coming soon";

  try {
    const d = new Date(String(value).includes("T") ? value : `${value}T00:00:00`);

    if (!Number.isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
  } catch {
    // Use fallback below.
  }

  return String(value);
}

function getTime(ad) {
  return ad?.event_time || ad?.time || ad?.start_time || "Time coming soon";
}

function getDateTime(ad) {
  const date = formatDate(ad);
  const time = getTime(ad);

  if (date === "Date coming soon") return date;
  if (time === "Time coming soon") return date;

  return `${date} • ${time}`;
}

function getPrice(ad) {
  return ad?.price || ad?.ticket_price || ad?.cost || "Contact for details";
}

function getInterested(ad) {
  return Number(ad?.interested_count || ad?.interested || 0);
}

function getRsvps(ad) {
  return Number(ad?.rsvp_count || ad?.rsvps || 0);
}

function getShares(ad) {
  return Number(ad?.shares || ad?.share_count || 0);
}

function getHeatNumber(ad) {
  const raw = ad?.heat_score || ad?.heat || 0;

  if (typeof raw === "string" && raw.includes("/")) {
    return Number(raw.split("/")[0]) || 0;
  }

  return Number(raw) || 0;
}

function getDescription(ad) {
  return (
    ad?.description ||
    ad?.details ||
    ad?.body ||
    "More details will be available soon. Contact the promoter for more information."
  );
}

function getPromoterName(ad) {
  return (
    ad?.promoter_name ||
    ad?.promoter ||
    ad?.business_name ||
    ad?.organizer ||
    "YardPromo promoter"
  );
}

function getPromoterPhone(ad) {
  return ad?.promoter_phone || ad?.phone || ad?.contact_phone || ad?.whatsapp || "";
}

function getWhatsApp(ad) {
  const raw =
    ad?.whatsapp ||
    ad?.promoter_whatsapp ||
    ad?.phone ||
    ad?.contact_phone ||
    "";

  return String(raw).replace(/[^\d+]/g, "");
}

function getEmail(ad) {
  return ad?.contact_email || ad?.email || ad?.promoter_email || "";
}

function getInstagram(ad) {
  return ad?.instagram || ad?.ig || ad?.instagram_url || "";
}

function getWebsite(ad) {
  return ad?.website || ad?.url || ad?.link || "";
}

function getDetailSlug(ad) {
  if (ad?.slug) return String(ad.slug);
  if (ad?.id) return String(ad.id);
  return makeSlug(getTitle(ad));
}

function getClaimPromoKey(ad) {
  return String(ad?.id || ad?.slug || getDetailSlug(ad));
}

function getDirectClaimUrl(ad) {
  return `/claim?promo=${encodeURIComponent(getClaimPromoKey(ad))}`;
}

function getClaimUrl(ad) {
  return `/login?next=${encodeURIComponent(getDirectClaimUrl(ad))}`;
}

function getDirectReportUrl(ad) {
  return `/report?promo=${encodeURIComponent(getClaimPromoKey(ad))}`;
}

function getReportUrl(ad) {
  return `/login?next=${encodeURIComponent(getDirectReportUrl(ad))}`;
}

function getSignupReportUrl(ad) {
  return `/login?mode=signup&next=${encodeURIComponent(getDirectReportUrl(ad))}`;
}

function buildMapQuery(ad) {
  return [getVenue(ad), getParish(ad), "Jamaica"].filter(Boolean).join(", ");
}

function hasUsefulLocation(ad) {
  const venue = String(getVenue(ad) || "").toLowerCase();
  const parish = String(getParish(ad) || "").toLowerCase();

  return (
    venue &&
    !venue.includes("coming soon") &&
    venue !== "jamaica" &&
    parish &&
    !parish.includes("coming soon")
  );
}

function buildGoogleMapsUrl(ad) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    buildMapQuery(ad)
  )}`;
}

function buildMapEmbedUrl(ad) {
  if (!hasUsefulLocation(ad)) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(buildMapQuery(ad))}&output=embed`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function createIcsDates(ad) {
  const rawDate = getDateValue(ad);

  if (!rawDate) return null;

  const datePart = String(rawDate).split("T")[0];
  let timePart = "09:00";
  const eventTime = getTime(ad);

  if (eventTime && eventTime !== "Time coming soon" && /^\d{1,2}:\d{2}/.test(eventTime)) {
    timePart = eventTime.slice(0, 5);
  }

  const start = new Date(`${datePart}T${timePart}:00`);

  if (Number.isNaN(start.getTime())) return null;

  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  function toIcsDate(date) {
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
      date.getUTCDate()
    )}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(
      date.getUTCSeconds()
    )}Z`;
  }

  return {
    start: toIcsDate(start),
    end: toIcsDate(end),
  };
}

function escapeIcs(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function adMatchesRoute(ad, routeSlug) {
  const target = cleanRouteSlug(routeSlug);
  const targetSlug = makeSlug(target);

  const id = String(ad?.id || "");
  const adSlug = String(ad?.slug || "");
  const titleSlug = makeSlug(getTitle(ad));
  const storedSlug = makeSlug(adSlug);

  return (
    target === id ||
    target === adSlug ||
    targetSlug === makeSlug(id) ||
    targetSlug === storedSlug ||
    targetSlug === titleSlug ||
    targetSlug === `${titleSlug}-${id}` ||
    targetSlug.startsWith(`${titleSlug}-`)
  );
}

function getCampaigns(ad) {
  const raw = ad?.campaigns || ad?.active_campaigns || ad?.campaign_list;

  if (!raw) return [];
  if (Array.isArray(raw)) return raw;

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function NotFoundContent() {
  return (
    <main className="section">
      <div className="container">
        <div className="panel" style={{ maxWidth: 780, margin: "0 auto" }}>
          <p className="kicker">YardPromo</p>
          <h1>Promo not found.</h1>
          <p className="muted">
            This promo link may be unavailable, unpublished, or removed. Browse active
            YardPromo listings instead.
          </p>

          <Link className="btn btn-primary" href="/browse">
            Browse Promos
          </Link>
        </div>
      </div>
    </main>
  );
}

function RelatedCard({ ad }) {
  const href = `/ad/${encodeURIComponent(getDetailSlug(ad))}`;

  return (
    <Link className="promo-related-card card" href={href}>
      <img src={getPoster(ad)} alt={getTitle(ad)} />

      <div>
        <p className="kicker">{getCategory(ad)}</p>
        <h3>{getTitle(ad)}</h3>
        <p className="muted">{getLocation(ad)}</p>
      </div>
    </Link>
  );
}

function ActionModal({ type, ad, onClose, onCopyClaimLink }) {
  if (!type) return null;

  const isClaim = type === "claim";

  return (
    <div className="promo-action-modal-overlay" role="dialog" aria-modal="true">
      <div className="promo-action-modal">
        <button
          type="button"
          className="promo-action-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {isClaim ? (
          <>
            <p className="kicker">Claim promo</p>
            <h2>Claim this promo.</h2>
            <p className="muted">
              Promoters can sign up or log in to verify ownership, submit promoter
              information, and manage this promo after review.
            </p>

            <div className="promo-action-modal-actions">
              <Link className="btn btn-primary" href={getClaimUrl(ad)}>
                Continue to claim
              </Link>

              <button type="button" className="btn btn-light" onClick={onCopyClaimLink}>
                Copy claim link
              </button>

              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="kicker">Report promo</p>
            <h2>Sign in to report.</h2>
            <p className="muted">
              Please sign up or log in to report this promo. This helps us prevent spam
              and follow up properly.
            </p>

            <div className="promo-action-modal-actions">
              <Link className="btn btn-primary" href={getReportUrl(ad)}>
                Log in to report
              </Link>

              <Link className="btn btn-light" href={getSignupReportUrl(ad)}>
                Create account
              </Link>

              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdDetailPage() {
  const params = useParams();
  const routeSlug = params?.slug;
  const supabase = useMemo(() => createClient(), []);

  const [ad, setAd] = useState(null);
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const [localInterested, setLocalInterested] = useState(0);
  const [localRsvps, setLocalRsvps] = useState(0);
  const [localShares, setLocalShares] = useState(0);

  const [interestDone, setInterestDone] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [sharePackOpen, setSharePackOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(true);
  const [notice, setNotice] = useState("");
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadAd() {
      setLoading(true);
      setMissing(false);

      try {
        const target = cleanRouteSlug(routeSlug);

        if (!target) {
          if (alive) {
            setAd(null);
            setMissing(true);
          }
          return;
        }

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const publicAds = (data || []).filter(isPublicLiveAd);
        const matchedAd = publicAds.find((item) => adMatchesRoute(item, target));

        if (alive) {
          setAllAds(publicAds);
          setAd(matchedAd || null);
          setMissing(!matchedAd);
          setLocalInterested(getInterested(matchedAd || {}));
          setLocalRsvps(getRsvps(matchedAd || {}));
          setLocalShares(getShares(matchedAd || {}));
        }
      } catch (error) {
        console.error("Ad detail load error:", error);

        if (alive) {
          setAd(null);
          setMissing(true);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadAd();

    return () => {
      alive = false;
    };
  }, [routeSlug, supabase]);

  const relatedAds = useMemo(() => {
    if (!ad) return [];

    const currentId = String(ad?.id || "");
    const category = String(getCategory(ad)).toLowerCase();
    const parish = String(getParish(ad)).toLowerCase();

    return allAds
      .filter((item) => String(item?.id || "") !== currentId)
      .filter((item) => {
        const itemCategory = String(getCategory(item)).toLowerCase();
        const itemParish = String(getParish(item)).toLowerCase();
        return itemCategory === category || itemParish === parish;
      })
      .slice(0, 3);
  }, [ad, allAds]);

  function markInterested() {
    if (interestDone) {
      setNotice("You already marked interest in this promo.");
      return;
    }

    setLocalInterested((count) => count + 1);
    setInterestDone(true);
    setNotice("Thanks for your interest. Share this promo with a friend.");
  }

  function markRsvp() {
    if (rsvpDone) {
      setNotice("Your RSVP interest is already noted.");
      return;
    }

    setLocalRsvps((count) => count + 1);
    setRsvpDone(true);
    setNotice("RSVP interest noted. Contact the promoter for final confirmation.");
  }

  async function copyPromoLink() {
    try {
      const link = currentUrl || window.location.href;
      await navigator.clipboard.writeText(link);
      setNotice("Promo link copied.");
    } catch {
      setNotice("Unable to copy link. Please copy it from your browser bar.");
    }
  }

  async function copyClaimLink() {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const claimLink = `${origin}${getDirectClaimUrl(ad)}`;
      await navigator.clipboard.writeText(claimLink);
      setNotice("Claim link copied. Sign up or log in to claim this promo.");
      setModalType("");
    } catch {
      setNotice("Unable to copy claim link. Use Continue to claim instead.");
    }
  }

  function saveEvent() {
    setNotice("Please log in to save events to your YardPromo account.");
  }

  function viewPromoter() {
    const section = document.getElementById("promoter-contact");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addToCalendar() {
    if (!ad) return;

    const dates = createIcsDates(ad);

    if (!dates) {
      setNotice("Calendar date is not ready for this promo yet.");
      return;
    }

    const title = getTitle(ad);
    const description = getDescription(ad);
    const location = getLocation(ad);
    const url = currentUrl || "";

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//YardPromo Jamaica//Promo Calendar//EN",
      "BEGIN:VEVENT",
      `UID:${String(ad?.id || makeSlug(title))}@yardpromoja.com`,
      `DTSTAMP:${new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")}`,
      `DTSTART:${dates.start}`,
      `DTEND:${dates.end}`,
      `SUMMARY:${escapeIcs(title)}`,
      `DESCRIPTION:${escapeIcs(description)}\\n${escapeIcs(url)}`,
      `LOCATION:${escapeIcs(location)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);

    link.href = objectUrl;
    link.download = `${makeSlug(title) || "yardpromo-event"}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(objectUrl);
    setNotice("Calendar file created.");
  }

  function shareClicked() {
    setLocalShares((count) => count + 1);
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="empty">
            <h3>Loading promo...</h3>
            <p className="muted">Fetching YardPromo details.</p>
          </div>
        </div>
      </main>
    );
  }

  if (missing || !ad) {
    return <NotFoundContent />;
  }

  const title = getTitle(ad);
  const category = getCategory(ad);
  const location = getLocation(ad);
  const venue = getVenue(ad);
  const parish = getParish(ad);
  const poster = getPoster(ad);
  const date = formatDate(ad);
  const time = getTime(ad);
  const dateTime = getDateTime(ad);
  const price = getPrice(ad);
  const description = getDescription(ad);
  const promoterName = getPromoterName(ad);
  const promoterPhone = getPromoterPhone(ad);
  const whatsapp = getWhatsApp(ad);
  const email = getEmail(ad);
  const instagram = getInstagram(ad);
  const website = getWebsite(ad);
  const campaigns = getCampaigns(ad);
  const mapEmbedUrl = buildMapEmbedUrl(ad);

  const shareUrl = currentUrl || "";
  const shareText = encodeURIComponent(`${title} on YardPromo Jamaica ${shareUrl}`);
  const whatsappShareUrl = `https://wa.me/?text=${shareText}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  const directionsUrl = buildGoogleMapsUrl(ad);

  return (
    <main className="section promo-detail-shell">
      <div className="container">
        <div className="promo-detail-hero">
          <div className="promo-detail-poster card">
            <img src={poster} alt={title} />
          </div>

          <aside className="promo-detail-panel panel">
            <div className="promo-detail-badges">
              <span>{category}</span>

              {ad?.is_featured || ad?.featured ? (
                <span className="is-featured">Featured</span>
              ) : null}

              <span>Reviewed by YardPromo</span>
              <span>Secure inquiry</span>
            </div>

            <h1>{title}</h1>

            <p className="muted promo-detail-summary">{description}</p>

            <div className="promo-detail-meta">
              <span>{dateTime}</span>
              <span>{location}</span>
              <span>{price}</span>
            </div>

            <div className="promo-stat-grid">
              <div>
                <strong>{localInterested}</strong>
                <span>Interested</span>
              </div>

              <div>
                <strong>{localRsvps}</strong>
                <span>RSVPs</span>
              </div>

              <div>
                <strong>{localShares}</strong>
                <span>Shares</span>
              </div>

              <div>
                <strong>{getHeatNumber(ad)}</strong>
                <span>Heat</span>
              </div>
            </div>

            {notice ? <div className="interest-message">{notice}</div> : null}

            <div className="promo-primary-actions">
              <button type="button" className="btn btn-light" onClick={markInterested}>
                {interestDone ? "Interested" : "I’m Interested"}
              </button>

              <button type="button" className="btn btn-primary" onClick={markRsvp}>
                {rsvpDone ? "RSVP Noted" : "RSVP"}
              </button>
            </div>

            <div className="promo-more-toggle">
              <button type="button" onClick={() => setMoreOpen((value) => !value)}>
                {moreOpen ? "▾" : "▸"} More Actions
              </button>
            </div>

            {moreOpen ? (
              <div className="promo-action-grid">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSharePackOpen((value) => !value)}
                >
                  {sharePackOpen ? "Close Share Pack" : "Open Share Pack"}
                </button>

                <button type="button" className="btn btn-light" onClick={addToCalendar}>
                  Add to calendar
                </button>

                <a className="btn btn-light" href={directionsUrl} target="_blank" rel="noreferrer">
                  Get directions
                </a>

                <button type="button" className="btn btn-light" onClick={saveEvent}>
                  Save event
                </button>

                <button type="button" className="btn btn-light" onClick={viewPromoter}>
                  View promoter
                </button>

                <button type="button" className="btn btn-light" onClick={copyPromoLink}>
                  Copy link
                </button>
              </div>
            ) : null}

            {sharePackOpen ? (
              <div className="promo-share-pack">
                <p className="kicker">Share Pack</p>
                <h3>Share this promo.</h3>

                <div className="promo-action-grid">
                  <button type="button" className="btn btn-primary" onClick={copyPromoLink}>
                    Copy promo link
                  </button>

                  <a
                    className="btn btn-light"
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={shareClicked}
                  >
                    WhatsApp
                  </a>

                  <a
                    className="btn btn-light"
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={shareClicked}
                  >
                    Facebook
                  </a>

                  <a className="btn btn-light" href={poster} target="_blank" rel="noreferrer">
                    View flyer
                  </a>
                </div>
              </div>
            ) : null}

            <div className="promo-small-links">
              <button type="button" onClick={() => setModalType("claim")}>
                Claim this promo
              </button>

              <button type="button" onClick={() => setModalType("report")}>
                Report promo
              </button>
            </div>
          </aside>
        </div>

        <div className="promo-detail-sections">
          <section className="panel promo-map-card">
            <p className="kicker">Directions</p>
            <h2>Find it on the map.</h2>

            <div className="promo-detail-list promo-map-list">
              <div>
                <strong>Venue / Location</strong>
                <span>{venue}</span>
              </div>

              <div>
                <strong>Parish</strong>
                <span>{parish}</span>
              </div>
            </div>

            {mapEmbedUrl ? (
              <iframe
                className="promo-map-frame"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${title} location map`}
              />
            ) : (
              <div className="empty promo-compact-empty">
                <h3>Directions will appear when a location is available.</h3>
              </div>
            )}

            <a className="btn btn-primary promo-wide-btn" href={directionsUrl} target="_blank" rel="noreferrer">
              Open directions
            </a>
          </section>

          <section className="panel">
            <p className="kicker">Event details</p>
            <h2>When and where.</h2>

            <div className="promo-detail-list">
              <div>
                <strong>Date</strong>
                <span>{date}</span>
              </div>

              <div>
                <strong>Time</strong>
                <span>{time}</span>
              </div>

              <div>
                <strong>Venue</strong>
                <span>{venue}</span>
              </div>

              <div>
                <strong>Parish</strong>
                <span>{parish}</span>
              </div>

              <div>
                <strong>Category</strong>
                <span>{category}</span>
              </div>

              <div>
                <strong>Price</strong>
                <span>{price}</span>
              </div>
            </div>
          </section>

          <section className="panel" id="promoter-contact">
            <p className="kicker">Promoter</p>
            <h2>Contact information.</h2>

            <div className="promo-detail-list">
              <div>
                <strong>Promoter</strong>
                <span>{promoterName}</span>
              </div>

              {promoterPhone ? (
                <div>
                  <strong>Phone / WhatsApp</strong>
                  <span>{promoterPhone}</span>
                </div>
              ) : null}

              {email ? (
                <div>
                  <strong>Email</strong>
                  <span>{email}</span>
                </div>
              ) : null}

              {instagram ? (
                <div>
                  <strong>Instagram</strong>
                  <span>{instagram}</span>
                </div>
              ) : null}

              {website ? (
                <div>
                  <strong>Website</strong>
                  <span>{website}</span>
                </div>
              ) : null}
            </div>

            {whatsapp ? (
              <a
                className="btn btn-primary promo-wide-btn"
                href={`https://wa.me/${whatsapp.replace("+", "")}?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
              >
                Message promoter on WhatsApp
              </a>
            ) : null}
          </section>

          <section className="panel">
            <p className="kicker">Campaigns</p>
            <h2>Active campaigns.</h2>

            {campaigns.length ? (
              <div className="promo-detail-list">
                {campaigns.map((campaign, index) => (
                  <div key={`${campaign?.title || "campaign"}-${index}`}>
                    <strong>{campaign?.title || `Campaign ${index + 1}`}</strong>
                    <span>{campaign?.description || "Campaign details coming soon."}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty promo-compact-empty">
                <h3>No active campaigns</h3>
              </div>
            )}
          </section>
        </div>

        <section className="promo-related-section">
          <div className="section-head">
            <div>
              <p className="kicker">Related</p>
              <h2>Related promos.</h2>
            </div>

            <Link className="btn btn-light" href="/browse">
              Browse all
            </Link>
          </div>

          {relatedAds.length ? (
            <div className="promo-related-grid">
              {relatedAds.map((item) => (
                <RelatedCard key={item.id || getDetailSlug(item)} ad={item} />
              ))}
            </div>
          ) : (
            <div className="empty promo-compact-empty">
              <h3>No related promos yet</h3>
              <p className="muted">More promos will appear here soon.</p>
            </div>
          )}
        </section>
      </div>

      <ActionModal
        type={modalType}
        ad={ad}
        onClose={() => setModalType("")}
        onCopyClaimLink={copyClaimLink}
      />
    </main>
  );
}