"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

function getPoster(ad) {
  return (
    ad?.poster_image_url ||
    ad?.image_url ||
    ad?.flyer_url ||
    ad?.cover_image ||
    ad?.posterUrl ||
    ad?.image ||
    "/assets/yardpromo-brand-preview.png"
  );
}

function statusLabel(status) {
  const value = String(status || "pending_review").toLowerCase();

  if (value === "approved" || value === "active") return "Active";
  if (value === "expired" || value === "archived") return "Expired";
  if (value === "draft") return "Draft";
  if (value === "rejected") return "Rejected";
  if (value === "pending_review" || value === "pending") return "Pending";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isApprovedStatus(status) {
  const value = String(status || "").toLowerCase();
  return value === "active" || value === "approved";
}

function isExpiredStatus(status) {
  const value = String(status || "").toLowerCase();
  return value === "expired" || value === "archived";
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadAdminAds() {
      setLoading(true);
      setMessage("");

      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError || !userData?.user) {
          router.push(`/login?next=${encodeURIComponent("/admin")}`);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userData.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        const isAdmin = ["admin", "super_admin"].includes(profileData?.role);

        if (!isAdmin) {
          setMessage("You do not have permission to view the admin page.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (alive) {
          setAds(data || []);
        }
      } catch (error) {
        if (alive) {
          setMessage(error.message || "Unable to load admin ads.");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadAdminAds();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateAd(adId, patch) {
    setSavingId(adId);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("ads")
        .update(patch)
        .eq("id", adId)
        .select("*")
        .maybeSingle();

      if (error) throw error;

      setAds((current) =>
        current.map((ad) =>
          ad.id === adId ? { ...ad, ...(data || patch) } : ad
        )
      );
    } catch (error) {
      setMessage(error.message || "Unable to update promo.");
    } finally {
      setSavingId("");
    }
  }

  function approveAd(ad) {
    return updateAd(ad.id, {
      status: "active",
    });
  }

  function toggleFeatured(ad) {
    return updateAd(ad.id, {
      is_featured: !Boolean(ad.is_featured),
    });
  }

  function togglePremium(ad) {
    return updateAd(ad.id, {
      is_premium: !Boolean(ad.is_premium),
    });
  }

  function toggleWeekend(ad) {
    return updateAd(ad.id, {
      is_weekend_pick: !Boolean(ad.is_weekend_pick),
    });
  }

  function expireAd(ad) {
    return updateAd(ad.id, {
      status: "expired",
      is_featured: false,
      is_premium: false,
      is_weekend_pick: false,
    });
  }

  function restoreAd(ad) {
    return updateAd(ad.id, {
      status: "active",
    });
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="toast">Loading admin ads...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <p className="kicker">Admin</p>
        <h2>Approve and manage YardPromo ads.</h2>

        {message ? (
          <div className="toast error" style={{ marginTop: 14 }}>
            {message}
          </div>
        ) : null}

        <div className="card" style={{ marginTop: 22, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 14 }}>Ad</th>
                <th style={{ textAlign: "left", padding: 14 }}>Status</th>
                <th style={{ textAlign: "left", padding: 14 }}>Category</th>
                <th style={{ textAlign: "left", padding: 14 }}>Premium</th>
                <th style={{ textAlign: "left", padding: 14 }}>Weekend</th>
                <th style={{ textAlign: "left", padding: 14 }}>Featured</th>
                <th style={{ textAlign: "left", padding: 14 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {ads.map((ad) => {
                const disabled = savingId === ad.id;
                const approved = isApprovedStatus(ad.status);
                const expired = isExpiredStatus(ad.status);

                return (
                  <tr key={ad.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: 14, minWidth: 300 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <img
                          src={getPoster(ad)}
                          alt={ad.title || "Promo poster"}
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: 12,
                            objectFit: "cover",
                            background: "#f1f5f9",
                          }}
                        />

                        <div>
                          <strong>{ad.title || "Untitled promo"}</strong>
                          <div className="muted small">
                            {ad.parish || ad.location || "Jamaica"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: 14 }}>{statusLabel(ad.status)}</td>
                    <td style={{ padding: 14 }}>{ad.category || "Promo"}</td>
                    <td style={{ padding: 14 }}>{ad.is_premium ? "Yes" : "No"}</td>
                    <td style={{ padding: 14 }}>
                      {ad.is_weekend_pick ? "Yes" : "No"}
                    </td>
                    <td style={{ padding: 14 }}>
                      {ad.is_featured ? "Yes" : "No"}
                    </td>

                    <td style={{ padding: 14, minWidth: 520 }}>
                      <div
                        className="admin-actions"
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        {!approved ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={disabled}
                            onClick={() => approveAd(ad)}
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-light"
                            disabled
                          >
                            Approved
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn btn-light"
                          disabled={disabled}
                          onClick={() => togglePremium(ad)}
                        >
                          {ad.is_premium ? "Remove Premium" : "Premium"}
                        </button>

                        <button
                          type="button"
                          className="btn btn-light"
                          disabled={disabled}
                          onClick={() => toggleWeekend(ad)}
                        >
                          {ad.is_weekend_pick ? "Remove Weekend" : "Weekend"}
                        </button>

                        <button
                          type="button"
                          className="btn btn-light"
                          disabled={disabled}
                          onClick={() => toggleFeatured(ad)}
                        >
                          {ad.is_featured ? "Unfeature" : "Feature"}
                        </button>

                        <Link
                          className="btn btn-light"
                          href={`/create?edit=${ad.id}`}
                        >
                          Edit
                        </Link>

                        {expired ? (
                          <button
                            type="button"
                            className="btn btn-light"
                            disabled={disabled}
                            onClick={() => restoreAd(ad)}
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-light"
                            disabled={disabled}
                            onClick={() => expireAd(ad)}
                          >
                            Expire
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!ads.length ? (
                <tr>
                  <td colSpan={7} style={{ padding: 18 }}>
                    <div className="empty">
                      <h3>No promos yet</h3>
                      <p className="muted">Uploaded promos will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}