"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function cleanCountryCode(value) {
  const digits = digitsOnly(value);
  return digits ? `+${digits}` : "+1";
}

function buildPhone(countryCode, localNumber) {
  const code = cleanCountryCode(countryCode);
  const digits = digitsOnly(localNumber);
  return `${code}${digits}`;
}

function optionalPhone(countryCode, localNumber) {
  const digits = digitsOnly(localNumber);
  return digits ? buildPhone(countryCode, localNumber) : "";
}

function isValidPhone(countryCode, localNumber) {
  const fullPhone = buildPhone(countryCode, localNumber);
  return /^\+[1-9]\d{7,14}$/.test(fullPhone);
}

export default function LoginClient({ nextUrl = "/dashboard", requestedMode = "" }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState(
    requestedMode === "signup" ? "signup" : "login"
  );

  const [authMethod, setAuthMethod] = useState("email");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [countryCode, setCountryCode] = useState("+1");
  const [localPhone, setLocalPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  useEffect(() => {
    if (requestedMode === "signup") {
      setMode("signup");
    }
  }, [requestedMode]);

  async function upsertProfile(user, extra = {}) {
    if (!user?.id) return;

    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email || email.trim() || null,
        full_name: fullName.trim() || user.user_metadata?.full_name || null,
        phone: optionalPhone(countryCode, localPhone) || user.phone || null,
        role: "user",
        ...extra,
      },
      { onConflict: "id" }
    );
  }

  async function handleEmailLogin(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      router.push(nextUrl);
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSignup(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: optionalPhone(countryCode, localPhone),
          },
        },
      });

      if (error) throw error;

      if (data?.user?.id) {
        await upsertProfile(data.user);
      }

      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData?.session || data?.session) {
        router.push(nextUrl);
        router.refresh();
        return;
      }

      setMessage(
        "Account created. Please check your email to confirm your account, then log in to continue."
      );
      setMode("login");
    } catch (error) {
      setMessage(error.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendPhoneCode(event) {
    event.preventDefault();

    const cleanPhone = buildPhone(countryCode, localPhone);

    if (!isValidPhone(countryCode, localPhone)) {
      setMessage("Choose your country code and enter a valid WhatsApp number.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: cleanPhone,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: cleanPhone,
          },
        },
      });

      if (error) throw error;

      setOtpSent(true);
      setMessage("OTP sent. Check your phone for the verification code.");
    } catch (error) {
  console.warn("Phone login unavailable:", error);

  setMessage(
    "Phone confirmation is not active yet. Please use email login. Your WhatsApp number can be added on claim/report forms."
  );
} finally {
  setLoading(false);
}
  }

  async function handleVerifyPhoneCode(event) {
    event.preventDefault();

    const cleanPhone = buildPhone(countryCode, localPhone);

    if (!isValidPhone(countryCode, localPhone)) {
      setMessage("Choose your country code and enter a valid WhatsApp number.");
      return;
    }

    if (!otp.trim()) {
      setMessage("Please enter the OTP code.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: cleanPhone,
        token: otp.trim(),
        type: "sms",
      });

      if (error) throw error;

      if (data?.user?.id) {
        await upsertProfile(data.user, {
          phone: cleanPhone,
          phone_verified: true,
        });
      }

      setMessage("Phone verified. Redirecting...");
      router.push(nextUrl);
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isError =
    message.toLowerCase().includes("unable") ||
    message.toLowerCase().includes("invalid") ||
    message.toLowerCase().includes("not enabled") ||
    message.toLowerCase().includes("please enter") ||
    message.toLowerCase().includes("choose your country code");

  return (
    <main className="section">
      <div className="container">
        <div className="auth-card panel">
          <p className="kicker">{isSignup ? "Create account" : "Login"}</p>

          <h1>
            {isSignup ? "Create your YardPromo account." : "Log in to YardPromo."}
          </h1>

          <p className="muted">
            {nextUrl !== "/dashboard"
              ? "After signing in, you’ll continue to the page you requested."
              : "Access your dashboard, saved promos, claims, and reports."}
          </p>

          <div className="auth-switch-row" style={{ marginTop: 18 }}>
            <button
              type="button"
              className={authMethod === "email" ? "btn btn-primary" : "btn btn-light"}
              onClick={() => {
                setAuthMethod("email");
                setMessage("");
              }}
            >
              Email
            </button>

            <button
              type="button"
              className={authMethod === "phone" ? "btn btn-primary" : "btn btn-light"}
              onClick={() => {
                setAuthMethod("phone");
                setMessage("");
              }}
            >
              Phone / WhatsApp
            </button>
          </div>

          {message ? (
            <div className={isError ? "toast error" : "toast"} style={{ marginTop: 14 }}>
              {message}
            </div>
          ) : null}

          {authMethod === "email" ? (
            <form
              className="auth-form"
              onSubmit={isSignup ? handleEmailSignup : handleEmailLogin}
            >
              {isSignup ? (
                <label>
                  Name
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your name"
                    required
                  />
                </label>
              ) : null}

              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  required
                  minLength={6}
                />
              </label>

              {isSignup ? (
                <>
                  <label>
                    Country code optional
                    <input
                      value={countryCode}
                      onChange={(event) =>
                        setCountryCode(cleanCountryCode(event.target.value))
                      }
                      placeholder="+1"
                    />
                  </label>

                  <label>
                    Phone / WhatsApp optional
                    <input
                      value={localPhone}
                      onChange={(event) =>
                        setLocalPhone(digitsOnly(event.target.value))
                      }
                      placeholder="8761234567"
                    />
                  </label>
                </>
              ) : null}

              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Please wait..." : isSignup ? "Create account" : "Log In"}
              </button>
            </form>
          ) : (
            <form
              className="auth-form"
              onSubmit={otpSent ? handleVerifyPhoneCode : handleSendPhoneCode}
            >
              {isSignup ? (
                <label>
                  Name optional
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your name"
                  />
                </label>
              ) : null}

              <label>
                Country code
                <input
                  value={countryCode}
                  onChange={(event) =>
                    setCountryCode(cleanCountryCode(event.target.value))
                  }
                  placeholder="+1"
                  required
                />
              </label>

              <label>
                Phone / WhatsApp number
                <input
                  value={localPhone}
                  onChange={(event) =>
                    setLocalPhone(digitsOnly(event.target.value))
                  }
                  placeholder="8761234567"
                  required
                />
              </label>

              <p className="muted small">
                Choose your country code and enter your WhatsApp number.
              </p>

              {otpSent ? (
                <label>
                  OTP code
                  <input
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="Enter SMS code"
                    required
                  />
                </label>
              ) : null}

              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Please wait..." : otpSent ? "Verify code" : "Send code"}
              </button>

              {otpSent ? (
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setMessage("");
                  }}
                >
                  Change phone number
                </button>
              ) : null}
            </form>
          )}

          <div className="auth-switch-row">
            {isSignup ? (
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
              >
                Already have an account? Log in
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                }}
              >
                Create a new account
              </button>
            )}

            <Link className="btn btn-light" href="/">
              Back home
            </Link>
          </div>

          <p className="muted small" style={{ marginTop: 16 }}>
  Phone confirmation is not active yet. Please use email login. Your WhatsApp number can be added on claim/report forms.
</p>
        </div>
      </div>
    </main>
  );
}
