"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/components/RequireAuth";

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostPromoPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [form, setForm] = useState({
    title: "",
    category: "",
    parish: "",
    location: "",
    venue: "",
    event_date: "",
    event_time: "",
    price: "",
    description: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    facebook: "",
    x_url: "",
    website_link: "",
    poster_image_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitPromo(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage("Please enter a promo title.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        router.push(`/login?next=${encodeURIComponent("/post-promo")}`);
        return;
      }

      const slug = `${makeSlug(form.title)}-${Date.now()}`;

      const payload = {
        user_id: user.id,
        title: form.title.trim(),
        slug,
        category: form.category.trim() || "Promo",
        parish: form.parish.trim() || "Jamaica",
        location: form.location.trim(),
        venue: form.venue.trim(),
        event_date: form.event_date || null,
        event_time: form.event_time || null,
        price: form.price.trim(),
        description: form.description.trim(),
        whatsapp: form.whatsapp.trim(),
        instagram: form.instagram.trim(),
        tiktok: form.tiktok.trim(),
        facebook: form.facebook.trim(),
        x_url: form.x_url.trim(),
        website_link: form.website_link.trim(),
        poster_image_url: form.poster_image_url.trim(),
        status: "pending",
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("ads")
        .insert([payload])
        .select()
        .maybeSingle();

      if (error) throw error;

      setMessage("Promo submitted for review.");

      if (data?.id) {
        router.push("/dashboard/promos");
      }
    } catch (error) {
      console.warn("Post promo error", error);
      setMessage("Unable to submit promo right now.");
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
              <p className="kicker">Post Promo</p>
              <h1>Create a YardPromo listing</h1>
              <p className="muted">
                Add the key details for your flyer, event, business promo, or sale offer.
              </p>
            </div>
          </div>

          {message ? <div className="toast">{message}</div> : null}

          <form className="panel" onSubmit={submitPromo} style={{ display: "grid", gap: 14 }}>
            <div className="grid grid-2" style={{ gap: 12 }}>
              <input
                className="share-input"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Promo title"
                required
              />

              <input
                className="share-input"
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                placeholder="Category, e.g. Party, Food, Beauty"
              />
            </div>

            <div className="grid grid-2" style={{ gap: 12 }}>
              <input
                className="share-input"
                value={form.parish}
                onChange={(event) => updateField("parish", event.target.value)}
                placeholder="Parish"
              />

              <input
                className="share-input"
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="Location"
              />
            </div>

            <input
              className="share-input"
              value={form.venue}
              onChange={(event) => updateField("venue", event.target.value)}
              placeholder="Venue"
            />

            <div className="grid grid-2" style={{ gap: 12 }}>
              <input
                className="share-input"
                type="date"
                value={form.event_date}
                onChange={(event) => updateField("event_date", event.target.value)}
              />

              <input
                className="share-input"
                type="time"
                value={form.event_time}
                onChange={(event) => updateField("event_time", event.target.value)}
              />
            </div>

            <input
              className="share-input"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="Price, e.g. Free, $2000, Contact for details"
            />

            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Description"
              rows={5}
              style={{ width: "100%" }}
            />

            <input
              className="share-input"
              value={form.poster_image_url}
              onChange={(event) => updateField("poster_image_url", event.target.value)}
              placeholder="Poster image URL"
            />

            <div className="grid grid-2" style={{ gap: 12 }}>
              <input
                className="share-input"
                value={form.whatsapp}
                onChange={(event) => updateField("whatsapp", event.target.value)}
                placeholder="WhatsApp"
              />

              <input
                className="share-input"
                value={form.instagram}
                onChange={(event) => updateField("instagram", event.target.value)}
                placeholder="Instagram"
              />
            </div>

            <div className="grid grid-2" style={{ gap: 12 }}>
              <input
                className="share-input"
                value={form.tiktok}
                onChange={(event) => updateField("tiktok", event.target.value)}
                placeholder="TikTok"
              />

              <input
                className="share-input"
                value={form.facebook}
                onChange={(event) => updateField("facebook", event.target.value)}
                placeholder="Facebook"
              />
            </div>

            <div className="grid grid-2" style={{ gap: 12 }}>
              <input
                className="share-input"
                value={form.x_url}
                onChange={(event) => updateField("x_url", event.target.value)}
                placeholder="X / Twitter"
              />

              <input
                className="share-input"
                value={form.website_link}
                onChange={(event) => updateField("website_link", event.target.value)}
                placeholder="Website / Ticket link"
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Submitting..." : "Submit promo"}
            </button>
          </form>
        </div>
      </main>
    </RequireAuth>
  );
}
