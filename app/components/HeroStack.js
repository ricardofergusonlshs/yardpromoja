"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { activeAds, cleanAd, sampleAds } from "@/lib/yardpromoData";

export default function HeroStack() {
  const fallbackItems = activeAds(sampleAds)
    .filter((ad) => ad.is_featured)
    .concat(activeAds(sampleAds).filter((ad) => !ad.is_featured))
    .slice(0, 3)
    .map(cleanAd);
  const [items, setItems] = useState(fallbackItems);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .in("status", ["active", "approved"])
          .order("is_featured", { ascending: false })
          .limit(3);

        if (!error && alive && data && data.length > 0) {
          setItems(data.map(cleanAd));
        }
      } catch (error) {
        console.info("YardPromo hero demo posters are being used because Supabase is unavailable.");
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  const posterItems = [...items, ...fallbackItems].slice(0, 3);

  return (
    <div className="poster-stack">
      {posterItems[0] ? (
        <Link
          href={`/ad/${posterItems[0].slug}`}
          className="mini-poster main"
          aria-label={`View ${posterItems[0].title}`}
        >
          <img src={posterItems[0].poster_image_url} alt={`${posterItems[0].title} poster`} />
          <span className="poster-label">View Promo</span>
        </Link>
      ) : null}

      {posterItems[1] ? (
        <Link
          href={`/ad/${posterItems[1].slug}`}
          className="mini-poster two"
          aria-label={`View ${posterItems[1].title}`}
        >
          <img src={posterItems[1].poster_image_url} alt={`${posterItems[1].title} poster`} />
          <span className="poster-label">View Promo</span>
        </Link>
      ) : null}

      {posterItems[2] ? (
        <Link
          href={`/ad/${posterItems[2].slug}`}
          className="mini-poster three"
          aria-label={`View ${posterItems[2].title}`}
        >
          <img src={posterItems[2].poster_image_url} alt={`${posterItems[2].title} poster`} />
          <span className="poster-label">View Promo</span>
        </Link>
      ) : null}
    </div>
  );
}
