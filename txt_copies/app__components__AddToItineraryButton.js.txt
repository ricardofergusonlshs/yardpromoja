"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

function requireLogin() {
  const next = typeof window === "undefined" ? "/" : `${window.location.pathname}${window.location.search || ""}`;
  window.location.href = `/login?next=${encodeURIComponent(next)}`;
}

export default function AddToItineraryButton({ ad, className = "btn btn-light" }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user || null;
      if (!alive) return;

      setUser(currentUser);
      if (!currentUser) return;

      const { data } = await supabase
        .from("itineraries")
        .select("id,title")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (alive) {
        setItineraries(data || []);
        setSelectedId(data?.[0]?.id || "");
      }
    }

    load();
    return () => { alive = false; };
  }, [supabase]);

  async function addToItinerary() {
    setMessage("");

    if (!user) {
      requireLogin();
      return;
    }

    if (!selectedId) {
      setMessage("Create an itinerary first.");
      return;
    }

    if (!ad?.id) {
      setMessage("This listing cannot be added yet.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.from("itinerary_items").insert([{
        itinerary_id: selectedId,
        ad_id: ad.id,
        title: ad.title || ad.name || "YardPromo stop",
        description: ad.description || "",
        item_type: ad.category || ad.type || "promo",
        parish: ad.parish || "",
        location: ad.location || ad.venue || "",
        image_url: ad.poster_image_url || ad.image_url || ad.flyer_url || "",
        day_number: 1,
        sort_order: 99,
      }]);

      if (error) throw error;
      setMessage("Added to itinerary.");
    } catch (error) {
      setMessage(error?.message || "Unable to add to itinerary.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {user && itineraries.length ? (
        <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          {itineraries.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
        </select>
      ) : null}

      <button className={className} type="button" onClick={addToItinerary} disabled={saving}>
        {saving ? "Adding..." : "Add to Itinerary"}
      </button>

      {message ? <small className="muted">{message}</small> : null}
    </div>
  );
}
