export const sampleAds = [];

export const campaigns = [
  {
    id: "camp-share-win-tickets",
    slug: "share-to-win-weekend-tickets",
    status: "active",
    featured: true,
    type: "Share to Win",
    title: "Share to Win Weekend Tickets",
    subtitle: "Share the promo link and enter to win tickets.",
    promo_slug: "",
    promo_title: "YardPromo Weekend Giveaway",
    reward: "2 free event tickets",
    parish: "Kingston",
    location: "Jamaica",
    starts_at: "2026-05-20",
    ends_at: "2026-06-30",
    participants: 43,
    shares: 128,
    votes: 0,
    rsvps: 0,
    referrals: 31,
    options: [],
    option_votes: [],
    hashtag: "#YardPromoWeekend",
    rules: [
      "Share the campaign link with friends.",
      "Enter your name and WhatsApp number.",
      "Winner is selected after the campaign closes.",
    ],
  },
  {
    id: "camp-vote-dj",
    slug: "vote-for-next-dj",
    status: "active",
    featured: true,
    type: "Vote / Poll",
    title: "Vote for the Next DJ",
    subtitle: "Help choose who should play at the next event.",
    promo_slug: "",
    promo_title: "Next Big Night Out",
    reward: "Top DJ gets featured on the campaign page",
    parish: "St. Andrew",
    location: "Kingston & St. Andrew",
    starts_at: "2026-05-20",
    ends_at: "2026-06-15",
    participants: 214,
    shares: 54,
    votes: 214,
    rsvps: 0,
    referrals: 0,
    options: ["DJ Blaze", "DJ Mystic", "Selector Jay", "DJ Nia"],
    option_votes: [82, 59, 47, 26],
    hashtag: "#VoteYardPromo",
    rules: [
      "One vote per visitor/session where possible.",
      "Voting results may be reviewed before final announcement.",
      "Suspicious duplicate votes may be removed.",
    ],
  },
  {
    id: "camp-guest-list",
    slug: "join-the-guest-list",
    status: "active",
    featured: false,
    type: "RSVP / Guest List",
    title: "Join the Guest List",
    subtitle: "RSVP early and get on the promoter review list.",
    promo_slug: "",
    promo_title: "Friday Night Link Up",
    reward: "Guest list consideration",
    parish: "St. Catherine",
    location: "Portmore",
    starts_at: "2026-05-20",
    ends_at: "2026-06-21",
    participants: 76,
    shares: 22,
    votes: 0,
    rsvps: 76,
    referrals: 0,
    options: [],
    option_votes: [],
    hashtag: "#YardPromoGuestList",
    rules: [
      "RSVP does not guarantee entry.",
      "Promoter or venue may confirm final guest list.",
      "Use a correct WhatsApp number for follow-up.",
    ],
  },
  {
    id: "camp-hashtag",
    slug: "yardpromo-hashtag-challenge",
    status: "active",
    featured: false,
    type: "Hashtag Challenge",
    title: "YardPromo Hashtag Challenge",
    subtitle: "Post with the campaign hashtag and submit your handle.",
    promo_slug: "",
    promo_title: "YardPromo Social Challenge",
    reward: "Featured social spotlight",
    parish: "All Jamaica",
    location: "Online",
    starts_at: "2026-05-20",
    ends_at: "2026-07-01",
    participants: 53,
    shares: 47,
    votes: 0,
    rsvps: 0,
    referrals: 0,
    options: [],
    option_votes: [],
    hashtag: "#YardPromoWeekend",
    rules: [
      "Post publicly with the campaign hashtag.",
      "Submit your social handle or post link.",
      "YardPromo may feature selected posts.",
    ],
  },
];

export const categories = [
  "Party",
  "Dancehall",
  "Reggae",
  "Stage Show",
  "Sound Clash",
  "Concert",
  "Business",
  "Food",
];

export const venues = [];

export const promoters = [];

export function activeAds(list = sampleAds) {
  return (list || []).filter((ad) => {
    const status = String(ad?.status || "").toLowerCase();
    return status === "active" || status === "approved";
  });
}

export function isWeekend(ad) {
  if (!ad?.event_date) return false;

  const date = new Date(`${ad.event_date}T00:00:00`);

  if (Number.isNaN(date.getTime())) return false;

  const day = date.getDay();
  return [5, 6, 0].includes(day);
}

export function heatScore(ad) {
  return Number(ad?.heat_score || ad?.heat || 0);
}

export function interestCount(ad) {
  return Number(ad?.interested_count || ad?.interested || 0);
}

export function rsvpCount(ad) {
  return Number(ad?.rsvp_count || ad?.rsvps || 0);
}

export function eventLabel(ad) {
  if (ad?.event_date) {
    return `${ad.event_date}${ad?.event_time ? ` • ${ad.event_time}` : ""}`;
  }

  return ad?.parish || ad?.location || "Jamaica";
}

export function cleanAd(ad) {
  if (!ad) return null;

  return {
    ...ad,
    slug: ad?.slug || String(ad?.id || ""),
    poster_image_url:
      ad?.poster_image_url ||
      ad?.image_url ||
      ad?.flyer_url ||
      ad?.cover_image ||
      "",
  };
}

export function getAdBySlug(slug, list = sampleAds) {
  return (list || []).find((ad) => ad?.slug === slug) || null;
}

export function relatedAds(slug, limit = 3) {
  return activeAds(sampleAds)
    .filter((ad) => ad?.slug !== slug)
    .slice(0, limit);
}

export function getVenue(slug) {
  return venues.find((venue) => venue?.slug === slug) || null;
}

export function getPromoter(slug) {
  return promoters.find((promoter) => promoter?.slug === slug) || null;
}
export function activeCampaigns(list = campaigns) {
  return (list || []).filter((campaign) => {
    const status = String(campaign?.status || "").toLowerCase();
    return status === "active" || status === "approved";
  });
}

export function getCampaign(slug, list = campaigns) {
  return (list || []).find((campaign) => campaign?.slug === slug) || null;
}

export function campaignUrl(slug) {
  return `/campaigns/${slug}`;
}

export function campaignPromo(campaign, list = sampleAds) {
  if (!campaign?.promo_slug) return null;
  return getAdBySlug(campaign.promo_slug, list);
}

export function campaignStatSummary(campaign) {
  return {
    participants: Number(campaign?.participants || 0),
    shares: Number(campaign?.shares || 0),
    votes: Number(campaign?.votes || 0),
    rsvps: Number(campaign?.rsvps || 0),
    referrals: Number(campaign?.referrals || 0),
  };
}