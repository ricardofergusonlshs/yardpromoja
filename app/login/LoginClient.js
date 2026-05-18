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

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const nextParam = safeNext(searchParams.get("next"));
  const modeParam = searchParams.get("mode");

  const [mode, setMode] = useState(modeParam === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (modeParam === "signup") {
      setMode("signup");
    }
  }, [modeParam]);

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

      router.push(nextParam);
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
            full_name: fullName.trim(),
          },
        },
      });

      if (error) throw error;

      if (data?.user?.id) {
        await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            email: email.trim(),
            full_name: fullName.trim(),
            role: "user",
          },
          { onConflict: "id" }
        );
      }

      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData?.session) {
        router.push(nextParam);
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

  const isSignup = mode === "signup";

  return (
    <main className="section">
      <div className="container">
        <div className="auth-card panel">
          <p className="kicker">{isSignup ? "Create account" : "Login"}</p>

          <h1>{isSignup ? "Create your YardPromo account." : "Log in to YardPromo."}</h1>

          <p className="muted">
            {nextParam !== "/dashboard"
              ? "After signing in, you’ll continue to the page you requested."
              : "Access your dashboard, saved promos, claims, and reports."}
          </p>

          {message ? (
            <div className={message.toLowerCase().includes("unable") ? "toast error" : "toast"}>
              {message}
            </div>
          ) : null}

          <form
            className="auth-form"
            onSubmit={isSignup ? handleSignup : handleLogin}
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

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Create account" : "Log In"}
            </button>
          </form>

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
      <LoginPageInner />
    </Suspense>
  );
}