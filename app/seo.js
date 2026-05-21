export const yardPromoBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://yardpromoja.com");

export const yardPromoDefaultMeta = {
  siteName: "YardPromoJa",
  title: "YardPromoJa | Jamaica’s Link-Up Planner",
  description:
    "Discover Jamaican events, food, campaigns, sale offers, services, stays, transport, parish moves, and link-up ideas.",
  keywords: [
    "Jamaica events",
    "Jamaica promotions",
    "YardPromoJa",
    "Jamaica food",
    "Jamaica nightlife",
    "Jamaica deals",
    "Jamaica link-up planner",
    "Jamaica campaigns",
  ],
};

export function getCanonical(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${yardPromoBaseUrl}${cleanPath}`;
}
