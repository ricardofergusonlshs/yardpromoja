import { getAdUrl } from "./routes";

export function slugify(value) {
  return String(value || "promo")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "promo";
}

export function cleanPhone(value) {
  return String(value || "").replace(/[^0-9]/g, "");
}

export function publicAdUrl(slug) {
  return getAdUrl(slug);
}

export const categories = [
  "Party",
  "Dancehall",
  "Reggae",
  "Stage Show",
  "Sound Clash",
  "Concert",
  "Business",
  "Food",
  "Fashion",
  "Services",
  "Real Estate",
  "Music",
  "Local Deals",
];

export const parishes = [
  "Kingston",
  "St. Andrew",
  "St. Catherine",
  "St. James",
  "St. Ann",
  "Westmoreland",
  "Manchester",
  "Clarendon",
  "St. Elizabeth",
  "Portland",
  "St. Mary",
  "St. Thomas",
  "Hanover",
  "Trelawny",
];
