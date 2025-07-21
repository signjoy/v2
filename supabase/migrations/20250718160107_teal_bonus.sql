/*
  # Create catalog items table

  1. New Tables
    - `catalog_items`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, foreign key to vendors)
      - `vendor_name` (text, not null)
      - `name` (text, not null)
      - `description` (text, optional)
      - `price` (decimal, not null)
      - `unit` (text, not null)
      - `image_url` (text, optional)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `catalog_items` table
    - Add policies for authenticated users to manage catalog items

  3. Indexes
    - Add index on vendor_id for faster queries
*/

CREATE TABLE IF NOT EXISTS catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  vendor_name text NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL,
  unit text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster vendor queries
CREATE INDEX IF NOT EXISTS idx_catalog_items_vendor_id ON catalog_items(vendor_id);

ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read catalog items"
  ON catalog_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert catalog items"
  ON catalog_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update catalog items"
  ON catalog_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete catalog items"
  ON catalog_items
  FOR DELETE
  TO authenticated
  USING (true);