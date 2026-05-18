"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { categories, parishes, slugify } from "@/lib/utils";

export default function CreateAdClient({ editId = "" }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const isEditMode = Boolean(editId);

  const [posterFile, setPosterFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [existingPosterUrl, setExistingPosterUrl] = useState("");
  const [existingSlug, setExistingSlug] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [isAdminUser, setIsAdminUser] = useState(false);

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState("idle");
  const [draftId, setDraftId] = useState(null);
  const [draftSaving, setDraftSaving] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState(null);

  const autosaveRef = useRef(null);

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
    status: "pending_review",
    is_featured: false,
    is_premium: false,
    is_weekend_pick: false,
  });

  const MAX_POSTER_SIZE = 5 * 1024 * 1024;
  const ALLOWED_POSTER_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  function draftKey() {
    return isEditMode ? `yp_edit_draft_${editId}` : "yp_create_draft";
  }

  function adToForm(ad) {
    return {
      title: ad.title || "",
      category: ad.category || "Dancehall",
      description: ad.description || "",
      event_date: ad.event_date || "",
      event_time: ad.event_time || "",
      venue: ad.venue || "",
      location: ad.location || "",
      parish: ad.parish || "Kingston",
      price: ad.price || "",
      phone: ad.phone || "",
      whatsapp: ad.whatsapp || "",
      website_link: ad.website_link || "",
      ticket_link: ad.ticket_link || "",
      instagram_link: ad.instagram_link || "",
      call_to_action: ad.call_to_action || "Learn More",
      tags: Array.isArray(ad.tags) ? ad.tags.join(", ") : ad.tags || "",
      status: ad.status || "pending_review",
      is_featured: Boolean(ad.is_featured),
      is_premium: Boolean(ad.is_premium),
      is_weekend_pick: Boolean(ad.is_weekend_pick),
    };
  }

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
    setErrors((e) => ({ ...e, [field]: undefined, general: undefined }));
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

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));

    try {
      localStorage.removeItem("yp_create_poster");
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    let alive = true;

    async function loadCurrentUserRole() {
      try {
        const { data: userData } = await supabase.auth.getUser();

        if (!userData?.user) return;

        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userData.user.id)
          .maybeSingle();

        if (alive) {
          setIsAdminUser(["admin", "super_admin"].includes(profileData?.role));
        }
      } catch {
        // Keep create page usable.
      }
    }

    loadCurrentUserRole();

    return () => {
      alive = false;
    };
  }, [supabase]);

  useEffect(() => {
    let alive = true;

    async function loadEditAd() {
      if (!isEditMode) return;

      setLoadingEdit(true);
      setMessage("");

      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
          router.push(`/login?next=${encodeURIComponent(`/create?edit=${editId}`)}`);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userData.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        const { data: ad, error: adError } = await supabase
          .from("ads")
          .select("*")
          .eq("id", editId)
          .maybeSingle();

        if (adError) throw adError;

        if (!ad) {
          setMessage("Promo not found.");
          return;
        }

        const isAdmin = ["admin", "super_admin"].includes(profileData?.role);
        setIsAdminUser(isAdmin);

        const ownsAd = ad.user_id === userData.user.id;

        if (!isAdmin && !ownsAd) {
          setMessage("You do not have permission to edit this promo.");
          return;
        }

        if (!alive) return;

        setForm((current) => ({ ...current, ...adToForm(ad) }));
        setExistingPosterUrl(ad.poster_image_url || "");
        setPreviewUrl(ad.poster_image_url || "");
        setExistingSlug(ad.slug || "");
        setOwnerId(ad.user_id || "");
      } catch (error) {
        setMessage(error.message || "Unable to load promo for editing.");
      } finally {
        if (alive) setLoadingEdit(false);
      }
    }

    function loadLocalDraft() {
      try {
        const raw = localStorage.getItem(draftKey());
        if (!raw) return;

        const saved = JSON.parse(raw);

        if (saved && typeof saved === "object") {
          setForm((f) => ({ ...f, ...saved.form }));
          if (saved.previewUrl) setPreviewUrl(saved.previewUrl);
          if (saved.draftId) setDraftId(saved.draftId);
          setDraftSavedAt(Date.now());
        }
      } catch {
        // ignore draft restore errors
      }
    }

    loadEditAd().then(loadLocalDraft);

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, isEditMode, router, supabase]);

  useEffect(() => {
    if (autosaveRef.current) clearTimeout(autosaveRef.current);

    autosaveRef.current = setTimeout(() => {
      try {
        const payload = {
          form,
          previewUrl: previewUrl && !previewUrl.startsWith("blob:") ? previewUrl : null,
          draftId,
        };

        localStorage.setItem(draftKey(), JSON.stringify(payload));
        setDraftSavedAt(Date.now());
      } catch {
        // ignore
      }
    }, 900);

    return () => {
      if (autosaveRef.current) clearTimeout(autosaveRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, previewUrl, draftId, editId]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function clearLocalDraft() {
    try {
      localStorage.removeItem(draftKey());
    } catch {
      // ignore
    }

    setDraftId(null);
    setDraftSavedAt(null);
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

  function validateStep(s) {
    const nextErrors = {};

    if (s === 1) {
      if (!form.title || !form.title.trim()) nextErrors.title = "Title is required.";
      if (!form.category) nextErrors.category = "Please select a category.";
      if (!form.description || !form.description.trim()) {
        nextErrors.description = "Description is required.";
      }
    }

    if (s === 2) {
      if (!posterFile && !existingPosterUrl) {
        nextErrors.poster = "Please upload a poster or flyer image.";
      }
    }

    if (s === 3) {
      if (!form.location && !form.venue) {
        nextErrors.location = "Provide a venue or location.";
      }

      if (!form.parish) {
        nextErrors.parish = "Select a parish.";
      }

      if ((form.event_date && !form.event_time) || (!form.event_date && form.event_time)) {
        nextErrors.event_date = "Please provide both date and time or leave both blank.";
      }
    }

    if (s === 4) {
      if (!form.whatsapp && !form.phone && !form.website_link && !form.ticket_link) {
        nextErrors.contact = "Provide at least WhatsApp, phone, website, or ticket link.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateAll() {
    return validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4);
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setErrors({});

    if (!validateAll()) return;

    if (!isValidUrl(form.website_link) || !isValidUrl(form.ticket_link)) {
      setErrors((e) => ({
        ...e,
        website_link: "Please enter valid website or ticket URLs.",
      }));
      return;
    }

    setSaving(true);
    setSubmitState("submitting");

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setSaving(false);
        router.push(
          isEditMode
            ? `/login?next=${encodeURIComponent(`/create?edit=${editId}`)}`
            : `/login?next=${encodeURIComponent("/create")}`
        );
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const role = profileData?.role;
      const isAdmin = ["admin", "super_admin"].includes(role);

      if (
        !isAdmin &&
        (role === "member" || !["advertiser", "promoter", "venue_owner"].includes(role))
      ) {
        const { error: roleError } = await supabase.from("profiles").upsert(
          {
            id: userData.user.id,
            role: "advertiser",
            email: userData.user.email,
          },
          { returning: "minimal" }
        );

        if (roleError) throw roleError;
      }

      if (isEditMode) {
        const { data: existingAd, error: existingError } = await supabase
          .from("ads")
          .select("id,user_id,slug,poster_image_url,status")
          .eq("id", editId)
          .maybeSingle();

        if (existingError) throw existingError;

        if (!existingAd) {
          throw new Error("Promo not found.");
        }

        if (!isAdmin && existingAd.user_id !== userData.user.id) {
          throw new Error("You do not have permission to edit this promo.");
        }

        const slug = existingAd.slug || existingSlug || `${slugify(form.title)}-${Date.now()}`;
        const posterUrl = posterFile
          ? await uploadPoster(userData.user.id, slug)
          : existingPosterUrl || existingAd.poster_image_url || null;

        const updatePayload = {
          title: form.title,
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
          status: isAdmin ? form.status || "approved" : "pending_review",
          is_featured: isAdmin ? Boolean(form.is_featured) : false,
          is_premium: isAdmin ? Boolean(form.is_premium) : false,
          is_weekend_pick: isAdmin ? Boolean(form.is_weekend_pick) : false,
        };

        const { error } = await supabase.from("ads").update(updatePayload).eq("id", editId);

        if (error) throw error;

        setSubmitState("success");
        setSaving(false);
        clearLocalDraft();

        setTimeout(() => router.push("/dashboard?updated=1"), 300);
        return;
      }

      const slug = `${slugify(form.title)}-${Date.now()}`;
      const posterUrl = await uploadPoster(userData.user.id, slug);

      const insertPayload = {
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
        status: isAdmin ? form.status || "approved" : "pending_review",
        is_featured: isAdmin ? Boolean(form.is_featured) : false,
        is_premium: isAdmin ? Boolean(form.is_premium) : false,
        is_weekend_pick: isAdmin ? Boolean(form.is_weekend_pick) : false,
        plan_name: "Free Launch Ad",
        payment_status: "free",
      };

      const { error } = await supabase.from("ads").insert(insertPayload);

      if (error) throw error;

      setSubmitState("success");
      setSaving(false);
      clearLocalDraft();

      setTimeout(() => router.push("/dashboard?created=1"), 300);
    } catch (error) {
      setMessage(error.message || "Unable to save promo.");
      setSubmitState("error");
      setSaving(false);
    }
  }

  async function saveDraft() {
    setDraftSaving(true);
    setMessage("");

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setDraftSaving(false);
        router.push(
          isEditMode
            ? `/login?next=${encodeURIComponent(`/create?edit=${editId}`)}`
            : `/login?next=${encodeURIComponent("/create")}`
        );
        return;
      }

      let posterUrl = existingPosterUrl || null;

      if (posterFile) {
        try {
          posterUrl = await uploadPoster(userData.user.id, `draft-${Date.now()}`);
          setExistingPosterUrl(posterUrl);
          setPreviewUrl(posterUrl);
        } catch {
          // non-fatal
        }
      }

      const tags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (isEditMode) {
        const { data: existingAd, error: existingError } = await supabase
          .from("ads")
          .select("id,user_id,slug")
          .eq("id", editId)
          .maybeSingle();

        if (existingError) throw existingError;
        if (!existingAd) throw new Error("Promo not found.");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userData.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        const isAdmin = ["admin", "super_admin"].includes(profileData?.role);

        if (!isAdmin && existingAd.user_id !== userData.user.id) {
          throw new Error("You do not have permission to edit this promo.");
        }

        const updatePayload = {
          title: form.title,
          category: form.category,
          description: form.description,
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
          tags,
        };

        if (posterUrl) updatePayload.poster_image_url = posterUrl;

        const { error } = await supabase.from("ads").update(updatePayload).eq("id", editId);

        if (error) throw error;

        setDraftSavedAt(Date.now());
        return;
      }

      const slug = `${slugify(form.title || "draft")}-draft-${Date.now()}`;

      if (draftId) {
        const updatePayload = {
          title: form.title,
          category: form.category,
          description: form.description,
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
          tags,
          status: "draft",
        };

        if (posterUrl) updatePayload.poster_image_url = posterUrl;

        const { error } = await supabase.from("ads").update(updatePayload).eq("id", draftId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("ads")
          .insert({
            user_id: userData.user.id,
            title: form.title || "Untitled draft",
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
            tags,
            status: "draft",
            plan_name: "Draft",
            payment_status: "free",
          })
          .select("id")
          .single();

        if (error) throw error;
        if (data?.id) setDraftId(data.id);
      }

      setDraftSavedAt(Date.now());
    } catch (error) {
      setMessage(error.message || "Unable to save draft.");
    } finally {
      setDraftSaving(false);
    }
  }

  if (loadingEdit) {
    return (
      <main className="section create-page">
        <div className="container">
          <div className="toast">Loading promo for editing...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="section create-page">
      <div className="container create-grid">
        <section className="create-main-card">
          <div className="create-header">
            <p className="kicker">{isEditMode ? "EDIT PROMO" : "POST PROMO"}</p>
            <h2>{isEditMode ? "Edit promotion." : "Create a promotion."}</h2>
            <p className="muted">
              {isEditMode
                ? "Update your promo details and submit changes for review."
                : "Upload your poster, add the details, and submit your promo for review."}
            </p>
          </div>

          <div className="create-step-grid">
            {[1, 2, 3, 4, 5].map((item) => {
              const labels = {
                1: "Basic details",
                2: "Poster / Flyer",
                3: "Location / Parish",
                4: "Contact / Social",
                5: "Preview & submit",
              };

              return (
                <div
                  key={item}
                  className={`create-step-card ${step === item ? "active" : ""}`}
                  onClick={() => setStep(item)}
                >
                  <span className="step-number">{item}</span>
                  <div>
                    <strong>{labels[item]}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="form-section-title">
            {step === 1
              ? "Basic Info"
              : step === 2
                ? "Poster / Flyer"
                : step === 3
                  ? "Location / Parish"
                  : step === 4
                    ? "Contact & Social"
                    : "Preview & Submit"}
          </div>

          <form onSubmit={submit} className="form-grid" style={{ marginTop: 22 }}>
            {step === 1 ? (
              <>
                <div className="form-row">
                  <label>
                    Ad title
                    <input
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                      placeholder="Uptown Friday Dancehall Party"
                    />
                    {errors.title ? <span className="yp-field-error">{errors.title}</span> : null}
                  </label>

                  <label>
                    Category
                    <select
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category ? (
                      <span className="yp-field-error">{errors.category}</span>
                    ) : null}
                  </label>
                </div>

                <label>
                  Description
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                  {errors.description ? (
                    <span className="yp-field-error">{errors.description}</span>
                  ) : null}
                </label>

                <div className="form-row">
                  <label>
                    Event date
                    <input
                      type="date"
                      value={form.event_date}
                      onChange={(e) => update("event_date", e.target.value)}
                    />
                    {errors.event_date ? (
                      <span className="yp-field-error">{errors.event_date}</span>
                    ) : null}
                  </label>

                  <label>
                    Event time
                    <input
                      type="time"
                      value={form.event_time}
                      onChange={(e) => update("event_time", e.target.value)}
                    />
                  </label>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <label className="upload-box">
                  <strong>Upload poster / flyer image</strong>
                  <span className="muted">
                    JPG, PNG, WebP or GIF. This uploads to the Supabase posters bucket.
                  </span>

                  {isEditMode && existingPosterUrl && !posterFile ? (
                    <span className="muted">
                      Current poster will stay unless you choose a new one.
                    </span>
                  ) : null}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      choosePoster(e.target.files?.[0]);
                      setErrors((s) => ({ ...s, poster: undefined }));
                    }}
                  />

                  {errors.poster ? <span className="yp-field-error">{errors.poster}</span> : null}
                </label>

                <div style={{ marginTop: 8 }}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Poster preview" style={{ maxWidth: 320 }} />
                  ) : (
                    <div className="poster-empty">No poster selected</div>
                  )}
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div className="form-row">
                  <label>
                    Venue
                    <input
                      value={form.venue}
                      onChange={(e) => update("venue", e.target.value)}
                      placeholder="New Kingston Lounge"
                    />
                  </label>

                  <label>
                    Location
                    <input
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="New Kingston"
                    />
                    {errors.location ? (
                      <span className="yp-field-error">{errors.location}</span>
                    ) : null}
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    Parish
                    <select value={form.parish} onChange={(e) => update("parish", e.target.value)}>
                      {parishes.map((parish) => (
                        <option key={parish}>{parish}</option>
                      ))}
                    </select>
                    {errors.parish ? <span className="yp-field-error">{errors.parish}</span> : null}
                  </label>

                  <label>
                    Price / entry fee
                    <input
                      value={form.price}
                      onChange={(e) => update("price", e.target.value)}
                      placeholder="JMD $2,500 presold"
                    />
                  </label>
                </div>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <div className="form-row">
                  <label>
                    Phone
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+1 876 555 0100"
                    />
                  </label>

                  <label>
                    WhatsApp
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => update("whatsapp", e.target.value)}
                      placeholder="+18765550100"
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    Website link
                    <input
                      type="url"
                      value={form.website_link}
                      onChange={(e) => update("website_link", e.target.value)}
                      placeholder="https://..."
                    />
                    {errors.website_link ? (
                      <span className="yp-field-error">{errors.website_link}</span>
                    ) : null}
                  </label>

                  <label>
                    Ticket link
                    <input
                      type="url"
                      value={form.ticket_link}
                      onChange={(e) => update("ticket_link", e.target.value)}
                      placeholder="https://..."
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    Instagram
                    <input
                      value={form.instagram_link}
                      onChange={(e) => update("instagram_link", e.target.value)}
                      placeholder="@yourhandle"
                    />
                  </label>

                  <label>
                    Button text
                    <input
                      value={form.call_to_action}
                      onChange={(e) => update("call_to_action", e.target.value)}
                    />
                  </label>
                </div>

                <label>
                  Tags
                  <input
                    value={form.tags}
                    onChange={(e) => update("tags", e.target.value)}
                    placeholder="dancehall, kingston, party"
                  />
                  {errors.contact ? (
                    <span className="yp-field-error">{errors.contact}</span>
                  ) : null}
                </label>
              </>
            ) : null}

            {step === 5 ? (
              <>
                <div className="panel">
                  <h3>Preview</h3>
                  <p className="muted">Review your promo details before submitting.</p>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      marginTop: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: 220,
                        height: 360,
                        background: "#f7f7f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Poster preview"
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                      ) : (
                        <div className="poster-empty">No poster</div>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3>{form.title || "Untitled promo"}</h3>
                      <div className="muted">
                        {form.parish} — {form.location || form.venue}
                      </div>
                      <p style={{ marginTop: 8 }}>{form.description}</p>
                      <p className="muted">
                        Category: {form.category} • Price: {form.price || "Free"}
                      </p>
                    </div>
                  </div>
                </div>

                {isAdminUser ? (
                  <div className="panel" style={{ marginTop: 12 }}>
                    <p className="kicker">Admin placement</p>
                    <h3>Homepage placement</h3>
                    <p className="muted">
                      Choose where this promo should appear on YardPromo.
                    </p>

                    <div className="form-grid" style={{ marginTop: 14 }}>
                      <label>
                        Public status
                        <select
                          value={form.status}
                          onChange={(e) => update("status", e.target.value)}
                        >
                          <option value="approved">Approved / Published</option>
                          <option value="pending_review">Pending review</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </label>

                      <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(form.is_featured)}
                          onChange={(e) => update("is_featured", e.target.checked)}
                          style={{ width: "auto" }}
                        />
                        Featured promo
                      </label>

                      <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(form.is_premium)}
                          onChange={(e) => update("is_premium", e.target.checked)}
                          style={{ width: "auto" }}
                        />
                        Show in Premium picks
                      </label>

                      <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(form.is_weekend_pick)}
                          onChange={(e) => update("is_weekend_pick", e.target.checked)}
                          style={{ width: "auto" }}
                        />
                        Show in What’s hot this weekend
                      </label>
                    </div>
                  </div>
                ) : null}

                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={submitState === "submitting" || submitState === "success" || saving}
                  >
                    {submitState === "submitting"
                      ? "Submitting..."
                      : submitState === "success"
                        ? "Saved"
                        : submitState === "error"
                          ? "Retry"
                          : isEditMode
                            ? "Save Changes"
                            : "Create Free Ad"}
                  </button>
                </div>
              </>
            ) : null}

            <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
              {step > 1 ? (
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => {
                    setMessage("");
                    setStep(step - 1);
                  }}
                >
                  Back
                </button>
              ) : null}

              {isEditMode ? (
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => router.push(existingSlug ? `/ad/${existingSlug}` : "/dashboard")}
                >
                  Cancel
                </button>
              ) : null}

              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  if (confirm("Clear saved draft for this promo?")) {
                    clearLocalDraft();
                    setMessage("Draft cleared.");
                  }
                }}
              >
                Clear draft
              </button>

              <button
                type="button"
                className="btn btn-light"
                disabled={draftSaving}
                onClick={saveDraft}
              >
                {draftSaving ? "Saving draft..." : "Save draft"}
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const ok = validateStep(step);
                    if (!ok) return;
                    setMessage("");
                    setStep(step + 1);
                  }}
                >
                  Next
                </button>
              ) : null}
            </div>
          </form>

          {message ? (
            <div className="toast error" style={{ marginTop: 12 }}>
              {message}
            </div>
          ) : null}

          {draftSavedAt ? (
            <div style={{ marginTop: 10 }} className="small muted">
              Draft saved {new Date(draftSavedAt).toLocaleString()}
            </div>
          ) : null}

          {ownerId && isEditMode ? (
            <div style={{ marginTop: 10 }} className="small muted">
              Editing existing promo.
            </div>
          ) : null}
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