"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

function safeNext(value) {
  if (!value) return "/dashboard";

  const next = String(value);

  if (!next.startsWith("/")) return "/dashboard";
  if (next.startsWith("//")) return "/dashboard";

  return next;
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const nextUrl = safeNext(searchParams.get("next"));
  const requestedMode = searchParams.get("mode");

  const [mode, setMode] = useState(
    requestedMode === "signup" ? "signup" : "login"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  useEffect(() => {
    if (requestedMode === "signup") {
      setMode("signup");
    }
  }, [requestedMode]);

  async function handleLogin(event) {
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

  async function handleSignup(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) throw error;

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

  return (
    <main className="section">
      <div className="container">
        <div className="panel" style={{ maxWidth: 620, margin: "0 auto" }}>
          <p className="kicker">{isSignup ? "Create account" : "Login"}</p>

          <h1>{isSignup ? "Create your account." : "Log in to YardPromo."}</h1>

          <p className="muted">
            {nextUrl !== "/dashboard"
              ? "After signing in, you’ll continue to the page you requested."
              : "Access your dashboard, saved promos, claims, and reports."}
          </p>

          {message ? (
            <div
              className={
                message.toLowerCase().includes("unable") ? "toast error" : "toast"
              }
              style={{ marginTop: 14 }}
            >
              {message}
            </div>
          ) : null}

          <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            style={{
              display: "grid",
              gap: 14,
              marginTop: 22,
            }}
          >
            {isSignup ? (
              <label style={{ display: "grid", gap: 8, fontWeight: 900 }}>
                Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                  style={{
                    width: "100%",
                    border: "1px solid #dbe8f5",
                    borderRadius: 16,
                    padding: "14px 15px",
                    font: "inherit",
                    fontWeight: 800,
                    background: "#f8fafc",
                  }}
                />
              </label>
            ) : null}

            <label style={{ display: "grid", gap: 8, fontWeight: 900 }}>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  border: "1px solid #dbe8f5",
                  borderRadius: 16,
                  padding: "14px 15px",
                  font: "inherit",
                  fontWeight: 800,
                  background: "#f8fafc",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: 8, fontWeight: 900 }}>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                required
                minLength={6}
                style={{
                  width: "100%",
                  border: "1px solid #dbe8f5",
                  borderRadius: 16,
                  padding: "14px 15px",
                  font: "inherit",
                  fontWeight: 800,
                  background: "#f8fafc",
                }}
              />
            </label>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create account"
                  : "Log in"}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 16,
            }}
          >
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
                Create account
              </button>
            )}

            <Link className="btn btn-light" href="/">
              Back home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="section">
          <div className="container">
            <div className="toast">Loading login...</div>
          </div>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}