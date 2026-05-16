"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadNotifications() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error) {
        setNotifications(data || []);
      }
      setLoading(false);
    }

    loadNotifications();
  }, [supabase]);

  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Notifications</p>
            <h2>Latest updates.</h2>
          </div>
        </div>

        {loading ? (
          <div className="toast">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          <div className="panel">
            <ul>
              {notifications.map((notif) => (
                <li key={notif.id} style={{ paddingBottom: 16, borderBottom: "1px solid #eee" }}>
                  <Link href={`/ad/${notif.slug}`}>
                    <strong>{notif.title}</strong>
                    <p className="muted">{notif.category} • {notif.parish}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="toast">No notifications yet.</div>
        )}
      </div>
    </main>
  );
}
