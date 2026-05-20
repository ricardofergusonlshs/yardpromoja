"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/components/RequireAuth";

const premiumOptions = [
  {
    title: "Featured Promo",
    description: "Place your promo in high-visibility sections across YardPromo Jamaica.",
    type: "featured",
  },
  {
    title: "Premium Pick",
    description: "Get premium placement for stronger exposure and brand trust.",
    type: "premium",
  },
  {
    title: "Weekend Boost",
    description: "Highlight your event or offer for weekend planners.",
    type: "weekend",
  },
];

export default function PremiumPage() {
  const supabase = useMemo(() => createClient(), []);

  const [selectedType, setSelectedType] = useState("premium");
  const [messageText, setMessageText] = useState("");
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function requestPremium(event) {
    event.preventDefault();

    setSaving(true);
    setNotice("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        window.location.href = `/login?next=${encodeURIComponent("/premium")}`;
        return;
      }

      const payload = {
        user_id: user.id,
        request_type: selectedType,
        message: messageText.trim(),
        contact: contact.trim(),
        status: "pending",
        created_at: new Date().toISOString(),
      };

      let saved = false;

      try {
        const { error } = await supabase.from("promotion_requests").insert([payload]);
        if (!error) saved = true;
      } catch {
        saved = false;
      }

      if (!saved) {
        try {
          const { error } = await supabase.from("premium_requests").insert([payload]);
          if (!error) saved = true;
        } catch {
          saved = false;
        }
      }

      setNotice(
        saved
          ? "Premium request submitted. YardPromo will contact you soon."
          : "Request noted. Please contact YardPromo to complete your premium placement."
      );

      setMessageText("");
      setContact("");
    } catch (error) {
      console.warn("Premium request error", error);
      setNotice("Unable to submit premium request right now.");
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
              <p className="kicker">Premium</p>
              <h1>Request premium promotion</h1>
              <p className="muted">
                Boost your promo with featured, premium, or weekend placement.
              </p>
            </div>

            <Link className="btn btn-light" href="/dashboard">
              Dashboard
            </Link>
          </div>

          {notice ? <div className="toast">{notice}</div> : null}

          <div className="grid grid-3" style={{ gap: 16, marginBottom: 20 }}>
            {premiumOptions.map((option) => (
              <button
                key={option.type}
                type="button"
                className={selectedType === option.type ? "panel is-featured" : "panel"}
                style={{ textAlign: "left", cursor: "pointer" }}
                onClick={() => setSelectedType(option.type)}
              >
                <p className="kicker">{option.type}</p>
                <h3>{option.title}</h3>
                <p className="muted">{option.description}</p>
              </button>
            ))}
          </div>

          <form className="panel" onSubmit={requestPremium} style={{ display: "grid", gap: 12 }}>
            <h2>Request details</h2>

            <input
              className="share-input"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="Best contact, WhatsApp, phone, or email"
            />

            <textarea
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Tell us what promo you want to boost and when."
              rows={5}
              style={{ width: "100%" }}
            />

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Submitting..." : "Submit request"}
            </button>
          </form>
        </div>
      </main>
    </RequireAuth>
  );
}
