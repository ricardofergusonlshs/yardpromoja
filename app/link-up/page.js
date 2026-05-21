import LinkUpClient from "./LinkUpClient";

export const metadata = {
  title: "Plan the Link-Up | YardPromo Jamaica",
  description:
    "Build the perfect plan around any event, promo, or weekend move in Jamaica.",
};

export default async function LinkUpPage({ searchParams }) {
  const params = await Promise.resolve(searchParams || {});
  const promoSlug = params?.promo || "";
  const need = params?.need || "";

  return <LinkUpClient initialPromoSlug={promoSlug} initialNeed={need} />;
}
