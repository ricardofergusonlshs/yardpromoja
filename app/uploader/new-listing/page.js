"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import RequireRole from "@/app/components/RequireRole";
import { createClient } from "@/lib/supabaseClient";

const uploaderRoles = ["content_uploader", "admin", "super_admin"];

const initialForm = {
  title: "",
  category: "",
  parish: "",
  location: "",
  description: "",
  contact_name: "",
  phone: "",
  whatsapp: "",
  instagram: "",
  tiktok: "",
  facebook: "",
  website: "",
  google_maps_url: "",
  opening_hours: "",
  source_url: "",
  source_notes: "",
  image_permission_status: "placeholder_used",
};

function makeSlug(title) {
  const clean = String(title || "yardpromo-listing")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${clean}-${Date.now()}`;
}

function cleanFileName(name) {
  return String(name || "upload")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewUploaderListingPage() {
  const supabase = useMemo(() => createClient(), []);

  const [form, setForm] = useState(initialForm);
  const [posterFile, setPosterFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function uploadPosterImage(user) {
    if (!posterFile) return "";

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(posterFile.type)) {
      throw new Error("Please upload a JPG, PNG, or WEBP image.");
    }

    if (posterFile.size > maxSize) {
      throw new Error("Image must be 5MB or smaller.");
    }

    const filePath = `${user.id}/${Date.now()}-${cleanFileName(
      posterFile.name
    )}`;

    const { error: uploadError } = await supabase.storage
      .from("ad-posters")
      .upload(filePath, posterFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: posterFile.type,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("ad-posters")
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || "";
  }

  async function submitListing(event) {
    event.preventDefault();
    setMessage("");

    if (!form.title.trim() || !form.category.trim() || !form.parish.trim()) {
      setMessage("Name, category, and parish are required.");
      return;
    }

    if (!form.source_url.trim()) {
      setMessage("A source URL is required for review.");
      return;
    }

    setSaving(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        window.location.href = `/login?next=${encodeURIComponent(
          "/uploader/new-listing"
        )}`;
        return;
      }

      const uploadedImageUrl = await uploadPosterImage(user);
      const slug = makeSlug(form.title);

      const payload = {
        title: form.title.trim(),
        slug,

        type: form.category.trim(),
        category: form.category.trim(),
        parish: form.parish.trim(),
        location: form.location.trim(),
        venue: form.location.trim(),
        description: form.description.trim(),

        contact_name: form.contact_name.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        instagram: form.instagram.trim(),
        tiktok: form.tiktok.trim(),
        facebook: form.facebook.trim(),
        website: form.website.trim(),
        google_maps_url: form.google_maps_url.trim(),
        opening_hours: form.opening_hours.trim(),

        source_url: form.source_url.trim(),
        source_notes: form.source_notes.trim(),
        image_permission_status: form.image_permission_status,

        poster_image_url: uploadedImageUrl || null,
        image_url: uploadedImageUrl || null,

        source_type: "curated",
        claim_status: "unclaimed",
        created_by_role: "content_uploader",

        review_status: "pending_review",
        status: "pending_review",

        submitted_by: user.id,
        submitted_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("ads")
        .insert([payload])
        .select("id")
        .maybeSingle();

      if (error) throw error;

      if (data?.id) {
        const { error: sourceError } = await supabase
          .from("content_upload_sources")
          .insert([
            {
              ad_id: data.id,
              uploader_id: user.id,
              source_url: form.source_url.trim(),
              source_type: "official_or_public_source",
              permission_status: form.image_permission_status,
              notes: form.source_notes.trim(),
            },
          ]);

        if (sourceError) throw sourceError;
      }

      setForm(initialForm);
      setPosterFile(null);
      setMessage("Listing submitted for admin review.");
    } catch (error) {
      console.warn("Uploader listing submit error:", error);
      setMessage(error?.message || "Unable to submit listing.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RequireRole allowedRoles={uploaderRoles}>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Uploader</p>
              <h1>Add curated listing</h1>
              <p className="muted">
                Submit accurate public listings for admin approval.
              </p>
            </div>

            <Link className="btn btn-light" href="/uploader">
              Dashboard
            </Link>
          </div>

          {message ? <div className="toast">{message}</div> : null}

          <form
            className="panel"
            onSubmit={submitListing}
            style={{ display: "grid", gap: 14 }}
          >
            <label>
              Business/Event Name *
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Example: Devon House"
              />
            </label>

            <div className="grid grid-3">
              <label>
                Category *
                <input
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  placeholder="Resort, Restaurant, Party, Attraction..."
                />
              </label>

              <label>
                Parish *
                <input
                  value={form.parish}
                  onChange={(event) => updateField("parish", event.target.value)}
                  placeholder="Kingston, St. Ann..."
                />
              </label>

              <label>
                Location / Venue
                <input
                  value={form.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  placeholder="Town, area, venue..."
                />
              </label>
            </div>

            <label>
              Original Description
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={5}
                placeholder="Write your own short description. Do not copy from other websites."
              />
            </label>

            <div className="grid grid-3">
              <label>
                Contact Name
                <input
                  value={form.contact_name}
                  onChange={(event) =>
                    updateField("contact_name", event.target.value)
                  }
                />
              </label>

              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                />
              </label>

              <label>
                WhatsApp
                <input
                  value={form.whatsapp}
                  onChange={(event) =>
                    updateField("whatsapp", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="grid grid-3">
              <label>
                Instagram
                <input
                  value={form.instagram}
                  onChange={(event) =>
                    updateField("instagram", event.target.value)
                  }
                />
              </label>

              <label>
                TikTok
                <input
                  value={form.tiktok}
                  onChange={(event) => updateField("tiktok", event.target.value)}
                />
              </label>

              <label>
                Facebook
                <input
                  value={form.facebook}
                  onChange={(event) =>
                    updateField("facebook", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="grid grid-3">
              <label>
                Website
                <input
                  value={form.website}
                  onChange={(event) =>
                    updateField("website", event.target.value)
                  }
                />
              </label>

              <label>
                Google Maps URL
                <input
                  value={form.google_maps_url}
                  onChange={(event) =>
                    updateField("google_maps_url", event.target.value)
                  }
                />
              </label>

              <label>
                Opening Hours
                <input
                  value={form.opening_hours}
                  onChange={(event) =>
                    updateField("opening_hours", event.target.value)
                  }
                />
              </label>
            </div>

            <label>
              Listing Image / Poster
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  setPosterFile(event.target.files?.[0] || null)
                }
              />
              <small className="muted">
                Upload JPG, PNG, or WEBP. Maximum size: 5MB.
              </small>
            </label>

            <label>
              Source URL *
              <input
                value={form.source_url}
                onChange={(event) =>
                  updateField("source_url", event.target.value)
                }
                placeholder="Official website, official social page, or Google Business link"
              />
            </label>

            <label>
              Image Permission Status
              <select
                value={form.image_permission_status}
                onChange={(event) =>
                  updateField("image_permission_status", event.target.value)
                }
              >
                <option value="owner_provided">Owner provided</option>
                <option value="official_media_kit">Official media kit</option>
                <option value="public_logo_only">Public logo only</option>
                <option value="placeholder_used">Placeholder used</option>
                <option value="needs_permission">Needs permission</option>
              </select>
            </label>

            <label>
              Source / Permission Notes
              <textarea
                value={form.source_notes}
                onChange={(event) =>
                  updateField("source_notes", event.target.value)
                }
                rows={3}
                placeholder="Add notes for admin review."
              />
            </label>

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Submitting..." : "Submit for Review"}
            </button>
          </form>
        </div>
      </main>
    </RequireRole>
  );
}