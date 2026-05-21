"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("YardPromoJa page error:", error);
  }, [error]);

  return (
    <main className="yp-system-page">
      <section className="yp-system-card">
        <p className="kicker">Something went wrong</p>
        <h1>This page couldn’t load.</h1>
        <p>
          Try again, return home, or browse active promos. If this keeps
          happening, check the terminal error from the dev server.
        </p>

        <div className="yp-system-actions">
          <button className="btn btn-primary" type="button" onClick={reset}>
            Try Again
          </button>
          <Link className="btn btn-gold" href="/browse">
            Browse Promos
          </Link>
          <Link className="btn btn-light" href="/">
            Go Home
          </Link>
        </div>
      </section>
    </main>
  );
}
