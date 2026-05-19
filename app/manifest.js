export default function manifest() {
  return {
    name: "YardPromo Jamaica",
    short_name: "YardPromo",
    description:
      "Discover Jamaican events, promos, venues, campaigns, and local deals — or post your own promo link.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#008a3d",
    orientation: "portrait",
    icons: [
      {
        src: "/assets/yardpromo-app-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/yardpromo-app-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/yardpromo-app-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}