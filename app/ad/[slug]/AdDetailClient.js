"use client";
import AddToItineraryButton from "@/app/components/AddToItineraryButton";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://yardpromoja.com"
  
).replace(/\/$/, "");
function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
const YARDPROMO_LOGO_PATH = "/assets/yardpromoja-logo.png";

function loadImageFromUrl(src) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(src, { cache: "force-cache" });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${src}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = objectUrl;
    } catch (error) {
      reject(error);
    }
  });
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function canvasToBlob(canvas, type = "image/png", quality = 0.95) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to create image blob."));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

async function createBrandedFlyerBlob(ad) {
  const posterUrl = getPoster(ad);
  const posterImg = await loadImageFromUrl(posterUrl);

  const width = posterImg.naturalWidth || posterImg.width;
  const height = posterImg.naturalHeight || posterImg.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available.");
  }

  // Keep the original flyer as the main content.
  ctx.drawImage(posterImg, 0, 0, width, height);

  let logoImg = null;

  try {
    logoImg = await loadImageFromUrl(YARDPROMO_LOGO_PATH);
  } catch {
    logoImg = null;
  }

  const shortestSide = Math.min(width, height);

  // Clean, centered, transparent YardPromoJa brand button.
  // It is large enough to be noticed but transparent enough to keep the poster visible.
  const buttonHeight = Math.max(130, Math.min(Math.round(height * 0.17), 230));
  const buttonWidth = Math.max(520, Math.min(Math.round(width * 0.82), 920));
  const buttonRadius = Math.round(buttonHeight * 0.30);

  const buttonX = Math.round((width - buttonWidth) / 2);
  const buttonY = Math.round((height - buttonHeight) / 2);

  // Slight glass tint behind the brand mark.
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
  ctx.shadowBlur = Math.max(16, Math.round(shortestSide * 0.018));
  ctx.shadowOffsetY = Math.max(4, Math.round(shortestSide * 0.005));

  const gradient = ctx.createLinearGradient(
    buttonX,
    buttonY,
    buttonX,
    buttonY + buttonHeight
  );
  gradient.addColorStop(0, "rgba(2, 6, 23, 0.30)");
  gradient.addColorStop(1, "rgba(2, 6, 23, 0.38)");

  ctx.fillStyle = gradient;
  drawRoundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonRadius);
  ctx.fill();
  ctx.restore();

  // Clean gold outline.
  ctx.save();
  ctx.strokeStyle = "rgba(250, 204, 21, 0.58)";
  ctx.lineWidth = Math.max(2, Math.round(shortestSide * 0.0024));
  drawRoundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonRadius);
  ctx.stroke();
  ctx.restore();

  // Logo circle on the left.
  const iconSize = Math.round(buttonHeight * 0.68);
  const iconX = buttonX + Math.round(buttonHeight * 0.24);
  const iconY = buttonY + Math.round((buttonHeight - iconSize) / 2);
  const iconRadius = iconSize / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(iconX + iconRadius, iconY + iconRadius, iconRadius, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.10)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = Math.max(1, Math.round(shortestSide * 0.0014));
  ctx.stroke();
  ctx.restore();

  if (logoImg) {
    const logoAspect =
      (logoImg.naturalWidth || logoImg.width) /
      (logoImg.naturalHeight || logoImg.height || 1);

    let logoDrawWidth = iconSize * 0.88;
    let logoDrawHeight = logoDrawWidth / logoAspect;

    if (logoDrawHeight > iconSize * 0.88) {
      logoDrawHeight = iconSize * 0.88;
      logoDrawWidth = logoDrawHeight * logoAspect;
    }

    const logoX = iconX + (iconSize - logoDrawWidth) / 2;
    const logoY = iconY + (iconSize - logoDrawHeight) / 2;

    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
    ctx.shadowBlur = Math.max(4, Math.round(shortestSide * 0.005));
    ctx.drawImage(logoImg, logoX, logoY, logoDrawWidth, logoDrawHeight);
    ctx.restore();
  } else {
    // Compact fallback mark if the logo file is unavailable.
    // Place your real logo at /public/assets/yardpromoja-logo.png.
    const fallbackFont = Math.max(30, Math.round(iconSize * 0.42));

    ctx.save();
    ctx.globalAlpha = 0.88;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${fallbackFont}px Arial, sans-serif`;
    ctx.fillStyle = "#facc15";
    ctx.fillText("Y", iconX + iconRadius - fallbackFont * 0.20, iconY + iconRadius);
    ctx.fillStyle = "#22c55e";
    ctx.fillText("P", iconX + iconRadius + fallbackFont * 0.28, iconY + iconRadius);
    ctx.restore();
  }

  // Improved brand name layout: one clean wordmark instead of oversized split text.
  const textX = iconX + iconSize + Math.round(buttonHeight * 0.20);
  const textAreaRight = buttonX + buttonWidth - Math.round(buttonHeight * 0.26);
  const maxTextWidth = Math.max(220, textAreaRight - textX);
  const textCenterY = buttonY + buttonHeight / 2;

  const labelFont = Math.max(16, Math.min(Math.round(buttonHeight * 0.15), 30));
  const nameFont = Math.max(38, Math.min(Math.round(buttonHeight * 0.34), 68));

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  // Small label.
  ctx.globalAlpha = 0.78;
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 ${labelFont}px Arial, sans-serif`;
  ctx.fillText("VIEW ON", textX, textCenterY - nameFont * 0.48, maxTextWidth);

  // Wordmark: YardPromoJa, with Yard in white and PromoJa in green.
  ctx.globalAlpha = 0.90;
  ctx.font = `900 ${nameFont}px Arial, sans-serif`;

  ctx.fillStyle = "#ffffff";
  ctx.fillText("Yard", textX, textCenterY + nameFont * 0.22, maxTextWidth);

  const yardWidth = ctx.measureText("Yard").width;

  ctx.fillStyle = "#22c55e";
  ctx.fillText(
    "PromoJa",
    textX + yardWidth,
    textCenterY + nameFont * 0.22,
    Math.max(100, maxTextWidth - yardWidth)
  );

  ctx.restore();

  return canvasToBlob(canvas, "image/png", 0.95);
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


function getPublicAdUrl(ad) {
  const detailSlug = getDetailSlug(ad);
  return `${SITE_URL}/ad/${encodeURIComponent(detailSlug)}`;
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

function getSaleOffers(ad) {
  const raw =
    ad?.sale_offers ||
    ad?.offers ||
    ad?.deals ||
    ad?.active_offers ||
    ad?.offer_list;

  if (Array.isArray(raw)) return raw;

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const title =
    ad?.sale_title ||
    ad?.offer_title ||
    ad?.deal_title ||
    ad?.discount_title ||
    "";

  const description =
    ad?.sale_description ||
    ad?.offer_description ||
    ad?.deal_description ||
    ad?.discount_description ||
    ad?.special_offer ||
    "";

  if (!title && !description) return [];

  return [
    {
      title: title || "Sale offer",
      description: description || "Offer details coming soon.",
      type: ad?.offer_type || ad?.deal_type || "Sale offer",
    },
  ];
}

const complementaryCategoryGroups = {
  event: [
    "Food",
    "Fashion",
    "Beauty",
    "Transport",
    "Hotel",
    "Drinks",
    "Restaurant",
    "Photography",
    "After Party",
  ],
  food: [
    "Fashion",
    "Beauty",
    "Transport",
    "Hotel",
    "Drinks",
    "Restaurant",
    "Photography",
    "Business",
  ],
  business: [
    "Food",
    "Printing",
    "Photography",
    "Marketing",
    "Transport",
    "Beauty",
    "Fashion",
  ],
  beauty: [
    "Fashion",
    "Food",
    "Photography",
    "Transport",
    "Hotel",
    "Restaurant",
  ],
  hotel: [
    "Food",
    "Transport",
    "Tour",
    "Beach",
    "Restaurant",
    "Beauty",
    "Fashion",
  ],
  default: [
    "Food",
    "Business",
    "Beauty",
    "Fashion",
    "Transport",
    "Hotel",
    "Restaurant",
  ],
};

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function getComplementaryCategories(category) {
  const value = normalizeText(category);

  if (
    [
      "party",
      "dancehall",
      "reggae",
      "stage show",
      "attraction",
      "concert",
      "sound clash",
      "event",
      "nightlife",
      "festival",
    ].some((item) => value.includes(item))
  ) {
    return complementaryCategoryGroups.event;
  }

  if (
    ["food", "restaurant", "brunch", "lunch", "dinner", "catering"].some((item) =>
      value.includes(item)
    )
  ) {
    return complementaryCategoryGroups.food;
  }

  if (
    ["business", "service", "shop", "store", "deal", "sale", "discount"].some((item) =>
      value.includes(item)
    )
  ) {
    return complementaryCategoryGroups.business;
  }

  if (
    ["beauty", "grooming", "hair", "makeup", "barber", "salon"].some((item) =>
      value.includes(item)
    )
  ) {
    return complementaryCategoryGroups.beauty;
  }

  if (
    ["hotel", "stay", "villa", "airbnb", "resort"].some((item) =>
      value.includes(item)
    )
  ) {
    return complementaryCategoryGroups.hotel;
  }

  return complementaryCategoryGroups.default;
}

function categoryMatchesWanted(ad, wantedCategories) {
  const category = normalizeText(getCategory(ad));

  return wantedCategories.some((wanted) => {
    const cleanWanted = normalizeText(wanted);

    return (
      category === cleanWanted ||
      category.includes(cleanWanted) ||
      cleanWanted.includes(category)
    );
  });
}

function isSameAd(a, b) {
  const aId = String(a?.id || "");
  const bId = String(b?.id || "");
  const aSlug = String(a?.slug || getDetailSlug(a));
  const bSlug = String(b?.slug || getDetailSlug(b));

  return (aId && bId && aId === bId) || (aSlug && bSlug && aSlug === bSlug);
}

function uniqueAds(list) {
  const seen = new Set();

  return (list || []).filter((ad) => {
    const key = String(ad?.id || ad?.slug || getDetailSlug(ad));

    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function complementaryAdsForDetail(currentAd, list = [], limit = 3) {
  if (!currentAd) return [];

  const wantedCategories = getComplementaryCategories(getCategory(currentAd));
  const currentParish = normalizeText(getParish(currentAd));
  const currentLocation = normalizeText(getLocation(currentAd));

  const active = (list || [])
    .filter(isPublicLiveAd)
    .filter((item) => !isSameAd(item, currentAd));

  const isComplementary = (item) =>
    categoryMatchesWanted(item, wantedCategories);

  const sameArea = active.filter((item) => {
    if (!isComplementary(item)) return false;

    const itemParish = normalizeText(getParish(item));
    const itemLocation = normalizeText(getLocation(item));

    return (
      (currentParish && itemParish && itemParish.includes(currentParish)) ||
      (currentLocation && itemLocation && itemLocation.includes(currentLocation))
    );
  });

  const anywhere = active.filter(isComplementary);

  return uniqueAds([...sameArea, ...anywhere]).slice(0, limit);
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
    <Link className="promo-suggestion-card" href={href}>
      <div className="promo-suggestion-image">
        <img src={getPoster(ad)} alt={getTitle(ad)} />
      </div>

      <div className="promo-suggestion-body">
        <p className="kicker">{getCategory(ad)}</p>
        <h3>{getTitle(ad)}</h3>
        <p className="muted">{getLocation(ad)}</p>
        <span className="promo-suggestion-link">View promo →</span>
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [modalType, setModalType] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    let alive = true;

    async function checkLoggedInUser() {
      try {
        const { data } = await supabase.auth.getUser();

        if (alive) {
          setLoggedInUser(data?.user || null);
          setAuthChecked(true);
        }
      } catch {
        if (alive) {
          setLoggedInUser(null);
          setAuthChecked(true);
        }
      }
    }

    checkLoggedInUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkLoggedInUser();
    });

    return () => {
      alive = false;
      subscription?.unsubscribe?.();
    };
  }, [supabase]);

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

  const suggestionAds = useMemo(() => {
    if (!ad) return [];
    return complementaryAdsForDetail(ad, allAds, 3);
  }, [ad, allAds]);

  function getCurrentNextPath() {
    if (typeof window === "undefined") return "/";

    return `${window.location.pathname}${window.location.search || ""}`;
  }

  function requireLoginForAction(actionPath = "") {
    if (loggedInUser) return true;

    const nextPath = actionPath || getCurrentNextPath();

    window.location.href = `/login?next=${encodeURIComponent(nextPath)}`;
    return false;
  }

  function requireLoginClick(event, actionPath = "") {
    if (loggedInUser) return true;

    event?.preventDefault?.();
    requireLoginForAction(actionPath);
    return false;
  }

  function goToProtected(path) {
    if (!requireLoginForAction(path)) return;
    window.location.href = path;
  }

  function toggleSharePack() {
    if (!sharePackOpen && !requireLoginForAction()) return;

    setSharePackOpen((value) => !value);
  }

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
  if (!requireLoginForAction()) return;

  try {
    const link = getPublicAdUrl(ad);
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

  async function downloadPoster() {
    if (!requireLoginForAction()) return;
    if (!ad) return;

    const titleSlug = makeSlug(getTitle(ad)) || "yardpromo-flyer";

    try {
      const brandedBlob = await createBrandedFlyerBlob(ad);
      const objectUrl = URL.createObjectURL(brandedBlob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${titleSlug}-yardpromoja.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
      setNotice("Branded flyer downloaded.");
    } catch (error) {
      console.error("Download flyer error:", error);

      try {
        window.open(getPoster(ad), "_blank", "noopener,noreferrer");
        setNotice("Could not generate branded flyer. Opened original flyer instead.");
      } catch {
        setNotice("Unable to download flyer right now.");
      }
    }
  }

  async function viewBrandedFlyer() {
    if (!requireLoginForAction()) return;
    if (!ad) return;

    try {
      const brandedBlob = await createBrandedFlyerBlob(ad);
      const objectUrl = URL.createObjectURL(brandedBlob);

      window.open(objectUrl, "_blank", "noopener,noreferrer");

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60000);

      setNotice("Branded flyer opened.");
    } catch (error) {
      console.error("View flyer error:", error);

      try {
        window.open(getPoster(ad), "_blank", "noopener,noreferrer");
        setNotice("Could not generate branded flyer. Opened original flyer instead.");
      } catch {
        setNotice("Unable to open flyer right now.");
      }
    }
  }

  async function shareToTikTok() {
    if (!requireLoginForAction()) return;

    const title = ad ? getTitle(ad) : "YardPromo";
    const shareCaption = `${title} on YardPromo Jamaica ${getPublicAdUrl(ad)}`;

    try {
      await navigator.clipboard.writeText(shareCaption);
    } catch {
      // Continue by opening TikTok.
    }

    setLocalShares((count) => count + 1);
    window.open("https://www.tiktok.com/", "_blank", "noopener,noreferrer");
    setNotice("Promo link copied. Paste it into TikTok.");
  }

  function shareClicked() {
    if (!requireLoginForAction()) return false;

    setLocalShares((count) => count + 1);
    return true;
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
  const saleOffers = getSaleOffers(ad);
  const campaignOfferItems = [...campaigns, ...saleOffers];
  const mapEmbedUrl = buildMapEmbedUrl(ad);

  const shareUrl = getPublicAdUrl(ad);
const shareCaption = `${title} on YardPromo Jamaica ${shareUrl}`;
  const shareText = encodeURIComponent(shareCaption);
  const whatsappShareUrl = `https://wa.me/?text=${shareText}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
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
              <button
                type="button"
                onClick={() => {
                  setMoreOpen((value) => {
                    const nextValue = !value;

                    if (!nextValue) {
                      setSharePackOpen(false);
                    }

                    return nextValue;
                  });
                }}
              >
                {moreOpen ? "▾" : "▸"} More Actions
              </button>
            </div>

            {moreOpen ? (
              <div className="promo-action-grid promo-action-grid-focused">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={toggleSharePack}
                  disabled={!authChecked}
                >
                  {!authChecked
                    ? "Checking access..."
                    : sharePackOpen
                      ? "Close Share Pack"
                      : "Open Share Pack"}
                </button>

                <button type="button" className="btn btn-light" onClick={addToCalendar}>
                  Save to Calendar
                </button>
              </div>
            ) : null}

            {moreOpen && sharePackOpen ? (
              <div className="promo-share-pack promo-share-pack-open">
                <p className="kicker">Share Pack</p>
                <h3>Share this promo.</h3>
                <p className="muted">
                  Copy the link, share to social, or download the flyer.
                </p>

                <div className="promo-action-grid promo-share-pack-grid">
                  <button type="button" className="btn btn-primary" onClick={copyPromoLink}>
                    Copy promo link
                  </button>

                  <a
                    className="btn btn-light"
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                      if (!requireLoginClick(event)) return;
                      shareClicked();
                    }}
                  >
                    WhatsApp
                  </a>

                  <a
                    className="btn btn-light"
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                      if (!requireLoginClick(event)) return;
                      shareClicked();
                    }}
                  >
                    Facebook
                  </a>

                  <a
                    className="btn btn-light"
                    href={xShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                      if (!requireLoginClick(event)) return;
                      shareClicked();
                    }}
                  >
                    X
                  </a>

                  <button type="button" className="btn btn-light" onClick={shareToTikTok}>
                    TikTok
                  </button>

                  <button type="button" className="btn btn-light" onClick={viewBrandedFlyer}>
                    View flyer
                  </button>

                  <button type="button" className="btn btn-gold" onClick={downloadPoster}>
                    Download flyer
                  </button>
                </div>
              </div>
            ) : null}

            <div className="promo-owner-actions">
              <button
                type="button"
                className="btn btn-primary promo-claim-btn"
                onClick={() => setModalType("claim")}
              >
                Claim this promo
              </button>

              <button
                type="button"
                className="btn btn-warning promo-report-btn"
                onClick={() => setModalType("report")}
              >
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

            <a
              className="btn btn-primary promo-wide-btn"
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open directions
            </a>
          </section>

          <section className="panel">
            <p className="kicker">Campaigns & Offers</p>
            <h2>Campaigns & sale offers.</h2>

            {campaignOfferItems.length ? (
              <div className="promo-detail-list">
                {campaignOfferItems.map((item, index) => (
                  <div key={`${item?.title || "campaign-offer"}-${index}`}>
                    <strong>{item?.title || `Campaign or offer ${index + 1}`}</strong>
                    <span>
                      {item?.description ||
                        item?.details ||
                        item?.type ||
                        "Campaign or offer details coming soon."}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty promo-compact-empty">
                <h3>No active campaigns or sale offers</h3>
                <p className="muted">
                  Campaigns, giveaways, sale offers, and special promotions can appear here.
                </p>
              </div>
            )}

            {loggedInUser ? (
              <div className="promo-action-grid" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => goToProtected("/dashboard/campaigns")}
                >
                  Set campaigns
                </button>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => goToProtected("/dashboard/sale-offers")}
                >
                  Add sale offer
                </button>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => goToProtected("/dashboard/promos")}
                >
                  Edit poster
                </button>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => goToProtected("/advertise")}
                >
                  Request feature
                </button>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => goToProtected("/premium")}
                >
                  Premium
                </button>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => goToProtected("/weekend")}
                >
                  Weekend boost
                </button>
              </div>
            ) : (
              <div className="empty promo-compact-empty" style={{ marginTop: 16 }}>
                <h3>Login to manage campaigns and offers</h3>
                <p className="muted">
                  Add campaigns, sale offers, premium placement, and weekend boosts after login.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => requireLoginForAction()}
                >
                  Login to continue
                </button>
              </div>
            )}
          </section>

          <section className="panel" id="promoter-contact">
            <p className="kicker">Contact</p>
            <h2>Contact.</h2>

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
        </div>

        <section className="promo-related-section">
          <div className="section-head">
            <div>
              <p className="kicker">Suggestions</p>
              <h2>You may also need.</h2>
            </div>

            <Link className="btn btn-light" href="/browse">
              Browse all
            </Link>
          </div>

          {suggestionAds.length ? (
            <div className="promo-related-grid">
              {suggestionAds.map((item) => (
                <RelatedCard key={item.id || getDetailSlug(item)} ad={item} />
              ))}
            </div>
          ) : (
            <div className="empty promo-compact-empty">
              <h3>No suggestions yet</h3>
              <p className="muted">More useful promos will appear here soon.</p>
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