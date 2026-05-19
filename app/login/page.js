import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

function safeNext(value) {
  if (!value) return "/dashboard";

  const next = String(value);

  if (!next.startsWith("/")) return "/dashboard";
  if (next.startsWith("//")) return "/dashboard";

  return next;
}

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const nextUrl = safeNext(
    typeof resolvedSearchParams?.next === "string"
      ? resolvedSearchParams.next
      : ""
  );

  const requestedMode =
    typeof resolvedSearchParams?.mode === "string"
      ? resolvedSearchParams.mode
      : "";

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