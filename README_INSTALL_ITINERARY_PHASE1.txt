YardPromoJa Itinerary Phase 1

This zip adds the starter itinerary feature for YardPromoJa.

Install order:
1. Run sql/itinerary_phase1_migration.sql.txt in Supabase SQL Editor.
2. Copy .js.txt files into the matching project paths and rename them to .js.
3. Add the AuthNav snippet so Itinerary appears in the header.
4. Test:
   /itinerary
   /itinerary/create
   /dashboard/itineraries
   /admin/itineraries

Important:
- Do not remove existing YardPromoJa promo/discovery features.
- Itinerary is added as a new layer.
- Private itineraries are visible only to owners.
- Public/published itineraries can be shared.
