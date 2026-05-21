"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/app/components/RequireAuth";
import { createClient } from "@/lib/supabaseClient";
import ItineraryCard from "@/app/components/ItineraryCard";

export default function DashboardItinerariesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data } = await supabase.from("itineraries").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (alive) {
        setItineraries(data || []);
        setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, [supabase]);

  return (
    <RequireAuth>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">My Itineraries</p>
              <h1>Plan and save Jamaican trips.</h1>
            </div>
            <Link className="btn btn-primary" href="/itinerary/create">Create Itinerary</Link>
          </div>

          {loading ? <div className="toast">Loading itineraries...</div> : null}

          {!loading && !itineraries.length ? (
            <div className="empty"><h3>No itineraries yet</h3><p className="muted">Create your first trip plan.</p></div>
          ) : null}

          <div className="ads-grid grid grid-3">
            {itineraries.map((item) => <ItineraryCard key={item.id} itinerary={item} />)}
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
