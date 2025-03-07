
-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('properties', 'properties', true);

-- Set up policies to allow authenticated users to upload to their own folders
CREATE POLICY "Anyone can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'properties');

CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'properties');

CREATE POLICY "Users can update their own property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'properties' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'properties' AND auth.uid()::text = (storage.foldername(name))[1]);
