"use client";

import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";

const services = [
  {
    title: "My Promos",
    description: "View, edit, duplicate, and manage your posted promos.",
    href: "/dashboard/promos",
    button: "Open My Promos",
    tag: "Manage",
  },
  {
    title: "Campaigns",
    description: "Create promotional campaigns connected to your YardPromo listings.",
    href: "/dashboard/campaigns",
    button: "Set Campaigns",
    tag: "Promote",
  },
  {
    title: "Sale Offers",
    description: "Add discounts, giveaways, bundles, and limited-time offers.",
    href: "/dashboard/sale-offers",
    button: "Add Sale Offers",
    tag: "Offers",
  },
  {
    title: "Request Feature",
    description: "Request featured placement for more visibility across YardPromo Jamaica.",
    href: "/advertise",
    button: "Request Feature",
    tag: "Visibility",
  },
  {
    title: "Premium",
    description: "Apply for premium promotion and higher visibility placement.",
    href: "/premium",
    button: "Go Premium",
    tag: "Premium",
  },
  {
    title: "Weekend Boost",
    description: "Boost your promo for weekend traffic and event discovery.",
    href: "/weekend",
    button: "Weekend Boost",
    tag: "Weekend",
  },
  {
    title: "Post Promo",
    description: "Upload a new flyer and create a professional promo page.",
    href: "/post-promo",
    button: "Post Promo",
    tag: "Create",
  },
  {
    title: "Account",
    description: "Update your profile, contact information, and promoter details.",
    href: "/account",
    button: "Account Settings",
    tag: "Profile",
  },
];

export default function ServicesPage() {
  return (
    <RequireAuth>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Promoter Services</p>
              <h1>Manage your YardPromo tools.</h1>
              <p className="muted">
                Manage your promos, campaigns, sale offers, featured placement,
                premium boosts, and weekend promotion tools from one place.
              </p>
            </div>

            <Link className="btn btn-primary" href="/post-promo">
              Post Promo
            </Link>
          </div>

          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {services.map((service) => (
              <article className="panel" key={service.href}>
                <p className="kicker">{service.tag}</p>
                <h3>{service.title}</h3>
                <p className="muted">{service.description}</p>

                <Link className="btn btn-light" href={service.href}>
                  {service.button}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
