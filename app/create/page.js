import { Suspense } from "react";
import CreateAdClient from "./CreateAdClient";

export const dynamic = "force-dynamic";

export default async function CreateAdPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const editId =
    typeof resolvedSearchParams?.edit === "string"
      ? resolvedSearchParams.edit
      : "";

  return (
    <Suspense
      fallback={
        <main className="section create-page">
          <div className="container">
            <div className="toast">Loading create page...</div>
          </div>
        </main>
      }
    >
      <CreateAdClient editId={editId} />
    </Suspense>
  );
}