"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function AuthNav() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;
      if (!currentUser) {
        setUser(null);
        setRole(null);
        return;
      }

      setUser(currentUser);
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .maybeSingle();

      setRole(profile?.role || null);
    }

    loadUser();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {user ? <Link href="/dashboard">Dashboard</Link> : null}
      {role === "admin" || role === "super_admin" ? <Link href="/admin">Admin</Link> : null}
      {user ? (
        <button className="btn btn-light" style={{ marginLeft: 4 }} onClick={signOut}>
          Logout
        </button>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </>
  );
}
