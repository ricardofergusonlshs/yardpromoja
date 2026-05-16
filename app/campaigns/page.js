"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

const campaignPlans = [
  {
    name: "Launch Boost",
    label: "Starter",
    price: "Free",
    description:
      "Get your promo page live with a clean share link, flyer image, event details, and basic discovery placement.",
    features: [
      "Promo page",
      "Browse listing",
      "Share-ready link",
      "Basic event details",
    ],
  },
  {
    name: "Weekend Push",
    label: "Popular",
    price: "JMD $2,500",
    description:
      "Give your event stronger placement across YardPromo for weekend discovery and higher visibility.",
    features: [
      "Featured placement",
      "Weekend section",
      "Higher card priority",
      "RSVP and interest tracking",
    ],
  },
  {
    name: "Island Campaign",
    label: "Premium",
    price: "Custom",
    description:
      "A stronger campaign package for brands, venues, promoters, and recurring events across Jamaica.",
    features: [
      "Premium homepage placement",
      "Multiple promo cards",
      "Campaign tracking",
      "Custom support",
    ],
  },
];

const campaignSteps = [
  {
    number: "1",
    title: "Upload your flyer",
    text: "Add your promo image, event details, location, date, and price.",
  },
  {
    number: "2",
    title: "Get a promo page",
    text: "YardPromo creates a clean page you can share everywhere.",
  },
  {
    number: "3",
    title: "Reach more people",
    text: "Your promo can appear in Browse, Weekend, Calendar, and featured sections.",
  },
];

export default function CampaignsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function verify() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!data?.user) {
        router.push("/login");
      } else {
        setChecking(false);
      }
    }

    verify();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  if (checking) {
    return (
      <main className="section">
        <div className="container">
          <div className="toast">Checking login status...</div>
        </div>
      </main>
    );
  }

  return (
    <section className="section campaigns-page">
      <div className="container">
        <div className="campaigns-hero panel">
          <p className="kicker">Campaigns</p>
          <h1>Promote smarter across Jamaica.</h1>
          <p>
            Launch clean promo pages, push events for the weekend, and help more
            people discover parties, shows, food deals, venues, services, and
            local offers.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" href="/create">
              Start Campaign
            </Link>
            <Link className="btn btn-light" href="/browse">
              Browse Promos
            </Link>
          </div>
        </div>

        <div className="section-head">
          <div>
            <p className="kicker">Campaign options</p>
            <h2>Choose your promo push.</h2>
          </div>

          <Link className="btn btn-light" href="/create">
            Post Promo
          </Link>
        </div>

        <div className="campaign-grid">
          {campaignPlans.map((plan) => (
            <article className="campaign-card" key={plan.name}>
              <span className="campaign-label">{plan.label}</span>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>

              <div className="campaign-price">{plan.price}</div>

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <Link className="details-btn" href="/create">
                Get Started
              </Link>
            </article>
          ))}
        </div>

        <div className="section-head">
          <div>
            <p className="kicker">How it works</p>
            <h2>Simple promo flow.</h2>
          </div>
        </div>

        <div className="campaign-steps">
          {campaignSteps.map((step) => (
            <article className="campaign-step" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}