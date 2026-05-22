import "./globals.css";
import "./mobile/mobile.css";
import "./yp-dark.css";
import Link from "next/link";
import AuthNav from "./components/AuthNav";

export const metadata = {
  metadataBase: new URL("https://yardpromoja.com"),
  applicationName: "YardPromo Jamaica",
  manifest: "/manifest.webmanifest",
  title: "YardPromo Jamaica | Find What’s Happening",
  description:
    "Discover Jamaican events, promos, venues, campaigns, and local deals — or post your own promo link.",
  appleWebApp: {
    capable: true,
    title: "YardPromoJa",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "YardPromo Jamaica",
    description: "Find what’s happening in Jamaica or post your own promo link.",
    images: ["/assets/yardpromo-logo-horizontal.png"],
    type: "website",
    url: "https://yardpromoja.com",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://yardpromoja.com",
  },
  icons: {
    icon: "/assets/favicon.png",
    shortcut: "/assets/favicon.png",
    apple: "/assets/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#008a3d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <header className="header yp-site-header">
          <div className="yp-container nav">
            <Link
              href="/"
              className="brand brand-logo"
              aria-label="YardPromoJa home"
            >
              <img
                className="brand-icon-img"
                src="/assets/yardpromo-icon.png"
                alt="YardPromoJa"
              />

              <span className="brand-copy">
                <img
                  className="brand-wordmark-img"
                  src="/assets/yardpromo-logo-horizontal.png"
                  alt="YardPromoJa"
                />
                <small>Jamaica’s link-up planner</small>
              </span>
            </Link>

            <nav className="nav-links" aria-label="Primary navigation">
              <AuthNav />
            </nav>
          </div>

          <div className="launch-banner yp-launch-banner">
            <div className="launch-banner-inner">
              <div>
                <strong>Social media gets attention.</strong>{" "}
                <span>
                  YardPromoJa turns your flyer into a link-up page with actions,
                  shares, directions, campaigns, and offers.
                </span>
              </div>

              <Link href="/create">Post Your Promo</Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer yp-site-footer">
          <div className="yp-container footer-inner">
            <div>
              <div className="footer-logo-row">
                <img
                  className="brand-icon-img"
                  src="/assets/yardpromo-icon.png"
                  alt="YardPromoJa"
                />
                <strong>YardPromoJa</strong>
              </div>

              <p className="muted">
                Jamaica’s link-up planner for events, businesses, campaigns,
                food, offers, and local promotion.
              </p>
            </div>

            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/advertise">Advertise</Link>
              <Link href="/campaigns">Campaigns & Giveaways</Link>
              <Link href="/link-up">Plan the Link-Up</Link>
              <Link href="/browse">Parish Pulse</Link>
              <Link href="/Newest">Weekend Board</Link>
              <Link href="/browse">Rankings</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/privacy">Personalization Policy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
