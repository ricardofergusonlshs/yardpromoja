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
  {id:1,title:"Uptown Friday Dancehall Party",slug:"uptown-friday-dancehall-party",category:"Dancehall",description:"Dancehall, bottle specials, VIP booths, and top selectors in New Kingston.",poster_image_url:"https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",event_date:"2026-05-22",event_time:"22:00",venue:"New Kingston Lounge",venue_slug:"new-kingston-lounge",location:"New Kingston",parish:"Kingston",price:"JMD $2,500 presold",phone:"+1 876 555 0100",whatsapp:"+18765550100",website_link:"https://yardpromoja.com/tickets",social_link:"@yardvibespromo",call_to_action:"Get Tickets",status:"active",is_featured:true,is_weekly_pick:true,promoter_slug:"island-vibes-promotions",posted_by:"admin",views:18420,clicks:1642,shares:382,interested_seed:286,rsvp_seed:74,guest_seed:126,vip_seed:18,birthday_seed:9,rsvp_limit:150},
  {id:2,title:"Reggae Sunset Live",slug:"reggae-sunset-live",category:"Reggae",description:"Live reggae bands, food vendors, craft stalls, and sunset music.",poster_image_url:"https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",event_date:"2026-05-24",event_time:"18:00",venue:"Hope Gardens",venue_slug:"hope-gardens",location:"Kingston",parish:"St. Andrew",price:"JMD $3,000 general",phone:"+1 876 555 0101",whatsapp:"+18765550101",website_link:"https://yardpromoja.com/reggae",social_link:"@rootsstageja",call_to_action:"Buy Passes",status:"active",is_featured:true,is_weekly_pick:true,promoter_slug:"roots-stage-ja",posted_by:"promoter",views:13200,clicks:920,shares:211,interested_seed:190,rsvp_seed:52,guest_seed:84,vip_seed:7,birthday_seed:4,rsvp_limit:200},
  {id:3,title:"MoBay Comedy Night",slug:"mobay-comedy-night",category:"Stage Show",description:"Stand-up comedy, food, drinks, and guest performers.",poster_image_url:"https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=1200&q=80",event_date:"2026-05-29",event_time:"20:30",venue:"Montego Bay Cultural Centre",venue_slug:"montego-bay-cultural-centre",location:"Montego Bay",parish:"St. James",price:"JMD $2,000",phone:"+1 876 555 0102",whatsapp:"+18765550102",website_link:"https://yardpromoja.com/comedy",social_link:"@stagehouseja",call_to_action:"Reserve Seats",status:"active",is_featured:false,is_weekly_pick:true,promoter_slug:"island-vibes-promotions",posted_by:"admin",views:7100,clicks:506,shares:148,interested_seed:128,rsvp_seed:38,guest_seed:61,vip_seed:5,birthday_seed:2,rsvp_limit:100},
  {id:4,title:"Ochi Seafood Specials",slug:"ochi-seafood-specials",category:"Food",description:"Fresh seafood, lunch boxes, juices, and weekend meal deals.",poster_image_url:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",event_date:"",event_time:"",venue:"Island Bites JA",venue_slug:"",location:"Ocho Rios",parish:"St. Ann",price:"Meals from JMD $1,800",phone:"+1 876 555 0104",whatsapp:"+18765550104",website_link:"https://yardpromoja.com/food",social_link:"@islandbitesja",call_to_action:"Order Now",status:"active",is_featured:false,is_weekly_pick:false,promoter_slug:"island-bites-ja",posted_by:"promoter",views:8800,clicks:620,shares:108,interested_seed:95,rsvp_seed:0,guest_seed:0,vip_seed:0,birthday_seed:0,rsvp_limit:0},
  {id:5,title:"Portmore Summer Sale",slug:"portmore-summer-sale",category:"Fashion",description:"Streetwear, caps, swimwear, and Jamaican graphic tees.",poster_image_url:"https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",event_date:"",event_time:"",venue:"Yardie Threadz",venue_slug:"",location:"Portmore Mall",parish:"St. Catherine",price:"Up to 30% off",phone:"+1 876 555 0105",whatsapp:"+18765550105",website_link:"https://yardpromoja.com/fashion",social_link:"@yardiethreadz",call_to_action:"Shop Now",status:"active",is_featured:false,is_weekly_pick:true,promoter_slug:"island-vibes-promotions",posted_by:"promoter",views:5400,clicks:414,shares:86,interested_seed:61,rsvp_seed:0,guest_seed:0,vip_seed:0,birthday_seed:0,rsvp_limit:0},
  {id:6,title:"Fresh Cutz Spanish Town",slug:"fresh-cutz-spanish-town",category:"Services",description:"Fades, grooming packages, lashes, brows, and walk-ins.",poster_image_url:"https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",event_date:"",event_time:"",venue:"Fresh Cutz Studio",venue_slug:"",location:"Spanish Town Plaza",parish:"St. Catherine",price:"Cuts from JMD $1,500",phone:"+1 876 555 0106",whatsapp:"+18765550106",website_link:"https://yardpromoja.com/book",social_link:"@freshcutzja",call_to_action:"Book Now",status:"Pending review",is_featured:false,is_weekly_pick:false,promoter_slug:"",posted_by:"user",views:0,clicks:0,shares:0,interested_seed:0,rsvp_seed:0,guest_seed:0,vip_seed:0,birthday_seed:0,rsvp_limit:0}
];

export const campaigns = [
  ...
];
  {id:1,slug:"win-2-tickets-uptown-friday",type:"Share-to-Win",title:"Share to Win 2 Free Tickets",promo_slug:"uptown-friday-dancehall-party",reward:"2 free tickets",start_date:"2026-05-01",end_date:"2026-05-21",rules:"Share the campaign link and follow the campaign terms.",status:"active",featured:true,participants:128,shares:382,votes:0,rsvps:0,referrals:0,hashtag:""},
  {id:2,slug:"vote-next-reggae-guest",type:"Vote / Poll",title:"Choose the Next Guest Artist",promo_slug:"reggae-sunset-live",reward:"Fan choice announcement",start_date:"2026-05-01",end_date:"2026-05-20",rules:"One vote per visitor.",status:"active",featured:false,participants:244,shares:90,votes:244,rsvps:0,referrals:0,question:"Which guest artist should perform next?",options:["Roots Singer","Dancehall DJ","Soca Artist","Gospel Choir"],option_votes:[88,72,54,30],hashtag:""},
  {id:3,slug:"mobay-comedy-guest-list",type:"RSVP / Guest List",title:"Join the MoBay Comedy Guest List",promo_slug:"mobay-comedy-night",reward:"Early access seating",start_date:"2026-05-03",end_date:"2026-05-28",rules:"Guest list spots are limited and subject to confirmation.",status:"active",featured:true,participants:76,shares:61,votes:0,rsvps:76,referrals:0,hashtag:""},
  {id:4,slug:"yardpromo-weekend-hashtag",type:"Hashtag Challenge",title:"YardPromo Weekend Challenge",promo_slug:"uptown-friday-dancehall-party",reward:"Featured repost",start_date:"2026-05-01",end_date:"2026-05-31",rules:"Use the hashtag and follow campaign instructions.",status:"active",featured:false,participants:53,shares:47,votes:0,rsvps:0,referrals:0,hashtag:"#YardPromoWeekend"}
];

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
  return venues.find((venue) => venue.slug === slug);
}

export function getPromoter(slug) {
  return promoters.find((promoter) => promoter.slug === slug);
}
