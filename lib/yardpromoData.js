export const sampleAds = [];

export const campaigns = [];

export const categories = [
  "Party",
  "Dancehall",
  "Reggae",
  "Stage Show",
  "Sound Clash",
  "Concert",
  "Business",
  "Food",
];

export const venues = [];

export const promoters = [];

export function activeAds(list = sampleAds) {
  return (list || []).filter((ad) => {
    const status = String(ad?.status || "").toLowerCase();
    return status === "active" || status === "approved";
  });
}

export function isWeekend(ad) {
  if (!ad?.event_date) return false;

  const date = new Date(`${ad.event_date}T00:00:00`);

  if (Number.isNaN(date.getTime())) return false;

  const day = date.getDay();
  return [5, 6, 0].includes(day);
}

export function heatScore(ad) {
  return Number(ad?.heat_score || ad?.heat || 0);
}

export function interestCount(ad) {
  return Number(ad?.interested_count || ad?.interested || 0);
}

export function rsvpCount(ad) {
  return Number(ad?.rsvp_count || ad?.rsvps || 0);
}

export function eventLabel(ad) {
  if (ad?.event_date) {
    return `${ad.event_date}${ad?.event_time ? ` • ${ad.event_time}` : ""}`;
  }

  return ad?.parish || ad?.location || "Jamaica";
}

export function cleanAd(ad) {
  if (!ad) return null;

  return {
    ...ad,
    slug: ad?.slug || String(ad?.id || ""),
    poster_image_url:
      ad?.poster_image_url ||
      ad?.image_url ||
      ad?.flyer_url ||
      ad?.cover_image ||
      "",
  };
}

export function getAdBySlug(slug, list = sampleAds) {
  return (list || []).find((ad) => ad?.slug === slug) || null;
}

export function relatedAds(slug, limit = 3) {
  return activeAds(sampleAds)
    .filter((ad) => ad?.slug !== slug)
    .slice(0, limit);
}

export function getVenue(slug) {
  return venues.find((venue) => venue?.slug === slug) || null;
}

export function getPromoter(slug) {
  return promoters.find((promoter) => promoter?.slug === slug) || null;
}