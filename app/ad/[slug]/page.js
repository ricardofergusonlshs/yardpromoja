import { createClient } from "@supabase/supabase-js";
import AdDetailClient from "./AdDetailClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yardpromoja.com";

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isPublicLiveAd(ad) {
  const status = String(ad?.status || "").toLowerCase();
  return status === "active" || status === "approved";
}

function getTitle(ad) {
  return ad?.title || ad?.name || "YardPromo Promo";
}

function getDescription(ad) {
  return (
    ad?.description ||
    ad?.details ||
    ad?.body ||
    "Discover this promo on YardPromo Jamaica."
  );
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

function getCategory(ad) {
  return ad?.category || ad?.type || "Promo";
}

function getLocation(ad) {
  return ad?.location || ad?.venue || ad?.parish || "Jamaica";
}

function cleanRouteSlug(value) {
  return decodeURIComponent(String(value || "")).trim();
}

function absoluteUrl(value) {
  const url = String(value || "").trim();

  if (!url) return `${SITE_URL}/assets/yardpromo-brand-preview.png`;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${SITE_URL}${url}`;
  }

  return `${SITE_URL}/${url}`;
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

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function getAdForMetadata(slug) {
  const supabase = getSupabaseServerClient();

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Metadata ad lookup error:", error);
    return null;
  }

  const publicAds = (data || []).filter(isPublicLiveAd);

  return publicAds.find((item) => adMatchesRoute(item, slug)) || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ad = await getAdForMetadata(slug);

  if (!ad) {
    return {
      title: "Promo Not Found | YardPromo Jamaica",
      description: "Browse active promos on YardPromo Jamaica.",
      openGraph: {
        title: "YardPromo Jamaica",
        description: "Find what’s happening in Jamaica.",
        url: `${SITE_URL}/ad/${encodeURIComponent(slug)}`,
        siteName: "YardPromo Jamaica",
        images: [
          {
            url: `${SITE_URL}/assets/yardpromo-brand-preview.png`,
            width: 1200,
            height: 630,
            alt: "YardPromo Jamaica",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "YardPromo Jamaica",
        description: "Find what’s happening in Jamaica.",
        images: [`${SITE_URL}/assets/yardpromo-brand-preview.png`],
      },
    };
  }

  const title = getTitle(ad);
  const category = getCategory(ad);
  const location = getLocation(ad);
  const description = getDescription(ad).slice(0, 180);
  const imageUrl = absoluteUrl(getPoster(ad));
  const pageUrl = `${SITE_URL}/ad/${encodeURIComponent(slug)}`;

  const metaTitle = `${title} | YardPromo Jamaica`;
  const metaDescription = `${description} ${category ? `Category: ${category}.` : ""} ${
    location ? `Location: ${location}.` : ""
  }`.trim();

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: pageUrl,
      siteName: "YardPromo Jamaica",
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}

export default function AdPage() {
  return <AdDetailClient />;
}