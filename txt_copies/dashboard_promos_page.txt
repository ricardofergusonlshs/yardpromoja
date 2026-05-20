"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/components/RequireAuth";

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getPublicAdUrl(ad) {
  const slug = ad?.slug || ad?.id || makeSlug(ad?.title);
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://yardpromoja.com";

  return `${baseUrl.replace(/\/$/, "")}/ad/${encodeURIComponent(slug)}`;
}

export default function PromosPage() {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState(null);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadPromos() {
      setLoading(true);
      setMessage("");

      try {
        const { data: userData } = await supabase.auth.getUser();
        const currentUser = userData?.user || null;

        if (!alive) return;

        setUser(currentUser);

        if (!currentUser) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (alive) {
          setPromos(data || []);
        }
      } catch (error) {
        console.warn("Promos load error", error);
        if (alive) {
          setMessage("Unable to load your promos right now.");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadPromos();

    return () => {
      alive = false;
    };
  }, [supabase]);

  async function copyPromoLink(ad) {
    try {
      await navigator.clipboard.writeText(getPublicAdUrl(ad));
      setMessage("Promo link copied.");
    } catch {
      setMessage("Unable to copy link. Please copy it from your browser bar.");
    }
  }

  async function deletePromo(ad) {
    if (!ad?.id) return;
    if (!confirm("Delete this promo? This action cannot be undone.")) return;

    setSavingId(ad.id);
    setMessage("");

    try {
      const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", ad.id)
        .eq("user_id", user?.id);

      if (error) throw error;

      setPromos((current) => current.filter((item) => item.id !== ad.id));
      setMessage("Promo deleted.");
    } catch (error) {
      console.warn("Delete promo error", error);
      setMessage("Unable to delete promo.");
    } finally {
      setSavingId("");
    }
  }

  async function duplicatePromo(ad) {
    if (!ad) return;

    setSavingId(ad.id);
    setMessage("");

    try {
      const {
        id,
        created_at,
        updated_at,
        views,
        link_clicks,
        shares,
        share_count,
        ...copyableAd
      } = ad;

      const slug = `${ad.slug || makeSlug(ad.title)}-copy-${Date.now()}`;

      const { data, error } = await supabase
        .from("ads")
        .insert([
          {
            ...copyableAd,
            title: `Copy of ${ad.title || "Promo"}`,
            slug,
            user_id: user?.id,
            status: "draft",
            views: 0,
            link_clicks: 0,
            shares: 0,
            share_count: 0,
          },
        ])
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPromos((current) => [data, ...current]);
      }

      setMessage("Promo duplicated as draft.");
    } catch (error) {
      console.warn("Duplicate promo error", error);
      setMessage("Unable to duplicate promo.");
    } finally {
      setSavingId("");
    }
  }

  return (
    <RequireAuth>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Dashboard</p>
              <h1>My Promos</h1>
              <p className="muted">
                Manage your YardPromo listings, edit posters, duplicate promos, and copy share links.
              </p>
            </div>

            <div className="actions">
              <Link className="btn btn-primary" href="/post-promo">
                Post Promo
              </Link>

              <Link className="btn btn-light" href="/dashboard">
                Dashboard
              </Link>
            </div>
          </div>

          {loading ? <div className="toast">Loading your promos...</div> : null}
          {message ? <div className="toast">{message}</div> : null}

          {!loading && promos.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Promo</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Parish</th>
                    <th>Views</th>
                    <th>Shares</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {promos.map((ad) => (
                    <tr key={ad.id || ad.slug}>
                      <td>
                        <div className="row-ad">
                          <img
                            src={
                              ad.poster_image_url ||
                              ad.image_url ||
                              "/assets/yardpromo-brand-preview.png"
                            }
                            alt={ad.title || "Promo poster"}
                          />

                          <div>
                            <strong>{ad.title || "Untitled promo"}</strong>
                            <br />
                            <span className="muted">{ad.slug || ad.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{ad.status || "draft"}</td>
                      <td>{ad.category || "Promo"}</td>
                      <td>{ad.parish || "Jamaica"}</td>
                      <td>{Number(ad.views) || 0}</td>
                      <td>{Number(ad.shares || ad.share_count) || 0}</td>

                      <td>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <Link
                            className="btn btn-light"
                            href={`/ad/${encodeURIComponent(ad.slug || ad.id)}`}
                          >
                            View
                          </Link>

                          <Link
                            className="btn btn-light"
                            href={`/create?edit=${encodeURIComponent(ad.id)}`}
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => copyPromoLink(ad)}
                          >
                            Copy Link
                          </button>

                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => duplicatePromo(ad)}
                            disabled={savingId === ad.id}
                          >
                            {savingId === ad.id ? "Working..." : "Duplicate"}
                          </button>

                          <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => deletePromo(ad)}
                            disabled={savingId === ad.id}
                          >
                            {savingId === ad.id ? "Working..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!loading && !promos.length ? (
            <div className="empty">
              <h3>No promos yet</h3>
              <p className="muted">
                Create your first promo to start sharing with YardPromo Jamaica.
              </p>
              <Link className="btn btn-primary" href="/post-promo">
                Post your first promo
              </Link>
            </div>
          ) : null}
        </div>
      </main>
    </RequireAuth>
  );
}
