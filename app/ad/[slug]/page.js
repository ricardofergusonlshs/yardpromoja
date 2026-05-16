import AdDetailClient from "../AdDetailClient";
import { getAdBySlug } from "@/lib/yardpromoData";

export default async function AdDetailPage({ params }) {
  const resolvedParams = await params;
  const ad = getAdBySlug(resolvedParams.slug);
  return <AdDetailClient slug={resolvedParams.slug} ad={ad} />;
}
