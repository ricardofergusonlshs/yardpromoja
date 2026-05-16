import Link from "next/link";
import AdsGrid from "./AdsGrid";
import HeroStack from "./components/HeroStack";
import { activeAds, categories, isWeekend, sampleAds } from "@/lib/yardpromoData";

export default function HomePage() {
  const ads = activeAds(sampleAds);
  const featured = ads.filter((ad) => ad.is_featured).slice(0, 3);
  const weekend = ads.filter(isWeekend).slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-brand-lockup">
              <img src="/assets/yardpromo-app-icon.png" alt="YardPromo" />
              <span>
                <strong>YardPromo Jamaica</strong>
                <br />
                <small>Discover • Promote • Connect</small>
              </span>
            </div>
            <span className="eyebrow">Free launch posting</span>
            <h1>Find what’s happening in Jamaica.</h1>
            <p>
              Discover parties, shows, businesses, services, food deals, venues,
              and campaigns — or post your own promo link in minutes.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-gold" href="/create">
                Post Your Promo
              </Link>
              <Link className="btn btn-light" href="/browse">
                Browse Promos
              </Link>
            </div>
          </div>

          <HeroStack />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Featured this week</p>
              <h2>Premium picks.</h2>
            </div>
            <Link className="btn btn-light" href="/browse">
              View All
            </Link>
          </div>
          <AdsGrid ads={featured} limit={3} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Weekend</p>
              <h2>What’s hot this weekend.</h2>
            </div>
            <Link className="btn btn-light" href="/weekend">
              See Weekend
            </Link>
          </div>
          <AdsGrid ads={weekend} limit={3} />
        </div>
      </section>

      <section className="section">
        <div className="container smart-grid">
          <div className="smart-card dark">
            <p className="kicker" style={{ color: "#f7c600" }}>
              For You
            </p>
            <h2>Your smart discovery feed.</h2>
            <p className="muted">
              Find promos based on parish, category, popularity, RSVPs, and
              what’s moving this weekend.
            </p>
            <div className="action-row">
              <Link className="btn btn-gold" href="/for-you">
                Open For You
              </Link>
              <Link className="btn btn-light" href="/for-you">
                Tune Your Feed
              </Link>
            </div>
          </div>
          <div className="smart-card">
            <p className="kicker">Mood</p>
            <h2>What are you looking for?</h2>
            <div className="mood-grid">
              {[
                "Party tonight",
                "Food & brunch",
                "Live music",
                "Family friendly",
                "Business deals",
                "Beauty & grooming",
                "VIP nightlife",
                "Free entry",
                "Date night",
                "Things to do this weekend",
              ].map((mood) => (
                <Link className="mood-pill" href="/browse" key={mood}>
                  {mood}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Categories</p>
              <h2>Popular categories.</h2>
            </div>
          </div>
          <div className="grid grid-4">
            {categories.slice(0, 8).map((category, index) => (
              <Link className="category-card" href="/browse" key={category}>
                <span className="category-icon">{index + 1}</span>
                <strong>{category}</strong>
                <p className="muted small">Browse promos</p>
              </Link>
            ))}
          </div>
          <div className="trust-band">
            <div className="trust-tile">
              <strong>For promoters</strong>
              <p className="muted small">
                Post events, collect RSVPs, and share clean promo links.
              </p>
            </div>
            <div className="trust-tile">
              <strong>For businesses</strong>
              <p className="muted small">
                Promote services, offers, products, and local deals.
              </p>
            </div>
            <div className="trust-tile">
              <strong>For venues</strong>
              <p className="muted small">
                Show upcoming events and help visitors find your location.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
