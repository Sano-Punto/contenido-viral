-- Esquema de Base de Datos para ViralStudio (Supabase PostgreSQL)

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PERFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'creator',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE FRAMEWORKS VIRALES
CREATE TABLE IF NOT EXISTS public.viral_frameworks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  viral_score INTEGER DEFAULT 95,
  badge TEXT,
  structure JSONB NOT NULL,
  recommended_scenes INTEGER DEFAULT 4,
  allowed_durations INTEGER[] DEFAULT '{6, 8, 10}',
  default_subtitle_style TEXT DEFAULT 'hormozi',
  default_bgm_genre TEXT DEFAULT 'Dark Phonk',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE PROYECTOS DE VIDEO
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  framework_id TEXT REFERENCES public.viral_frameworks(id),
  idea_prompt TEXT NOT NULL,
  target_audience TEXT,
  tone TEXT,
  scenes_count INTEGER NOT NULL DEFAULT 4,
  subtitle_style_id TEXT DEFAULT 'hormozi',
  bgm_track_id TEXT,
  bgm_volume NUMERIC(3, 2) DEFAULT 0.25,
  voiceover_volume NUMERIC(3, 2) DEFAULT 1.00,
  status TEXT DEFAULT 'draft',
  render_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA DE ESCENAS POR PROYECTO
CREATE TABLE IF NOT EXISTS public.scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  role TEXT NOT NULL, -- 'hook', 'body', 'climax', 'cta'
  title TEXT NOT NULL,
  script_text TEXT NOT NULL,
  visual_prompt TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image', -- 'image' | 'video'
  duration_sec INTEGER DEFAULT 6,
  audio_voice_url TEXT,
  words JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viral_frameworks ENABLE ROW LEVEL SECURITY;

-- Lectura pública de frameworks
CREATE POLICY "Frameworks visibles para todos" ON public.viral_frameworks
  FOR SELECT USING (true);

-- Acceso a proyectos del usuario autenticado
CREATE POLICY "Los usuarios pueden ver y editar sus propios proyectos" ON public.projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden ver y editar las escenas de sus proyectos" ON public.scenes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE public.projects.id = public.scenes.project_id
      AND public.projects.user_id = auth.uid()
    )
  );

-- BUCKETS DE ALMACENAMIENTO (Storage)
-- Insertar en storage.buckets: 'scene-media', 'audio-tracks', 'rendered-videos'
