import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import AdDetailClient from "../AdDetailClient";

function cleanAd(ad) {
  if (!ad) return null;

  return {
    ...ad,
    slug: ad.slug || String(ad.id || ""),
    title: ad.title || ad.name || "Untitled promo",
    category: ad.category || ad.type || "Promo",
    parish: ad.parish || ad.location || "Jamaica",
    location: ad.location || ad.parish || "Jamaica",
    venue: ad.venue || ad.location || ad.parish || "Jamaica",
    description: ad.description || "",
    price: ad.price || ad.ticket_price || ad.cost || "Contact for details",
    event_date: ad.event_date || ad.date || "",
    event_time: ad.event_time || ad.time || "",
    whatsapp: ad.whatsapp || ad.phone || "",
    phone: ad.phone || ad.whatsapp || "",
    promoter_name: ad.promoter_name || ad.business_name || "",
    business_name: ad.business_name || ad.promoter_name || "",
    poster_image_url:
      ad.poster_image_url ||
      ad.image_url ||
      ad.flyer_url ||
      ad.cover_image ||
      "",
    image_url:
      ad.image_url ||
      ad.poster_image_url ||
      ad.flyer_url ||
      ad.cover_image ||
      "",
    status: ad.status || "active",
    interested_count: Number(ad.interested_count || ad.interested || 0),
    rsvp_count: Number(ad.rsvp_count || ad.rsvps || 0),
    heat_score: Number(ad.heat_score || ad.heat || 0),
    shares: Number(ad.shares || 0),
  };
}

function isPublicLiveAd(ad) {
  const status = String(ad?.status || "").toLowerCase();
  return status === "active" || status === "approved";
}

async function getLiveAdBySlug(slug) {
  if (!slug) return null;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Ad detail Supabase error:", error.message);
    return null;
  }

  if (!data || !isPublicLiveAd(data)) {
    return null;
  }

  return cleanAd(data);
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const ad = await getLiveAdBySlug(slug);

  if (!ad) {
    return {
      title: "Promo not found | YardPromo Jamaica",
      description: "This YardPromo listing may be unavailable or removed.",
    };
  }

  const description =
    ad.description || `${ad.title} in ${ad.parish || ad.location || "Jamaica"}`;

  const image = ad.poster_image_url || ad.image_url;

  return {
    title: `${ad.title} | YardPromo Jamaica`,
    description,
    openGraph: {
      title: `${ad.title} | YardPromo Jamaica`,
      description,
      images: image ? [image] : [],
      type: "website",
    },
  };
}

export default async function AdPage({ params }) {
  const slug = params?.slug;
  const ad = await getLiveAdBySlug(slug);

  if (!ad) {
    return (
      <section className="section">
        <div className="container">
          <div className="panel" style={{ maxWidth: 760, margin: "0 auto" }}>
            <p className="kicker">YardPromo</p>
            <h1>Promo not found.</h1>
            <p className="muted">
              This promo link may be unavailable, unpublished, or removed.
              Browse active YardPromo listings instead.
            </p>

            <div style={{ marginTop: 18 }}>
              <Link className="btn btn-primary" href="/browse">
                Browse Promos
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <AdDetailClient ad={ad} liveAd={ad} isDemo={false} />;
}