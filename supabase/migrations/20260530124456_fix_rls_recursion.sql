-- Fix infinite recursion in profiles RLS policies
-- Admin policies on profiles query profiles itself = recursion.
-- Fix: SECURITY DEFINER helper function that bypasses RLS.

-- 1. Create SECURITY DEFINER helper
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  );
$$;

-- 2. Fix profiles table (source of recursion)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING ((select is_admin()));

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE USING ((select is_admin()));

-- 3. Fix other admin policies (already had correct function call from first migration, but let's be safe)
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products"
  ON products FOR ALL USING ((select is_admin()));

DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL USING ((select is_admin()));

DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;
CREATE POLICY "Admins can manage all order items"
  ON order_items FOR ALL USING ((select is_admin()));

DROP POLICY IF EXISTS "Admins can manage all deliveries" ON deliveries;
CREATE POLICY "Admins can manage all deliveries"
  ON deliveries FOR ALL USING ((select is_admin()));

DROP POLICY IF EXISTS "Admins can manage all kiosk pickups" ON kiosk_pickups;
CREATE POLICY "Admins can manage all kiosk pickups"
  ON kiosk_pickups FOR ALL USING ((select is_admin()));

DROP POLICY IF EXISTS "Admins can manage campaigns" ON campaigns;
CREATE POLICY "Admins can manage campaigns"
  ON campaigns FOR ALL USING ((select is_admin()));

DROP POLICY IF EXISTS "Admins can manage all UGC" ON ugc_submissions;
CREATE POLICY "Admins can manage all UGC"
  ON ugc_submissions FOR ALL USING ((select is_admin()));

DROP POLICY IF EXISTS "Admins can manage farm locations" ON farm_locations;
CREATE POLICY "Admins can manage farm locations"
  ON farm_locations FOR ALL USING ((select is_admin()));
