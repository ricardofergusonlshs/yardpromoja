"use client";

import Link from "next/link";

function makeSlug(value) {
  return String(value || "yardpromo-promo")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSlug(ad) {
  if (ad?.slug) return String(ad.slug);
  if (ad?.id) return String(ad.id);
  return makeSlug(ad?.title || ad?.name || "yardpromo-promo");
}

export default function PlanAroundPromoButton({ ad, slug = "", className = "" }) {
  const promoSlug = slug || getSlug(ad);

  return (
    <Link
      className={`btn btn-light yp-plan-promo-btn ${className}`.trim()}
      href={`/link-up?promo=${encodeURIComponent(promoSlug)}`}
    >
      Plan around this promo
    </Link>
  );
}
