import Link from "next/link";

export default function NotFound() {
  return (
    <main className="yp-system-page">
      <section className="yp-system-card">
        <p className="kicker">YardPromoJa</p>
        <h1>Page not found.</h1>
        <p>
          This page may have moved, the promo may no longer be active, or the
          link may be incorrect. You can still browse live approved promos or
          plan your next link-up.
        </p>

        <div className="yp-system-actions">
          <Link className="btn btn-primary" href="/browse">
            Browse Promos
          </Link>
          <Link className="btn btn-gold" href="/link-up">
            Plan the Link-Up
          </Link>
          <Link className="btn btn-light" href="/">
            Go Home
          </Link>
        </div>
      </section>
    </main>
  );
}
