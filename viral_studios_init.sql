-- ==============================================================================
-- VIRAL STUDIOS - SUPABASE INITIALIZATION MIGRATION
-- ==============================================================================

-- 1. Create the viral_frameworks table
CREATE TABLE IF NOT EXISTS public.viral_frameworks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    badge TEXT,
    description TEXT,
    image_generation_mode TEXT NOT NULL, -- 'single_master' | 'multi_scene'
    image_model TEXT NOT NULL,
    video_model TEXT NOT NULL,
    prompt_template TEXT,
    video_control_rules JSONB,
    asmr_config JSONB,
    default_scene_duration INTEGER DEFAULT 8,
    requires_spoken_script BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the viral_projects table
CREATE TABLE IF NOT EXISTS public.viral_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    framework_id TEXT REFERENCES public.viral_frameworks(id),
    idea_prompt TEXT,
    scenes_count INTEGER,
    master_image_url TEXT,
    master_image_prompt TEXT,
    caption TEXT,
    final_video_url TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'scripting', 'storyboarding', 'ready', 'rendering', 'exported'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the viral_scenes table
CREATE TABLE IF NOT EXISTS public.viral_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.viral_projects(id) ON DELETE CASCADE,
    scene_order INTEGER NOT NULL,
    title TEXT,
    subject_or_item TEXT,
    concept_or_reaction TEXT,
    visual_prompt TEXT,
    video_control_prompt TEXT,
    media_url TEXT,
    media_type TEXT DEFAULT 'image',
    duration_sec INTEGER DEFAULT 8,
    asmr_fx TEXT,
    voiceover_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create the viral_generation_logs table for AI traceability
CREATE TABLE IF NOT EXISTS public.viral_generation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.viral_projects(id) ON DELETE SET NULL,
    framework_id TEXT,
    model_name TEXT,
    call_type TEXT,
    request_payload JSONB,
    response_payload JSONB,
    latency_ms INTEGER,
    status TEXT, -- 'SUCCESS' | 'ERROR'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Insert initial framework data
INSERT INTO public.viral_frameworks (
    id, name, category, badge, description, image_generation_mode, image_model, video_model, default_scene_duration, requires_spoken_script
) VALUES 
(
    'super-alimentos', 
    'Super Alimentos para tu Órgano', 
    'Nutrición', 
    '🌟 Super Alimentos (3D)', 
    'El órgano empieza cansado y, al ser alimentado, se cura e ilumina.', 
    'single_master', 
    'image-3d-high-res', 
    'video-render-engine', 
    8, 
    false
),
(
    'alimentos-que-retan', 
    'Alimentos que retan tu Órgano', 
    'Nutrición', 
    '⚠️ Alimentos Dañinos (3D)', 
    'El órgano inicia saludable y reacciona con fatiga al recibir mala comida.', 
    'single_master', 
    'image-3d-high-res', 
    'video-render-engine', 
    8, 
    false
),
(
    'que-sucede-al-comer', 
    'Qué sucede en tu cuerpo al comer...', 
    'Nutrición', 
    '🔬 Viaje Biológico Cinemático', 
    'Viaje cinemático paso a paso por boca, estómago e hígado.', 
    'multi_scene', 
    'image-3d-high-res', 
    'video-render-engine', 
    8, 
    true
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 6. STORAGE BUCKETS
-- ==============================================================================
-- Crear buckets para almacenamiento persistente de medios generados
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('viral-images', 'viral-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('viral-videos', 'viral-videos', true, 104857600, ARRAY['video/mp4', 'video/webm']),
  ('viral-renders', 'viral-renders', true, 524288000, ARRAY['video/mp4', 'video/webm'])
ON CONFLICT (id) DO NOTHING;

-- Políticas de lectura pública
CREATE POLICY "Lectura publica viral-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'viral-images');

CREATE POLICY "Lectura publica viral-videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'viral-videos');

CREATE POLICY "Lectura publica viral-renders" ON storage.objects
  FOR SELECT USING (bucket_id = 'viral-renders');

-- Políticas de escritura (INSERT)
CREATE POLICY "Upload viral-images service" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'viral-images');

CREATE POLICY "Upload viral-videos service" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'viral-videos');

CREATE POLICY "Upload viral-renders service" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'viral-renders');

-- Políticas de eliminación (DELETE)
CREATE POLICY "Delete viral-images service" ON storage.objects
  FOR DELETE USING (bucket_id = 'viral-images');

CREATE POLICY "Delete viral-videos service" ON storage.objects
  FOR DELETE USING (bucket_id = 'viral-videos');

CREATE POLICY "Delete viral-renders service" ON storage.objects
  FOR DELETE USING (bucket_id = 'viral-renders');
