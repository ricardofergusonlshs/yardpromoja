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
  const [metrics, setMetrics] = useState({});
  const [savedPromos, setSavedPromos] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [interestedPromos, setInterestedPromos] = useState([]);
  const [followedPromoters, setFollowedPromoters] = useState([]);
  const [followedVenues, setFollowedVenues] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [duplicatingId, setDuplicatingId] = useState(null);

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
        computeMetrics(data || []);
      }
    }

    async function computeMetrics(adList) {
      const adIds = (adList || []).map((a) => a.id).filter(Boolean);

      const totalPromos = adList.length;
      const approvedPromos = adList.filter((a) => (a.status || '').toLowerCase() === 'approved').length;
      const pendingPromos = adList.filter((a) => (a.status || '').toLowerCase() === 'pending').length;
      const activePromos = adList.filter((a) => (a.status || '').toLowerCase() === 'active' || (a.status || '').toLowerCase() === 'approved').length;

      const totalViews = adList.reduce((s, a) => s + (Number(a.views) || 0), 0);
      const totalLinkClicks = adList.reduce((s, a) => s + (Number(a.link_clicks) || 0), 0);

      // counts that live in separate tables
      let supportCount = 0;
      let rsvpCount = 0;
      let inquiryCount = 0;

      try {
        if (adIds.length) {
          const { count: support } = await supabase
            .from('interest_events')
            .select('id', { count: 'exact', head: true })
            .in('ad_id', adIds);

          const { count: rsvp } = await supabase
            .from('rsvps')
            .select('id', { count: 'exact', head: true })
            .in('ad_id', adIds);

          const { count: inquiries } = await supabase
            .from('inquiries')
            .select('id', { count: 'exact', head: true })
            .in('ad_id', adIds);

          supportCount = Number(support) || 0;
          rsvpCount = Number(rsvp) || 0;
          inquiryCount = Number(inquiries) || 0;
        }
      } catch (e) {
        console.warn('Metrics load error', e);
      }

      const shareCount = adList.reduce((s, a) => s + (Number(a.share_count) || Number(a.shares) || 0), 0) || totalLinkClicks;

      // simple heat score
      const heatScore = Math.round(totalViews * 0.1 + supportCount * 2 + rsvpCount * 3 + shareCount * 1.5 + inquiryCount * 4);

      // pick best performing by simple composite (views + link clicks weighted)
      const best = adList.slice().sort((x, y) => ((Number(y.views) || 0) + (Number(y.link_clicks) || 0) * 10) - ((Number(x.views) || 0) + (Number(x.link_clicks) || 0) * 10))[0];

      setMetrics({
        totalPromos,
        approvedPromos,
        pendingPromos,
        activePromos,
        totalViews,
        supportCount,
        rsvpCount,
        shareCount,
        inquiryCount,
        heatScore,
        bestPromo: best || null,
      });
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
            <section className="section">
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 18 }}>
                <div className="panel">
                  <h4>Total promos</h4>
                  <div className="stats-large">{metrics.totalPromos ?? ads.length}</div>
                </div>
                <div className="panel">
                  <h4>Active</h4>
                  <div className="stats-large">{metrics.activePromos ?? 0}</div>
                </div>
                <div className="panel">
                  <h4>Pending</h4>
                  <div className="stats-large">{metrics.pendingPromos ?? 0}</div>
                </div>
                <div className="panel">
                  <h4>Approved</h4>
                  <div className="stats-large">{metrics.approvedPromos ?? 0}</div>
                </div>
                <div className="panel">
                  <h4>Views</h4>
                  <div className="stats-large">{metrics.totalViews ?? 0}</div>
                </div>
                <div className="panel">
                  <h4>Support</h4>
                  <div className="stats-large">{metrics.supportCount ?? 0}</div>
                </div>
                <div className="panel">
                  <h4>RSVPs</h4>
                  <div className="stats-large">{metrics.rsvpCount ?? 0}</div>
                </div>
                <div className="panel">
                  <h4>Shares</h4>
                  <div className="stats-large">{metrics.shareCount ?? 0}</div>
                </div>
                <div className="panel">
                  <h4>Inquiries</h4>
                  <div className="stats-large">{metrics.inquiryCount ?? 0}</div>
                </div>
                <div className="panel">
                  <h4>Heat</h4>
                  <div className="stats-large">{metrics.heatScore ?? 0}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <Link className="btn btn-primary" href="/create">Create Promo</Link>
                <a className="btn btn-light" href="#ads-table">View My Promos</a>
                <a className="btn btn-light" href="/advertise">Boost Promo</a>
                <a className="btn btn-light" href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>Edit Promo</a>
                <a className="btn btn-light" href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>View Analytics</a>
              </div>
            </section>
            <div className="table-wrap" id="ads-table">
              <table>
                <thead>
                  <tr>
                    <th>Ad</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Views</th>
                    <th>Clicks</th>
                    <th>Share</th>
                    <th>Actions</th>
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
                      <td>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button className="btn btn-light" onClick={() => router.push(`/create?edit=${ad.id}`)}>Edit</button>
                          <button className="btn btn-light" onClick={async () => {
                            if (!confirm('Delete this promo? This action cannot be undone.')) return;
                            setDeletingId(ad.id);
                            try {
                              const { error } = await supabase.from('ads').delete().eq('id', ad.id);
                              if (error) throw error;
                              setAds((prev) => prev.filter((a) => a.id !== ad.id));
                              setMessage('Promo deleted.');
                            } catch (e) {
                              console.warn('Delete error', e);
                              setMessage('Unable to delete promo.');
                            } finally {
                              setDeletingId(null);
                            }
                          }}>{deletingId === ad.id ? 'Deleting...' : 'Delete'}</button>
                          <button className="btn btn-light" onClick={async () => {
                            setDuplicatingId(ad.id);
                            try {
                              const slug = `${ad.slug || ad.title}-copy-${Date.now()}`.replace(/\s+/g, '-').toLowerCase();
                              const { data, error } = await supabase.from('ads').insert([{ ...ad, title: `Copy of ${ad.title}`, slug, status: 'draft' }]).select();
                              if (error) throw error;
                              const newAd = data && data[0] ? data[0] : null;
                              if (newAd) setAds((prev) => [newAd, ...prev]);
                              setMessage('Promo duplicated as draft.');
                            } catch (e) {
                              console.warn('Duplicate error', e);
                              setMessage('Unable to duplicate promo.');
                            } finally {
                              setDuplicatingId(null);
                            }
                          }}>{duplicatingId === ad.id ? 'Duplicating...' : 'Duplicate'}</button>
                        </div>
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
