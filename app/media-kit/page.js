import Link from "next/link";
import styles from "./MediaKit.module.css";

export const metadata = {
  title: "Media Kit | YardPromoJa",
  description:
    "YardPromoJa media kit for advertisers, promoters, partners, and Jamaican local businesses.",
};

const stats = [
  ["Active promo types", "Events, food, offers, services, campaigns"],
  ["Audience intent", "People looking for where to go, eat, shop, book, and link up"],
  ["Action tools", "Shares, RSVP, calendar, directions, contact, save"],
  ["Advertiser fit", "Promoters, restaurants, venues, boutiques, services, stays"],
];

const placements = [
  {
    title: "Homepage feature",
    text: "Premium visibility near the main discovery flow.",
  },
  {
    title: "Category placement",
    text: "Appear inside events, food, sale offers, beauty, fashion, stay, transport, and more.",
  },
  {
    title: "Parish discovery",
    text: "Connect promotions to where people are searching in Jamaica.",
  },
  {
    title: "Link-Up planner",
    text: "Help users plan around an event with related food, outfit, transport, stay, and after-party ideas.",
  },
  {
    title: "Campaign cards",
    text: "Giveaways, votes, sale offers, and engagement activations.",
  },
  {
    title: "Share pack",
    text: "WhatsApp, Facebook, X, TikTok-friendly links, copy link, and social preview support.",
  },
];

export default function MediaKitPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.wrap}>
          <p className={styles.kicker}>Media kit</p>
          <h1>
            YardPromoJa is the link between <span>social attention</span> and real action.
          </h1>
          <p>
            A Jamaican promotion platform for events, food spots, venues,
            services, offers, campaigns, and link-up planning.
          </p>

          <div className={styles.actions}>
            <Link href="/advertise/packages">View Packages</Link>
            <Link href="/advertise">Advertise With Us</Link>
            <Link href="/create">Post Your Promo</Link>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.wrap}>
          {stats.map(([label, value]) => (
            <article key={label}>
              <strong>{label}</strong>
              <span>{value}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.placements}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Advertiser placements</p>
              <h2>Where brands can show up.</h2>
            </div>
          </div>

          <div className={styles.grid}>
            {placements.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.wrap}>
          <div>
            <p className={styles.kicker}>The gap we fill</p>
            <h2>Social posts move fast. YardPromoJa keeps the action clear.</h2>
          </div>

          <div className={styles.storyCards}>
            <article>
              <strong>Social media</strong>
              <p>Great for attention, visuals, and conversation.</p>
            </article>
            <article>
              <strong>YardPromoJa</strong>
              <p>Great for actions, details, discovery, link-up planning, and sharing one clean promo page.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.wrap}>
          <div>
            <p className={styles.kicker}>Partner with us</p>
            <h2>Give advertisers a higher presence without replacing social media.</h2>
            <p>
              YardPromoJa complements the social post and gives people somewhere
              clear to act after they see the flyer.
            </p>
          </div>
          <Link href="/contact?topic=media-kit">Request Media Info</Link>
        </div>
      </section>
    </main>
  );
}
