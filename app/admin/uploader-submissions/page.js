"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequireRole from "@/app/components/RequireRole";
import { createClient } from "@/lib/supabaseClient";

const adminRoles = ["admin", "super_admin"];

export default function AdminUploaderSubmissionsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState({});

  async function loadItems() {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("ads")
        .select(`
          id,
          title,
          slug,
          status,
          review_status,
          category,
          type,
          parish,
          location,
          venue,
          description,
          source_url,
          source_notes,
          image_permission_status,
          contact_name,
          phone,
          whatsapp,
          instagram,
          tiktok,
          facebook,
          website,
          google_maps_url,
          opening_hours,
          submitted_by,
          submitted_at,
          admin_notes,
          rejection_reason
        `)
        .not("submitted_by", "is", null)
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.warn("Admin uploader submissions error:", error);
      setMessage(error?.message || "Unable to load uploader submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function updateNote(id, value) {
    setNotes((current) => ({
      ...current,
      [id]: value,
    }));
  }

  async function reviewSubmission(item, action) {
    setMessage("");

    const note = notes[item.id] || "";

    let payload = {
      reviewed_at: new Date().toISOString(),
      admin_notes: note,
    };

    if (action === "approve") {
      payload = {
        ...payload,
        review_status: "approved",
        status: "active",
        rejection_reason: null,
      };
    }

    if (action === "needs_correction") {
      payload = {
        ...payload,
        review_status: "needs_correction",
        status: "pending",
      };
    }

    if (action === "reject") {
      payload = {
        ...payload,
        review_status: "rejected",
        status: "rejected",
        rejection_reason: note || "Rejected by admin.",
      };
    }

    try {
      const { error } = await supabase
        .from("ads")
        .update(payload)
        .eq("id", item.id);

      if (error) throw error;

      setMessage("Submission updated.");
      await loadItems();
    } catch (error) {
      console.warn("Review update error:", error);
      setMessage(error?.message || "Unable to update submission.");
    }
  }

  return (
    <RequireRole
      allowedRoles={adminRoles}
      fallbackTitle="Admin access required"
      fallbackMessage="Only admins can review uploader submissions."
    >
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Admin Review</p>
              <h1>Uploader submissions</h1>
              <p className="muted">
                Review curated listings submitted by content uploaders.
              </p>
            </div>

            <Link className="btn btn-light" href="/admin">
              Admin Dashboard
            </Link>
          </div>

          {message ? <div className="toast">{message}</div> : null}

          {loading ? <div className="toast">Loading submissions...</div> : null}

          {!loading && !items.length ? (
            <div className="empty">
              <h3>No uploader submissions yet</h3>
              <p className="muted">
                When uploaders submit listings, they will appear here.
              </p>
            </div>
          ) : null}

          {!loading && items.length ? (
            <div style={{ display: "grid", gap: 18 }}>
              {items.map((item) => (
                <section className="panel" key={item.id}>
                  <div className="section-head">
                    <div>
                      <p className="kicker">
                        {item.review_status || "pending"} · {item.status || "pending"}
                      </p>

                      <h2>{item.title || "Untitled listing"}</h2>

                      <p className="muted">
                        {item.category || item.type || "No category"} ·{" "}
                        {item.parish || "No parish"} ·{" "}
                        {item.location || item.venue || "No location"}
                      </p>
                    </div>

                    {item.slug ? (
                      <Link className="btn btn-light" href={`/ad/${item.slug}`}>
                        View Page
                      </Link>
                    ) : null}
                  </div>

                  <div className="promo-detail-list">
                    <div>
                      <strong>Description</strong>
                      <span>{item.description || "No description provided."}</span>
                    </div>

                    <div>
                      <strong>Contact</strong>
                      <span>
                        {item.contact_name || "No contact name"} ·{" "}
                        {item.phone || "No phone"} ·{" "}
                        {item.whatsapp || "No WhatsApp"}
                      </span>
                    </div>

                    <div>
                      <strong>Social / Web</strong>
                      <span>
                        Instagram: {item.instagram || "—"} · TikTok:{" "}
                        {item.tiktok || "—"} · Facebook: {item.facebook || "—"} ·
                        Website: {item.website || "—"}
                      </span>
                    </div>

                    <div>
                      <strong>Source</strong>
                      <span>{item.source_url || "No source URL provided."}</span>
                    </div>

                    <div>
                      <strong>Source notes</strong>
                      <span>{item.source_notes || "No source notes."}</span>
                    </div>

                    <div>
                      <strong>Image permission</strong>
                      <span>{item.image_permission_status || "Not specified"}</span>
                    </div>
                  </div>

                  <label style={{ marginTop: 16, display: "block" }}>
                    Admin notes / correction reason
                    <textarea
                      rows={3}
                      value={notes[item.id] || item.admin_notes || ""}
                      onChange={(event) => updateNote(item.id, event.target.value)}
                      placeholder="Add approval note, correction request, or rejection reason..."
                    />
                  </label>

                  <div className="dashboard-actions" style={{ marginTop: 14 }}>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => reviewSubmission(item, "approve")}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-light"
                      type="button"
                      onClick={() => reviewSubmission(item, "needs_correction")}
                    >
                      Needs Correction
                    </button>

                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => reviewSubmission(item, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </section>
              ))}
            </div>
          ) : null}
        </div>
      </main>
    </RequireRole>
  );
}