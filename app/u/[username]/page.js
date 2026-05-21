"use client";

import { use, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

export default function UserProfilePage({ params }) {
  const { username } = use(params);
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [savedPromos, setSavedPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error || !data) {
        setMessage("Profile not found.");
        setLoading(false);
        return;
      }

      setProfile(data);

      if (data.public_saved_collections_enabled) {
        const { data: savedData, error: savedError } = await supabase
          .from("saved_promos")
          .select("ad:ads(*)")
          .eq("user_id", data.id)
          .order("created_at", { ascending: false });

        if (!savedError) {
          setSavedPromos(savedData || []);
        }
      }

      setLoading(false);
    }

    loadProfile();
  }, [username, supabase]);

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="toast">Loading profile...</div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="section">
        <div className="container">
          <div className="toast">{message || "Profile not found."}</div>
        </div>
      </main>
    );
  }

  const publicSaved = profile.public_saved_collections_enabled;
  const publicPromoters = profile.public_followed_promoters_enabled;
  const publicSupport = profile.public_support_badges_enabled;

  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Profile</p>
            <h2>{profile.full_name || profile.username || "YardPromo member"}</h2>
            <p className="muted">@{profile.username || "unknown"}</p>
          </div>
          <Link className="btn btn-light" href="/browse">Browse promos</Link>
        </div>

        <div className="grid grid-2" style={{ gap: 24 }}>
          <div className="panel">
            {profile.avatar_url && <img src={profile.avatar_url} alt={profile.full_name || profile.username} style={{ width: 120, borderRadius: 18, marginBottom: 20 }} />}
            <p><strong>Parish</strong></p>
            <p>{profile.parish || "Not specified"}</p>
            <p><strong>About</strong></p>
            <p>{profile.bio || "No public bio yet."}</p>
            <p><strong>Role</strong></p>
            <p>{profile.role || "member"}</p>
            {profile.created_at && <p><strong>Member since</strong> {new Date(profile.created_at).toLocaleDateString()}</p>}
          </div>

          <div className="panel">
            <h3>Public activity</h3>
            {publicSaved ? (
              savedPromos.length ? (
                <div>
                  <p>Saved promos</p>
                  <ul>
                    {savedPromos.map((item, index) => (
                      <li key={index}>
                        <Link href={`/ad/${item.ad?.slug}`}>{item.ad?.title || "Promo"}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="toast">No public saved promos available.</div>
              )
            ) : (
              <div className="toast">Saved collections are private.</div>
            )}

            {publicPromoters && (
              <div style={{ marginTop: 18 }}>
                <p><strong>Followed promoters</strong></p>
                <div className="toast">This member has chosen to share followed promoters publicly.</div>
              </div>
            )}

            {publicSupport && (
              <div style={{ marginTop: 18 }}>
                <p><strong>Support badges</strong></p>
                <div className="toast">Support badges and public activity are shown here.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
