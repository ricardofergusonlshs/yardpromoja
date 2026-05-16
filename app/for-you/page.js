"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdsGrid from "../AdsGrid";
import { createClient } from "@/lib/supabaseClient";
import { activeAds, heatScore, sampleAds } from "@/lib/yardpromoData";

export default function ForYouPage() {
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

  const ads = [...activeAds(sampleAds)].sort((a, b) => heatScore(b) - heatScore(a));
  const labels = [
    "Popular near you",
    "Trending this weekend",
    "Similar to what you viewed",
    "New in Kingston",
    "Food deals near you",
    "Guest list active",
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero">
          <p className="kicker" style={{ color: "#f7c600" }}>
            For You
          </p>
          <h2>Your discovery feed.</h2>
          <p>
            Smart picks based on parish, category, popularity, RSVPs, and recent
            sharing activity.
          </p>
          <div className="action-row">
            <Link className="btn btn-gold" href="/browse">
              Tune Your Feed
            </Link>
            <Link className="btn btn-light" href="/browse">
              Get Alerts
            </Link>
          </div>
        </div>
        <div className="grid grid-3">
          {ads.slice(0, 6).map((ad, index) => (
            <div key={ad.slug}>
              <span className="heat-badge" style={{ marginBottom: 10 }}>
                {labels[index % labels.length]}
              </span>
              <AdsGrid ads={[ad]} limit={1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
