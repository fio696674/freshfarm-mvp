-- ============================================================================
-- Fresh Farm MVP — Initial Schema Migration
-- ============================================================================
-- Enables pg_uuidv7, creates all core tables with CHECK constraints,
-- FK indexes, partial indexes, RLS policies, triggers, and role grants.
-- ============================================================================

-- ---------- Extensions ----------
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;

-- ---------- Helper: updated_at trigger ----------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- profiles (extends auth.users)
-- ============================================================================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'customer'
                CHECK (role IN ('customer', 'admin', 'driver')),
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_app_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- products
-- ============================================================================
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL CHECK (price > 0),
  image_url   TEXT,
  category    TEXT NOT NULL DEFAULT 'eggs',
  stock_qty   INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_products_is_active ON products (is_active) WHERE is_active = true;
CREATE INDEX idx_products_category ON products (category);

-- ============================================================================
-- orders
-- ============================================================================
CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN (
                        'pending', 'confirmed', 'preparing',
                        'out_for_delivery', 'delivered', 'cancelled'
                      )),
  delivery_method   TEXT NOT NULL DEFAULT 'delivery'
                      CHECK (delivery_method IN ('delivery', 'kiosk')),
  delivery_address  JSONB,
  total_amount      NUMERIC(10,2) NOT NULL DEFAULT 0,
  qr_code_token     TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Drivers can view assigned deliveries' orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM deliveries d
      WHERE d.order_id = orders.id
        AND d.driver_id = (select auth.uid())
    )
  );

CREATE POLICY "Drivers can update delivery status"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM deliveries d
      WHERE d.order_id = orders.id
        AND d.driver_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_delivery_address ON orders USING GIN (delivery_address);
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';

-- ============================================================================
-- order_items
-- ============================================================================
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);

-- ============================================================================
-- deliveries
-- ============================================================================
CREATE TABLE deliveries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  driver_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_type  TEXT NOT NULL DEFAULT 'bike'
                  CHECK (vehicle_type IN ('bike', 'car', 'van')),
  status        TEXT NOT NULL DEFAULT 'assigned'
                  CHECK (status IN (
                    'assigned', 'picked_up', 'in_transit',
                    'delivered', 'failed'
                  )),
  estimated_time  INTERVAL,
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can view own deliveries"
  ON deliveries FOR SELECT
  USING ((select auth.uid()) = driver_id);

CREATE POLICY "Drivers can update own deliveries"
  ON deliveries FOR UPDATE
  USING ((select auth.uid()) = driver_id)
  WITH CHECK ((select auth.uid()) = driver_id);

CREATE POLICY "Admins can manage all deliveries"
  ON deliveries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE TRIGGER deliveries_set_updated_at
  BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_deliveries_order_id ON deliveries (order_id);
CREATE INDEX idx_deliveries_driver_id ON deliveries (driver_id);
CREATE INDEX idx_deliveries_pending ON deliveries (created_at) WHERE status = 'assigned';

-- ============================================================================
-- kiosk_pickups
-- ============================================================================
CREATE TABLE kiosk_pickups (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  kiosk_code    TEXT NOT NULL,
  picked_up_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE kiosk_pickups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own kiosk pickups"
  ON kiosk_pickups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = kiosk_pickups.order_id
        AND orders.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can manage all kiosk pickups"
  ON kiosk_pickups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE INDEX idx_kiosk_pickups_order_id ON kiosk_pickups (order_id);

-- ============================================================================
-- campaigns
-- ============================================================================
CREATE TABLE campaigns (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  name          TEXT NOT NULL,
  description   TEXT,
  type          TEXT NOT NULL DEFAULT 'promo'
                  CHECK (type IN ('promo', 'referral', 'seasonal', 'loyalty')),
  discount_pct  NUMERIC(5,2) CHECK (discount_pct >= 0 AND discount_pct <= 100),
  code          TEXT UNIQUE,
  start_date    TIMESTAMPTZ,
  end_date      TIMESTAMPTZ,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active campaigns"
  ON campaigns FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage campaigns"
  ON campaigns FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE TRIGGER campaigns_set_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_campaigns_code ON campaigns (code) WHERE code IS NOT NULL;
CREATE INDEX idx_campaigns_active ON campaigns (start_date, end_date) WHERE is_active = true;

-- ============================================================================
-- ugc_submissions (user-generated content)
-- ============================================================================
CREATE TABLE ugc_submissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  caption     TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ugc_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved UGC"
  ON ugc_submissions FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can view own UGC"
  ON ugc_submissions FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create own UGC"
  ON ugc_submissions FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Admins can manage all UGC"
  ON ugc_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE TRIGGER ugc_submissions_set_updated_at
  BEFORE UPDATE ON ugc_submissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_ugc_submissions_user_id ON ugc_submissions (user_id);

-- ============================================================================
-- farm_locations
-- ============================================================================
CREATE TABLE farm_locations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  name        TEXT NOT NULL,
  address     TEXT NOT NULL,
  latitude    NUMERIC(9,6),
  longitude   NUMERIC(9,6),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE farm_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active farm locations"
  ON farm_locations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage farm locations"
  ON farm_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE TRIGGER farm_locations_set_updated_at
  BEFORE UPDATE ON farm_locations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- GRANTs — expose tables to anon/authenticated roles via Data API
-- ============================================================================
-- profiles
GRANT SELECT, INSERT ON profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

-- products
GRANT SELECT ON products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;

-- orders
GRANT SELECT, INSERT ON orders TO anon;
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;

-- order_items
GRANT SELECT, INSERT ON order_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON order_items TO authenticated;

-- deliveries
GRANT SELECT ON deliveries TO anon;
GRANT SELECT, INSERT, UPDATE ON deliveries TO authenticated;

-- kiosk_pickups
GRANT SELECT ON kiosk_pickups TO anon;
GRANT SELECT, INSERT, UPDATE ON kiosk_pickups TO authenticated;

-- campaigns
GRANT SELECT ON campaigns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaigns TO authenticated;

-- ugc_submissions
GRANT SELECT ON ugc_submissions TO anon;
GRANT SELECT, INSERT, UPDATE ON ugc_submissions TO authenticated;

-- farm_locations
GRANT SELECT ON farm_locations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON farm_locations TO authenticated;
