const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://yardpromoja.com";

const now = new Date();

function page(url, priority = 0.7, changeFrequency = "weekly") {
  return {
    url: `${SITE_URL}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  };
}

export default function sitemap() {
  return [
    page("/", 1, "daily"),
    page("/browse", 0.95, "daily"),
    page("/link-up", 0.9, "weekly"),
    page("/campaigns", 0.88, "weekly"),
    page("/reels", 0.86, "weekly"),
    page("/weekend", 0.82, "weekly"),

    page("/advertise", 0.78, "monthly"),
    page("/advertise/packages", 0.78, "monthly"),
    page("/media-kit", 0.72, "monthly"),
    page("/create", 0.7, "monthly"),

    page("/about", 0.55, "monthly"),
    page("/contact", 0.55, "monthly"),
    page("/privacy", 0.45, "yearly"),
    page("/terms", 0.45, "yearly"),
  ];
}
