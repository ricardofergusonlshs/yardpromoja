const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://yardpromoja.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/browse",
          "/ad/",
          "/link-up",
          "/campaigns",
          "/reels",
          "/weekend",
          "/advertise",
          "/advertise/packages",
          "/media-kit",
          "/about",
          "/contact",
        ],
        disallow: [
          "/admin",
          "/account",
          "/dashboard",
          "/saved",
          "/uploader",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
