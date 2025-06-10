
-- Add the missing columns to the travel_offers table
ALTER TABLE public.travel_offers 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[],
ADD COLUMN IF NOT EXISTS youtube_video TEXT;
