/*
  # Fix RLS policies for public access

  1. Security Updates
    - Update travel_offers table RLS policies to allow public read access
    - Ensure categories can be read by anonymous users
    - Fix authentication requirements

  2. Changes
    - Allow anonymous users to read travel offers
    - Allow anonymous users to read categories
    - Keep write operations restricted to authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view offers for public display" ON travel_offers;
DROP POLICY IF EXISTS "Enable read access for all users" ON travel_offers;
DROP POLICY IF EXISTS "Users can view their own offers" ON travel_offers;

-- Create new policies for travel_offers
CREATE POLICY "Public can view all offers"
  ON travel_offers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert offers"
  ON travel_offers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own offers"
  ON travel_offers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own offers"
  ON travel_offers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update categories policies
DROP POLICY IF EXISTS "Users can read all categories" ON categories;

CREATE POLICY "Public can read all categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE travel_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;