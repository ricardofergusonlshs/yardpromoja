"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/components/RequireAuth";

export default function AccountPage() {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    username: "",
    parish: "",
    bio: "",
    avatar_url: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadAccount() {
      setLoading(true);
      setMessage("");

      try {
        const { data: userData } = await supabase.auth.getUser();
        const currentUser = userData?.user || null;

        if (!alive) return;

        setUser(currentUser);

        if (!currentUser) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id,email,full_name,username,parish,bio,avatar_url,role")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (error) throw error;

        if (alive) {
          setProfile({
            full_name: data?.full_name || "",
            username: data?.username || "",
            parish: data?.parish || "",
            bio: data?.bio || "",
            avatar_url: data?.avatar_url || "",
            role: data?.role || "member",
          });
        }
      } catch (error) {
        console.warn("Account load error", error);
        if (alive) {
          setMessage("Unable to load account details.");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      alive = false;
    };
  }, [supabase]);

  function updateField(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveAccount(event) {
    event.preventDefault();

    if (!user?.id) return;

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        id: user.id,
        email: user.email,
        full_name: profile.full_name.trim(),
        username: profile.username.trim(),
        parish: profile.parish.trim(),
        bio: profile.bio.trim(),
        avatar_url: profile.avatar_url.trim(),
        role: profile.role || "member",
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" });

      if (error) throw error;

      setMessage("Account updated.");
    } catch (error) {
      console.warn("Account save error", error);
      setMessage("Unable to save account.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <RequireAuth>
      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Account</p>
              <h1>Account settings</h1>
              <p className="muted">
                Manage your YardPromo Jamaica profile and public promoter information.
              </p>
            </div>

            <div className="actions">
              <Link className="btn btn-light" href="/dashboard">
                Dashboard
              </Link>

              <button type="button" className="btn btn-light" onClick={signOut}>
                Logout
              </button>
            </div>
          </div>

          {loading ? <div className="toast">Loading account...</div> : null}
          {message ? <div className="toast">{message}</div> : null}

          {!loading ? (
            <form className="panel" onSubmit={saveAccount} style={{ display: "grid", gap: 12 }}>
              <p>
                <strong>Email:</strong> {user?.email || "Not available"}
              </p>

              <input
                className="share-input"
                value={profile.full_name}
                onChange={(event) => updateField("full_name", event.target.value)}
                placeholder="Full name or business name"
              />

              <input
                className="share-input"
                value={profile.username}
                onChange={(event) => updateField("username", event.target.value)}
                placeholder="Username"
              />

              <input
                className="share-input"
                value={profile.parish}
                onChange={(event) => updateField("parish", event.target.value)}
                placeholder="Parish"
              />

              <input
                className="share-input"
                value={profile.avatar_url}
                onChange={(event) => updateField("avatar_url", event.target.value)}
                placeholder="Avatar image URL"
              />

              <textarea
                value={profile.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="Bio"
                rows={5}
                style={{ width: "100%" }}
              />

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save account"}
                </button>

                {profile.username ? (
                  <Link className="btn btn-light" href={`/u/${profile.username}`}>
                    View public profile
                  </Link>
                ) : null}
              </div>
            </form>
          ) : null}
        </div>
      </main>
    </RequireAuth>
  );
}
