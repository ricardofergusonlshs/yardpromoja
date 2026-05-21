"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

function getCurrentPath(pathname) {
  if (typeof window === "undefined") return pathname || "/";

  const path = window.location.pathname || pathname || "/";
  const search = window.location.search || "";

  return `${path}${search}`;
}

export default function RequireAuth({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let alive = true;

    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (!alive) return;

        if (!error && data?.user) {
          setAllowed(true);
          setChecking(false);
          return;
        }

        const next = getCurrentPath(pathname);
        router.replace(`/login?next=${encodeURIComponent(next)}`);
      } catch {
        if (!alive) return;

        const next = getCurrentPath(pathname);
        router.replace(`/login?next=${encodeURIComponent(next)}`);
      }
    }

    checkAuth();

    return () => {
      alive = false;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <main className="section">
        <div className="container">
          <div className="toast">Checking access...</div>
        </div>
      </main>
    );
  }

  if (!allowed) return null;

  return children;
}
