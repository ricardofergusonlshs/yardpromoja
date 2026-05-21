"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequireRole from "@/app/components/RequireRole";
import { createClient } from "@/lib/supabaseClient";

const uploaderRoles = ["content_uploader", "admin", "super_admin"];

function countByStatus(items, status) {
  return items.filter((item) => item.review_status === status).length;
}

export default function UploaderDashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadSubmissions() {
      setLoading(true);

      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) return;

        const { data, error } = await supabase
          .from("ads")
          .select("id,title,slug,review_status,status,created_at,admin_notes,rejection_reason")
          .eq("submitted_by", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (alive) setSubmissions(data || []);
      } catch (error) {
        console.warn("Uploader dashboard load error:", error);
        if (alive) setSubmissions([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadSubmissions();

    return () => {
      alive = false;
    };
  }, [supabase]);

  const total = submissions.length;
  const pending = countByStatus(submissions, "pending_review");
  const approved = countByStatus(submissions, "approved") + countByStatus(submissions, "published");
  const rejected = countByStatus(submissions, "rejected");
  const corrections = countByStatus(submissions, "needs_correction");

  return (
    <RequireRole allowedRoles={uploaderRoles}>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Content Uploader</p>
              <h1>Uploader Dashboard</h1>
              <p className="muted">
                Add curated listings, track submissions, and help populate YardPromoJa.
              </p>
            </div>

            <Link className="btn btn-primary" href="/uploader/new-listing">
              Add Listing
            </Link>
          </div>

          <div className="dashboard-stats compact-stats">
            <div><strong>Total</strong><span>{total}</span></div>
            <div><strong>Pending</strong><span>{pending}</span></div>
            <div><strong>Approved</strong><span>{approved}</span></div>
            <div><strong>Needs correction</strong><span>{corrections}</span></div>
            <div><strong>Rejected</strong><span>{rejected}</span></div>
          </div>

          <div className="dashboard-actions" style={{ marginTop: 18 }}>
            <Link className="btn btn-primary" href="/uploader/new-listing">
              Create New Listing
            </Link>
            <Link className="btn btn-light" href="/uploader/my-submissions">
              My Submissions
            </Link>
            <Link className="btn btn-light" href="/uploader/guidelines">
              Guidelines
            </Link>
          </div>

          <section className="panel" style={{ marginTop: 22 }}>
            <p className="kicker">Recent work</p>
            <h2>Latest submissions</h2>

            {loading ? <div className="toast">Loading submissions...</div> : null}

            {!loading && !submissions.length ? (
              <div className="empty">
                <h3>No submissions yet</h3>
                <p className="muted">Start by creating your first curated listing.</p>
              </div>
            ) : null}

            {!loading && submissions.length ? (
              <div className="promo-detail-list">
                {submissions.slice(0, 8).map((item) => (
                  <div key={item.id}>
                    <strong>{item.title || "Untitled listing"}</strong>
                    <span>Status: {item.review_status || item.status || "draft"}</span>
                    {item.rejection_reason ? <span>Reason: {item.rejection_reason}</span> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </RequireRole>
  );
}
