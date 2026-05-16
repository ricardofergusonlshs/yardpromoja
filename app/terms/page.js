export const metadata = {
  title: "Terms | YardPromo Jamaica",
  description: "Terms of use for YardPromo Jamaica.",
};

export default function TermsPage() {
  return (
    <section className="section legal-page">
      <div className="container">
        <div className="legal-card">
          <p className="kicker">Terms</p>
          <h1>Terms of Use.</h1>

          <p>
            By using YardPromo Jamaica, you agree to use the platform
            responsibly and only submit content you have permission to share.
          </p>

          <h2>Promo submissions</h2>
          <p>
            Promoters are responsible for the accuracy of titles, dates,
            locations, prices, contact details, and uploaded posters.
          </p>

          <h2>Content review</h2>
          <p>
            YardPromo may review, reject, remove, or limit promotions that are
            misleading, unsafe, illegal, abusive, or inappropriate for the
            platform.
          </p>

          <h2>Accounts</h2>
          <p>
            Users are responsible for keeping their login information secure and
            for activity connected to their accounts.
          </p>

          <h2>Availability</h2>
          <p>
            YardPromo may change, pause, or improve features over time.
          </p>
        </div>
      </div>
    </section>
  );
}