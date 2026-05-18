"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
};

export default function ContactPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function closeModal() {
    if (sending) return;

    setOpen(false);
    setStatus({ type: "", message: "" });
    setForm(initialForm);
  }

  async function submitContact(event) {
    event.preventDefault();

    setStatus({ type: "", message: "" });

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setStatus({
        type: "error",
        message: "Please complete your name, email, subject, and message.",
      });
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          source: "YardPromo Jamaica contact page",
        }),
      });

      const text = await response.text();

let result = {};
try {
  result = text ? JSON.parse(text) : {};
} catch {
  throw new Error(
    "Contact API route is not returning JSON. Restart npm run dev and confirm app/api/contact/route.js exists."
  );
}

if (!response.ok || !result.ok) {
  throw new Error(result.error || "Message failed to send.");
}

      setStatus({
        type: "success",
        message: "Message sent. We’ll get back to you soon.",
      });

      setTimeout(() => {
        closeModal();
      }, 1200);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Message failed to send. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section contact-page">
      <div className="container">
        <div className="page-hero contact-hero">
          <p className="kicker" style={{ color: "#f7c600" }}>
            Contact
          </p>

          <h1>Contact YardPromo Jamaica.</h1>

          <p>
            Have a question about posting a promo, advertising, partnerships,
            or getting your event seen? Send us a message and we’ll respond as
            soon as possible.
          </p>

          <div className="contact-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setOpen(true)}
            >
              Send us a message
            </button>

            <a
  href="mailto:yardpromoja@gmail.com?subject=YardPromo%20Jamaica%20Inquiry"
  className="btn btn-light"
>
  Email directly
</a>
          </div>
        </div>

        <div className="contact-info-grid">
          <div className="panel">
            <p className="kicker">Promoters</p>
            <h3>Post and share your promo.</h3>
            <p className="muted">
              Need help uploading flyers, editing promo details, or getting
              your event featured? Reach out anytime.
            </p>
          </div>

          <div className="panel">
            <p className="kicker">Businesses</p>
            <h3>Advertise local offers.</h3>
            <p className="muted">
              Restaurants, venues, shops, and service providers can use
              YardPromo to reach visitors looking for what’s happening.
            </p>
          </div>

          <div className="panel">
            <p className="kicker">Support</p>
            <h3>Need something fixed?</h3>
            <p className="muted">
              Send the promo title, page link, and what needs updating so we
              can help faster.
            </p>
          </div>
        </div>
      </div>

      {open ? (
        <div className="contact-modal-overlay" role="dialog" aria-modal="true">
          <div className="contact-modal-card">
            <button
              type="button"
              className="contact-modal-close"
              onClick={closeModal}
              aria-label="Close contact form"
            >
              ×
            </button>

            <div className="contact-modal-head">
              <p className="kicker">Message YardPromo</p>
              <h2>Send us a message.</h2>
              <p className="muted">
                Fill out the form below and your message will go directly to
                YardPromo Jamaica.
              </p>
            </div>

            <form className="contact-form" onSubmit={submitContact}>
              <input
                className="contact-honeypot"
                type="text"
                name="website"
                value={form.website}
                onChange={updateField}
                tabIndex={-1}
                autoComplete="off"
              />

              <label>
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Phone or WhatsApp optional
                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="876..."
                />
              </label>

              <label>
                Subject
                <input
                  name="subject"
                  value={form.subject}
                  onChange={updateField}
                  placeholder="How can we help?"
                  required
                />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  placeholder="Write your message..."
                  rows={5}
                  required
                />
              </label>

              {status.message ? (
                <div className={`contact-alert ${status.type}`}>
                  {status.message}
                </div>
              ) : null}

              <div className="contact-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={closeModal}
                  disabled={sending}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}