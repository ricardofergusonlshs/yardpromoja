-- SECURITY_SQL_REVIEW.sql
-- Recommended Supabase Row Level Security policies for YardPromo.

-- 1. Enable RLS on each table:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE saved_promos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE interest_events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE promoter_follows ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE venue_follows ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- 2. Public read of approved/active ads:
-- Allow anonymous public select only on approved/active ads.
CREATE POLICY public_select_active_ads ON ads
  FOR SELECT
  USING (
    status IN ('active', 'approved')
  );

-- 3. User can create their own ads.
CREATE POLICY insert_own_ad ON ads
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending_review'
  );

-- 4. User can read/update only their own ads.
CREATE POLICY select_own_ads ON ads
  FOR SELECT
  USING (
    user_id = auth.uid()
  );

CREATE POLICY update_own_ads ON ads
  FOR UPDATE
  USING (
    user_id = auth.uid()
  )
  WITH CHECK (
    user_id = auth.uid()
  );

-- 5. Admin can manage all ads.
CREATE POLICY admin_manage_ads ON ads
  FOR ALL
  USING (
    auth.role() = 'authenticated' AND auth.jwt() ->> 'role' IN ('admin', 'super_admin')
  );

-- 6. User can read/update only their own profile.
CREATE POLICY select_own_profile ON profiles
  FOR SELECT
  USING (
    id = auth.uid()
  );

CREATE POLICY update_own_profile ON profiles
  FOR UPDATE
  USING (
    id = auth.uid()
  )
  WITH CHECK (
    id = auth.uid()
    AND role NOT IN ('admin', 'super_admin')
  );

-- 7. Prevent role elevation for normal profile updates.
CREATE POLICY prevent_public_role_change ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    role IN (SELECT role FROM auth.users WHERE id = auth.uid())
      OR auth.jwt() ->> 'role' IN ('admin', 'super_admin')
  );

-- 8. Allow authenticated users to manage their own saved promos and related user tables.
CREATE POLICY select_own_saved_promos ON saved_promos
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY insert_own_saved_promos ON saved_promos
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY update_own_saved_promos ON saved_promos
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY select_own_rsvps ON rsvps
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY insert_own_rsvps ON rsvps
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY select_own_interest_events ON interest_events
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY insert_own_interest_events ON interest_events
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY select_own_promoter_follows ON promoter_follows
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY insert_own_promoter_follows ON promoter_follows
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY select_own_venue_follows ON venue_follows
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY insert_own_venue_follows ON venue_follows
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY select_own_alerts ON alerts
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY insert_own_alerts ON alerts
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Note: Adjust auth.jwt() role logic based on how roles are embedded in your JWT.
-- If your Supabase project does not include a role claim, use a profile-based admin check in a function instead.
