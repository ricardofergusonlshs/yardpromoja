const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://yardpromoja.com"
).replace(/\/$/, "");

export default function manifest() {
  return {
    name: "YardPromoJa",
    short_name: "YardPromoJa",
    description:
      "Discover Jamaican events, promotions, campaigns, sale offers, and plan the full link-up.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#020806",
    theme_color: "#008a3d",
    categories: ["events", "business", "entertainment", "food"],
    lang: "en",
    dir: "ltr",
    id: SITE_URL,
    icons: [
      {
        src: "/assets/favicon.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/yardpromo-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/assets/yardpromo-app-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    shortcuts: [
      {
        name: "Browse Promos",
        short_name: "Browse",
        description: "Explore active approved YardPromoJa listings.",
        url: "/browse",
      },
      {
        name: "Plan the Link-Up",
        short_name: "Plan",
        description: "Build a full plan around events, food, deals, transport, and more.",
        url: "/link-up",
      },
      {
        name: "Post Your Promo",
        short_name: "Post",
        description: "Create a new promo page.",
        url: "/create",
      },
      {
        name: "Campaigns",
        short_name: "Win",
        description: "Join campaigns, giveaways, votes, and guest lists.",
        url: "/campaigns",
      },
    ],
  };
}
