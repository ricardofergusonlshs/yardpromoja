import Link from "next/link";
export default function CheckoutSuccessPage() {
  return (
    <main className="section"><div className="container"><div className="empty">
      <p className="kicker">Payment Submitted</p><h1>Thank you.</h1>
      <p className="muted">Your payment has been submitted for review. Bank transfer payments are activated only after admin approval.</p>
      <div className="dashboard-actions" style={{ marginTop: 18 }}>
        <Link className="btn btn-primary" href="/dashboard/payments">View My Payments</Link>
        <Link className="btn btn-light" href="/services">Back to Services</Link>
      </div>
    </div></div></main>
  );
}
