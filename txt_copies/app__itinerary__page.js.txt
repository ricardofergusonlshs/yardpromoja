"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import ItineraryCard from "@/app/components/ItineraryCard";

export default function ItineraryPage() {
  const supabase = useMemo(() => createClient(), []);
  const [templates, setTemplates] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setMessage("");

      try {
        const [{ data: templateData, error: templateError }, { data: itineraryData, error: itineraryError }] = await Promise.all([
          supabase.from("itinerary_templates").select("*").eq("active", true).order("is_featured", { ascending: false }),
          supabase.from("itineraries").select("*").eq("visibility", "public").eq("status", "published").order("is_featured", { ascending: false }),
        ]);

        if (templateError) throw templateError;
        if (itineraryError) throw itineraryError;

        if (alive) {
          setTemplates(templateData || []);
          setItineraries(itineraryData || []);
        }
      } catch (error) {
        if (alive) setMessage(error?.message || "Unable to load itineraries.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, [supabase]);

  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Itinerary</p>
            <h1>Plan your Jamaican weekend.</h1>
            <p className="muted">Explore ready-made trip ideas for beaches, food, nightlife, resorts, family trips, and parish road trips.</p>
          </div>
          <Link className="btn btn-primary" href="/itinerary/create">Create My Trip</Link>
        </div>

        {message ? <div className="toast">{message}</div> : null}
        {loading ? <div className="toast">Loading itinerary ideas...</div> : null}

        <section>
          <div className="section-head">
            <div>
              <p className="kicker">Templates</p>
              <h2>Start with a ready-made plan</h2>
            </div>
          </div>

          <div className="ads-grid grid grid-3">
            {templates.map((template) => <ItineraryCard key={template.id} itinerary={template} template />)}
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <div className="section-head">
            <div>
              <p className="kicker">Community Plans</p>
              <h2>Public itineraries</h2>
            </div>
          </div>

          {!loading && !itineraries.length ? (
            <div className="empty">
              <h3>No public itineraries yet</h3>
              <p className="muted">Create and publish the first YardPromoJa itinerary.</p>
            </div>
          ) : null}

          <div className="ads-grid grid grid-3">
            {itineraries.map((itinerary) => <ItineraryCard key={itinerary.id} itinerary={itinerary} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
