"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequireRole from "@/app/components/RequireRole";
import { createClient } from "@/lib/supabaseClient";

const adminRoles = ["admin", "super_admin"];

export default function AdminItinerariesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [itineraries, setItineraries] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const { data, error } = await supabase.from("itineraries").select("*").order("created_at", { ascending: false });
    if (error) {
      setMessage(error.message);
      return;
    }
    setItineraries(data || []);
  }

  useEffect(() => { load(); }, []);

  async function updateItinerary(item, patch) {
    const { error } = await supabase.from("itineraries").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", item.id);
    if (error) {
      setMessage(error.message);
      return;
    }
    await load();
  }

  return (
    <RequireRole allowedRoles={adminRoles}>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Admin Itineraries</p>
              <h1>Manage itinerary content.</h1>
            </div>
            <Link className="btn btn-primary" href="/admin/itinerary-templates">Templates</Link>
          </div>

          {message ? <div className="toast">{message}</div> : null}

          <div className="table-card">
            <table>
              <thead><tr><th>Itinerary</th><th>Status</th><th>Visibility</th><th>Featured</th><th>Sponsored</th><th>Actions</th></tr></thead>
              <tbody>
                {itineraries.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.title}</strong><br /><span className="muted">{item.slug}</span></td>
                    <td>{item.status}</td>
                    <td>{item.visibility}</td>
                    <td>{item.is_featured ? "Yes" : "No"}</td>
                    <td>{item.is_sponsored ? "Yes" : "No"}</td>
                    <td>
                      <div className="admin-actions">
                        <Link className="admin-action-btn" href={`/itinerary/${item.slug}`}>View</Link>
                        <button className="admin-action-btn" type="button" onClick={() => updateItinerary(item, { is_featured: !item.is_featured })}>Feature</button>
                        <button className="admin-action-btn" type="button" onClick={() => updateItinerary(item, { is_sponsored: !item.is_sponsored })}>Sponsor</button>
                        <button className="admin-action-btn" type="button" onClick={() => updateItinerary(item, { status: "published", visibility: "public" })}>Publish</button>
                        <button className="admin-action-btn" type="button" onClick={() => updateItinerary(item, { status: "archived" })}>Archive</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!itineraries.length ? <tr><td colSpan={6}><div className="empty"><h3>No itineraries yet</h3></div></td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </RequireRole>
  );
}
