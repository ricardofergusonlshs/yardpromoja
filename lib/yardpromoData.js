// YardPromo demo data converted from the original static HTML source of truth.

export const categories = ["Party","Dancehall","Reggae","Stage Show","Sound Clash","Concert","Business","Food","Fashion","Services","Real Estate","Music","Local Deals"];

export const parishes = ["Kingston","St. Andrew","St. Catherine","St. James","St. Ann","Westmoreland","Manchester","Clarendon","St. Elizabeth","Portland","St. Mary","St. Thomas","Hanover","Trelawny"];

export const promoters = [
  {slug:"island-vibes-promotions",name:"Island Vibes Promotions",verified:true,type:"Promoter",bio:"Kingston-based event promoter focused on nightlife, dancehall, and premium weekend experiences.",parish:"Kingston",location:"New Kingston",phone:"+1 876 555 0100",whatsapp:"+18765550100",website:"https://yardpromoja.com",instagram:"@islandvibesja",image:"https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80"},
  {slug:"roots-stage-ja",name:"Roots Stage JA",verified:true,type:"Event Organizer",bio:"Live reggae shows, culture events, and outdoor music experiences across Jamaica.",parish:"St. Andrew",location:"Kingston",phone:"+1 876 555 0101",whatsapp:"+18765550101",website:"https://yardpromoja.com",instagram:"@rootsstageja",image:"https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80"},
  {slug:"island-bites-ja",name:"Island Bites JA",verified:false,type:"Business",bio:"Seafood, lunch boxes, and weekend food specials in Ocho Rios.",parish:"St. Ann",location:"Ocho Rios",phone:"+1 876 555 0104",whatsapp:"+18765550104",website:"https://yardpromoja.com",instagram:"@islandbitesja",image:"https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&w=900&q=80"}
];

export const venues = [
  {slug:"new-kingston-lounge",name:"New Kingston Lounge",image:"https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?auto=format&fit=crop&w=1200&q=80",parish:"Kingston",location:"New Kingston",address:"New Kingston, Jamaica",description:"Premium lounge venue for parties, selectors, VIP bookings, and weekend events.",phone:"+1 876 555 0200",whatsapp:"+18765550200",website:"https://yardpromoja.com"},
  {slug:"hope-gardens",name:"Hope Gardens",image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",parish:"St. Andrew",location:"Kingston",address:"Old Hope Road, Kingston, Jamaica",description:"Outdoor venue for concerts, cultural events, family shows, and community gatherings.",phone:"+1 876 555 0201",whatsapp:"+18765550201",website:"https://yardpromoja.com"},
  {slug:"montego-bay-cultural-centre",name:"Montego Bay Cultural Centre",image:"https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",parish:"St. James",location:"Montego Bay",address:"Sam Sharpe Square, Montego Bay, Jamaica",description:"Venue for stage shows, comedy nights, performances, and community gatherings.",phone:"+1 876 555 0202",whatsapp:"+18765550202",website:"https://yardpromoja.com"}
];
export const sampleAds = [];

export const campaigns = [];
 

export function activeAds(list = sampleAds) {
  return (list || []).filter((ad) => {
    const status = String(ad?.status || "").toLowerCase();
    return status === "active" || status === "approved";
  });
}

export function isWeekend(ad) {
  if (!ad?.event_date) return false;
  const d = new Date(`${ad.event_date}T00:00:00`).getDay();
  return [5, 6, 0].includes(d);
}

export function heatScore(ad) {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        Number(ad?.interested_seed || 0) * 0.12 +
          Number(ad?.rsvp_seed || 0) * 0.35 +
          Number(ad?.views || 0) / 300 +
          Number(ad?.clicks || 0) * 0.25 +
          Number(ad?.shares || 0) * 0.7 +
          (ad?.is_featured ? 15 : 0)
      )
    )
  );
}

export function interestCount(ad) {
  return Number(ad?.interested_seed || ad?.interested_count || ad?.link_clicks || 0);
}

export function rsvpCount(ad) {
  return Number(ad?.rsvp_seed || ad?.rsvp_count || ad?.whatsapp_clicks || 0);
}

export function eventLabel(ad) {
  if (ad?.event_date) return `${ad.event_date}${ad.event_time ? " • " + ad.event_time : ""}`;
  return ad?.parish || "Jamaica";
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
  return (list || []).find((ad) => ad.slug === slug) || null;
}

export function relatedAds(slug, limit = 3) {
  return activeAds(sampleAds)
    .filter((ad) => ad.slug !== slug)
    .slice(0, limit);
}

export function getVenue(slug) {
  return venues.find((venue) => venue.slug === slug) || null;
}

export function getPromoter(slug) {
  return promoters.find((promoter) => promoter.slug === slug) || null;
}