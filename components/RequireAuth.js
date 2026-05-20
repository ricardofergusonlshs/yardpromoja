"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let alive = true;

    function getCurrentPath() {
      if (typeof window === "undefined") {
        return pathname || "/";
      }

      return `${window.location.pathname}${window.location.search || ""}`;
    }

    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getUser();

        if (!alive) return;

        if (data?.user) {
          setAllowed(true);
          setChecking(false);
          return;
        }

        const currentPath = getCurrentPath();
        router.replace(`/login?next=${encodeURIComponent(currentPath)}`);
      } catch {
        if (!alive) return;

        const currentPath = getCurrentPath();
        router.replace(`/login?next=${encodeURIComponent(currentPath)}`);
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      alive = false;
      subscription?.unsubscribe?.();
    };
  }, [pathname, router, supabase]);

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
