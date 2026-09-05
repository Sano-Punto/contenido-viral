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
    model_name TEXT, -- 'nano-banana-pro' | 'google-omni-flash'
    call_type TEXT, -- 'single_master_image' | 'scene_video_render' | 'script_generation'
    request_payload JSONB,
    response_payload JSONB,
    latency_ms INTEGER,
    status TEXT, -- 'SUCCESS' | 'ERROR'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Insert initial Salud & Organos 3D framework data
INSERT INTO public.viral_frameworks (
    id, name, category, badge, description, image_generation_mode, image_model, video_model, default_scene_duration, requires_spoken_script
) VALUES 
(
    'super-alimentos', 
    'Super Alimentos para tu Órgano', 
    'Salud & Órganos 3D', 
    '🌟 Super Alimentos (Pixar 3D)', 
    'El órgano empieza cansado y, al ser alimentado, se cura e ilumina.', 
    'single_master', 
    'nano-banana-pro', 
    'google-omni-flash', 
    8, 
    false
),
(
    'alimentos-que-retan', 
    'Alimentos que retan tu Órgano', 
    'Salud & Órganos 3D', 
    '⚠️ Alimentos Dañinos (Pixar 3D)', 
    'El órgano inicia saludable y reacciona con fatiga al recibir mala comida.', 
    'single_master', 
    'nano-banana-pro', 
    'google-omni-flash', 
    8, 
    false
),
(
    'que-sucede-al-comer', 
    'Qué sucede en tu cuerpo al comer...', 
    'Salud & Órganos 3D', 
    '🔬 Viaje Biológico Cinemático', 
    'Viaje cinemático paso a paso por boca, estómago e hígado.', 
    'multi_scene', 
    'imagen-3', 
    'google-omni-flash', 
    8, 
    true
) ON CONFLICT (id) DO NOTHING;
