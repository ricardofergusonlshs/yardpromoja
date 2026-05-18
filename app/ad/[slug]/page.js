import AdDetailClient from "../AdDetailClient";
import { getAdBySlug } from "@/lib/yardpromoData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yardpromoja.com";

function normalizeSlug(slug) {
  return String(slug || "").trim();
}

function normalizeAd(ad, slug) {
  if (!ad) return null;

  return {
    ...ad,
    slug: ad.slug || slug,
    title: ad.title || "YardPromo Jamaica Promo",
    description: ad.description || "View this promotion on YardPromo Jamaica.",
    poster_image_url: ad.poster_image_url || "",
    category: ad.category || "Promo",
    parish: ad.parish || "",
    location: ad.location || "",
    venue: ad.venue || "",
    price: ad.price || "",
    event_date: ad.event_date || "",
    event_time: ad.event_time || "",
    whatsapp: ad.whatsapp || "",
    phone: ad.phone || "",
    website_link: ad.website_link || "",
    ticket_link: ad.ticket_link || "",
    instagram_link: ad.instagram_link || "",
    call_to_action: ad.call_to_action || "View Details",
    tags: Array.isArray(ad.tags) ? ad.tags : [],
  };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams?.slug);
  const ad = normalizeAd(getAdBySlug(slug), slug);

  const title = ad ? `${ad.title} | YardPromo Jamaica` : "Promo not found | YardPromo Jamaica";
  const description = ad?.description || "View promotions on YardPromo Jamaica.";
  const url = `${SITE_URL.replace(/\/$/, "")}/ad/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "YardPromo Jamaica",
      type: "website",
      images: ad?.poster_image_url ? [ad.poster_image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ad?.poster_image_url ? [ad.poster_image_url] : [],
    },
  };
}

export default async function AdDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams?.slug);
  const ad = normalizeAd(getAdBySlug(slug), slug);

  if (!ad) {
    return (
      <main className="section">
        <div className="container">
          <div className="panel" style={{ maxWidth: 760, margin: "0 auto" }}>
            <p className="kicker">YARDPROMO</p>
            <h1>Promo not found.</h1>
            <p className="muted">
              This promo link may be unavailable, unpublished, or removed. Browse active YardPromo
              listings instead.
            </p>
            <a className="btn btn-primary" href="/browse">
              Browse Promos
            </a>
          </div>
        </div>
      </main>
    );
  }

  return <AdDetailClient slug={slug} ad={ad} />;
}