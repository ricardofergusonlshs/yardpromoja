"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const SIGNUP_SUCCESS_MESSAGE = "Account created. Please check your email to confirm your account.";
const ACCOUNT_EXISTS_MESSAGE = "This account already exists. Please log in.";
const USERNAME_TAKEN_MESSAGE = "That username is already taken.";
const GENERIC_LOGIN_ERROR = "Unable to log in. Please check your email and password.";

export default function LoginClient() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    username: "",
    role: "member",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSignup() {
    const role = form.role === "advertiser" ? "advertiser" : "member";
    const username = form.username?.trim() || form.email.split("@")[0];

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          username,
        },
      },
    });

    if (error) {
      const normalized = error.message?.toLowerCase() || "";
      if (normalized.includes("username") && normalized.includes("already")) {
        setMessage(USERNAME_TAKEN_MESSAGE);
      } else if (normalized.includes("already") || normalized.includes("registered") || normalized.includes("account")) {
        setMessage(ACCOUNT_EXISTS_MESSAGE);
      } else {
        setMessage(error.message);
      }
      return;
    }

    const user = data?.user;
    const session = data?.session;

    if (user?.id && session) {
      const profilePayload = {
        id: user.id,
        email: user.email,
        role,
        full_name: form.fullName,
        username,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profilePayload, { returning: "minimal" });

      if (profileError) {
        const profileText = profileError.message?.toLowerCase() || "";
        if (!profileText.includes("duplicate") && !profileText.includes("already")) {
          console.error("Profile upsert error", profileError);
        }
      }
    }

    setMessage(SIGNUP_SUCCESS_MESSAGE);
    setMode("login");
  }

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      const normalized = error.message?.toLowerCase() || "";
      if (normalized.includes("invalid") || normalized.includes("credentials")) {
        setMessage("Invalid email or password.");
      } else {
        setMessage(GENERIC_LOGIN_ERROR);
      }
      return;
    }

    const user = data?.user;
    if (!user) {
      setMessage(GENERIC_LOGIN_ERROR);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile load error", profileError);
    }

    const role = profile?.role;

    if (role === "admin" || role === "super_admin") {
      router.push("/admin");
      return;
    }

    router.push("/dashboard");
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");

    if (mode === "signup") {
      await handleSignup();
      return;
    }

    await handleLogin();
  }

  return (
    <main className="section">
      <div className="container">
        <div className="form-card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <p className="kicker">{mode === "signup" ? "Create account" : "Login"}</p>
          <h2>{mode === "signup" ? "Sign up for YardPromo." : "Log in to YardPromo."}</h2>

          <form onSubmit={submit} className="form-grid" style={{ marginTop: 20 }}>
            {mode === "signup" && (
              <>
                <label>
                  Full name
                  <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
                </label>
                <label>
                  Username
                  <input value={form.username} onChange={(e) => update("username", e.target.value)} placeholder="yourname" />
                </label>
                <fieldset>
                  <legend>Account type</legend>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="member"
                      checked={form.role === "member"}
                      onChange={(e) => update("role", e.target.value)}
                    />
                    I want to discover promos
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="advertiser"
                      checked={form.role === "advertiser"}
                      onChange={(e) => update("role", e.target.value)}
                    />
                    I want to post a promo
                  </label>
                </fieldset>
              </>
            )}

            <label>
              Email
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </label>

            <label>
              Password
              <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={6} />
            </label>

            <button className="btn btn-primary" type="submit">
              {mode === "signup" ? "Create Account" : "Log In"}
            </button>
          </form>

          <button
            className="btn btn-light"
            style={{ marginTop: 12 }}
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setMessage("");
            }}
          >
            {mode === "signup" ? "I already have an account" : "Create a new account"}
          </button>

          {message && <div className={`toast ${message.toLowerCase().includes("error") ? "error" : ""}`}>{message}</div>}
        </div>
      </div>
    </main>
  );
}
