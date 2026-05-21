YardPromoJa Payment System Phase 1

This package adds the first secure payment flow for YardPromoJa:
- Paid services table
- Payments table
- Payment events table
- Bank transfer/manual proof upload flow
- Pricing page
- Checkout page
- Checkout success/cancel pages
- Customer payments page
- Admin payments review page
- Admin services/pricing page
- Storage bucket for payment proof uploads

Important:
Phase 1 does NOT process card numbers directly.
It does NOT store card numbers or CVV.
Bank transfer payments are marked pending_review until admin approval.

INSTALL ORDER
1. Run Supabase SQL: sql/payment_system_phase1_migration.sql.txt
2. Copy these files into your project:
   app/pricing/page.js
   app/checkout/page.js
   app/checkout/success/page.js
   app/checkout/cancel/page.js
   app/dashboard/payments/page.js
   app/admin/payments/page.js
   app/admin/services/page.js
   app/components/PaymentStatusBadge.js
3. Optional snippets are in the snippets folder.
4. Test /pricing, /checkout?service=featured-placement, /dashboard/payments, /admin/payments, /admin/services.
5. Commit and push.

SECURITY NOTES
- YardPromoJa never stores raw card details.
- Bank transfer payments require admin approval.
- Customers can only view their own payments.
- Admins can manage all payments.
- Payment proof uploads are stored in Supabase Storage.
- Future card payment gateways must use server routes/webhooks only.
- Do not expose payment gateway secret keys in client components.

IMPORTANT
Update bank account details in app/checkout/page.js.
Search for const BANK_DETAILS and replace placeholder values.
