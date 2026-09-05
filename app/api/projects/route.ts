import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ projects: [] });
    }

    const { data: projects, error } = await supabaseServer
      .from('viral_projects')
      .select('*, viral_scenes(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ projects: [], error: error.message });
    }

    return NextResponse.json({ projects: projects || [] });
  } catch (error: any) {
    return NextResponse.json({ projects: [], error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      frameworkId,
      ideaPrompt,
      scenesCount,
      masterImageUrl,
      masterImagePrompt,
      status = 'storyboarding',
      scenes = [],
    } = body;

    if (!supabaseServer) {
      return NextResponse.json({ error: 'Supabase no inicializado' }, { status: 500 });
    }

    // 1. Insertar proyecto
    const { data: newProject, error: projectError } = await supabaseServer
      .from('viral_projects')
      .insert({
        title: title || 'Nuevo Video Viral',
        framework_id: frameworkId,
        idea_prompt: ideaPrompt,
        scenes_count: scenesCount || scenes.length,
        master_image_url: masterImageUrl,
        master_image_prompt: masterImagePrompt,
        status,
      })
      .select()
      .single();

    if (projectError) {
      throw projectError;
    }

    // 2. Insertar escenas si existen
    if (scenes.length > 0 && newProject) {
      const scenesToInsert = scenes.map((s: any, idx: number) => ({
        project_id: newProject.id,
        scene_order: s.order || idx + 1,
        title: s.title,
        subject_or_item: s.subjectOrItem,
        concept_or_reaction: s.conceptOrReaction,
        visual_prompt: s.visualPrompt,
        video_control_prompt: s.videoControlPrompt || s.visualPrompt,
        media_url: s.mediaUrl || masterImageUrl,
        media_type: s.mediaType || 'image',
        duration_sec: s.durationSec || 8,
        asmr_fx: s.asmrFx,
        voiceover_text: s.scriptText,
      }));

      await supabaseServer.from('viral_scenes').insert(scenesToInsert);
    }

    return NextResponse.json({ success: true, project: newProject });
  } catch (error: any) {
    console.error('Error saving project to Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
