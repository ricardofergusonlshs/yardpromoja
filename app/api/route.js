import { NextResponse } from "next/server";

const DEFAULT_TO_EMAIL = "yardpromoja@gmail.com";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function clean(value) {
  return String(value || "").trim();
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = clean(body.name);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const subject = clean(body.subject);
    const message = clean(body.message);
    const source = clean(body.source) || "YardPromo Jamaica contact form";
    const website = clean(body.website);

    // Honeypot spam protection.
    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          ok: false,
          error: "Name, email, subject, and message are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL ||
      "YardPromo Jamaica <onboarding@resend.dev>";

    if (!resendApiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "Contact email service is not configured.",
        },
        { status: 500 }
      );
    }

    const emailSubject = `YardPromo Contact: ${subject}`;

    const textBody = `
New YardPromo Jamaica contact message

Name:
${name}

Email:
${email}

Phone / WhatsApp:
${phone || "Not provided"}

Subject:
${subject}

Message:
${message}

Source:
${source}
`.trim();

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #07111f;">
        <h2>New YardPromo Jamaica contact message</h2>

        <p><strong>Name:</strong><br />${name}</p>
        <p><strong>Email:</strong><br />${email}</p>
        <p><strong>Phone / WhatsApp:</strong><br />${phone || "Not provided"}</p>
        <p><strong>Subject:</strong><br />${subject}</p>
        <p><strong>Message:</strong><br />${message.replace(/\n/g, "<br />")}</p>
        <p><strong>Source:</strong><br />${source}</p>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: emailSubject,
        text: textBody,
        html: htmlBody,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend contact error:", result);

      return NextResponse.json(
        {
          ok: false,
          error: "Message failed to send.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact route error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Message failed to send.",
      },
      { status: 500 }
    );
  }
}