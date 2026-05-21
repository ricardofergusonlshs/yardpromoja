"use client";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Compatibility client for components that import:
 * "@/lib/supabase/client"
 *
 * This keeps the app compiling even when the project did not already have
 * a root-level lib/supabase/client.js file.
 */
export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
