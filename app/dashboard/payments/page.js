"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/app/components/RequireAuth";
import { createClient } from "@/lib/supabaseClient";

function PaymentStatusBadge({ status }) {
  const value = String(status || "pending_review").toLowerCase();

  let label = "Pending Review";
  let className = "admin-status-badge is-pending";

  if (value === "paid" || value === "approved" || value === "completed") {
    label = "Paid";
    className = "admin-status-badge is-active";
  }

  if (value === "pending" || value === "pending_review" || value === "review") {
    label = "Pending Review";
    className = "admin-status-badge is-pending";
  }

  if (value === "submitted") {
    label = "Submitted";
    className = "admin-status-badge is-pending";
  }

  if (value === "rejected" || value === "failed" || value === "cancelled") {
    label = "Rejected";
    className = "admin-status-badge is-expired";
  }

  return <span className={className}>{label}</span>;
}

function getPaymentStatus(payment) {
  return payment?.payment_status || payment?.status || "pending_review";
}

function getAmount(payment) {
  const currency = payment?.currency || "JMD";

  const amount =
    payment?.amount ||
    payment?.amount_jmd ||
    payment?.amount_usd ||
    payment?.total ||
    0;

  return `${currency} ${Number(amount || 0).toLocaleString()}`;
}

function getPaymentMethod(payment) {
  const method =
    payment?.payment_method ||
    payment?.method ||
    payment?.payment_type ||
    "Not specified";

  return String(method).replaceAll("_", " ");
}

function getReference(payment) {
  return (
    payment?.bank_reference ||
    payment?.reference ||
    payment?.transaction_reference ||
    payment?.paypal_reference ||
    payment?.stripe_reference ||
    "—"
  );
}

export default function CustomerPaymentsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadPayments() {
      setLoading(true);
      setMessage("");

      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) throw userError;

        const user = userData?.user;

        if (!user) {
          if (alive) {
            setPayments([]);
            setLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from("payments")
          .select("*, service:paid_services(name,slug,description)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (alive) {
          setPayments(data || []);
        }
      } catch (error) {
        if (alive) {
          setMessage(error?.message || "Unable to load payments.");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadPayments();

    return () => {
      alive = false;
    };
  }, [supabase]);

  return (
    <RequireAuth>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Payments</p>
              <h1>My Payments</h1>
              <p className="muted">
                Track your YardPromoJa paid services and bank transfer reviews.
              </p>
            </div>

            <Link className="btn btn-primary" href="/pricing">
              New Payment
            </Link>
          </div>

          {message ? <div className="toast error">{message}</div> : null}

          {loading ? <div className="toast">Loading payments...</div> : null}

          {!loading && !payments.length ? (
            <div className="empty">
              <h3>No payments yet</h3>
              <p className="muted">Choose a paid service to get started.</p>
              <Link className="btn btn-primary" href="/pricing">
                View Pricing
              </Link>
            </div>
          ) : null}

          {!loading && payments.length ? (
            <div className="table-card admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Reference</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <strong>
                          {payment.service?.name ||
                            payment.service_name ||
                            "YardPromo service"}
                        </strong>

                        {payment.service?.description ? (
                          <>
                            <br />
                            <span className="muted">
                              {payment.service.description}
                            </span>
                          </>
                        ) : null}
                      </td>

                      <td>{getAmount(payment)}</td>

                      <td>{getPaymentMethod(payment)}</td>

                      <td>
                        <PaymentStatusBadge status={getPaymentStatus(payment)} />
                      </td>

                      <td>{getReference(payment)}</td>

                      <td>
                        {payment.created_at
                          ? new Date(payment.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </main>
    </RequireAuth>
  );
}