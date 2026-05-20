"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let alive = true;

    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getUser();

        if (!alive) return;

        if (data?.user) {
          setAllowed(true);
          setChecking(false);
          return;
        }

        const query = searchParams?.toString();
        const currentPath = query ? `${pathname}?${query}` : pathname;

        router.replace(`/login?next=${encodeURIComponent(currentPath)}`);
      } catch {
        if (!alive) return;

        const query = searchParams?.toString();
        const currentPath = query ? `${pathname}?${query}` : pathname;

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
  }, [pathname, router, searchParams, supabase]);

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
