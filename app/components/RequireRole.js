"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

function getCurrentPath(pathname) {
  if (typeof window === "undefined") return pathname || "/";
  return `${window.location.pathname}${window.location.search || ""}`;
}

export default function RequireRole({
  children,
  allowedRoles = [],
  fallbackTitle = "Access restricted",
  fallbackMessage = "You do not have access to this area.",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [profileRole, setProfileRole] = useState("");

  useEffect(() => {
    let alive = true;

    async function checkAccess() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!alive) return;

        if (!user) {
          router.replace(`/login?next=${encodeURIComponent(getCurrentPath(pathname))}`);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        const role = profile?.role || "customer";

        if (!alive) return;

        setProfileRole(role);
        setAllowed(allowedRoles.includes(role));
      } catch {
        if (!alive) return;
        setAllowed(false);
      } finally {
        if (alive) setChecking(false);
      }
    }

    checkAccess();

    return () => {
      alive = false;
    };
  }, [allowedRoles, pathname, router, supabase]);

  if (checking) {
    return (
      <main className="section">
        <div className="container">
          <div className="toast">Checking access...</div>
        </div>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="section">
        <div className="container">
          <div className="empty">
            <p className="kicker">Role required</p>
            <h1>{fallbackTitle}</h1>
            <p className="muted">
              {fallbackMessage}
              {profileRole ? ` Current role: ${profileRole}.` : ""}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return children;
}