export const metadata = {
  title: "About | YardPromo Jamaica",
  description: "Learn about YardPromo Jamaica.",
};

export default function AboutPage() {
  return (
    <section className="section legal-page">
      <div className="container">
        <div className="legal-card">
          <p className="kicker">About</p>
          <h1>About YardPromo.</h1>

          <p>
            YardPromo Jamaica is a promotional platform built for Jamaican
            promoters, venues, businesses, event organizers, service providers,
            and local brands.
          </p>

          <h2>What we do</h2>
          <p>
            YardPromo helps people discover parties, shows, food deals,
            campaigns, venues, services, and community promotions across
            Jamaica.
          </p>

          <h2>For promoters</h2>
          <p>
            Promoters can post flyers, create shareable promo pages, collect
            interest, track RSVPs, and make their events easier to find online.
          </p>

          <h2>For visitors</h2>
          <p>
            Visitors can browse promotions, find weekend events, view event
            details, and discover what is happening across the island.
          </p>

          <h2>Our mission</h2>
          <p>
            Our mission is to make local promotion easier, cleaner, and more
            accessible for Jamaican communities and businesses.
          </p>
        </div>
      </div>
    </section>
  );
}