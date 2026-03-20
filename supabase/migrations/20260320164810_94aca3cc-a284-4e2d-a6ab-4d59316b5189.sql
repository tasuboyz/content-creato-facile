
-- Create enums
CREATE TYPE public.stato_media AS ENUM ('Vuoto', 'Caricato');
CREATE TYPE public.stato_social AS ENUM ('In corso', 'Bozza', 'Generato', 'Approvato', 'Pubblicato');

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome_post TEXT NOT NULL,
  media_group_id TEXT,
  png_attachments TEXT[] DEFAULT '{}',
  pdf_link TEXT,
  caption_instagram TEXT DEFAULT '',
  caption_linkedin TEXT DEFAULT '',
  note_correzione TEXT DEFAULT '',
  stato_png stato_media NOT NULL DEFAULT 'Vuoto',
  stato_pdf stato_media NOT NULL DEFAULT 'Vuoto',
  stato_linkedin stato_social NOT NULL DEFAULT 'Bozza',
  stato_instagram stato_social NOT NULL DEFAULT 'Bozza',
  pubblica_linkedin TIMESTAMP WITH TIME ZONE,
  pubblica_instagram TIMESTAMP WITH TIME ZONE,
  generato_il TIMESTAMP WITH TIME ZONE,
  pubblicato_il TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own posts" ON public.posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Settings table
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  webhook_genera_caption TEXT DEFAULT '',
  webhook_pubblica_linkedin TEXT DEFAULT '',
  webhook_pubblica_instagram TEXT DEFAULT '',
  linkedin_page_id TEXT DEFAULT '',
  instagram_account_id TEXT DEFAULT '',
  anthropic_api_key TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own settings" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.settings FOR UPDATE USING (auth.uid() = user_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for post images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true);

CREATE POLICY "Users can upload post media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Post media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'post-media');
CREATE POLICY "Users can update their post media" ON storage.objects FOR UPDATE USING (bucket_id = 'post-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their post media" ON storage.objects FOR DELETE USING (bucket_id = 'post-media' AND auth.uid()::text = (storage.foldername(name))[1]);
