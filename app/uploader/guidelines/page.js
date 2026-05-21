import Link from "next/link";
import RequireRole from "@/app/components/RequireRole";

const uploaderRoles = ["content_uploader", "admin", "super_admin"];

export default function UploaderGuidelinesPage() {
  return (
    <RequireRole allowedRoles={uploaderRoles}>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Uploader Guide</p>
              <h1>Content uploader guidelines</h1>
              <p className="muted">
                Use this checklist before submitting listings for review.
              </p>
            </div>

            <Link className="btn btn-primary" href="/uploader/new-listing">
              Add Listing
            </Link>
          </div>

          <section className="panel">
            <h2>Minimum listing requirements</h2>
            <ul>
              <li>Name</li>
              <li>Category</li>
              <li>Parish or location</li>
              <li>Original description</li>
              <li>Official source URL</li>
              <li>At least one contact, social link, website, or map link where available</li>
            </ul>
          </section>

          <section className="panel" style={{ marginTop: 16 }}>
            <h2>Do not upload</h2>
            <ul>
              <li>Fake events or fake business details</li>
              <li>Copied website descriptions</li>
              <li>Unauthorized Instagram photos or flyers</li>
              <li>Private phone numbers that are not publicly listed</li>
              <li>Adult, illegal, scam, or misleading content</li>
              <li>Duplicate listings</li>
            </ul>
          </section>

          <section className="panel" style={{ marginTop: 16 }}>
            <h2>Image status rules</h2>
            <ul>
              <li>Owner provided — safest option</li>
              <li>Official media kit — allowed if reuse is clear</li>
              <li>Public logo only — use carefully</li>
              <li>Placeholder used — safest when unsure</li>
              <li>Needs permission — do not publish questionable image publicly</li>
            </ul>
          </section>

          <section className="panel" style={{ marginTop: 16 }}>
            <h2>Workflow</h2>
            <ol>
              <li>Research the listing.</li>
              <li>Check for duplicates.</li>
              <li>Write an original description.</li>
              <li>Add source and contact/social links.</li>
              <li>Set image permission status.</li>
              <li>Submit for review.</li>
              <li>Admin approves, rejects, or requests correction.</li>
            </ol>
          </section>
        </div>
      </main>
    </RequireRole>
  );
}
