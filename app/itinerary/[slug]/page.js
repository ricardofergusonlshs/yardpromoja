"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import ItineraryDaySchedule from "@/app/components/ItineraryDaySchedule";

export default function ItineraryDetailPage({ params }) {
  const { slug } = use(params);
  const supabase = useMemo(() => createClient(), []);

  const [itinerary, setItinerary] = useState(null);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setMessage("");

      try {
        const { data: itineraryData, error } = await supabase.from("itineraries").select("*").eq("slug", slug).maybeSingle();
        if (error) throw error;

        if (!itineraryData) {
          if (alive) setMessage("Itinerary not found.");
          return;
        }

        const { data: itemData, error: itemError } = await supabase
          .from("itinerary_items")
          .select("*")
          .eq("itinerary_id", itineraryData.id)
          .order("day_number", { ascending: true })
          .order("sort_order", { ascending: true });

        if (itemError) throw itemError;

        if (alive) {
          setItinerary(itineraryData);
          setItems(itemData || []);
        }
      } catch (error) {
        if (alive) setMessage(error?.message || "Unable to load itinerary.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, [slug, supabase]);

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Itinerary link copied.");
    } catch {
      setMessage("Copy this page URL to share the itinerary.");
    }
  }

  return (
    <main className="section">
      <div className="container">
        {loading ? <div className="toast">Loading itinerary...</div> : null}
        {message ? <div className="toast">{message}</div> : null}

        {itinerary ? (
          <>
            <section className="panel" style={{ marginBottom: 18 }}>
              <div className="section-head">
                <div>
                  <p className="kicker">{itinerary.parish || "Jamaica"} · {String(itinerary.travel_style || "itinerary").replaceAll("_", " ")}</p>
                  <h1>{itinerary.title}</h1>
                  <p className="muted">{itinerary.description || "YardPromoJa trip plan."}</p>
                  <div className="promo-mini-stats">
                    <span>{itinerary.trip_length_days || 1} day plan</span>
                    <span>{String(itinerary.budget_level || "flexible").replaceAll("_", " ")}</span>
                    <span>{itinerary.visibility}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn btn-light" type="button" onClick={copyShareLink}>Share</button>
                  <Link className="btn btn-primary" href="/dashboard/itineraries">Manage</Link>
                </div>
              </div>
            </section>

            <ItineraryDaySchedule items={items} />
          </>
        ) : null}
      </div>
    </main>
  );
}
