import Link from "next/link";
import styles from "./Packages.module.css";

export const metadata = {
  title: "Advertiser Packages | YardPromoJa",
  description:
    "YardPromoJa advertiser packages for events, food spots, brands, services, campaigns, offers, and Jamaican link-up planning.",
};

const packages = [
  {
    name: "Starter Promo",
    tag: "For first-time posts",
    price: "Free launch / intro",
    description:
      "Turn a flyer or social post into a clean promo page with share actions, directions, contact details, and discovery on YardPromoJa.",
    features: [
      "Promo page from your flyer",
      "WhatsApp and share actions",
      "RSVP / interest buttons",
      "Map and directions support",
      "Open Graph thumbnail sharing",
    ],
    cta: "Post Your Promo",
    href: "/create",
    featured: false,
  },
  {
    name: "Link-Up Boost",
    tag: "Best for events",
    price: "Featured package",
    description:
      "Help people plan around your event with food, fashion, beauty, transport, stay, after-party, and weekend suggestions.",
    features: [
      "Featured homepage / category placement",
      "Plan the Link-Up placement",
      "Audience action tracking",
      "Save-to-calendar flow",
      "Campaign-ready share links",
    ],
    cta: "Start a Link-Up Boost",
    href: "/advertise",
    featured: true,
  },
  {
    name: "Campaign Kit",
    tag: "For engagement",
    price: "Campaign add-on",
    description:
      "Run a structured campaign that complements social media: giveaways, vote-to-win, guest list interest, sale offers, or sponsor activations.",
    features: [
      "Share-to-win campaign option",
      "Vote / poll style campaign",
      "Sale offer spotlight",
      "Campaign landing card",
      "Clear CTA and reporting path",
    ],
    cta: "Explore Campaigns",
    href: "/campaigns",
    featured: false,
  },
  {
    name: "Business Presence",
    tag: "For local brands",
    price: "Monthly visibility",
    description:
      "Build a stronger local presence beyond one post with always-on discovery for restaurants, boutiques, attractions, services, and stays.",
    features: [
      "Business profile style page",
      "Parish and category discovery",
      "Offer and promo updates",
      "Footer / parish visibility path",
      "Media kit support",
    ],
    cta: "Advertise With Us",
    href: "/advertise",
    featured: false,
  },
];

const comparison = [
  ["Promo page", "Yes", "Yes", "Yes", "Yes"],
  ["Open share thumbnail", "Yes", "Yes", "Yes", "Yes"],
  ["Homepage / category boost", "Limited", "Yes", "Optional", "Yes"],
  ["Campaign tools", "No", "Optional", "Yes", "Optional"],
  ["Link-Up planner placement", "No", "Yes", "Optional", "Yes"],
  ["Reporting focus", "Basic", "Enhanced", "Campaign", "Monthly"],
];

const useCases = [
  {
    title: "Events & parties",
    text: "Promote flyers with RSVP, calendar, map, share pack, link-up planning, and after-party discovery.",
  },
  {
    title: "Food & drinks",
    text: "Give restaurants, bars, brunches, pop-ups, and food events a page people can save and share.",
  },
  {
    title: "Campaigns & offers",
    text: "Run giveaways, votes, sale offers, and sponsored activations that drive action from social attention.",
  },
  {
    title: "Local services",
    text: "Support beauty, fashion, transport, stays, attractions, and parish-based discovery.",
  },
];

export default function AdvertiserPackagesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.wrap}>
          <p className={styles.kicker}>Advertiser packages</p>
          <h1>
            Social media gets attention. <span>YardPromoJa turns it into action.</span>
          </h1>
          <p>
            Give advertisers a flexible promo presence that complements their
            social media posts — with share links, RSVP, directions, campaigns,
            offers, and link-up planning in one Jamaican discovery platform.
          </p>

          <div className={styles.actions}>
            <Link href="/create">Post Your Promo</Link>
            <Link href="/advertise">Advertise With Us</Link>
            <Link href="/media-kit">View Media Kit</Link>
          </div>
        </div>
      </section>

      <section className={styles.packageSection}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Packages</p>
              <h2>Choose the level of presence.</h2>
            </div>
            <Link href="/contact?topic=advertising">Talk to us</Link>
          </div>

          <div className={styles.packageGrid}>
            {packages.map((item) => (
              <article
                className={`${styles.packageCard} ${
                  item.featured ? styles.featured : ""
                }`}
                key={item.name}
              >
                <span className={styles.tag}>{item.tag}</span>
                <h3>{item.name}</h3>
                <strong>{item.price}</strong>
                <p>{item.description}</p>

                <ul>
                  {item.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <Link href={item.href}>{item.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.useCases}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Who it helps</p>
              <h2>Built around Jamaican promotion needs.</h2>
            </div>
          </div>

          <div className={styles.useCaseGrid}>
            {useCases.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.compareSection}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Comparison</p>
              <h2>Clear value without changing your app function.</h2>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Starter</th>
                  <th>Link-Up Boost</th>
                  <th>Campaign Kit</th>
                  <th>Business Presence</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.wrap}>
          <div>
            <p className={styles.kicker}>Ready for advertisers</p>
            <h2>Turn a flyer into a page people can act on.</h2>
            <p>
              Start with a flexible package, then add campaign tools, parish
              visibility, or Link-Up planning when the advertiser is ready.
            </p>
          </div>
          <Link href="/advertise">Advertise With Us</Link>
        </div>
      </section>
    </main>
  );
}
