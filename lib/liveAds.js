import { createClient } from "@/lib/supabaseClient";

function slugify(value) {
  return String(value || "promo")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function isVisibleAd(ad) {
  const status = String(ad?.status || "").toLowerCase();

  // Do not show drafts/rejected/private items publicly.
  if (["draft", "deleted", "archived", "rejected", "private"].includes(status)) {
    return false;
  }

  return true;
}

export function normalizeLiveAd(row) {
  if (!row) return null;

  const title = row.title || "Untitled promo";
  const slug = row.slug || `${slugify(title)}-${row.id || Date.now()}`;

  const image =
    row.poster_image_url ||
    row.image_url ||
    row.poster_url ||
    row.flyer_url ||
    row.image ||
    "";

  return {
    ...row,
    id: row.id,
    title,
    slug,
    category: row.category || "Promo",
    description: row.description || "",
    poster_image_url: image,
    image_url: image,
    event_date: row.event_date || row.date || null,
    event_time: row.event_time || row.time || null,
    venue: row.venue || "",
    location: row.location || "",
    parish: row.parish || "Jamaica",
    price: row.price || row.ticket_price || "Contact for details",
    phone: row.phone || "",
    whatsapp: row.whatsapp || "",
    website_link: row.website_link || "",
    ticket_link: row.ticket_link || "",
    instagram_link: row.instagram_link || "",
    call_to_action: row.call_to_action || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    featured: Boolean(row.featured || row.is_featured),
    is_featured: Boolean(row.featured || row.is_featured),
    shares: row.shares || 0,
    interested: row.interested || row.interest_count || 0,
    rsvps: row.rsvps || row.rsvp_count || 0,
    created_at: row.created_at || null,
  };
}

export async function getLiveAds({ limit = 24 } = {}) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("Unable to fetch live ads:", error.message);
      return [];
    }

    return (data || [])
      .filter(isVisibleAd)
      .map(normalizeLiveAd)
      .filter(Boolean);
  } catch (error) {
    console.warn("Live ads fetch failed:", error);
    return [];
  }
}

export async function getLiveAdBySlug(slug) {
  if (!slug) return null;

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data || !isVisibleAd(data)) return null;

    return normalizeLiveAd(data);
  } catch (error) {
    console.warn("Live ad by slug fetch failed:", error);
    return null;
  }
}
