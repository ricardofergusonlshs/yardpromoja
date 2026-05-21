"use client";

import Link from "next/link";

function getCover(item) {
  return item?.cover_image_url || "/assets/yardpromo-brand-preview.png";
}

export default function ItineraryCard({ itinerary, template = false }) {
  if (!itinerary) return null;

  const href = template
    ? `/itinerary?template=${encodeURIComponent(itinerary.slug)}`
    : `/itinerary/${itinerary.slug}`;

  return (
    <article className="promo-card card">
      <Link className="promo-media card-img" href={href}>
        <img src={getCover(itinerary)} alt={itinerary.title || "Itinerary"} />
        {itinerary.is_featured ? <span className="featured-badge featured-tag">Featured</span> : null}
      </Link>

      <div className="promo-body card-body">
        <p className="promo-category meta">{itinerary.itinerary_type || "Itinerary"}</p>
        <h3>{itinerary.title}</h3>
        <p className="promo-location location-chip">{itinerary.parish || "Jamaica"}</p>
        <p className="muted">{itinerary.description || "Plan your Jamaican outing."}</p>

        <div className="promo-mini-stats">
          <span>{itinerary.trip_length_days || 1} day plan</span>
          <span>{String(itinerary.budget_level || "flexible").replaceAll("_", " ")}</span>
          <span>{String(itinerary.travel_style || "local").replaceAll("_", " ")}</span>
        </div>

        <Link className="btn btn-primary" href={href}>
          {template ? "Use Template" : "View Itinerary"}
        </Link>
      </div>
    </article>
  );
}
