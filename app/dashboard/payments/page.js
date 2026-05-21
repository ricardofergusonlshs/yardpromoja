"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/app/components/RequireAuth";
import { createClient } from "@/lib/supabaseClient";
import PaymentStatusBadge from "@/app/components/PaymentStatusBadge";
export default function CustomerPaymentsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => { let alive = true; async function loadPayments() { setLoading(true); setMessage(""); try { const { data: userData } = await supabase.auth.getUser(); const user = userData?.user; if (!user) return; const { data, error } = await supabase.from("payments").select("*, service:paid_services(name,slug,description)").eq("user_id", user.id).order("created_at", { ascending: false }); if (error) throw error; if (alive) setPayments(data || []); } catch (error) { if (alive) setMessage(error?.message || "Unable to load payments."); } finally { if (alive) setLoading(false); } } loadPayments(); return () => { alive = false; }; }, [supabase]);
  return <RequireAuth><main className="section"><div className="container"><div className="section-head"><div><p className="kicker">Payments</p><h1>My Payments</h1><p className="muted">Track your YardPromoJa paid services and bank transfer reviews.</p></div><Link className="btn btn-primary" href="/pricing">New Payment</Link></div>{message ? <div className="toast">{message}</div> : null}{loading ? <div className="toast">Loading payments...</div> : null}{!loading && !payments.length ? <div className="empty"><h3>No payments yet</h3><p className="muted">Choose a paid service to get started.</p><Link className="btn btn-primary" href="/pricing">View Pricing</Link></div> : null}{payments.length ? <div className="table-card"><table><thead><tr><th>Service</th><th>Amount</th><th>Method</th><th>Status</th><th>Reference</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><td>{payment.service?.name || "YardPromo service"}</td><td>{payment.currency || "JMD"} ${Number(payment.amount || 0).toLocaleString()}</td><td>{String(payment.payment_method || "").replaceAll("_", " ")}</td><td><PaymentStatusBadge status={payment.payment_status} /></td><td>{payment.bank_reference || "—"}</td></tr>)}</tbody></table></div> : null}</div></main></RequireAuth>;
}
