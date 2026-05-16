"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

export default function SavedPage() {
  const supabase = createClient();
  const [savedPromos, setSavedPromos] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        window.location.href = "/login?redirect=/saved";
        return;
      }

      const { data, error } = await supabase
        .from("saved_promos")
        .select("id,ad:ads(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Unable to load saved promos", error);
        setMessage("Unable to load saved promos.");
      } else {
        setSavedPromos(data || []);
      }

      setLoading(false);
    }

    loadSaved();
  }, [supabase]);

  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Saved</p>
            <h2>Your saved promos.</h2>
          </div>
          <Link className="btn btn-primary" href="/dashboard">Back to Dashboard</Link>
        </div>

        {loading && <div className="toast">Loading your saved promos...</div>}
        {!loading && message && <div className="toast">{message}</div>}

        {!loading && !savedPromos.length && (
          <div className="toast">No saved promos yet. Browse promos and save your favorites.</div>
        )}

        {!loading && savedPromos.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Promo</th>
                  <th>Category</th>
                  <th>Parish</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {savedPromos.map((item) => (
                  <tr key={item.id}>
                    <td>{item.ad?.title || "Promo"}</td>
                    <td>{item.ad?.category || "—"}</td>
                    <td>{item.ad?.parish || "—"}</td>
                    <td>
                      {item.ad?.slug ? (
                        <Link className="btn btn-light" href={`/ad/${item.ad.slug}`}>
                          View
                        </Link>
                      ) : (
                        <span className="muted">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
