import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

function safeNext(value) {
  if (!value) return "/dashboard";

  const next = String(value).trim();

  // Only allow internal app redirects.
  if (!next.startsWith("/")) return "/dashboard";
  if (next.startsWith("//")) return "/dashboard";

  // Avoid redirect loops back to login.
  if (next === "/login" || next.startsWith("/login?")) {
    return "/dashboard";
  }

  return next;
}

function safeMode(value) {
  const mode = String(value || "").trim().toLowerCase();

  if (mode === "signup" || mode === "login") {
    return mode;
  }

  return "";
}

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const rawNext = Array.isArray(resolvedSearchParams?.next)
    ? resolvedSearchParams.next[0]
    : resolvedSearchParams?.next;

  const rawMode = Array.isArray(resolvedSearchParams?.mode)
    ? resolvedSearchParams.mode[0]
    : resolvedSearchParams?.mode;

  const nextUrl = safeNext(typeof rawNext === "string" ? rawNext : "");
  const requestedMode = safeMode(typeof rawMode === "string" ? rawMode : "");

  return (
    <Suspense
      fallback={
        <main className="section">
          <div className="container">
            <div className="toast">Loading login...</div>
          </div>
        </main>
      }
    >
      <LoginClient nextUrl={nextUrl} requestedMode={requestedMode} />
    </Suspense>
  );
}
