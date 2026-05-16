import Link from "next/link";

export const metadata = {
  title: "Pricing | YardPromo Jamaica",
  description: "YardPromo Jamaica launch pricing and advertising options.",
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

export default function PricingPage() {
  return (
    <section className="section pricing-page">
      <div className="container">
        <div className="pricing-head">
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