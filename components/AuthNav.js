"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseClient";

export default function AuthNav() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user || null;

      if (!mounted) return;

      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (mounted) {
          setRole(profile?.role || null);
        }
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push("/login");
    router.refresh();
  }

  const isAdmin = role === "admin" || role === "super_admin";
  const canPost = ["advertiser", "promoter", "venue_owner"].includes(role);
  const isMember = role === "member";
  const accountLabel = isMember ? "Account" : "Dashboard";

  return (
    <>
      {user && <Link href="/for-you">For You</Link>}
      {user && <Link href="/calendar">Calendar</Link>}
      {user && <Link href="/campaigns">Campaigns</Link>}
      {user && !isAdmin && <Link href="/dashboard">{accountLabel}</Link>}
      {isMember && <Link href="/saved">Saved</Link>}
      {isAdmin && <Link href="/admin">Admin</Link>}
      {!user ? (
        <Link href="/login">Login</Link>
      ) : (
        <button type="button" className="nav-link-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </>
  );
}
