import Link from "next/link";
import AdsGrid from "./AdsGrid";
import HeroStack from "./components/HeroStack";
import HomeSearchPanel from "./components/HomeSearchPanel";
import { categories } from "@/lib/yardpromoData";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={`hero ${styles.heroUpgrade}`}>
        <div className={`container hero-grid ${styles.heroGridUpgrade}`}>
          <div className={styles.heroCopy}>
            <div className="hero-brand-lockup">
              <img src="/assets/yardpromo-app-icon.png" alt="YardPromo" />
              <span>
                <strong>YardPromo Jamaica</strong>
                <br />
                <small>Broadcast • Promote • Connect</small>
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

          <div className={styles.heroVisual}>
            <HeroStack />
          </div>
        </div>
      </section>

      <HomeSearchPanel />

      <section className={`section ${styles.modernSection} ${styles.premiumSection}`}>
        <div className={`container ${styles.modernContainer}`}>
          <div className={`section-head ${styles.sectionHead}`}>
            <div>
              <p className="kicker">Featured this week</p>
              <h2>Premium picks.</h2>
              <p className={styles.sectionSubcopy}>
                Handpicked promos and experiences worth checking out.
              </p>
            </div>

            <Link className="btn btn-light" href="/browse">
              View All
            </Link>
          </div>

          <AdsGrid limit={3} section="premium" />
        </div>
      </section>

      <section className={`section ${styles.modernSection} ${styles.weekendSection}`}>
        <div className={`container ${styles.modernContainer}`}>
          <div className={`section-head ${styles.sectionHead}`}>
            <div>
              <p className="kicker">Weekend</p>
              <h2>What’s hot this weekend.</h2>
              <p className={styles.sectionSubcopy}>
                Trending events, attractions, and specials people can check out soon.
              </p>
            </div>

            <Link className="btn btn-light" href="/weekend">
              See Weekend
            </Link>
          </div>

          <AdsGrid limit={3} section="weekend" />
        </div>
      </section>

      <section className={`section ${styles.modernSection}`}>
        <div className={`container smart-grid ${styles.modernContainer} ${styles.campaignGrid}`}>
          <div className="smart-card dark">
            <p className="kicker" style={{ color: "#f7c600" }}>
              Campaigns & Sale Offers
            </p>

            <h2>Promote your sale, deal, or campaign.</h2>

            <p className="muted">
              Built for restaurants, shops, promoters, venues, services, launches,
              discounts, food specials, and limited-time offers.
            </p>

            <div className="action-row">
              <Link className="btn btn-gold" href="/create?type=offer">
                Post a Sale Offer
              </Link>

              <Link className="btn btn-light" href="/campaigns">
                View Offers
              </Link>
            </div>
          </div>

          <div className="smart-card">
            <p className="kicker">What can you promote?</p>

            <h2>Sales, deals, launches, and specials.</h2>

            <div className="mood-grid">
              {[
                "Sale",
                "Deal",
                "Discount",
                "Food Special",
                "Product Offer",
                "Service Offer",
                "Business Promotion",
                "Event Campaign",
              ].map((item) => (
                <Link
                  className="mood-pill"
                  href={`/browse?category=${encodeURIComponent(item)}`}
                  key={item}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.modernSection}`}>
        <div className={`container ${styles.modernContainer}`}>
          <div className={`section-head ${styles.sectionHead}`}>
            <div>
              <p className="kicker">Categories</p>
              <h2>Popular categories.</h2>
              <p className={styles.sectionSubcopy}>
                Explore the most-searched promo types on YardPromoJa.
              </p>
            </div>
          </div>

          <div className={`grid grid-4 ${styles.categoryGrid}`}>
            {categories.slice(0, 8).map((category) => (
              <Link
                className="category-card"
                href={`/browse?category=${encodeURIComponent(category)}`}
                key={category}
              >
                <strong>{category}</strong>
                <p className="muted small">Browse promos</p>
              </Link>
            ))}
          </div>

          <div className={`trust-band ${styles.trustBand}`}>
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
