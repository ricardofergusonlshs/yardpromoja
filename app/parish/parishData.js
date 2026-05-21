export const PARISHES = [
  {
    name: "Kingston",
    slug: "kingston",
    region: "Kingston",
    listings: "84+ listings",
    image: "/assets/parishes/kingston.png",
    aliases: ["kingston", "downtown kingston", "new kingston", "cross roads"],
    description:
      "Explore Kingston promos, nightlife, food spots, campaigns, services, and weekend moves.",
    highlights: ["Nightlife", "Food", "Business", "Campaigns"],
  },
  {
    name: "St. Andrew",
    slug: "st-andrew",
    region: "Half Way Tree, Constant Spring, Liguanea",
    listings: "120+ listings",
    image: "/assets/parishes/kingston.png",
    aliases: ["st andrew", "st. andrew", "half way tree", "constant spring", "liguanea", "barbican"],
    description:
      "Find St. Andrew promotions, restaurants, services, events, and link-up stops.",
    highlights: ["Food", "Services", "Fashion", "Nightlife"],
  },
  {
    name: "St. Catherine",
    slug: "st-catherine",
    region: "Portmore, Spanish Town",
    listings: "128+ listings",
    image: "/assets/parishes/st-catherine.png",
    aliases: ["st catherine", "st. catherine", "portmore", "spanish town", "old harbour"],
    description:
      "Discover St. Catherine events, food, transport, sale offers, and local businesses.",
    highlights: ["Food", "Events", "Services", "Transport"],
  },
  {
    name: "Manchester",
    slug: "manchester",
    region: "Mandeville",
    listings: "156+ listings",
    image: "/assets/parishes/manchester.png",
    aliases: ["manchester", "mandeville", "christiana", "porus"],
    description:
      "Explore Manchester promos, businesses, food spots, services, and weekend plans.",
    highlights: ["Services", "Food", "Shopping", "Weekend"],
  },
  {
    name: "Clarendon",
    slug: "clarendon",
    region: "May Pen",
    listings: "132+ listings",
    image: "/assets/parishes/clarendon.png",
    aliases: ["clarendon", "may pen", "chapelton", "lionel town"],
    description:
      "Find Clarendon promos, local events, food spots, services, and campaigns.",
    highlights: ["Food", "Services", "Sale Offers", "Events"],
  },
  {
    name: "St. Ann",
    slug: "st-ann",
    region: "Ocho Rios",
    listings: "178+ listings",
    image: "/assets/parishes/st-ann.png",
    aliases: ["st ann", "st. ann", "ocho rios", "runaway bay", "st anns bay", "st. ann's bay"],
    description:
      "Plan around St. Ann attractions, food spots, parties, stays, and transport.",
    highlights: ["Experiences", "Food", "Stay", "Transport"],
  },
  {
    name: "Trelawny",
    slug: "trelawny",
    region: "Falmouth",
    listings: "98+ listings",
    image: "/assets/parishes/trelawny.png",
    aliases: ["trelawny", "falmouth", "duncans", "clarks town"],
    description:
      "Discover Trelawny events, services, food, adventure stops, and local deals.",
    highlights: ["Events", "Food", "Services", "Adventure"],
  },
  {
    name: "St. James",
    slug: "st-james",
    region: "Montego Bay",
    listings: "213+ listings",
    image: "/assets/parishes/st-james.png",
    aliases: ["st james", "st. james", "montego bay", "mobay", "rose hall"],
    description:
      "Explore Montego Bay and St. James parties, food, stays, campaigns, and experiences.",
    highlights: ["Nightlife", "Stay", "Food", "Experiences"],
  },
  {
    name: "Hanover",
    slug: "hanover",
    region: "Lucea",
    listings: "105+ listings",
    image: "/assets/parishes/hanover.png",
    aliases: ["hanover", "lucea", "sandy bay", "green island"],
    description:
      "Find Hanover food, services, stays, local businesses, and weekend promotions.",
    highlights: ["Stay", "Food", "Services", "Weekend"],
  },
  {
    name: "Westmoreland",
    slug: "westmoreland",
    region: "Negril, Savanna-la-Mar",
    listings: "250+ listings",
    image: "/assets/parishes/westmoreland.png",
    aliases: ["westmoreland", "negril", "savanna-la-mar", "sav la mar", "whitehouse"],
    description:
      "Discover Westmoreland and Negril events, food, stays, nightlife, and sale offers.",
    highlights: ["Nightlife", "Stay", "Food", "Beach"],
  },
  {
    name: "St. Elizabeth",
    slug: "st-elizabeth",
    region: "Black River",
    listings: "167+ listings",
    image: "/assets/parishes/st-elizabeth.png",
    aliases: ["st elizabeth", "st. elizabeth", "black river", "santa cruz", "junction"],
    description:
      "Explore St. Elizabeth adventures, services, food spots, attractions, and promos.",
    highlights: ["Adventure", "Food", "Services", "Experiences"],
  },
  {
    name: "St. Mary",
    slug: "st-mary",
    region: "Port Maria",
    listings: "87+ listings",
    image: "/assets/parishes/st-mary.png",
    aliases: ["st mary", "st. mary", "port maria", "oracabessa", "highgate"],
    description:
      "Find St. Mary food, local events, services, stays, and parish promotions.",
    highlights: ["Food", "Events", "Services", "Stay"],
  },
  {
    name: "Portland",
    slug: "portland",
    region: "Port Antonio",
    listings: "76+ listings",
    image: "/assets/parishes/portland.png",
    aliases: ["portland", "port antonio", "san san", "buff bay", "manchioneal"],
    description:
      "Explore Portland adventures, beaches, stays, food spots, and local experiences.",
    highlights: ["Adventure", "Beach", "Food", "Stay"],
  },
  {
    name: "St. Thomas",
    slug: "st-thomas",
    region: "Morant Bay",
    listings: "64+ listings",
    image: "/assets/jamaica-parish-map.svg",
    aliases: ["st thomas", "st. thomas", "morant bay", "yallahs", "bath", "seaforth"],
    description:
      "Discover St. Thomas events, food, beaches, local services, and emerging promotions.",
    highlights: ["Beach", "Food", "Services", "Weekend"],
  },
];

export function slugifyParish(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/st\./g, "st")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getParishBySlug(slug) {
  const cleanSlug = slugifyParish(slug);
  return PARISHES.find((parish) => parish.slug === cleanSlug);
}

export function getParishHref(parishNameOrSlug) {
  const parish =
    getParishBySlug(parishNameOrSlug) ||
    PARISHES.find(
      (item) => item.name.toLowerCase() === String(parishNameOrSlug).toLowerCase()
    );

  return parish ? `/parish/${parish.slug}` : "/parish";
}
