"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/components/RequireAuth";

export default function SaleOffersPage() {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState(null);
  const [promos, setPromos] = useState([]);
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    ad_id: "",
    title: "",
    description: "",
    offer_type: "",
    start_date: "",
    end_date: "",
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
          .select("id,title,slug,status")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (adError) throw adError;

        if (alive) {
          setPromos(adData || []);
        }

        try {
          const { data: offerData, error: offerError } = await supabase
            .from("sale_offers")
            .select("*, ad:ads(id,title,slug)")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false });

          if (offerError) throw offerError;

          if (alive) {
            setOffers(offerData || []);
          }
        } catch (offerError) {
          console.warn("Sale offers table unavailable", offerError);
          if (alive) {
            setOffers([]);
          }
        }
      } catch (error) {
        console.warn("Sale offers load error", error);
        if (alive) {
          setMessage("Unable to load sale offers right now.");
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

  async function createOffer(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage("Please enter an offer title.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        user_id: user?.id,
        ad_id: form.ad_id || null,
        title: form.title.trim(),
        description: form.description.trim(),
        offer_type: form.offer_type.trim() || "Sale offer",
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        status: "active",
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("sale_offers")
        .insert([payload])
        .select("*, ad:ads(id,title,slug)")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setOffers((current) => [data, ...current]);
      }

      setForm({
        ad_id: "",
        title: "",
        description: "",
        offer_type: "",
        start_date: "",
        end_date: "",
      });

      setMessage("Sale offer created.");
    } catch (error) {
      console.warn("Create sale offer error", error);
      setMessage(
        "Unable to save sale offer. If this is your first setup, create a sale_offers table in Supabase."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteOffer(offer) {
    if (!offer?.id) return;
    if (!confirm("Delete this sale offer?")) return;

    setSaving(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("sale_offers")
        .delete()
        .eq("id", offer.id)
        .eq("user_id", user?.id);

      if (error) throw error;

      setOffers((current) => current.filter((item) => item.id !== offer.id));
      setMessage("Sale offer deleted.");
    } catch (error) {
      console.warn("Delete sale offer error", error);
      setMessage("Unable to delete sale offer.");
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
              <h1>Sale Offers</h1>
              <p className="muted">
                Add special deals, giveaways, discounts, and limited-time offers to your promos.
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

          {loading ? <div className="toast">Loading sale offers...</div> : null}
          {message ? <div className="toast">{message}</div> : null}

          <section className="panel" style={{ marginBottom: 20 }}>
            <p className="kicker">New offer</p>
            <h2>Add sale offer</h2>

            <form onSubmit={createOffer} style={{ display: "grid", gap: 12 }}>
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
                placeholder="Offer title, e.g. Early bird tickets"
              />

              <input
                className="share-input"
                value={form.offer_type}
                onChange={(event) => updateField("offer_type", event.target.value)}
                placeholder="Offer type, e.g. Discount, Giveaway, Bundle"
              />

              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Offer details"
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

              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Create offer"}
              </button>
            </form>
          </section>

          <section className="panel">
            <p className="kicker">Current offers</p>
            <h2>Your sale offers</h2>

            {offers.length ? (
              <div className="promo-detail-list">
                {offers.map((offer) => (
                  <div key={offer.id}>
                    <strong>{offer.title}</strong>
                    <span>{offer.description || "Offer details coming soon."}</span>
                    <span className="muted">
                      {offer.ad?.title ? `Promo: ${offer.ad.title}` : "No promo attached"}
                    </span>

                    <div style={{ marginTop: 10 }}>
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => deleteOffer(offer)}
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
                <h3>No sale offers yet</h3>
                <p className="muted">Create your first offer above.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </RequireAuth>
  );
}
