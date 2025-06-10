/*
  # Create categories table and update travel offers

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, category name)
      - `description` (text, optional description)
      - `image_url` (text, category image)
      - `min_price` (text, minimum price display)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)

  2. Changes
    - Add `category_id` to `travel_offers` table
    - Add foreign key constraint

  3. Security
    - Enable RLS on `categories` table
    - Add policies for authenticated users
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  min_price text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Add category_id to travel_offers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'travel_offers' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE travel_offers ADD COLUMN category_id uuid REFERENCES categories(id);
  END IF;
END $$;

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Users can read all categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);