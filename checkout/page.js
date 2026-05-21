"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const BANK_DETAILS = {
  bankName: "Your Bank Name",
  accountName: "YardPromo Jamaica",
  accountNumber: "000000000",
  branch: "Your Branch",
  accountType: "Business / Chequing",
  note: "Replace these details with your real YardPromoJa bank account details before launch.",
};

function getServiceSlugFromBrowser() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("service") || "";
}

function cleanFileName(name) {
  return String(name || "proof").toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState(null);
  const [service, setService] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [bankReference, setBankReference] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    async function loadCheckout() {
      setLoading(true);
      setMessage("");
      try {
        const slug = getServiceSlugFromBrowser();
        if (!slug) { setMessage("No service selected."); setLoading(false); return; }
        const { data: userData } = await supabase.auth.getUser();
        const currentUser = userData?.user || null;
        if (!currentUser) { router.replace(`/login?next=${encodeURIComponent(`/checkout?service=${slug}`)}`); return; }
        if (alive) setUser(currentUser);
        const { data, error } = await supabase.from("paid_services").select("*").eq("slug", slug).eq("active", true).maybeSingle();
        if (error) throw error;
        if (!data) { setMessage("Service not found or unavailable."); return; }
        if (alive) setService(data);
      } catch (error) {
        if (alive) setMessage(error?.message || "Unable to load checkout.");
      } finally { if (alive) setLoading(false); }
    }
    loadCheckout();
    return () => { alive = false; };
  }, [router, supabase]);

  async function uploadPaymentProof() {
    if (!proofFile || !user) return "";
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(proofFile.type)) throw new Error("Proof must be JPG, PNG, WEBP, or PDF.");
    if (proofFile.size > maxSize) throw new Error("Proof file must be 5MB or smaller.");
    const filePath = `${user.id}/${Date.now()}-${cleanFileName(proofFile.name)}`;
    const { error: uploadError } = await supabase.storage.from("payment-proofs").upload(filePath, proofFile, { cacheControl: "3600", upsert: false, contentType: proofFile.type });
    if (uploadError) throw uploadError;
    const { data: publicUrlData } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);
    return publicUrlData?.publicUrl || "";
  }

  async function submitPayment(event) {
    event.preventDefault();
    if (!service || !user) return;
    setSaving(true); setMessage("");
    try {
      if (paymentMethod === "card" || paymentMethod === "paypal") {
        setMessage("Card and PayPal checkout will be connected in Phase 2. Please use bank transfer for now.");
        return;
      }
      if (!bankReference.trim() && !proofFile) { setMessage("Enter a bank reference number or upload proof of payment."); return; }
      const proofUrl = await uploadPaymentProof();
      const { data, error } = await supabase.from("payments").insert([{ user_id: user.id, service_id: service.id, amount: Number(service.amount_jmd || 0), currency: "JMD", payment_method: "bank_transfer", payment_status: "pending_review", provider: "bank_transfer", bank_reference: bankReference.trim(), proof_image_url: proofUrl || null }]).select("id").maybeSingle();
      if (error) throw error;
      router.push(`/checkout/success?payment=${data?.id || ""}`);
    } catch (error) { setMessage(error?.message || "Unable to submit payment."); }
    finally { setSaving(false); }
  }

  if (loading) return <main className="section"><div className="container"><div className="toast">Loading checkout...</div></div></main>;

  return (
    <main className="section"><div className="container">
      <div className="section-head"><div><p className="kicker">Secure Checkout</p><h1>Complete your YardPromoJa payment.</h1><p className="muted">Payments are processed securely. YardPromoJa does not store your card details.</p></div><Link className="btn btn-light" href="/pricing">Back to Pricing</Link></div>
      {message ? <div className="toast">{message}</div> : null}
      {service ? <form className="panel" onSubmit={submitPayment} style={{ display: "grid", gap: 16 }}>
        <div><p className="kicker">Selected service</p><h2>{service.name}</h2><p className="muted">{service.description}</p><h3>JMD ${Number(service.amount_jmd || 0).toLocaleString()}</h3></div>
        <div><p className="kicker">Payment method</p><div className="grid grid-3">
          <label className="panel"><input type="radio" name="paymentMethod" value="bank_transfer" checked={paymentMethod === "bank_transfer"} onChange={() => setPaymentMethod("bank_transfer")} /> <strong>Bank Transfer</strong><p className="muted">Send payment and upload proof for admin approval.</p></label>
          <label className="panel"><input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} /> <strong>Card</strong><p className="muted">Coming soon through a secure payment gateway.</p></label>
          <label className="panel"><input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} /> <strong>PayPal</strong><p className="muted">Coming soon for international customers.</p></label>
        </div></div>
        {paymentMethod === "bank_transfer" ? <section className="panel"><p className="kicker">Bank transfer details</p><h3>{BANK_DETAILS.bankName}</h3><p><strong>Account Name:</strong> {BANK_DETAILS.accountName}</p><p><strong>Account Number:</strong> {BANK_DETAILS.accountNumber}</p><p><strong>Branch:</strong> {BANK_DETAILS.branch}</p><p><strong>Account Type:</strong> {BANK_DETAILS.accountType}</p><p className="muted">{BANK_DETAILS.note}</p><label>Bank reference / transaction number<input value={bankReference} onChange={(event) => setBankReference(event.target.value)} placeholder="Enter transfer reference number" /></label><label>Upload proof of payment<input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(event) => setProofFile(event.target.files?.[0] || null)} /><small className="muted">JPG, PNG, WEBP, or PDF. Maximum 5MB.</small></label></section> : null}
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Submitting..." : "Submit Payment for Review"}</button>
      </form> : null}
    </div></main>
  );
}
