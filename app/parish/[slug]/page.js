import { notFound } from "next/navigation";
import { getParishBySlug, PARISHES } from "../parishData";
import ParishPageClient from "./ParishPageClient";

export function generateStaticParams() {
  return PARISHES.map((parish) => ({ slug: parish.slug }));
}

export function generateMetadata({ params }) {
  const parish = getParishBySlug(params.slug);

  if (!parish) {
    return {
      title: "Parish not found | YardPromoJa",
    };
  }

  return {
    title: `${parish.name} Promos, Events & Food | YardPromoJa`,
    description: parish.description,
  };
}

export default function ParishDetailPage({ params }) {
  const parish = getParishBySlug(params.slug);

  if (!parish) {
    notFound();
  }

  return <ParishPageClient parish={parish} allParishes={PARISHES} />;
}
