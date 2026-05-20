import Link from "next/link";
import AdsGrid from "./AdsGrid";
import HeroStack from "./components/HeroStack";
import { categories } from "@/lib/yardpromoData";

const moodLinks = [
  {
    label: "Party tonight",
    href: "/browse?category=Party",
  },
  {
    label: "Food & brunch",
    href: "/browse?category=Food",
  },
  {
    label: "Live music",
    href: "/browse?category=Concert",
  },
  {
    label: "Family friendly",
    href: "/browse?category=Family",
  },
  {
    label: "Business deals",
    href: "/browse?category=Business",
  },
  {
    label: "Beauty & grooming",
    href: "/browse?category=Beauty",
  },
  {
    label: "VIP nightlife",
    href: "/browse?category=VIP",
  },
  {
    label: "Free entry",
    href: "/browse?price=free",
  },
  {
    label: "Date night",
    href: "/browse?category=Date%20Night",
  },
  {
    label: "Things to do this weekend",
    href: "/weekend",
  },
];

export default function Home() {
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

          <AdsGrid limit={3} section="premium" />
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

    <AdsGrid limit={3} section="weekend" />
  </div>
</section>

<section className="section">
  <div className="container smart-grid">
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

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Categories</p>
              <h2>Popular categories.</h2>
            </div>
          </div>

          <div className="grid grid-4">
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