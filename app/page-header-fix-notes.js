/*
YardPromoJa homepage header cleanup notes.

Use this as a reference. Do not paste this file as your real page.js unless you
are rebuilding your homepage manually.

Your final app/page.js should have only one header at the top:

import YardPromoHeader from "./components/YardPromoHeader";

export default function HomePage() {
  return (
    <>
      <YardPromoHeader />

      <main>
        // Keep your existing hero here.
        // Keep the hero badge:
        // "LAUNCH SPECIAL / Free Promo Posting Now Open!"
        //
        // Remove any yellow announcement banner outside the hero.
        // Remove any second duplicate header/nav.
      </main>
    </>
  );
}

Search for and remove code that renders the yellow banner:
- "Free launch posting"
- "Upload your flyer"
- "professional promo page"
- "share it everywhere"

Search for and remove duplicate header components:
- <Header />
- <SiteHeader />
- <TopNav />
- <AnnouncementBanner />
- <TopRibbon />
- <YardPromoHeader /> if duplicated
*/
