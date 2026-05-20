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

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
}

function getErrorMessage(error) {
  return (
    error?.message ||
    error?.details ||
    error?.hint ||
    error?.code ||
    "Unable to save campaign."
  );
}

export default function CampaignsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState(null);
  const [promos, setPromos] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({
    ad_id: "",
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    budget_note: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadData() {
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

        const { data: adData, error: adError } = await supabase
          .from("ads")
          .select("id,title,slug,status,poster_image_url,image_url,parish,location")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (adError) throw adError;

        if (alive) {
          setPromos(adData || []);
        }

        const { data: campaignData, error: campaignError } = await supabase
          .from("campaigns")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (campaignError) throw campaignError;

        if (alive) {
          setCampaigns(campaignData || []);
        }
      } catch (error) {
        console.warn("Campaigns load error", error);
        if (alive) {
          setMessage(getErrorMessage(error));
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      alive = false;
    };
  }, [supabase]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function getSelectedPromo() {
    return promos.find((promo) => String(promo.id) === String(form.ad_id)) || null;
  }

  async function createCampaign(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage("Please enter a campaign title.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const selectedPromo = getSelectedPromo();
      const campaignSlug = `${makeSlug(form.title)}-${Date.now()}`;

      const payload = {
        user_id: user?.id,
        title: form.title.trim(),
        slug: campaignSlug,
        description: form.description.trim(),
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        budget_note: form.budget_note.trim(),
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),

        // Compatibility with your older campaigns table columns.
        type: "campaign",
        subtitle: form.description.trim(),
        promo_slug: selectedPromo?.slug || "",
        promo_title: selectedPromo?.title || "",
        reward: form.budget_note.trim(),
        image_url: selectedPromo?.poster_image_url || selectedPromo?.image_url || "",
        parish: selectedPromo?.parish || "",
        location: selectedPromo?.location || "",
        starts_at: form.start_date || null,
        ends_at: form.end_date || null,
        participants: 0,
        shares: 0,
        votes: 0,
        rsvps: 0,
        referrals: 0,
        options: {},
        option_votes: {},
        hashtag: "",
        rules: {},
      };

      // Only send ad_id if it is a real UUID. Your campaigns.ad_id column is UUID,
      // but some existing ads may use non-UUID ids.
      if (selectedPromo?.id && isUuid(selectedPromo.id)) {
        payload.ad_id = selectedPromo.id;
      }

      const { data, error } = await supabase
        .from("campaigns")
        .insert([payload])
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCampaigns((current) => [data, ...current]);
      }

      setForm({
        ad_id: "",
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        budget_note: "",
      });

      setMessage("Campaign created.");
    } catch (error) {
      console.error("Create campaign error:", error);
      setMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function deleteCampaign(campaign) {
    if (!campaign?.id) return;
    if (!confirm("Delete this campaign?")) return;

    setSaving(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", campaign.id)
        .eq("user_id", user?.id);

      if (error) throw error;

      setCampaigns((current) => current.filter((item) => item.id !== campaign.id));
      setMessage("Campaign deleted.");
    } catch (error) {
      console.warn("Delete campaign error", error);
      setMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <RequireAuth>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Promoter tools</p>
              <h1>Campaigns</h1>
              <p className="muted">
                Create and manage promotional campaigns connected to your YardPromo listings.
              </p>
            </div>

            <div className="actions">
              <Link className="btn btn-light" href="/dashboard/promos">
                My Promos
              </Link>

              <Link className="btn btn-primary" href="/post-promo">
                Post Promo
              </Link>
            </div>
          </div>

          {loading ? <div className="toast">Loading campaigns...</div> : null}
          {message ? <div className="toast">{message}</div> : null}

          <section className="panel" style={{ marginBottom: 20 }}>
            <p className="kicker">New campaign</p>
            <h2>Set campaign details</h2>

            <form onSubmit={createCampaign} style={{ display: "grid", gap: 12 }}>
              <select
                className="share-input"
                value={form.ad_id}
                onChange={(event) => updateField("ad_id", event.target.value)}
              >
                <option value="">Attach to promo, optional</option>
                {promos.map((promo) => (
                  <option key={promo.id} value={promo.id}>
                    {promo.title || promo.slug || promo.id}
                  </option>
                ))}
              </select>

              <input
                className="share-input"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Campaign title"
              />

              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Campaign description"
                rows={4}
                style={{ width: "100%" }}
              />

              <div className="grid grid-2" style={{ gap: 12 }}>
                <input
                  className="share-input"
                  type="date"
                  value={form.start_date}
                  onChange={(event) => updateField("start_date", event.target.value)}
                />

                <input
                  className="share-input"
                  type="date"
                  value={form.end_date}
                  onChange={(event) => updateField("end_date", event.target.value)}
                />
              </div>

              <input
                className="share-input"
                value={form.budget_note}
                onChange={(event) => updateField("budget_note", event.target.value)}
                placeholder="Budget or placement note, optional"
              />

              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Create campaign"}
              </button>
            </form>
          </section>

          <section className="panel">
            <p className="kicker">Active campaigns</p>
            <h2>Your campaigns</h2>

            {campaigns.length ? (
              <div className="promo-detail-list">
                {campaigns.map((campaign) => (
                  <div key={campaign.id}>
                    <strong>{campaign.title || campaign.promo_title || "Campaign"}</strong>
                    <span>
                      {campaign.description ||
                        campaign.subtitle ||
                        "Campaign details coming soon."}
                    </span>
                    <span className="muted">
                      {campaign.promo_title
                        ? `Promo: ${campaign.promo_title}`
                        : campaign.promo_slug
                          ? `Promo: ${campaign.promo_slug}`
                          : "No promo attached"}
                    </span>

                    <div style={{ marginTop: 10 }}>
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => deleteCampaign(campaign)}
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty promo-compact-empty">
                <h3>No campaigns yet</h3>
                <p className="muted">Create your first campaign above.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </RequireAuth>
  );
}
