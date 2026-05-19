"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDetailSlug(ad) {
  if (ad?.slug) return String(ad.slug);
  if (ad?.id) return String(ad.id);

  const titleSlug = makeSlug(ad?.title || ad?.name || "promo");
  return titleSlug || "promo";
}

export default function SavedPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [savedPromos, setSavedPromos] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadSaved() {
      setLoading(true);
      setMessage("");

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user?.id) {
        router.push(`/login?next=${encodeURIComponent("/saved")}`);
        return;
      }

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from("saved_promos")
        .select("id, created_at, ad:ads(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!alive) return;

      if (error) {
        console.warn("Unable to load saved promos", error);
        setMessage("Unable to load saved promos.");
        setSavedPromos([]);
      } else {
        setSavedPromos(data || []);
      }

      setLoading(false);
    }

    loadSaved();

    return () => {
      alive = false;
    };
  }, [router, supabase]);

  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Saved</p>
            <h2>Your saved promos.</h2>
          </div>

          <Link className="btn btn-primary" href="/dashboard">
            Back to Dashboard
          </Link>
        </div>

        {loading ? <div className="toast">Loading your saved promos...</div> : null}

        {!loading && message ? <div className="toast error">{message}</div> : null}

        {!loading && !message && savedPromos.length === 0 ? (
          <div className="toast">
            No saved promos yet. Browse promos and save your favorites.
          </div>
        ) : null}

        {!loading && savedPromos.length > 0 ? (
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
                {savedPromos.map((item) => {
                  const ad = item.ad;
                  const detailSlug = ad ? getDetailSlug(ad) : "";

                  return (
                    <tr key={item.id}>
                      <td>{ad?.title || ad?.name || "Promo"}</td>
                      <td>{ad?.category || "—"}</td>
                      <td>{ad?.parish || "—"}</td>
                      <td>
                        {ad && detailSlug ? (
                          <Link
                            className="btn btn-light"
                            href={`/ad/${encodeURIComponent(detailSlug)}`}
                          >
                            View
                          </Link>
                        ) : (
                          <span className="muted">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </main>
  );
}