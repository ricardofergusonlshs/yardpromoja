"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { publicAdUrl } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [ads, setAds] = useState([]);
  const [savedPromos, setSavedPromos] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [interestedPromos, setInterestedPromos] = useState([]);
  const [followedPromoters, setFollowedPromoters] = useState([]);
  const [followedVenues, setFollowedVenues] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: userData, error: sessionError } = await supabase.auth.getUser();
      if (sessionError || !userData?.user) {
        window.location.href = "/login?redirect=/dashboard";
        return;
      }

      setUser(userData.user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id,role,full_name,username,parish,bio,avatar_url")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (profileError) {
        console.warn("Profile load error", profileError);
        setMessage("Unable to load profile data.");
        setLoading(false);
        return;
      }

      setProfile(profileData);
      setRole(profileData?.role || "member");

      if (["advertiser", "promoter", "venue_owner"].includes(profileData?.role)) {
        await loadAdvertiserAds(userData.user.id);
        setLoading(false);
        return;
      }

      if (["admin", "super_admin"].includes(profileData?.role)) {
        setMessage("Admin accounts should use the admin dashboard.");
        setLoading(false);
        return;
      }

      await loadMemberData(userData.user.id);
      setLoading(false);
    }

    async function loadAdvertiserAds(userId) {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Unable to load ads", error);
        setMessage("Unable to load your ads.");
      } else {
        setAds(data || []);
      }
    }

    async function loadMemberData(userId) {
      const queries = [
        { table: "saved_promos", setter: setSavedPromos, select: "ad:ads(*)" },
        { table: "rsvps", setter: setRsvps, select: "ad:ads(*)" },
        { table: "interest_events", setter: setInterestedPromos, select: "ad:ads(*)" },
        { table: "promoter_follows", setter: setFollowedPromoters, select: "promoter_id, promoter:profiles(id,full_name,username,avatar_url)" },
        { table: "venue_follows", setter: setFollowedVenues, select: "venue_id" },
        { table: "alerts", setter: setAlerts, select: "*" },
      ];

      for (const query of queries) {
        const { data, error } = await supabase
          .from(query.table)
          .select(query.select)
          .eq("user_id", userId);

        if (error) {
          console.warn(`Unable to load ${query.table}`, error);
          continue;
        }

        query.setter(data || []);
      }
    }

    load();
  }, [supabase]);

  async function handleUpgrade() {
    if (!profile?.id) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: profile.id, role: "advertiser" }, { returning: "minimal" });

    if (error) {
      console.warn("Upgrade error", error);
      setMessage("Unable to upgrade your account right now.");
      return;
    }

    router.push("/create");
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function copyLink(slug) {
    await navigator.clipboard.writeText(publicAdUrl(slug));
    setMessage("Share link copied.");
  }

  const isMember = role === "member";
  const isAdvertiser = ["advertiser", "promoter", "venue_owner"].includes(role);
  const isAdmin = ["admin", "super_admin"].includes(role);

  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker">Dashboard</p>
            <h2>{isMember ? "Member dashboard" : isAdvertiser ? "My YardPromo ads" : "Dashboard"}</h2>
          </div>
          <div className="actions">
            {isAdvertiser && <Link className="btn btn-primary" href="/create">+ Create Ad</Link>}
            {isMember && (
              <button className="btn btn-primary" type="button" onClick={handleUpgrade}>
                Post a Promo
              </button>
            )}
            <button className="btn btn-light" onClick={signOut}>Sign Out</button>
          </div>
        </div>

        {loading && <div className="toast">Loading your dashboard...</div>}
        {!loading && message && <div className="toast">{message}</div>}

        {isAdmin && !loading && (
          <div className="toast">
            Admin accounts should use the <Link href="/admin">admin dashboard</Link>.
          </div>
        )}

        {isAdvertiser && !loading && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ad</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Views</th>
                    <th>Clicks</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
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
                      <td>{ad.status}</td>
                      <td>{ad.category}</td>
                      <td>{ad.views}</td>
                      <td>{ad.link_clicks}</td>
                      <td>
                        <button className="btn btn-light" onClick={() => copyLink(ad.slug)}>Copy Link</button>
                      </td>
                    </tr>
                  ))}
                  {!ads.length && (
                    <tr>
                      <td colSpan="6">No ads yet. Create your first ad.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {isMember && !loading && (
          <>
            <section className="section">
              <div className="grid grid-2" style={{ gap: 24 }}>
                <div className="panel">
                  <h3>Saved promos</h3>
                  {savedPromos.length ? (
                    <ul>
                      {savedPromos.map((item) => (
                        <li key={item.id}>
                          <Link href={`/ad/${item.ad?.slug}`}>{item.ad?.title || "Promo"}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="toast">No saved promos yet.</div>
                  )}
                </div>
                <div className="panel">
                  <h3>My RSVPs</h3>
                  {rsvps.length ? (
                    <ul>
                      {rsvps.map((item) => (
                        <li key={item.id}>
                          <Link href={`/ad/${item.ad?.slug}`}>{item.ad?.title || "Promo"}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="toast">No RSVPs yet.</div>
                  )}
                </div>
              </div>
            </section>

            <section className="section">
              <div className="grid grid-2" style={{ gap: 24 }}>
                <div className="panel">
                  <h3>Interested promos</h3>
                  {interestedPromos.length ? (
                    <ul>
                      {interestedPromos.map((item) => (
                        <li key={item.id}>
                          <Link href={`/ad/${item.ad?.slug}`}>{item.ad?.title || "Promo"}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="toast">No interests yet.</div>
                  )}
                </div>
                <div className="panel">
                  <h3>Followed promoters</h3>
                  {followedPromoters.length ? (
                    <ul>
                      {followedPromoters.map((item) => (
                        <li key={item.id}>{item.promoter?.full_name || item.promoter?.username || item.promoter?.id}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="toast">No followed promoters yet.</div>
                  )}
                </div>
              </div>
            </section>

            <section className="section">
              <div className="grid grid-2" style={{ gap: 24 }}>
                <div className="panel">
                  <h3>Followed venues</h3>
                  {followedVenues.length ? (
                    <ul>
                      {followedVenues.map((item) => (
                        <li key={item.id}>{item.venue_id || item.id}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="toast">No followed venues yet.</div>
                  )}
                </div>
                <div className="panel">
                  <h3>Yard Alerts</h3>
                  {alerts.length ? (
                    <ul>
                      {alerts.map((alert) => (
                        <li key={alert.id}>{alert.parish || alert.category || "Alert saved"}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="toast">No alerts yet.</div>
                  )}
                </div>
              </div>
            </section>

            <section className="section">
              <div className="panel">
                <h3>Account settings</h3>
                <p><strong>Name:</strong> {profile?.full_name || "Member"}</p>
                <p><strong>Username:</strong> {profile?.username || "Not set"}</p>
                <p><strong>Parish:</strong> {profile?.parish || "Not set"}</p>
                <p><strong>Bio:</strong> {profile?.bio || "No bio yet."}</p>
                {profile?.username && (
                  <p>
                    <Link href={`/u/${profile.username}`}>View public profile</Link>
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
