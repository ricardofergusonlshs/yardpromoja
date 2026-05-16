import Link from "next/link";

export const metadata = {
  title: "Advertise | YardPromo Jamaica",
  description: "Advertise with YardPromo Jamaica.",
};

const plans = [
  {
    title: "Free Launch Ad",
    price: "JMD $0",
    text: "Public promo page, poster upload, shareable link",
  },
  {
    title: "Weekend Boost",
    price: "Coming soon",
    text: "Higher weekend placement",
  },
  {
    title: "Parish Spotlight",
    price: "Coming soon",
    text: "Featured by parish",
  },
  {
    title: "Homepage Featured",
    price: "Coming soon",
    text: "Premium homepage placement",
  },
  {
    title: "Promoter Monthly Plan",
    price: "Coming soon",
    text: "For regular promoters and businesses",
  },
];

export default function AdvertisePage() {
  return (
    <section className="section advertise-page">
      <div className="container">
        <div className="advertise-head">
          <div>
            <p className="kicker">Advertise</p>
            <h1>Free during launch.</h1>
          </div>

          <Link className="btn btn-primary" href="/create">
            Post Promo
          </Link>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className="price-card" key={plan.title}>
              <h2>{plan.title}</h2>
              <strong>{plan.price}</strong>
              <p>{plan.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}