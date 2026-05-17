import "./globals.css";
import Link from "next/link";
import AuthNav from "../components/AuthNav";

export const metadata = {
  metadataBase: new URL("https://yardpromoja.com"),
  title: "YardPromo Jamaica | Find What’s Happening",
  description:
    "Discover Jamaican events, promos, venues, campaigns, and local deals — or post your own promo link.",
  openGraph: {
    title: "YardPromo Jamaica",
    description: "Find what’s happening in Jamaica or post your own promo link.",
    images: ["/assets/yardpromo-brand-presentation.png"],
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
    icon: "/assets/yardpromo-app-icon.png",
    apple: "/assets/yardpromo-app-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container nav">
            <Link href="/" className="brand brand-logo" aria-label="YardPromo home">
              <img
                className="brand-icon-img"
                src="/assets/yardpromo-app-icon.png"
                alt="YardPromo logo"
              />
              <span className="brand-copy">
                <img
                  className="brand-wordmark-img"
                  src="/assets/yardpromo-wordmark.png"
                  alt="YardPromo"
                />
                <small>Jamaican promotion platform</small>
              </span>
            </Link>

            <nav className="nav-links" aria-label="Primary navigation">
              <Link href="/">Home</Link>
              <Link href="/browse">Browse</Link>
              <Link href="/weekend">Weekend</Link>
              <Link href="/create">Post Promo</Link>
              <AuthNav />
            </nav>
          </div>

          <div className="launch-banner">
            <div className="launch-banner-inner">
              <div>
                <strong>Free launch posting:</strong>{" "}
                <span>
                  Upload your flyer, get a professional promo page, and share it
                  everywhere.
                </span>
              </div>
              <Link href="/create">Post Your Promo</Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="container footer-inner">
            <div>
              <div className="footer-logo-row">
                <img src="/assets/yardpromo-app-icon.png" alt="YardPromo" />
                <strong style={{ color: "#07111f" }}>YardPromo Jamaica</strong>
              </div>
              <p className="muted">
                Built for promoters, venues, businesses, and event organizers.
              </p>
            </div>
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/advertise">Advertise</Link>
              <Link href="/weekend">Weekly Roundup</Link>
              <Link href="/browse">Parish Pulse</Link>
              <Link href="/weekend">Weekend Board</Link>
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
