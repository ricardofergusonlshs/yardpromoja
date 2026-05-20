YardPromo Jamaica Services Header Update

Copy these files into your project:

components/AuthNav.js
app/services/page.js

What this does:
- Removes My Promos, Campaigns, Sale Offers, Premium, and Request Feature from the logged-in header.
- Adds one clean Services link to the logged-in header.
- Creates /services as a protected page.
- Keeps the existing individual pages working:
  /dashboard/promos
  /dashboard/campaigns
  /dashboard/sale-offers
  /advertise
  /premium
  /weekend
  /post-promo
  /account

After copying:
1. Restart your dev server.
2. Test logged out header:
   Home, Browse, Weekend, Calendar, Login
3. Test logged in header:
   Home, Browse, Weekend, Calendar, Dashboard, Post Promo, Services, Account, Logout
4. Visit /services while logged in.
5. Log out and visit /services. It should redirect to /login?next=/services.
