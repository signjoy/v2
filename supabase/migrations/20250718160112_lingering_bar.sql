/*
  # Create images storage bucket

  1. Storage
    - Create `images` bucket for storing vendor and catalog item images
    - Make bucket public for easy access
    - Set up storage policies for authenticated users

  2. Security
    - Allow authenticated users to upload images
    - Allow public access to read images
    - Allow authenticated users to delete their uploaded images
*/

-- Create the images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Allow public access to read images
CREATE POLICY "Allow public access to read images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'images');

-- Allow authenticated users to update images
CREATE POLICY "Allow authenticated users to update images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');