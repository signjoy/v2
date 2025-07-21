/*
  # Create vendors table

  1. New Tables
    - `vendors`
      - `id` (uuid, primary key)
      - `shop_name` (text, not null)
      - `location` (text, not null) 
      - `owner_name` (text, not null)
      - `phone` (text, not null)
      - `category` (text, not null)
      - `image_url` (text, optional)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `vendors` table
    - Add policy for authenticated users to read all vendors
    - Add policy for authenticated users to insert vendors
    - Add policy for authenticated users to update vendors
    - Add policy for authenticated users to delete vendors
*/

CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name text NOT NULL,
  location text NOT NULL,
  owner_name text NOT NULL,
  phone text NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read vendors"
  ON vendors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert vendors"
  ON vendors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update vendors"
  ON vendors
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete vendors"
  ON vendors
  FOR DELETE
  TO authenticated
  USING (true);