import Link from "next/link";

export default function ModernHeroCopy() {
  return (
    <div className="yp-modern-hero-copy">
      <p className="yp-modern-eyebrow">Jamaica’s discovery hub</p>

      <h1 className="yp-modern-headline">
        Find your next move <span>in Jamaica.</span>
      </h1>

      <p className="yp-modern-subtitle">
        Explore events, food spots, weekend plans, services, deals, and local promos — searchable by parish, category, and date.
      </p>

      <div className="yp-modern-actions">
        <Link href="/browse" className="yp-modern-btn yp-modern-btn-primary">
          Explore promos
        </Link>
        <Link href="/create" className="yp-modern-btn yp-modern-btn-dark">
          Post your promo
        </Link>
        <Link href="/link-up" className="yp-modern-btn yp-modern-btn-ghost">
          Plan a link-up
        </Link>
      </div>
    </div>
  );
}
