import Link from "next/link";
import AdsGrid from "./AdsGrid";
import { categories } from "@/lib/yardpromoData";

const categoryLinks = [
  { label: "Events & Parties", href: "/browse?category=Events", icon: "🎟️" },
  { label: "Food & Drinks", href: "/browse?category=Food", icon: "🍽️" },
  { label: "Campaigns", href: "/campaigns", icon: "🏆" },
  { label: "Sale Offers", href: "/browse?category=Sale", icon: "🏷️" },
  { label: "Weekend", href: "/weekend", icon: "🔥" },
  { label: "Parish Pulse", href: "/browse", icon: "📍" },
  { label: "Saved Promos", href: "/saved", icon: "♡" },
  { label: "List Your Promo", href: "/create", icon: "➕" },
];

const popularSearches = [
  { label: "Dancehall", href: "/browse?category=Dancehall" },
  { label: "Food deals", href: "/browse?category=Food" },
  { label: "Weekend", href: "/weekend" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Sale offers", href: "/browse?category=Sale" },
];

const parishLinks = [
  "Kingston",
  "St. Catherine",
  "St. Ann",
  "Montego Bay",
  "Manchester",
  "St. James",
  "Westmoreland",
  "Portland",
];

export default function Home() {
  return (
    <div className="yp-discovery-home">
      <section className="yp-hero-premium">
        <div className="yp-hero-bg" />

        <div className="container yp-hero-content">
          <div className="yp-hero-copy">
            <div className="yp-location-kicker">
              <span>🇯🇲</span>
              Discover the real Jamaica
            </div>

            <h1>
              What’s happening in <span>Jamaica?</span>
            </h1>

            <p>
              Discover events, food deals, businesses, services, campaigns,
              and local promos near you — or post your own promo link in minutes.
            </p>

            <form className="yp-search-bar" action="/browse" method="GET">
              <label htmlFor="yp-home-search" className="sr-only">
                Search YardPromo Jamaica
              </label>

              <input
                id="yp-home-search"
                type="search"
                name="search"
                placeholder="What are you looking for?"
              />

              <select name="category" aria-label="Category">
                <option value="">All Categories</option>
                {categories.slice(0, 12).map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select name="parish" aria-label="Location">
                <option value="">All Locations</option>
                {parishLinks.map((parish) => (
                  <option value={parish} key={parish}>
                    {parish}
                  </option>
                ))}
              </select>

              <button type="submit" aria-label="Search promos">
                Search
              </button>
            </form>

            <div className="yp-popular-searches" aria-label="Popular searches">
              <span>Popular searches:</span>
              {popularSearches.map((item) => (
                <Link href={item.href} key={item.label}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="yp-hero-actions">
              <Link className="btn btn-gold" href="/create">
                Post Your Promo
              </Link>

              <Link className="btn btn-light" href="/browse">
                Browse Promos
              </Link>
            </div>
          </div>

          <div className="yp-hero-showcase" aria-label="YardPromo preview">
            <div className="yp-showcase-card yp-showcase-main">
              <img src="/assets/yardpromo-brand-preview.png" alt="YardPromo preview" />
            </div>

            <div className="yp-floating-proof">
              <strong>Broadcast • Promote • Connect</strong>
              <span>Promo pages, share links, RSVP, inquiries, and reports.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="yp-category-dock">
        <div className="container">
          <div className="yp-category-scroll">
            {categoryLinks.map((item) => (
              <Link className="yp-category-tile" href={item.href} key={item.label}>
                <span>{item.icon}</span>
                <strong>{item.label}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section yp-dark-section">
        <div className="container">
          <div className="section-head yp-section-head-light">
            <div>
              <p className="kicker">Trending now</p>
              <h2>Featured promos.</h2>
              <p className="muted">
                The latest promoted events, offers, and businesses on YardPromoJa.
              </p>
            </div>

            <Link className="btn btn-light" href="/browse">
              View all
            </Link>
          </div>

          <AdsGrid limit={3} section="featured" />
        </div>
      </section>

      <section className="section yp-dark-section yp-parish-section">
        <div className="container yp-parish-panel">
          <div className="section-head yp-section-head-light">
            <div>
              <p className="kicker">By parish</p>
              <h2>Explore what’s happening near you.</h2>
            </div>

            <Link className="btn btn-light" href="/browse">
              Browse Jamaica
            </Link>
          </div>

          <div className="yp-parish-grid">
            {parishLinks.map((parish) => (
              <Link
                className="yp-parish-card"
                href={`/browse?parish=${encodeURIComponent(parish)}`}
                key={parish}
              >
                <span>📍</span>
                <strong>{parish}</strong>
                <small>View promos</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section yp-dark-section">
        <div className="container yp-campaign-offer-grid">
          <div className="yp-campaign-card">
            <p className="kicker">Campaigns & Sale Offers</p>
            <h2>Win tickets, vote for DJs, run sales, and grow interest.</h2>

            <p>
              Run share-to-win giveaways, DJ votes, guest lists, sale offers,
              and limited-time promotions without changing your current workflow.
            </p>

            <div className="action-row">
              <Link className="btn btn-gold" href="/campaigns">
                View Campaigns
              </Link>

              <Link className="btn btn-light" href="/create?type=campaign">
                Start a Campaign
              </Link>
            </div>
          </div>

          <div className="yp-offer-card">
            <p className="kicker">What can you promote?</p>
            <h2>Events, food, services, deals, and more.</h2>

            <div className="mood-grid">
              {[
                "Event Campaign",
                "Food Special",
                "Sale",
                "Discount",
                "Product Offer",
                "Service Offer",
                "Business Promotion",
                "Guest List",
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

      <section className="section yp-dark-section">
        <div className="container">
          <div className="section-head yp-section-head-light">
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

      <section className="section yp-dark-section">
        <div className="container">
          <div className="section-head yp-section-head-light">
            <div>
              <p className="kicker">Promo highlights</p>
              <h2>Fresh links to explore.</h2>
            </div>

            <Link className="btn btn-light" href="/browse">
              Browse all
            </Link>
          </div>

          <AdsGrid limit={6} />
        </div>
      </section>

      <section className="section yp-dark-section">
        <div className="container yp-business-cta">
          <div>
            <p className="kicker">Promote your business</p>
            <h2>Get seen. Get booked. Grow.</h2>
            <p>
              Create a shareable YardPromoJa page for your event, sale, food special,
              service, campaign, or business promotion.
            </p>
          </div>

          <div className="yp-cta-actions">
            <Link className="btn btn-gold" href="/create">
              Post Your Promo
            </Link>

            <Link className="btn btn-light" href="/advertise">
              Advertise
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
