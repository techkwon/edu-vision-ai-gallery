-- Add index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at 
ON generated_images(created_at DESC);

-- Add index on generation_requests created_at
CREATE INDEX IF NOT EXISTS idx_generation_requests_created_at 
ON generation_requests(created_at DESC);