"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { categories, parishes, slugify } from "@/lib/utils";

export default function CreateAdPage() {
  const router = useRouter();
  const supabase = createClient();

  const [posterFile, setPosterFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Dancehall",
    description: "",
    event_date: "",
    event_time: "",
    venue: "",
    location: "",
    parish: "Kingston",
    price: "",
    phone: "",
    whatsapp: "",
    website_link: "",
    ticket_link: "",
    instagram_link: "",
    call_to_action: "Learn More",
    tags: "",
  });

  const MAX_POSTER_SIZE = 5 * 1024 * 1024;
  const ALLOWED_POSTER_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  function isValidUrl(value) {
    try {
      if (!value) return true;
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }


  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function choosePoster(file) {
    if (!file) return;

    if (!ALLOWED_POSTER_TYPES.includes(file.type)) {
      setMessage("Only JPG, PNG, WebP, and GIF images are allowed.");
      return;
    }

    if (file.size > MAX_POSTER_SIZE) {
      setMessage("Poster file must be 5MB or smaller.");
      return;
    }

    setMessage("");
    setPosterFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  async function uploadPoster(userId, slug) {
    if (!posterFile) return null;

    const extension = posterFile.name.split(".").pop();
    const path = `${userId}/${slug}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("posters")
      .upload(path, posterFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: posterFile.type,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("posters").getPublicUrl(path);
    return data.publicUrl;
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");

    if (!isValidUrl(form.website_link) || !isValidUrl(form.ticket_link)) {
      setMessage("Please enter valid website and ticket URLs.");
      return;
    }

    setSaving(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setSaving(false);
        router.push("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (profileData?.role === "member" || !["advertiser", "promoter", "venue_owner"].includes(profileData?.role)) {
        const { error: roleError } = await supabase.from("profiles").upsert(
          { id: userData.user.id, role: "advertiser", email: userData.user.email },
          { returning: "minimal" }
        );
        if (roleError) throw roleError;
      }

      const slug = `${slugify(form.title)}-${Date.now()}`;
      const posterUrl = await uploadPoster(userData.user.id, slug);

      const { error } = await supabase.from("ads").insert({
        user_id: userData.user.id,
        title: form.title,
        slug,
        category: form.category,
        description: form.description,
        poster_image_url: posterUrl,
        event_date: form.event_date || null,
        event_time: form.event_time || null,
        venue: form.venue,
        location: form.location,
        parish: form.parish,
        price: form.price,
        phone: form.phone,
        whatsapp: form.whatsapp,
        website_link: form.website_link,
        ticket_link: form.ticket_link,
        instagram_link: form.instagram_link,
        call_to_action: form.call_to_action,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        status: "pending_review",
        plan_name: "Free Launch Ad",
        payment_status: "free",
      });

      if (error) throw error;

      router.push("/dashboard?created=1");
    } catch (error) {
      setMessage(error.message || "Unable to create promo.");
      setSaving(false);
    }
  }

  return (
    <main className="section create-page">
      <div className="container create-grid">
        <section className="create-main-card">
          <div className="create-header">
            <p className="kicker">POST PROMO</p>
            <h2>Create a promotion.</h2>
            <p className="muted">Upload your poster, add the details, and submit your promo for review.</p>
          </div>

          <div className="create-step-grid">
            <div className="create-step-card">
              <span className="step-number">1</span>
              <div>
                <strong>Choose promo type</strong>
              </div>
            </div>
            <div className="create-step-card">
              <span className="step-number">2</span>
              <div>
                <strong>Upload poster</strong>
              </div>
            </div>
            <div className="create-step-card">
              <span className="step-number">3</span>
              <div>
                <strong>Preview &amp; submit</strong>
              </div>
            </div>
          </div>

          <div className="form-section-title">Basic Info</div>

          <form onSubmit={submit} className="form-grid" style={{ marginTop: 22 }}>
            <div className="form-row">
              <label>
                Ad title
                <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Uptown Friday Dancehall Party" required />
              </label>

              <label>
                Category
                <select value={form.category} onChange={(e) => update("category", e.target.value)}>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
            </div>

            <label>
              Description
              <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} required />
            </label>

            <div className="form-row">
              <label>
                Event date
                <input type="date" value={form.event_date} onChange={(e) => update("event_date", e.target.value)} />
              </label>
              <label>
                Event time
                <input type="time" value={form.event_time} onChange={(e) => update("event_time", e.target.value)} />
              </label>
            </div>

            <div className="form-row">
              <label>
                Venue
                <input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder="New Kingston Lounge" />
              </label>
              <label>
                Location
                <input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="New Kingston" required />
              </label>
            </div>

            <div className="form-row">
              <label>
                Parish
                <select value={form.parish} onChange={(e) => update("parish", e.target.value)}>
                  {parishes.map((parish) => <option key={parish}>{parish}</option>)}
                </select>
              </label>
              <label>
                Price / entry fee
                <input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="JMD $2,500 presold" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Phone
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 876 555 0100" />
              </label>
              <label>
                WhatsApp
                <input type="tel" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="+18765550100" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Website link
                <input type="url" value={form.website_link} onChange={(e) => update("website_link", e.target.value)} placeholder="https://..." />
              </label>
              <label>
                Ticket link
                <input type="url" value={form.ticket_link} onChange={(e) => update("ticket_link", e.target.value)} placeholder="https://..." />
              </label>
            </div>

            <div className="form-row">
              <label>
                Instagram
                <input value={form.instagram_link} onChange={(e) => update("instagram_link", e.target.value)} placeholder="@yourhandle" />
              </label>
              <label>
                Button text
                <input value={form.call_to_action} onChange={(e) => update("call_to_action", e.target.value)} />
              </label>
            </div>

            <label>
              Tags
              <input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="dancehall, kingston, party" />
            </label>

            <label className="upload-box">
              <strong>Upload poster / flyer image</strong>
              <span className="muted">JPG, PNG, WebP or GIF. This uploads to the Supabase `posters` bucket.</span>
              <input type="file" accept="image/*" onChange={(e) => choosePoster(e.target.files?.[0])} />
            </label>

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Create Free Ad"}
            </button>
          </form>

          {message && <div className="toast error">{message}</div>}
        </section>

        <aside className="create-sidebar">
          <div className="create-preview-card">
            <h3>Preview</h3>
            <p className="muted">Your poster preview will appear here.</p>
            {previewUrl ? (
              <img src={previewUrl} alt="Poster preview" />
            ) : (
              <div className="poster-empty">No poster selected</div>
            )}
          </div>

          <div className="checklist-card">
            <h3>Posting checklist</h3>
            <p>Add date, parish, WhatsApp, and a clear call-to-action for better results.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
