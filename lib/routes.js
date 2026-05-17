export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yardpromoja.com";
export const PUBLIC_SITE_URL = "https://yardpromoja.com";

export const ROUTES = {
  HOME: "/",
  BROWSE: "/browse",
  WEEKEND: "/weekend",
  CREATE: "/create",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ADMIN: "/admin",
  FOR_YOU: "/for-you",
  CALENDAR: "/calendar",
  CAMPAIGNS: "/campaigns",
  SAVED: "/saved",
  NOTIFICATIONS: "/notifications",
  ABOUT: "/about",
  CONTACT: "/contact",
  ADVERTISE: "/advertise",
  PRICING: "/pricing",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  USER: "/u",
};

export function getAdUrl(slug) {
  return `${PUBLIC_SITE_URL}/ad/${slug}`;
}

export function getShareText(ad) {
  const title = ad?.title || "YardPromo Jamaica";
  const description = ad?.description ? ` — ${ad.description}` : "";
  return `${title}${description} ${getAdUrl(ad?.slug || "")}`.trim();
}

export function getWhatsAppShareUrl(ad) {
  const text = `${ad?.title || "YardPromo Jamaica"} ${getAdUrl(ad?.slug || "")}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function getCalendarUrl(ad) {
  if (!ad?.event_date) return "";

  const title = encodeURIComponent(ad.title || "YardPromo Event");
  const details = encodeURIComponent(ad.description || "YardPromo Jamaica event.");
  const location = encodeURIComponent(
    `${ad.location || ad.venue || ""}${ad.parish ? `, ${ad.parish}` : ""}`
  );
  const dateOnly = String(ad.event_date).replace(/-/g, "");
  const timeOnly = ad.event_time
    ? String(ad.event_time).replace(":", "").slice(0, 4)
    : "1900";
  const start = `${dateOnly}T${timeOnly}00`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${start}`;
}

export function getMapsSearchUrl(location) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}
