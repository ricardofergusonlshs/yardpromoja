export default function Loading() {
  return (
    <main className="yp-system-page yp-loading-page">
      <section className="yp-system-card">
        <div className="yp-loader-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <p className="kicker">Loading YardPromoJa</p>
        <h1>Getting the latest promos.</h1>
        <p>
          Please wait while YardPromoJa loads events, campaigns, sale offers,
          and link-up ideas.
        </p>
      </section>
    </main>
  );
}
