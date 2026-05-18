"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdsGrid from "../AdsGrid";
import { createClient } from "@/lib/supabaseClient";
import { getAdUrl, getCalendarUrl, getMapsSearchUrl, getWhatsAppShareUrl } from "@/lib/routes";
import {
  eventLabel,
  getAdBySlug,
  getPromoter,
  getVenue,
  heatScore,
  interestCount,
  relatedAds,
  rsvpCount,
} from "@/lib/yardpromoData";

export default function AdDetailClient({ slug, ad }) {
  const [currentAd, setCurrentAd] = useState(ad);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [interestCountState, setInterestCountState] = useState(interestCount(ad));
  const [interestSaving, setInterestSaving] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [posterStudioOpen, setPosterStudioOpen] = useState(false);
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [captionModalOpen, setCaptionModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [sharePackModalOpen, setSharePackModalOpen] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadAd() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (!alive) return;

        if (error) {
          console.warn("Ad fetch error", error);

          const fallback = getAdBySlug(slug);
          setCurrentAd(fallback);
          setInterestCountState(interestCount(fallback));
          setMessage("Promo details are unavailable, showing demo content.");
          setLoading(false);
          return;
        }

        if (data) {
          setCurrentAd(data);
          setInterestCountState(interestCount(data));
          setMessage("");
        } else {
          const fallback = getAdBySlug(slug);

          if (fallback && fallback.slug === slug) {
            setCurrentAd(fallback);
            setInterestCountState(interestCount(fallback));
            setMessage(
              "Promo not found in the live database; demo content is displayed."
            );
          } else {
            setCurrentAd(null);
            setMessage("Promo not found.");
          }
        }
      } catch (error) {
        console.warn("Ad load failed", error);

        const fallback = getAdBySlug(slug);
        setCurrentAd(fallback);
        setInterestCountState(interestCount(fallback));
        setMessage("Unable to load promo details right now.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadAd();

    return () => {
      alive = false;
    };
  }, [slug]);

  function handleInterest() {
    // Save interest locally and show modal + toast.
    if (!currentAd?.slug && !slug) {
      showToast("Unable to save interest for unknown promo.");
      return;
    }

    const theSlug = currentAd?.slug || slug;
    if (interestSaving) return;
    const key = `yardpromo_interest_${theSlug}`;

    try {
      if (localStorage.getItem(key)) {
        showToast("Interest already recorded.");
        return;
      }
      localStorage.setItem(key, JSON.stringify({ slug: theSlug, date: Date.now() }));
    } catch (e) {
      // ignore
    }

    setInterestCountState((current) => current + 1);
    setInterestSaving(true);

    // Try to persist to Supabase but fail silently.
    (async () => {
      try {
        const supabase = createClient();
        const user = await supabase.auth.getUser();
        if (user?.data?.user) {
          await supabase.from("interest_events").insert({ slug: theSlug, user_id: user.data.user.id, created_at: new Date() });
        }
      } catch (e) {
        // table might not exist — ignore
      } finally {
        setInterestSaving(false);
      }
    })();

    setInterestModalOpen(true);
    showToast("Interest saved.");
  }

  function handleCloseInterestModal() {
    setInterestModalOpen(false);
  }

  function getCurrentUrl() {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }

  function getPublicAdUrl() {
    return getAdUrl(currentAd?.slug || slug);
  }

  async function handleCopyLink() {
    const short = getPublicAdUrl();

    try {
      await navigator.clipboard?.writeText(short);
      showToast("Link copied.");
    } catch (e) {
      showToast("Copy failed. You can copy the URL from the address bar.");
    }
  }

  function openPreviewModal() {
    setPreviewModalOpen(true);
  }

  function openInquiryModal() {
    setInquiryModalOpen(true);
  }

  function openClaimModal() {
    setClaimModalOpen(true);
  }

  function openBoostModal() {
    setBoostModalOpen(true);
  }

  function openAlertsModal() {
    setAlertsModalOpen(true);
  }

  function handleRSVP() {
    setRsvpModalOpen(true);
  }

  async function handleSharePromo() {
    if (typeof window === "undefined") return;

    const shareTitle = currentAd?.title || "YardPromo Jamaica";
    const shareText =
      currentAd?.description || "Check out this promo on YardPromo Jamaica.";
    const short = getPublicAdUrl();

    if (navigator.share) {
      navigator
        .share({
          title: shareTitle,
          text: `${shareText} ${short}`,
          url: short,
        })
        .catch(() => {});

      return;
    }

    try {
      await navigator.clipboard?.writeText(`${shareTitle} - ${short}`);
      showToast("Link copied.");
    } catch (e) {
      showToast("Unable to copy link.");
    }
  }

  function handleOpenSharePack() {
    setSharePackModalOpen(true);
  }

  function handleCloseSharePackModal() {
    setSharePackModalOpen(false);
  }

  function handleAddToCalendar() {
    if (!currentAd?.event_date) {
      showToast("No event date available for calendar.");
      return;
    }

    const title = encodeURIComponent(currentAd.title || "YardPromo Event");
    const details = encodeURIComponent(
      currentAd.description || "YardPromo Jamaica event."
    );
    const location = encodeURIComponent(
      `${currentAd.location || currentAd.venue || ""}, ${currentAd.parish || ""}`
    );

    const dateOnly = String(currentAd.event_date).replace(/-/g, "");
    const timeOnly = currentAd.event_time
      ? String(currentAd.event_time).replace(":", "").slice(0, 4)
      : "1900";
    const start = `${dateOnly}T${timeOnly}00`;

    const googleCalendarUrl = getCalendarUrl(currentAd);
    window.open(googleCalendarUrl, "_blank", "noopener,noreferrer");

    // Also generate a simple .ics file for download
    try {
      const dtstamp = new Date().toISOString().replace(/[-:]/g, "");
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//YardPromo//EN",
        "BEGIN:VEVENT",
        `UID:${(currentAd?.slug || slug) || Math.random().toString(36).slice(2)}@yardpromoja.com`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${start}`,
        `DTEND:${start}`,
        `SUMMARY:${decodeURIComponent(title)}`,
        `DESCRIPTION:${decodeURIComponent(details)}`,
        `LOCATION:${decodeURIComponent(location)}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${(currentAd?.slug || slug) || "event"}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (e) {
      // ignore
    }
  }

  function handleRemindMe() {
    if (!currentAd?.slug && !slug) {
      showToast("Unable to save alert for unknown promo.");
      return;
    }

    try {
      const key = "yardpromo_alerts";
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      const theSlug = currentAd?.slug || slug;
      stored.push({ slug: theSlug, date: Date.now() });
      localStorage.setItem(key, JSON.stringify(stored));
      showToast("Alert saved on this device.");
    } catch (e) {
      showToast("Unable to save alert locally.");
    }

    (async () => {
      try {
        const supabase = createClient();
        const user = await supabase.auth.getUser();
        if (user?.data?.user) {
          await supabase.from("alerts").insert({ slug: currentAd?.slug || slug, user_id: user.data.user.id, created_at: new Date() });
        }
      } catch (e) {}
    })();
  }

  function showToast(txt, t = 2500) {
    setShareMessage(txt);
    setTimeout(() => setShareMessage(""), t);
  }

  function handlePreviewShareLink() {
    openPreviewModal();
  }

  function handleWhatsAppShare() {
    const url = getWhatsAppShareUrl(currentAd || { title: "YardPromo Jamaica", slug });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleSendInquiry() {
    openInquiryModal();
  }

  function handleGetDirections() {
    const place = currentAd?.venue || currentAd?.location || currentAd?.parish;
    if (!place) {
      showToast("Location unavailable.");
      return;
    }

    setDirectionsModalOpen(true);
  }

  function handleSaveEvent() {
    try {
      const key = "yardpromo_saved_ads";
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      const theSlug = currentAd?.slug || slug;
      if (!stored.find((s) => s.slug === theSlug)) {
        stored.push({ slug: theSlug, title: currentAd?.title || "", saved_at: Date.now() });
        localStorage.setItem(key, JSON.stringify(stored));
      }
      showToast("Promo saved.");
    } catch (e) {
      showToast("Unable to save promo locally.");
    }

    (async () => {
      try {
        const supabase = createClient();
        const user = await supabase.auth.getUser();
        if (user?.data?.user) {
          await supabase.from("saved_promos").insert({ slug: currentAd?.slug || slug, user_id: user.data.user.id, created_at: new Date() });
        }
      } catch (e) {}
    })();
  }

  function handleViewPromoter() {
    if (promoter?.slug) return; // Link exists in UI
    showToast("Promoter profile unavailable.");
  }

  function handleViewVenue() {
    const place = currentAd?.venue || currentAd?.location || currentAd?.parish;
    if (!place) {
      showToast("Venue information unavailable.");
      return;
    }
    setDirectionsModalOpen(true);
  }

  function openReportModal() {
    setReportReason("");
    setReportModalOpen(true);
  }

  function submitReport() {
    if (!currentAd?.slug && !slug) {
      showToast("Unable to report unknown promo.");
      return;
    }
    try {
      const key = "yardpromo_reports";
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      stored.push({ slug: currentAd?.slug || slug, reason: reportReason, date: Date.now() });
      localStorage.setItem(key, JSON.stringify(stored));
      showToast("Report submitted. Thank you.");
      setReportModalOpen(false);
    } catch (e) {
      showToast("Unable to submit report locally.");
    }

    (async () => {
      try {
        const supabase = createClient();
        const user = await supabase.auth.getUser();
        if (user?.data?.user) {
          await supabase.from("promo_reports").insert({ slug: currentAd?.slug || slug, user_id: user.data.user.id, reason: reportReason, created_at: new Date() });
        }
      } catch (e) {}
    })();
  }

  function openPosterStudio() {
    setPosterStudioOpen(true);
  }

  function closePosterStudio() {
    setPosterStudioOpen(false);
  }

  function generateCaptionText() {
    const theSlug = currentAd?.slug || slug;
    const parts = [];
    if (currentAd?.title) parts.push(currentAd.title);
    if (currentAd?.event_date || currentAd?.event_time) parts.push(`${currentAd?.event_date || ""} ${currentAd?.event_time || ""}`.trim());
    if (currentAd?.venue || currentAd?.location) parts.push(`${currentAd?.venue || currentAd?.location}${currentAd?.parish ? ", " + currentAd.parish : ""}`);
    if (currentAd?.price) parts.push(`Price: ${currentAd.price}`);
    if (currentAd?.call_to_action) parts.push(currentAd.call_to_action);
    parts.push(getAdUrl(theSlug));
    parts.push("#YardPromo #JamaicaEvents");
    return parts.filter(Boolean).join("\n\n");
  }

  function openCaptionModal() {
    setGeneratedCaption(generateCaptionText());
    setCaptionModalOpen(true);
  }

  function copyCaption() {
    try {
      navigator.clipboard?.writeText(generatedCaption || "");
      showToast("Caption copied.");
    } catch (e) {
      showToast("Unable to copy caption.");
    }
  }

  async function downloadCanvasImage(width, height, filename) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    const isStory = height > width;
    const margin = Math.max(36, Math.floor(width * 0.045));

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#050816");
    gradient.addColorStop(0.55, "#101827");
    gradient.addColorStop(1, "#020617");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // YardPromo text branding, no logo file needed
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.max(34, Math.floor(width / 17))}px sans-serif`;
    ctx.fillText("YardPromo", margin, isStory ? 82 : 58);

    ctx.fillStyle = "#facc15";
    ctx.font = `bold ${Math.max(18, Math.floor(width / 42))}px sans-serif`;
    ctx.fillText("Jamaican promotion platform", margin, isStory ? 120 : 88);

    // Poster image
    const posterTop = isStory ? 170 : 115;
    const posterMaxWidth = width - margin * 2;
    const posterMaxHeight = isStory ? Math.floor(height * 0.58) : Math.floor(height * 0.48);

    if (currentAd?.poster_image_url) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = currentAd.poster_image_url;

      await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });

      if (img.width && img.height) {
        let drawWidth = posterMaxWidth;
        let drawHeight = (img.height / img.width) * drawWidth;

        if (drawHeight > posterMaxHeight) {
          drawHeight = posterMaxHeight;
          drawWidth = (img.width / img.height) * drawHeight;
        }

        const x = (width - drawWidth) / 2;
        const y = posterTop;

        ctx.fillStyle = "#111827";
        ctx.fillRect(x - 8, y - 8, drawWidth + 16, drawHeight + 16);
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      }
    }

    // Bottom information panel
    const panelHeight = isStory ? 430 : 210;
    const panelY = height - panelHeight - margin;

    ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
    ctx.fillRect(margin, panelY, width - margin * 2, panelHeight);

    ctx.textAlign = "left";
    ctx.fillStyle = "#020617";
    ctx.font = `bold ${Math.max(34, Math.floor(width / 18))}px sans-serif`;

    const title = currentAd?.title || "YardPromo Jamaica";
    const titleLines = wrapCanvasText(ctx, title, width - margin * 4);
    titleLines.slice(0, 3).forEach((line, index) => {
      ctx.fillText(line, margin * 1.5, panelY + 70 + index * 48);
    });

    ctx.fillStyle = "#334155";
    ctx.font = `bold ${Math.max(20, Math.floor(width / 38))}px sans-serif`;

    const details = [
      `${currentAd?.event_date || ""} ${currentAd?.event_time || ""}`.trim(),
      `${currentAd?.venue || currentAd?.location || ""}${currentAd?.parish ? ", " + currentAd.parish : ""}`,
      currentAd?.price || "",
    ].filter(Boolean);

    details.slice(0, 3).forEach((line, index) => {
      ctx.fillText(line, margin * 1.5, panelY + 230 + index * 34);
    });

    // Link footer
    const theSlug = currentAd?.slug || slug;
    const publicUrl = getAdUrl(theSlug).replace(/^https?:\/\//, "");

    ctx.fillStyle = "#00843d";
    ctx.font = `bold ${Math.max(20, Math.floor(width / 42))}px sans-serif`;
    ctx.fillText(publicUrl, margin * 1.5, height - margin * 1.2);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e) {
    showToast("Unable to generate image.");
  }
}

function wrapCanvasText(ctx, text, maxWidth) {
  const words = String(text || "").split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    const width = ctx.measureText(testLine).width;

    if (width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });

  if (line) lines.push(line);

  return lines;
}
  function downloadPreview() {
    downloadCanvasImage(1200, 630, `${(currentAd?.slug || slug) || "preview"}-preview.png`);
  }

  function downloadStory() {
    downloadCanvasImage(1080, 1920, `${(currentAd?.slug || slug) || "story"}-story.png`);
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="toast">Loading promo details...</div>
        </div>
      </main>
    );
  }

  if (!currentAd) {
    return (
      <main className="section">
        <div className="container">
          <div className="toast">Promo not found.</div>

          <div style={{ marginTop: 20 }}>
            <Link className="btn btn-primary" href="/browse">
              Back to browse
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const promoter = getPromoter(currentAd.promoter_slug);
  const venue = getVenue(currentAd.venue_slug);
  const related = relatedAds(currentAd.slug, 3);
  const locationQuery = currentAd?.venue || currentAd?.location || currentAd?.parish || "";

  return (
    <section className="section">
      <div className="container">
        {message ? <div className="toast">{message}</div> : null}
        {shareMessage ? <div className="toast">{shareMessage}</div> : null}
      </div>

      <div className="container detail-shell">
        <section>
          <div className="detail-image">
            <img src={currentAd.poster_image_url} alt={currentAd.title} />
          </div>

          <section className="section" style={{ paddingBottom: 0 }}>
            <div className="section-head">
              <div>
                <p className="kicker">Campaigns</p>
                <h2>Active campaigns.</h2>
              </div>
            </div>

            <div className="empty">
              <h3>No active campaigns</h3>
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <div>
                <p className="kicker">Related</p>
                <h2>Related promos.</h2>
              </div>
            </div>

            <AdsGrid ads={related} limit={3} />
          </section>
        </section>

        <aside className="detail-panel">
          <p className="kicker">{currentAd.category}</p>

          <h1 className="promo-title">{currentAd.title}</h1>

          <p className="muted" style={{ fontSize: 17 }}>
            {currentAd.description}
          </p>

          <div className="details">
            {currentAd.event_date ? <span>{eventLabel(currentAd)}</span> : null}

            <span>
              {venue ? venue.name : currentAd.venue || currentAd.location},{" "}
              {currentAd.parish}
            </span>

            <span>{currentAd.price || "Contact for details"}</span>
          </div>

          <div className="trust-row">
            <span>Reviewed by YardPromo</span>
            {promoter?.verified ? <span>Verified promoter</span> : null}
            <span>Secure inquiry</span>
          </div>

          <div className="engagement-strip">
            <div className="engagement-stat">
              <strong>{interestCountState}</strong>
              <span>Interested</span>
            </div>

            <div className="engagement-stat">
              <strong>{rsvpCount(currentAd)}</strong>
              <span>RSVPs</span>
            </div>

            <div className="engagement-stat">
              <strong>{currentAd.shares || 0}</strong>
              <span>Shares</span>
            </div>

            <div className="engagement-stat">
              <strong>{heatScore(currentAd)}</strong>
              <span>Heat</span>
            </div>
          </div>

          <div className="support-note">
            Support this promo by sharing, RSVPing, saving, or joining the guest
            list.
          </div>

          <div className="primary-actions">
            {currentAd.website_link ? (
              <a
                className="btn btn-gold"
                href={currentAd.website_link}
                target="_blank"
                rel="noreferrer noopener"
              >
                {currentAd.call_to_action || "Visit Website"}
              </a>
            ) : null}

            {currentAd.whatsapp ? (
              <a
                className="btn btn-primary"
                href={`https://wa.me/${String(currentAd.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I saw ${currentAd.title} on YardPromo Jamaica and would like more information.`)}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                WhatsApp
              </a>
            ) : null}

            <button
              type="button"
              className="btn btn-light"
              onClick={handleInterest}
            >
              I’m Interested
            </button>

            {currentAd.event_date ? (
              <button type="button" className="btn btn-primary" onClick={handleRSVP}>
                RSVP
              </button>
            ) : (
              <button type="button" className="btn btn-light" onClick={openInquiryModal}>
                Send Inquiry
              </button>
            )}
          </div>

          <details className="more-actions" open>
            <summary>More Actions</summary>

            <div className="more-actions-grid">
              <button type="button" className="btn btn-gold" onClick={handleInterest}>
                Show Support
              </button>

              <button type="button" className="btn btn-primary" onClick={handleOpenSharePack}>
                Open Share Pack
              </button>

              <button type="button" className="btn btn-light" onClick={openPosterStudio}>
                Poster Studio
              </button>

              <button type="button" className="btn btn-light" onClick={handleCopyLink}>
                Copy link
              </button>

              <button type="button" className="btn btn-light" onClick={handleWhatsAppShare}>
                Share on WhatsApp
              </button>

              <button type="button" className="btn btn-light" onClick={handlePreviewShareLink}>
                Preview share link
              </button>

              <button type="button" className="btn btn-light" onClick={downloadStory}>
                Download story image
              </button>

              <button type="button" className="btn btn-light" onClick={downloadPreview}>
                Download preview image
              </button>

              <button type="button" className="btn btn-light" onClick={openCaptionModal}>
                Create caption
              </button>

              <button type="button" className="btn btn-light" onClick={handleSendInquiry}>
                Send inquiry
              </button>

              <button type="button" className="btn btn-light" onClick={handleAddToCalendar}>
                Add to calendar
              </button>

              <button type="button" className="btn btn-light" onClick={handleGetDirections}>
                Get directions
              </button>

              <button type="button" className="btn btn-light" onClick={handleSaveEvent}>
                Save event
              </button>

              {promoter ? (
                <Link className="btn btn-light" href={`/u/${promoter.slug || currentAd.promoter_slug}`}>
                  View promoter
                </Link>
              ) : (
                <button type="button" className="btn btn-light" onClick={handleViewPromoter}>
                  View promoter
                </button>
              )}

              <button type="button" className="btn btn-light" onClick={handleViewVenue}>
                View venue
              </button>

              <button type="button" className="btn btn-light" onClick={openClaimModal}>
                Claim this event
              </button>

              <button type="button" className="btn btn-light" onClick={openAlertsModal}>
                Get alerts
              </button>

              <button type="button" className="btn btn-light" onClick={openBoostModal}>
                Boost Preview
              </button>

              <button type="button" className="btn btn-light" onClick={openReportModal}>
                Report promo
              </button>
            </div>
          </details>

          <div className="share-pack">
            <h3>Share Pack</h3>
            <p className="muted">Share this promo quickly</p>

            <div className="share-pack-row">
              <input readOnly value={getPublicAdUrl()} className="share-input" />
              <button className="btn btn-light" onClick={handleCopyLink}>Copy</button>
            </div>

            <div className="share-pack-buttons">
              <button className="btn btn-light" onClick={downloadPreview}>Download preview</button>
              <button className="btn btn-light" onClick={downloadStory}>Download story</button>
              <button className="btn btn-light" onClick={openCaptionModal}>Copy caption</button>
            </div>

            <div className="share-qr">
              <div className="qr-fallback">{getPublicAdUrl()}</div>
            </div>
          </div>

          {sharePackModalOpen ? (
            <div className="yp-modal-backdrop">
              <div className="yp-modal-card" role="dialog" aria-modal="true">
                <div className="yp-modal-header">
                  <h2>Share Pack</h2>
                  <button type="button" className="yp-modal-close" onClick={handleCloseSharePackModal} aria-label="Close share pack modal">×</button>
                </div>
                <div className="yp-modal-body">
                  <p className="muted">Share this promo quickly.</p>
                  <div className="share-pack-row">
                    <input readOnly value={getPublicAdUrl()} className="share-input" />
                    <button className="btn btn-light" onClick={handleCopyLink}>Copy</button>
                  </div>
                  <div className="share-pack-buttons">
                    <button className="btn btn-light" onClick={downloadPreview}>Download preview</button>
                    <button className="btn btn-light" onClick={downloadStory}>Download story</button>
                    <button className="btn btn-light" onClick={openCaptionModal}>Copy caption</button>
                  </div>
                  <div className="share-qr">
                    <div className="qr-fallback">{getPublicAdUrl()}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      {/* Centralized modal/card rendering for ad actions */}
      {interestModalOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-interest-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <div>
                <p className="kicker">YardPromo</p>
                <h2>Interest saved</h2>
              </div>
              <button type="button" className="yp-modal-close" onClick={handleCloseInterestModal} aria-label="Close interest popup">×</button>
            </div>
            <div className="yp-modal-body">
              <div className="yp-modal-success">Thanks — we’ll use this to show more relevant promos.</div>
              <p className="yp-modal-question">Would you like to take another action?</p>
              <div className="yp-modal-actions">
                <button type="button" className="btn btn-primary" onClick={handleRSVP}>RSVP</button>
                <button type="button" className="btn btn-light" onClick={handleAddToCalendar}>Add to calendar</button>
                <button type="button" className="btn btn-light" onClick={() => { setInterestModalOpen(false); setAlertsModalOpen(true); }}>Save alert</button>
                <button type="button" className="btn btn-light" onClick={handleSharePromo}>Share promo</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportModalOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-report-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <h2>Report promo</h2>
              <button type="button" className="yp-modal-close" onClick={() => setReportModalOpen(false)} aria-label="Close report dialog">×</button>
            </div>
            <div className="yp-modal-body">
              <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Reason for reporting" rows={5} style={{ width: '100%' }} />
              <div style={{ marginTop: 10 }}>
                <button className="btn btn-light" onClick={() => setReportModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={submitReport} style={{ marginLeft: 8 }}>Submit report</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {directionsModalOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-action-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <h2>Directions</h2>
              <button type="button" className="yp-modal-close" onClick={() => setDirectionsModalOpen(false)} aria-label="Close directions modal">×</button>
            </div>
            <div className="yp-modal-body">
              <p className="muted">Preview the venue and get directions in-app.</p>
              <div className="yp-modal-grid">
                <div>
                  <strong>{locationQuery || "Location unavailable"}</strong>
                  <p className="muted">Search powered by Google Maps.</p>
                </div>
                <div className="yp-modal-card-actions">
                  <button className="btn btn-primary" onClick={() => { if (locationQuery) window.open(getMapsSearchUrl(locationQuery), "_blank", "noopener,noreferrer"); }}>Open in Maps</button>
                  <button className="btn btn-light" onClick={async () => { try { await navigator.clipboard.writeText(locationQuery); showToast("Location copied."); } catch { showToast("Unable to copy location."); } }}>Copy address</button>
                </div>
              </div>
              {locationQuery && (
                <iframe className="yp-map-frame" src={`https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&output=embed`} title="Venue directions" />
              )}
            </div>
          </div>
        </div>
      )}

      {posterStudioOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-poster-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <h2>Poster Studio</h2>
              <button type="button" className="yp-modal-close" onClick={closePosterStudio} aria-label="Close poster studio">×</button>
            </div>
            <div className="yp-modal-body">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ width: 180, height: 320, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {currentAd.poster_image_url ? <img src={currentAd.poster_image_url} alt="poster" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <div>No image</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <h3>{currentAd.title}</h3>
                  <div>{currentAd.event_date} {currentAd.event_time}</div>
                  <div>{currentAd.venue || currentAd.location}</div>
                  <div style={{ marginTop: 8 }}><input readOnly value={getPublicAdUrl()} style={{ width: '100%' }} /></div>
                  <div style={{ marginTop: 12 }}>
                    <button className="btn btn-light" onClick={() => { navigator.clipboard?.writeText(generateCaptionText()); showToast('Caption copied.'); }}>Copy caption</button>
                    <button className="btn btn-light" onClick={downloadPreview} style={{ marginLeft: 8 }}>Download preview</button>
                    <button className="btn btn-light" onClick={downloadStory} style={{ marginLeft: 8 }}>Download preview</button>
                    <button className="btn btn-primary" onClick={closePosterStudio} style={{ marginLeft: 8 }}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {captionModalOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-caption-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <h2>Caption</h2>
              <button type="button" className="yp-modal-close" onClick={() => setCaptionModalOpen(false)} aria-label="Close caption">×</button>
            </div>
            <div className="yp-modal-body">
              <textarea value={generatedCaption} onChange={(e) => setGeneratedCaption(e.target.value)} rows={8} style={{ width: '100%' }} />
              <div style={{ marginTop: 10 }}>
                <button className="btn btn-light" onClick={() => { navigator.clipboard?.writeText(generatedCaption || ''); showToast('Caption copied.'); }}>Copy caption</button>
                <button className="btn btn-light" onClick={() => setCaptionModalOpen(false)} style={{ marginLeft: 8 }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewModalOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-action-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <h2>Preview promo link</h2>
              <button type="button" className="yp-modal-close" onClick={() => setPreviewModalOpen(false)} aria-label="Close preview">×</button>
            </div>
            <div className="yp-modal-body">
              <p className="muted">View the public promo URL before sharing it.</p>
              <div className="yp-modal-grid">
                <div>
                  <strong>{currentAd.title}</strong>
                  <p className="muted">{currentAd.description}</p>
                  <p>{getPublicAdUrl()}</p>
                </div>
                <div className="yp-modal-card-actions">
                  <button className="btn btn-light" onClick={handleCopyLink}>Copy link</button>
                  <button className="btn btn-primary" onClick={() => window.open(getPublicAdUrl(), "_blank", "noopener,noreferrer")}>Open link</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {inquiryModalOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-action-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <h2>Send an inquiry</h2>
              <button type="button" className="yp-modal-close" onClick={() => setInquiryModalOpen(false)} aria-label="Close inquiry">×</button>
            </div>
            <div className="yp-modal-body">
              <p className="muted">Ask the promoter a question about this event.</p>
              <div className="yp-modal-actions">
                <button className="btn btn-primary" onClick={() => {
                  if (currentAd?.whatsapp) {
                    const number = String(currentAd.whatsapp).replace(/\D/g, "");
                    const text = `Hi, I saw ${currentAd.title} on YardPromo Jamaica and would like more information.`;
                    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
                    window.open(url, "_blank", "noopener,noreferrer");
                  } else {
                    window.location.href = `/login?next=${encodeURIComponent(`/ad/${currentAd.slug || slug}`)}`;
                  }
                }}>Start inquiry</button>
                <button className="btn btn-light" onClick={() => setInquiryModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {claimModalOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-action-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <h2>Claim this event</h2>
              <button type="button" className="yp-modal-close" onClick={() => setClaimModalOpen(false)} aria-label="Close claim">×</button>
            </div>
            <div className="yp-modal-body">
              <p className="muted">If you are the promoter or business owner, claim this promo page.</p>
              <div className="yp-modal-actions">
                <button className="btn btn-primary" onClick={() => window.location.href = `/login?next=${encodeURIComponent(`/ad/${currentAd.slug || slug}`)}&claim=1`}>Login to claim</button>
                <button className="btn btn-light" onClick={() => setClaimModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {boostModalOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-action-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <h2>Boost Preview</h2>
              <button type="button" className="yp-modal-close" onClick={() => setBoostModalOpen(false)} aria-label="Close boost preview">×</button>
            </div>
            <div className="yp-modal-body">
              <p className="muted">Preview premium promotion options for this event.</p>
              <div className="yp-action-grid">
                {[
                  { title: "Homepage Featured", subtitle: "Top visibility on the homepage" },
                  { title: "Weekend Boost", subtitle: "Highlight your event for weekend planners" },
                  { title: "Parish Spotlight", subtitle: "Feature your promo by parish" },
                  { title: "Category Top Spot", subtitle: "Showcase in your event category" },
                  { title: "Weekly Roundup Feature", subtitle: "Be included in editorial picks" },
                  { title: "Campaign Feature", subtitle: "Promote to a wider audience" },
                ].map((card) => (
                  <div key={card.title} className="yp-boost-card">
                    <div>
                      <strong>{card.title}</strong>
                      <p className="muted">{card.subtitle}</p>
                    </div>
                    <Link className="btn btn-primary" href="/advertise">Request Boost</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {alertsModalOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-action-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <h2>Get alerts</h2>
              <button type="button" className="yp-modal-close" onClick={() => setAlertsModalOpen(false)} aria-label="Close alerts">×</button>
            </div>
            <div className="yp-modal-body">
              <p className="muted">Save this event alert locally and receive reminder information.</p>
              <div className="yp-modal-actions">
                <button className="btn btn-primary" onClick={() => { handleRemindMe(); setAlertsModalOpen(false); }}>Save alert</button>
                <button className="btn btn-light" onClick={() => setAlertsModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rsvpModalOpen && (
        <div className="yp-modal-backdrop">
          <div className="yp-modal-card yp-action-modal" role="dialog" aria-modal="true">
            <div className="yp-modal-header">
              <h2>RSVP</h2>
              <button type="button" className="yp-modal-close" onClick={() => setRsvpModalOpen(false)} aria-label="Close RSVP">×</button>
            </div>
            <div className="yp-modal-body">
              <p className="muted">RSVP for this promo. Login is required to secure your spot.</p>
              <div className="yp-modal-actions">
                <button className="btn btn-primary" onClick={() => window.location.href = `/login?next=${encodeURIComponent(`/ad/${currentAd.slug || slug}`)}`}>Login to RSVP</button>
                <button className="btn btn-light" onClick={() => setRsvpModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}