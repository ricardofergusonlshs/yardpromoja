"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/app/components/RequireAuth";
import { createClient } from "@/lib/supabaseClient";

function makeSlug(title) {
  const clean = String(title || "yardpromo-trip").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${clean}-${Date.now()}`;
}

export default function CreateItineraryPage() {
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState({
    title: "",
    description: "",
    parish: "",
    trip_length_days: 1,
    visibility: "private",
    budget_level: "mid_range",
    travel_style: "local_weekend",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function createItinerary(event) {
    event.preventDefault();
    setMessage("");

    if (!form.title.trim()) {
      setMessage("Add a title for your itinerary.");
      return;
    }

    setSaving(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        window.location.href = `/login?next=${encodeURIComponent("/itinerary/create")}`;
        return;
      }

      const slug = makeSlug(form.title);

      const { data, error } = await supabase
        .from("itineraries")
        .insert([{
          user_id: user.id,
          title: form.title.trim(),
          slug,
          description: form.description.trim(),
          parish: form.parish.trim() || null,
          trip_length_days: Number(form.trip_length_days || 1),
          visibility: form.visibility,
          status: form.visibility === "public" ? "published" : "draft",
          itinerary_type: "custom",
          budget_level: form.budget_level,
          travel_style: form.travel_style,
        }])
        .select("slug")
        .maybeSingle();

      if (error) throw error;
      window.location.href = `/itinerary/${data?.slug || slug}`;
    } catch (error) {
      setMessage(error?.message || "Unable to create itinerary.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RequireAuth>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Create Itinerary</p>
              <h1>Build your Jamaican trip plan.</h1>
              <p className="muted">Save a private plan or publish a public itinerary.</p>
            </div>
            <Link className="btn btn-light" href="/itinerary">Explore Itineraries</Link>
          </div>

          {message ? <div className="toast">{message}</div> : null}

          <form className="panel" onSubmit={createItinerary} style={{ display: "grid", gap: 14 }}>
            <label>Itinerary Title *<input value={form.title} onChange={(e) => updateField("title", e.target.value)} /></label>
            <label>Description<textarea rows={4} value={form.description} onChange={(e) => updateField("description", e.target.value)} /></label>

            <div className="grid grid-3">
              <label>Parish<input value={form.parish} onChange={(e) => updateField("parish", e.target.value)} /></label>
              <label>Trip Length<select value={form.trip_length_days} onChange={(e) => updateField("trip_length_days", e.target.value)}><option value="1">1 day</option><option value="2">2 days</option><option value="3">3 days</option><option value="4">4+ days</option></select></label>
              <label>Visibility<select value={form.visibility} onChange={(e) => updateField("visibility", e.target.value)}><option value="private">Private</option><option value="unlisted">Unlisted</option><option value="public">Public</option></select></label>
            </div>

            <div className="grid grid-3">
              <label>Budget<select value={form.budget_level} onChange={(e) => updateField("budget_level", e.target.value)}><option value="budget">Budget</option><option value="mid_range">Mid Range</option><option value="premium">Premium</option><option value="luxury">Luxury</option></select></label>
              <label>Travel Style<select value={form.travel_style} onChange={(e) => updateField("travel_style", e.target.value)}><option value="local_weekend">Local Weekend</option><option value="tourist">Tourist</option><option value="family">Family</option><option value="couples">Couples</option><option value="friends">Friends</option><option value="nightlife">Nightlife</option><option value="food">Food</option><option value="beach">Beach</option><option value="adventure">Adventure</option></select></label>
            </div>

            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Creating..." : "Create Itinerary"}</button>
          </form>
        </div>
      </main>
    </RequireAuth>
  );
}
