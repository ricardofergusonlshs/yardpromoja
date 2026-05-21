"use client";

function labelForStatus(status) {
  const value = String(status || "pending").toLowerCase();
  if (value === "paid") return "Paid";
  if (value === "pending_review") return "Pending Review";
  if (value === "pending") return "Pending";
  if (value === "failed") return "Failed";
  if (value === "cancelled") return "Cancelled";
  if (value === "rejected") return "Rejected";
  if (value === "refunded") return "Refunded";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function PaymentStatusBadge({ status }) {
  const value = String(status || "pending").toLowerCase();
  const className =
    value === "paid"
      ? "admin-status-badge is-active"
      : value === "rejected" || value === "failed" || value === "cancelled"
        ? "admin-status-badge is-expired"
        : "admin-status-badge is-pending";
  return <span className={className}>{labelForStatus(value)}</span>;
}
