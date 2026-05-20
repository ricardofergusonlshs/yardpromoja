"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/weekend", label: "Weekend" },
  { href: "/calendar", label: "Calendar" },
];

const customerLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/weekend", label: "Weekend" },
  { href: "/calendar", label: "Calendar" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/services", label: "Services" },
  { href: "/account", label: "Account" },
];

export default function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadUser() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user || null;

        if (!alive) return;

        if (!currentUser) {
          setUser(null);
          setRole(null);
          setAuthChecked(true);
          return;
        }

        setUser(currentUser);

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (!alive) return;

        setRole(profile?.role || null);
        setAuthChecked(true);
      } catch {
        if (!alive) return;

        setUser(null);
        setRole(null);
        setAuthChecked(true);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      alive = false;
      subscription?.unsubscribe?.();
    };
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push("/");
    router.refresh();
  }

  const isAdmin = role === "admin" || role === "super_admin";

  const links = user
    ? customerLinks.filter((link) => {
        if (isAdmin && link.href === "/dashboard") return false;
        return true;
      })
    : publicLinks;

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? "page" : undefined}
          className={pathname === link.href ? "active" : undefined}
        >
          {link.label}
        </Link>
      ))}

      {user && isAdmin ? <Link href="/admin">Admin</Link> : null}

      {authChecked && user ? (
        <button
          type="button"
          className="btn btn-light"
          style={{ marginLeft: 4 }}
          onClick={signOut}
        >
          Logout
        </button>
      ) : null}

      {authChecked && !user ? <Link href="/login">Login</Link> : null}
    </>
  );
}