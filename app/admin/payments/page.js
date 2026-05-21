"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequireRole from "@/app/components/RequireRole";
import { createClient } from "@/lib/supabaseClient";

const adminRoles = ["admin", "super_admin"];

function PaymentStatusBadge({ status }) {
  const value = String(status || "pending_review").toLowerCase();

  let label = "Pending Review";
  let className = "admin-status-badge is-pending";

  if (value === "paid" || value === "approved" || value === "completed") {
    label = "Paid";
    className = "admin-status-badge is-active";
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

function getCustomer(payment) {
  return (
    payment?.customer_name ||
    payment?.customer_email ||
    payment?.email ||
    payment?.user_email ||
    payment?.user_id ||
    "Customer"
  );
}

function getServiceName(payment) {
  return (
    payment?.service?.name ||
    payment?.service_name ||
    payment?.service ||
    payment?.package_name ||
    "Paid service"
  );
}

function getPaymentMethod(payment) {
  return String(
    payment?.payment_method || payment?.method || "Not specified"
  ).replaceAll("_", " ");
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

export default function AdminPaymentsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");

  async function loadPayments() {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*, service:paid_services(name,slug,description)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPayments(data || []);
    } catch (error) {
      setMessage(error?.message || "Unable to load payments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updatePayment(payment, newStatus) {
    setSavingId(payment.id);
    setMessage("");

    try {
      const statusColumn =
        Object.prototype.hasOwnProperty.call(payment, "payment_status")
          ? "payment_status"
          : "status";

      const { error } = await supabase
        .from("payments")
        .update({
          [statusColumn]: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      if (error) throw error;

      setPayments((current) =>
        current.map((item) =>
          item.id === payment.id
            ? {
                ...item,
                [statusColumn]: newStatus,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      );
    } catch (error) {
      setMessage(error?.message || "Unable to update payment.");
    } finally {
      setSavingId("");
    }
  }

  return (
    <RequireRole allowedRoles={adminRoles}>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Admin Payments</p>
              <h1>Review customer payments.</h1>
              <p className="muted">
                View payment requests, bank transfers, service purchases, and
                approval status.
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="btn btn-light" href="/admin">
                Admin Dashboard
              </Link>

              <Link className="btn btn-primary" href="/admin/services">
                Manage Services
              </Link>
            </div>
          </div>

          {message ? <div className="toast error">{message}</div> : null}

          {loading ? <div className="toast">Loading payments...</div> : null}

          {!loading && !payments.length ? (
            <div className="empty">
              <h3>No payments yet</h3>
              <p className="muted">
                Customer payment records will appear here.
              </p>
            </div>
          ) : null}

          {!loading && payments.length ? (
            <div className="table-card admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => {
                    const disabled = savingId === payment.id;
                    const status = getPaymentStatus(payment);

                    return (
                      <tr key={payment.id}>
                        <td>
                          <strong>{getCustomer(payment)}</strong>
                          <br />
                          <span className="muted">
                            {payment?.customer_email ||
                              payment?.email ||
                              payment?.user_email ||
                              ""}
                          </span>
                        </td>

                        <td>{getServiceName(payment)}</td>

                        <td>{getAmount(payment)}</td>

                        <td>{getPaymentMethod(payment)}</td>

                        <td>
                          <PaymentStatusBadge status={status} />
                        </td>

                        <td>{getReference(payment)}</td>

                        <td>
                          {payment.created_at
                            ? new Date(payment.created_at).toLocaleDateString()
                            : "—"}
                        </td>

                        <td>
                          <div className="admin-actions">
                            <button
                              type="button"
                              className="admin-action-btn admin-action-primary"
                              disabled={disabled}
                              onClick={() => updatePayment(payment, "paid")}
                            >
                              Mark Paid
                            </button>

                            <button
                              type="button"
                              className="admin-action-btn"
                              disabled={disabled}
                              onClick={() =>
                                updatePayment(payment, "pending_review")
                              }
                            >
                              Pending
                            </button>

                            <button
                              type="button"
                              className="admin-action-btn"
                              disabled={disabled}
                              onClick={() => updatePayment(payment, "rejected")}
                            >
                              Reject
                            </button>

                            {payment.proof_image_url ? (
                              <a
                                className="admin-action-btn"
                                href={payment.proof_image_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Proof
                              </a>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </main>
    </RequireRole>
  );
}