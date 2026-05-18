import { Suspense } from "react";
import CreateAdClient from "./CreateAdClient";

export const dynamic = "force-dynamic";

export default function CreateAdPage() {
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
      <CreateAdClient />
    </Suspense>
  );
}