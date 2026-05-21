import Link from "next/link";
export default function CheckoutCancelPage() {
  return (
    <main className="section"><div className="container"><div className="empty">
      <p className="kicker">Checkout Cancelled</p><h1>No payment was completed.</h1>
      <p className="muted">You can return to pricing and choose a service when you are ready.</p>
      <div className="dashboard-actions" style={{ marginTop: 18 }}>
        <Link className="btn btn-primary" href="/pricing">View Pricing</Link>
        <Link className="btn btn-light" href="/services">Services</Link>
      </div>
    </div></div></main>
  );
}
