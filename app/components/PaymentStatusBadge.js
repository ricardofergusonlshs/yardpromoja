export default function PaymentStatusBadge({ status }) {
  const value = String(status || "pending").toLowerCase();

  let label = "Pending";
  let className = "admin-status-badge is-pending";

  if (value === "paid" || value === "approved" || value === "completed") {
    label = "Paid";
    className = "admin-status-badge is-active";
  }

  if (value === "rejected" || value === "failed" || value === "cancelled") {
    label = "Rejected";
    className = "admin-status-badge is-expired";
  }

  if (value === "pending_review" || value === "review") {
    label = "Pending Review";
    className = "admin-status-badge is-pending";
  }

  if (value === "submitted") {
    label = "Submitted";
    className = "admin-status-badge is-pending";
  }

  return <span className={className}>{label}</span>;
}