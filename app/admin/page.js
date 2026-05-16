"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const STATUS_LABELS = {
  pending_review: "Pending Review",
  active: "Active",
  rejected: "Rejected",
  expired: "Expired",
};

const STATUS_ORDER = ["pending_review", "active", "rejected", "expired"];

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [ads, setAds] = useState([]);
  const [message, setMessage] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  async function load() {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      router.push("/login?redirect=/admin");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setMessage("Unable to verify permissions. Please sign in again.");
      setChecking(false);
      return;
    }

    const role = profile?.role;

    if (!["admin", "super_admin"].includes(role)) {
      router.push("/dashboard");
      return;
    }

    setAllowed(true);

    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setMessage("Unable to load ads. Please try again.");
    else setAds(data || []);
    setChecking(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateAd(id, changes) {
    if (!allowed) {
      setMessage("You do not have permission to perform this action.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) {
      router.push("/login?redirect=/admin");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setMessage(profileError.message);
      return;
    }

    const role = profile?.role;
    if (!["admin", "super_admin"].includes(role)) {
      setMessage("You do not have permission to perform this action.");
      return;
    }

    const { error } = await supabase.from("ads").update(changes).eq("id", id);
    if (error) setMessage(error.message);
    else {
      setMessage("Updated.");
      load();
    }
  }

  const sortedAds = [...ads].sort((a, b) => {
    const aIndex = STATUS_ORDER.indexOf(a.status);
    const bIndex = STATUS_ORDER.indexOf(b.status);
    if (aIndex !== bIndex) return aIndex - bIndex;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  function renderActions(ad) {
    const commonButtons = (
      <>
        <button className="btn btn-light" onClick={() => updateAd(ad.id, { is_featured: !ad.is_featured })}>
          {ad.is_featured ? "Unfeature" : "Feature"}
        </button>
      </>
    );

    switch (ad.status) {
      case "pending_review":
        return (
          <>
            <button className="btn btn-primary" onClick={() => updateAd(ad.id, { status: "active", approved_at: new Date().toISOString() })}>
              Approve
            </button>
            {commonButtons}
            <button className="btn btn-danger" onClick={() => updateAd(ad.id, { status: "rejected", rejection_reason: "Rejected by admin." })}>
              Reject
            </button>
            <button className="btn btn-light" onClick={() => updateAd(ad.id, { status: "expired" })}>
              Expire
            </button>
          </>
        );
      case "active":
        return (
          <>
            <span className="btn btn-light" style={{ cursor: "default", opacity: 0.8 }}>Active</span>
            {commonButtons}
            <button className="btn btn-light" onClick={() => updateAd(ad.id, { status: "expired" })}>
              Expire
            </button>
          </>
        );
      case "rejected":
        return (
          <>
            <span className="btn btn-danger" style={{ cursor: "default", opacity: 0.9 }}>Rejected</span>
            <button className="btn btn-light" onClick={() => updateAd(ad.id, { status: "pending_review" })}>
              Restore
            </button>
            <button className="btn btn-primary" onClick={() => updateAd(ad.id, { status: "active", approved_at: new Date().toISOString() })}>
              Approve
            </button>
          </>
        );
      case "expired":
        return (
          <>
            <span className="btn btn-light" style={{ cursor: "default", opacity: 0.8 }}>Expired</span>
            <button className="btn btn-light" onClick={() => updateAd(ad.id, { status: "pending_review" })}>
              Restore
            </button>
          </>
        );
      default:
        return (
          <>
            <button className="btn btn-light" onClick={() => updateAd(ad.id, { status: "pending_review" })}>
              Restore
            </button>
          </>
        );
    }
  }

  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Admin</p>
            <h2>Approve and manage YardPromo ads.</h2>
          </div>
        </div>

        {checking && <div className="toast">Checking admin access...</div>}
        {!checking && message && <div className="toast">{message}</div>}

        {allowed && !checking && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAds.map((ad) => (
                  <tr key={ad.id}>
                    <td>
                      <div className="row-ad">
                        <img src={ad.poster_image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"} alt={ad.title} />
                        <div>
                          <strong>{ad.title}</strong>
                          <br />
                          <span className="muted">{ad.parish}</span>
                        </div>
                      </div>
                    </td>
                    <td>{STATUS_LABELS[ad.status] || ad.status}</td>
                    <td>{ad.category}</td>
                    <td>{ad.is_featured ? "Yes" : "No"}</td>
                    <td>
                      <div className="actions" style={{ marginTop: 0 }}>
                        {renderActions(ad)}
                      </div>
                    </td>
                  </tr>
                ))}
                {!sortedAds.length && (
                  <tr>
                    <td colSpan="5">No ads found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
