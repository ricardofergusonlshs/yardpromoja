import Link from "next/link";

const footerColumns = [
  {
    title: "Explore",
    links: [
      ["Events", "/browse?category=Party"],
      ["Food & Drinks", "/browse?category=Food"],
      ["Sale Offers", "/browse?category=Sale"],
      ["Campaigns", "/campaigns"],
      ["Link-Up", "/link-up"],
      ["By Parish", "/browse"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Advertise", "/advertise"],
      ["Packages", "/advertise/packages"],
      ["Media Kit", "/media-kit"],
      ["List Your Business", "/create"],
      ["Contact Us", "/contact"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help Center", "/contact"],
      ["Safety", "/terms"],
      ["Terms of Service", "/terms"],
      ["Privacy Policy", "/privacy"],
      ["Report a Promo", "/contact?topic=report"],
      ["Claim a Promo", "/claim"],
    ],
  },
  {
    title: "Popular Locations",
    links: [
      ["Montego Bay", "/browse?parish=St.%20James"],
      ["Negril", "/browse?parish=Westmoreland"],
      ["Ocho Rios", "/browse?parish=St.%20Ann"],
      ["Kingston", "/browse?parish=Kingston"],
      ["Port Antonio", "/browse?parish=Portland"],
      ["Mandeville", "/browse?parish=Manchester"],
    ],
  },
];

export default function YardPromoFooter() {
  return (
    <footer className="yp-full-footer">
      <div className="yp-container yp-full-footer-grid">
        <section className="yp-footer-brand">
          <Link className="yp-footer-logo" href="/">
            <span>🌴</span>
            <strong>YardPromo</strong>
            <em>Ja</em>
          </Link>

          <p>
            Your go-to guide for finding the best events, places, food,
            campaigns, offers, and link-ups across Jamaica.
          </p>

          <div className="yp-footer-socials" aria-label="Social links">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
              ◎
            </a>
            <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok">
              ♪
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
              f
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
              ▶
            </a>
          </div>

          <small>© 2026 YardPromoJa. All rights reserved.</small>
        </section>

        <nav className="yp-footer-columns" aria-label="Footer navigation">
          {footerColumns.map((column) => (
            <div className="yp-footer-column" key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map(([label, href]) => (
                <Link href={href} key={label}>
                  {label}
                </Link>
              ))}
            </div>
          ))}

          <div className="yp-footer-column yp-footer-download">
            <h3>Download the App</h3>
            <Link className="yp-store-badge" href="/manifest.webmanifest">
              <span>▶</span>
              <strong>
                Get it on
                <em>Google Play</em>
              </strong>
            </Link>
            <Link className="yp-store-badge" href="/manifest.webmanifest">
              <span></span>
              <strong>
                Download on the
                <em>App Store</em>
              </strong>
            </Link>
          </div>
        </nav>
      </div>

      <div className="yp-container yp-footer-bottom">
        <span>Made with ❤️ in Jamaica</span>
        <Link href="/create">Post Your Promo</Link>
      </div>
    </footer>
  );
}
