"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

function ClaimPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promo = searchParams.get("promo") || "";
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    promoterName: "",
    email: "",
    phone: "",
    brandName: "",
    website: "",
    instagram: "",
    proof: "",
  });

  useEffect(() => {
    let alive = true;

    async function checkUser() {
      const next = `/claim?promo=${encodeURIComponent(promo)}`;
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      if (alive) {
        setForm((current) => ({
          ...current,
          email: data.user.email || "",
        }));
        setLoading(false);
      }
    }

    checkUser();

    return () => {
      alive = false;
    };
  }, [promo, router, supabase]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitClaim(event) {
    event.preventDefault();

    if (!form.promoterName || !form.email || !form.phone || !form.proof) {
      setMessage("Please complete promoter name, email, phone/WhatsApp, and proof.");
      return;
    }

    setMessage("Claim request received for review.");
    setForm({
      promoterName: "",
      email: form.email,
      phone: "",
      brandName: "",
      website: "",
      instagram: "",
      proof: "",
    });
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="toast">Loading claim page...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="section claim-page">
      <div className="container">
        <div className="panel claim-card">
          <p className="kicker">Claim promo</p>
          <h1>Verify ownership.</h1>

          <p className="muted">
            Submit your promoter details so YardPromo can review your request to
            claim this promo.
          </p>

          {promo ? (
            <p className="muted small">
              Promo reference: <strong>{promo}</strong>
            </p>
          ) : null}

          {message ? (
            <div className="interest-message" style={{ marginTop: 14 }}>
              {message}
            </div>
          ) : null}

          <form className="claim-report-form" onSubmit={submitClaim}>
            <label>
              Promoter name
              <input
                name="promoterName"
                value={form.promoterName}
                onChange={updateField}
                placeholder="Your full name"
                required
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Phone / WhatsApp
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder="876..."
                required
              />
            </label>

            <label>
              Business / brand name
              <input
                name="brandName"
                value={form.brandName}
                onChange={updateField}
                placeholder="Promoter, venue, or brand name"
              />
            </label>

            <label>
              Website
              <input
                name="website"
                value={form.website}
                onChange={updateField}
                placeholder="https://..."
              />
            </label>

            <label>
              Instagram
              <input
                name="instagram"
                value={form.instagram}
                onChange={updateField}
                placeholder="@yourhandle"
              />
            </label>

            <label className="full">
              Proof or note explaining ownership
              <textarea
                name="proof"
                value={form.proof}
                onChange={updateField}
                placeholder="Tell us how you are connected to this promo."
                rows={5}
                required
              />
            </label>

            <div className="claim-report-actions">
              <button className="btn btn-primary" type="submit">
                Submit claim request
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

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <main className="section">
          <div className="container">
            <div className="toast">Loading claim page...</div>
          </div>
        </main>
      }
    >
      <ClaimPageContent />
    </Suspense>
  );
}