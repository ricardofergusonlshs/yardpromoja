"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTitle(ad) {
  return ad?.title || ad?.name || "Selected promo";
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function cleanCountryCode(value) {
  const digits = digitsOnly(value);
  return digits ? `+${digits}` : "+1";
}

function buildPhone(countryCode, localNumber) {
  const code = cleanCountryCode(countryCode);
  const digits = digitsOnly(localNumber);
  return `${code}${digits}`;
}

function matchesPromo(ad, promo) {
  const target = String(promo || "");
  const targetSlug = makeSlug(target);

  const id = String(ad?.id || "");
  const slug = String(ad?.slug || "");
  const titleSlug = makeSlug(getTitle(ad));

  return (
    target === id ||
    target === slug ||
    targetSlug === makeSlug(id) ||
    targetSlug === makeSlug(slug) ||
    targetSlug === titleSlug ||
    targetSlug === `${titleSlug}-${id}` ||
    targetSlug.startsWith(`${titleSlug}-`)
  );
}

export default function ReportClient({ promo = "" }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [promoTitle, setPromoTitle] = useState("Selected promo");
  const [message, setMessage] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [localPhone, setLocalPhone] = useState("");

  const [form, setForm] = useState({
    reason: "Incorrect information",
    details: "",
    phone: "",
    contactEmail: "",
  });

  useEffect(() => {
    let alive = true;

    async function loadReportPage() {
      setLoading(true);

      const next = `/report?promo=${encodeURIComponent(promo)}`;
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      try {
        const { data } = await supabase
          .from("ads")
          .select("*")
          .in("status", ["active", "approved"])
          .order("created_at", { ascending: false });

        const matched = (data || []).find((ad) => matchesPromo(ad, promo));

        if (alive && matched) {
          setPromoTitle(getTitle(matched));
        }
      } catch {
        // Keep report form usable even if promo lookup fails.
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadReportPage();

    return () => {
      alive = false;
    };
  }, [promo, router, supabase]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateCountryCode(event) {
    const nextCountryCode = cleanCountryCode(event.target.value);
    setCountryCode(nextCountryCode);

    setForm((current) => ({
      ...current,
      phone: localPhone ? buildPhone(nextCountryCode, localPhone) : "",
    }));
  }

  function updateLocalPhone(event) {
    const nextLocalPhone = digitsOnly(event.target.value);
    setLocalPhone(nextLocalPhone);

    setForm((current) => ({
      ...current,
      phone: nextLocalPhone ? buildPhone(countryCode, nextLocalPhone) : "",
    }));
  }

  function submitReport(event) {
    event.preventDefault();

    const fullPhone = localPhone ? buildPhone(countryCode, localPhone) : "";

    if (!form.reason || !form.details) {
      setMessage("Please choose a reason and add details.");
      return;
    }

    setForm((current) => ({
      ...current,
      phone: fullPhone,
    }));

    setMessage("Report received for review. Thank you for helping keep YardPromo safe.");

    setForm({
      reason: "Incorrect information",
      details: "",
      phone: "",
      contactEmail: "",
    });

    setLocalPhone("");
  }

  if (loading) {
    return (
      <main className="section report-page">
        <div className="container">
          <div className="empty">
            <h3>Loading report page...</h3>
            <p className="muted">Checking your sign-in status.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section report-page">
      <div className="container">
        <div className="report-card panel">
          <p className="kicker">Report promo</p>
          <h1>Log a complaint.</h1>

          <p className="muted">
            Tell YardPromo what needs review for:
            <strong> {promoTitle}</strong>
          </p>

          {message ? <div className="interest-message">{message}</div> : null}

          <form className="claim-report-form" onSubmit={submitReport}>
            <label>
              Reason
              <select
                name="reason"
                value={form.reason}
                onChange={updateField}
                required
              >
                <option>Incorrect information</option>
                <option>Scam or suspicious promo</option>
                <option>Duplicate promo</option>
                <option>Offensive content</option>
                <option>Event cancelled</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Country code optional
              <input
                value={countryCode}
                onChange={updateCountryCode}
                placeholder="+1"
              />
            </label>

            <label>
              Phone / WhatsApp optional
              <input
                name="phone"
                value={localPhone}
                onChange={updateLocalPhone}
                placeholder="8761234567"
              />
            </label>

            <label>
              Contact email optional
              <input
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={updateField}
                placeholder="you@example.com"
              />
            </label>

            <label className="full">
              Details
              <textarea
                name="details"
                value={form.details}
                onChange={updateField}
                placeholder="Explain what should be reviewed."
                rows={6}
                required
              />
            </label>

            <div className="claim-report-actions">
              <button className="btn btn-primary" type="submit">
                Submit report
              </button>

              <Link className="btn btn-light" href="/browse">
                Back to promos
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}