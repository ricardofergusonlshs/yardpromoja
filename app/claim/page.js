import { Suspense } from "react";
import ClaimClient from "./ClaimClient";

export const dynamic = "force-dynamic";

export default async function ClaimPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const promo =
    typeof resolvedSearchParams?.promo === "string"
      ? resolvedSearchParams.promo
      : Array.isArray(resolvedSearchParams?.promo)
        ? resolvedSearchParams.promo[0] || ""
        : "";

  return (
    <Suspense
      fallback={
        <main className="section">
          <div className="container">
            <div className="toast">Loading claim page...</div>
          </div>
        </main>
      }
    >
      <ClaimClient promo={promo} />
    </Suspense>
  );
}