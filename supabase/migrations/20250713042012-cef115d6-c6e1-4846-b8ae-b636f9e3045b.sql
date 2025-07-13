-- Create a table for generated images
CREATE TABLE public.generated_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  style TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (anyone can view)
CREATE POLICY "Anyone can view generated images" 
ON public.generated_images 
FOR SELECT 
USING (true);

-- Create policy for public insert (anyone can create)
CREATE POLICY "Anyone can create generated images" 
ON public.generated_images 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_generated_images_updated_at
BEFORE UPDATE ON public.generated_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_generated_images_created_at ON public.generated_images(created_at DESC);