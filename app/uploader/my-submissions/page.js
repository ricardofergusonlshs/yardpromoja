"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequireRole from "@/app/components/RequireRole";
import { createClient } from "@/lib/supabaseClient";

const uploaderRoles = ["content_uploader", "admin", "super_admin"];

export default function MyUploaderSubmissionsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadItems() {
      setLoading(true);

      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) return;

        const { data, error } = await supabase
  .from("ads")
  .select(`
    id,
    title,
    slug,
    status,
    review_status,
    category,
    parish,
    location,
    submitted_by,
    submitted_at,
    admin_notes,
    rejection_reason
  `)
  .eq("submitted_by", user.id)
  .order("submitted_at", { ascending: false });

        if (error) throw error;

        if (alive) setItems(data || []);
      } catch (error) {
        console.warn("Uploader submissions load error:", error);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadItems();

    return () => {
      alive = false;
    };
  }, [supabase]);

  return (
    <RequireRole allowedRoles={uploaderRoles}>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Uploader</p>
              <h1>My submissions</h1>
              <p className="muted">Track your submitted curated listings.</p>
            </div>

            <Link className="btn btn-primary" href="/uploader/new-listing">
              Add Listing
            </Link>
          </div>

          {loading ? <div className="toast">Loading submissions...</div> : null}

          {!loading && !items.length ? (
            <div className="empty">
              <h3>No submissions yet</h3>
              <p className="muted">Create your first curated YardPromoJa listing.</p>
            </div>
          ) : null}

          {!loading && items.length ? (
            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Category</th>
                    <th>Parish</th>
                    <th>Review</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.title || "Untitled"}</strong>
                        <br />
                        <span className="muted">{item.slug || item.id}</span>
                      </td>
                      <td>{item.category || "—"}</td>
                      <td>{item.parish || "—"}</td>
                      <td>{item.review_status || item.status || "draft"}</td>
                      <td>{item.rejection_reason || item.admin_notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </main>
    </RequireRole>
  );
}
