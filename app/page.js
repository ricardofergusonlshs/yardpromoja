import JamaicaParishMap from "@/components/JamaicaParishMap";
import Link from "next/link";
import AdsGrid from "./AdsGrid";
import HeroStack from "./components/HeroStack";

const categoryLinks = [
  { label: "Events & Parties", icon: "♫", href: "/browse?category=Party" },
  { label: "Food & Drinks", icon: "🍴", href: "/browse?category=Food" },
  { label: "Sale Offers", icon: "🏷", href: "/browse?category=Sale" },


  { label: "Beauty", icon: "✂", href: "/browse?category=Beauty" },
  { label: "Fashion", icon: "👕", href: "/browse?category=Fashion" },
  { label: "Transport", icon: "🚕", href: "/browse?category=Transport" },
  { label: "Stay", icon: "🛏", href: "/browse?category=Hotel" },
  { label: "Weekend", icon: "📅", href: "/weekend" },
  { label: "Parish Pulse", icon: "📍", href: "/browse" },
];

const planItems = [
  { label: "Food before or after", icon: "🍴" },
  { label: "Outfit / Fashion", icon: "👕" },
  { label: "Beauty / Grooming", icon: "✂" },
  { label: "Transport", icon: "🚕" },
  { label: "Stay / Hotel", icon: "🛏" },
  { label: "After-party", icon: "♫" },
];

const campaignCards = [
  {
    title: "Win tickets",
    text: "Run share-to-win giveaways for your event.",
    href: "/campaigns",
    tone: "gold",
  },
  {
    title: "Vote for your favourite DJ",
    text: "Let fans vote, share, and build interest.",
    href: "/campaigns",
    tone: "blue",
  },
  {
    title: "Sale offers",
    text: "Promote deals, discounts, and specials.",
    href: "/create?type=offer",
    tone: "pink",
  },
];

const parishCards = [
  {
    name: "Kingston",
    sub: "& St. Andrew",
    listings: "84+ listings",
    image: "/assets/parishes/kingston.png",
    href: "/browse?parish=Kingston",
  },
  {
    name: "St. Catherine",
    sub: "Portmore, Spanish Town",
    listings: "128+ listings",
    image: "/assets/parishes/st-catherine.png",
    href: "/browse?parish=St.%20Catherine",
  },
  {
    name: "Manchester",
    sub: "Mandeville",
    listings: "156+ listings",
    image: "/assets/parishes/manchester.png",
    href: "/browse?parish=Manchester",
  },
  {
    name: "Clarendon",
    sub: "May Pen",
    listings: "132+ listings",
    image: "/assets/parishes/clarendon.png",
    href: "/browse?parish=Clarendon",
  },
  {
    name: "St. Ann",
    sub: "Ocho Rios",
    listings: "178+ listings",
    image: "/assets/parishes/st-ann.png",
    href: "/browse?parish=St.%20Ann",
  },
  {
    name: "Trelawny",
    sub: "Falmouth",
    listings: "98+ listings",
    image: "/assets/parishes/trelawny.png",
    href: "/browse?parish=Trelawny",
  },
  {
    name: "St. James",
    sub: "Montego Bay",
    listings: "213+ listings",
    image: "/assets/parishes/st-james.png",
    href: "/browse?parish=St.%20James",
  },
  {
    name: "Hanover",
    sub: "Lucea",
    listings: "105+ listings",
    image: "/assets/parishes/hanover.png",
    href: "/browse?parish=Hanover",
  },
  {
    name: "Westmoreland",
    sub: "Negril, Savanna-la-Mar",
    listings: "250+ listings",
    image: "/assets/parishes/westmoreland.png",
    href: "/browse?parish=Westmoreland",
  },
  {
    name: "St. Elizabeth",
    sub: "Black River",
    listings: "167+ listings",
    image: "/assets/parishes/st-elizabeth.png",
    href: "/browse?parish=St.%20Elizabeth",
  },
  {
    name: "St. Mary",
    sub: "Port Maria",
    listings: "87+ listings",
    image: "/assets/parishes/st-mary.png",
    href: "/browse?parish=St.%20Mary",
  },
  {
    name: "Portland",
    sub: "Port Antonio",
    listings: "76+ listings",
    image: "/assets/parishes/portland.png",
    href: "/browse?parish=Portland",
  },
];

const reels = [
  {
    title: "Blue Lagoon",
    parish: "Port Antonio",
    image: "/assets/reels/blue-lagoon.png",
    href: "/browse?category=Experiences&parish=Portland",
  },
  {
    title: "Dancehall Night",
    parish: "Kingston",
    image: "/assets/reels/dancehall-night.png",
    href: "/browse?category=Party&parish=Kingston",
  },
  {
    title: "Jerk Chicken",
    parish: "Ocho Rios",
    image: "/assets/reels/jerk-chicken.png",
    href: "/browse?category=Food",
  },
  {
    title: "Reach Falls",
    parish: "Portland",
    image: "/assets/reels/reach-falls.png",
    href: "/browse?category=Experiences&parish=Portland",
  },
  {
    title: "Negril Vibes",
    parish: "Negril",
    image: "/assets/reels/negril-vibes.png",
    href: "/browse?parish=Westmoreland",
  },
  {
    title: "Sunset at Rick’s",
    parish: "Negril",
    image: "/assets/reels/sunset-ricks.png",
    href: "/browse?parish=Westmoreland",
  },
  {
    title: "Yardie Brunch",
    parish: "Montego Bay",
    image: "/assets/reels/yardie-brunch.png",
    href: "/browse?category=Food&parish=St.%20James",
  },
  {
    title: "Hiking in Jamaica",
    parish: "St. Ann",
    image: "/assets/reels/hiking-jamaica.png",
    href: "/browse?category=Experiences&parish=St.%20Ann",
  },
];

export default function Home() {
  return (
    <div className="yp-dark-home">
      <section className="yp-dark-hero">
        <div className="yp-container yp-home-hero-grid">
          <div className="yp-hero-copy">
            <p className="yp-mini-kicker">Discover the real Jamaica</p>

            <h1 className="ypHomeHeroTitle">
  <span className="ypHomeHeroLine">What&apos;s happening</span>
  <span className="ypHomeHeroJamaica">in Jamaica?</span>
</h1>

            <p className="yp-hero-text">
              Discover events, promotions, food, fashion, transport, stays,
              deals and more — all in one place.
            </p>

            <form className="yp-search-panel" action="/browse" method="GET">
              <label className="yp-search-field">
                <span>What are you looking for?</span>
                <input
                  name="q"
                  type="search"
                  placeholder="Search promos, food, events, places..."
                />
              </label>

              <label className="yp-search-select">
                <span>Category</span>
                <select name="category" defaultValue="">
                  <option value="">All Categories</option>
                  <option value="Party">Events & Parties</option>
                  <option value="Food">Food & Drinks</option>
                  <option value="Sale">Sale Offers</option>
                  <option value="Campaign">Campaigns</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Transport">Transport</option>
                  <option value="Hotel">Stay</option>
                </select>
              </label>

              <label className="yp-search-select">
                <span>Location</span>
                <select name="parish" defaultValue="">
                  <option value="">All Jamaica</option>
                  <option value="Kingston">Kingston</option>
                  <option value="St. Ann">St. Ann</option>
                  <option value="St. Catherine">St. Catherine</option>
                  <option value="St. James">St. James</option>
                  <option value="Manchester">Manchester</option>
                  <option value="Portland">Portland</option>
                  <option value="Westmoreland">Westmoreland</option>
                </select>
              </label>

              <button className="yp-search-button" type="submit" aria-label="Search">
                🔍
              </button>
            </form>

            <div className="yp-hero-actions">
              <Link className="yp-btn yp-btn-gold" href="/create">
                Post Your Promo
              </Link>
              <Link className="yp-btn yp-btn-green" href="/browse">
                Browse Promos
              </Link>
              <Link className="yp-btn yp-btn-outline" href="/link-up">
                ⚡ Plan the Link-Up
              </Link>
            </div>
          </div>

          <div className="yp-hero-showcase">
            <div className="yp-feature-ribbon">Featured promos</div>
            <HeroStack />
          </div>
        </div>
      </section>

      <section className="yp-category-strip-wrap">
        <div className="yp-container">
          <div className="yp-category-strip" aria-label="Promo categories">
            {categoryLinks.map((item) => (
              <Link className="yp-category-pill" href={item.href} key={item.label}>
                <span className="yp-category-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="yp-dark-section">
        <div className="yp-container yp-home-content-grid">
          <div className="yp-dark-card yp-trending-panel">
            <div className="yp-section-head">
              <div>
                <p className="yp-kicker">Trending Now</p>
                <h2>Promos people are checking.</h2>
              </div>
              <Link href="/browse">View All</Link>
            </div>

            <AdsGrid limit={6} section="featured" />
          </div>

          <aside className="yp-home-sidebar">
            <div className="yp-dark-card yp-linkup-preview">
              <p className="yp-kicker">Plan the Link-Up</p>
              <h2>You found the event. We help you plan the rest.</h2>

              <div className="yp-linkup-list">
                {planItems.map((item) => (
                  <Link
                    href={`/link-up?need=${encodeURIComponent(item.label)}`}
                    key={item.label}
                  >
                    <span>{item.icon}</span>
                    <strong>{item.label}</strong>
                    <em>›</em>
                  </Link>
                ))}
              </div>

              <Link className="yp-btn yp-btn-outline yp-full-btn" href="/link-up">
                Explore All
              </Link>
            </div>

            <div className="yp-dark-card yp-campaigns-preview">
              <div className="yp-section-head compact">
                <div>
                  <p className="yp-kicker">Campaigns & Offers</p>
                  <h2>Turn attention into action.</h2>
                </div>
                <Link href="/campaigns">View All</Link>
              </div>

              <div className="yp-campaign-mini-list">
                {campaignCards.map((card) => (
                  <Link
                    className={`yp-campaign-mini ${card.tone}`}
                    href={card.href}
                    key={card.title}
                  >
                    <strong>{card.title}</strong>
                    <span>{card.text}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="yp-dark-section yp-parish-section">
        <div className="yp-container yp-parish-panel">
          <div className="yp-section-head yp-parish-head">
            <div>
              <p className="yp-kicker">
                🌴 By Parish <span className="yp-new-pill">New</span>
              </p>
              <h2>Explore Jamaica by parish.</h2>
              <p>
                Find events, food spots, sale offers, adventures, services, and
                local promos near you.
              </p>
            </div>

            <Link href="/browse">View all parishes</Link>
          </div>

          <div className="yp-parish-layout">
            <div className="yp-parish-card-grid">
              {parishCards.map((parish) => (
                <Link
                  className="yp-parish-card"
                  href={parish.href}
                  key={parish.name}
                  style={{ backgroundImage: `url(${parish.image})` }}
                >
                  <span className="yp-parish-card-shade" />
                  <strong>{parish.name}</strong>
                  <small>{parish.sub}</small>
                  <em>{parish.listings}</em>
                </Link>
              ))}
            </div>

            <aside className="yp-parish-map-panel">
              <JamaicaParishMap />

              <div className="yp-parish-map-cta">
                <h3>Explore Your Parish</h3>
                <p>
                  Choose a parish and discover promos, food, campaigns, places,
                  weekend moves, and link-up ideas nearby.
                </p>
                <Link className="yp-btn yp-btn-green yp-full-btn" href="/browse">
                  📍 Select Your Parish
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="yp-dark-section yp-reels-section">
        <div className="yp-container">
          <div className="yp-section-head yp-reels-head">
            <div>
              <h2>
                YardPromo <span>Reels</span>
              </h2>
              <p>Real people. Real vibes. Real Jamaica.</p>
            </div>

            <Link href="/browse?format=reels">View all reels ›</Link>
          </div>

          <div className="yp-reels-row">
            {reels.map((reel) => (
              <Link
                className="yp-reel-card"
                href={reel.href}
                key={reel.title}
                style={{ backgroundImage: `url(${reel.image})` }}
              >
                <span className="yp-reel-play">▶</span>
                <span className="yp-reel-gradient" />
                <strong>{reel.title}</strong>
                <small>{reel.parish}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="yp-dark-section yp-bottom-marketing-section">
        <div className="yp-container yp-bottom-marketing">
          <div className="yp-promote-banner">
            <div>
              <h2>Promote your business.</h2>
              <p>Get seen. Get booked. Grow.</p>
            </div>

            <Link className="yp-btn yp-btn-gold" href="/create">
              List Your Business →
            </Link>
          </div>

          <div className="yp-newsletter-banner">
            <div>
              <h2>Stay in the loop</h2>
              <p>Get the best of Jamaica delivered to your inbox.</p>
            </div>

            <form className="yp-newsletter-form" action="/contact" method="GET">
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
