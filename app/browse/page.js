import AdsGrid from "../AdsGrid";

export default function BrowsePage() {
  return (
    <main className="section">
      <div className="container">
        <div className="page-hero">
          <p className="kicker">Browse Jamaica ads</p>
          <h2>Search active approved YardPromo listings.</h2>
          <p className="muted">
            Explore live events, services, venues, campaigns, and local deals
            from across Jamaica.
          </p>
        </div>
        <AdsGrid limit={6} />
      </div>
    </main>
  );
}
