import Link from "next/link";
import styles from "./Reels.module.css";

export const metadata = {
  title: "YardPromo Reels | YardPromoJa",
  description:
    "Watch Jamaican promo inspiration, food, nightlife, attractions, events, and link-up ideas from YardPromoJa.",
};

const reels = [
  {
    title: "Blue Lagoon",
    parish: "Port Antonio",
    category: "Hidden Gems",
    image: "/assets/reels/blue-lagoon.png",
    href: "/browse?category=Experiences&parish=Portland",
  },
  {
    title: "Dancehall Night",
    parish: "Kingston",
    category: "Nightlife",
    image: "/assets/reels/dancehall-night.png",
    href: "/browse?category=Party&parish=Kingston",
  },
  {
    title: "Jerk Chicken",
    parish: "Ocho Rios",
    category: "Food & Drinks",
    image: "/assets/reels/jerk-chicken.png",
    href: "/browse?category=Food",
  },
  {
    title: "Reach Falls",
    parish: "Portland",
    category: "Experiences",
    image: "/assets/reels/reach-falls.png",
    href: "/browse?category=Experiences&parish=Portland",
  },
  {
    title: "Negril Vibes",
    parish: "Negril",
    category: "Beach",
    image: "/assets/reels/negril-vibes.png",
    href: "/browse?parish=Westmoreland",
  },
  {
    title: "Sunset at Rick’s",
    parish: "Negril",
    category: "Weekend",
    image: "/assets/reels/sunset-ricks.png",
    href: "/browse?parish=Westmoreland",
  },
  {
    title: "Yardie Brunch",
    parish: "Montego Bay",
    category: "Food",
    image: "/assets/reels/yardie-brunch.png",
    href: "/browse?category=Food&parish=St.%20James",
  },
  {
    title: "Hiking in Jamaica",
    parish: "St. Ann",
    category: "Adventure",
    image: "/assets/reels/hiking-jamaica.png",
    href: "/browse?category=Experiences&parish=St.%20Ann",
  },
];

const buckets = [
  ["Events & Parties", "/browse?category=Party"],
  ["Food & Drinks", "/browse?category=Food"],
  ["Hidden Gems", "/browse?category=Experiences"],
  ["Weekend", "/weekend"],
  ["Plan the Link-Up", "/link-up"],
];

export default function ReelsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.wrap}>
          <p className={styles.kicker}>YardPromo Reels</p>
          <h1>
            Real people. Real vibes. <span>Real Jamaica.</span>
          </h1>
          <p>
            A visual lane for places, food, events, weekend moves, campaigns,
            and link-up ideas people can discover fast.
          </p>

          <div className={styles.actions}>
            <Link href="/browse">Browse Promos</Link>
            <Link href="/create">Post Your Promo</Link>
            <Link href="/link-up">Plan the Link-Up</Link>
          </div>
        </div>
      </section>

      <section className={styles.filters}>
        <div className={styles.wrap}>
          {buckets.map(([label, href]) => (
            <Link href={href} key={label}>
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Featured reels</p>
              <h2>Explore the island by vibe.</h2>
            </div>
            <Link href="/browse">View all promos</Link>
          </div>

          <div className={styles.reelGrid}>
            {reels.map((reel) => (
              <Link
                className={styles.reelCard}
                href={reel.href}
                key={reel.title}
                style={{ backgroundImage: `url(${reel.image})` }}
              >
                <span className={styles.play}>▶</span>
                <span className={styles.category}>{reel.category}</span>
                <div>
                  <strong>{reel.title}</strong>
                  <small>{reel.parish}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.wrap}>
          <div>
            <p className={styles.kicker}>For promoters</p>
            <h2>Turn a reel, flyer, or post into a link people can act on.</h2>
            <p>
              Add your promo page, share it everywhere, and let people RSVP,
              save, contact you, browse offers, and plan the link-up.
            </p>
          </div>
          <Link href="/create">Post Your Promo</Link>
        </div>
      </section>
    </main>
  );
}
