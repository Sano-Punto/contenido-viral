'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSystemStore } from '@/store/useProjectStore';
import { Film, Download, Copy, Check, Sparkles, Clock, Layers, ArrowRight } from 'lucide-react';

interface SavedProject {
  id: string;
  title: string;
  framework_id: string;
  idea_prompt: string;
  scenes_count: number;
  master_image_url?: string;
  caption?: string;
  created_at: string;
  viral_scenes?: any[];
}

export const CreationsLibraryView: React.FC = () => {
  const router = useRouter();
  const { setScenes, setIdeaDetails, selectFramework, setCaption } = useSystemStore();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCreations() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (data.projects) {
            setProjects(data.projects);
          }
        }
      } catch (err) {
        console.error('Error cargando creaciones:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCreations();
  }, []);

  const handleOpenInStudio = (proj: SavedProject) => {
    selectFramework(proj.framework_id || 'super-alimentos');
    setIdeaDetails({
      ideaPrompt: proj.idea_prompt,
      scenesCount: proj.scenes_count,
    });
    if (proj.caption) {
      setCaption(proj.caption);
    }

    if (proj.viral_scenes && proj.viral_scenes.length > 0) {
      const mappedScenes = proj.viral_scenes.map((s: any) => ({
        id: s.id || `scene-${s.scene_order}`,
        order: s.scene_order,
        role: s.scene_order === 1 ? 'hook' : s.scene_order === proj.scenes_count ? 'cta' : 'body',
        title: s.title || `Escena ${s.scene_order}`,
        scriptText: s.voiceover_text || s.title || '',
        visualPrompt: s.visual_prompt || '',
        mediaUrl: s.media_url || proj.master_image_url || '',
        mediaType: s.media_type || 'image',
        durationSec: s.duration_sec || 8,
        subjectOrItem: s.subject_or_item,
        conceptOrReaction: s.concept_or_reaction,
        cameraMovement: s.camera_movement,
        asmrFx: s.asmr_fx,
        words: [],
      }));
      setScenes(mappedScenes as any);
    }

    router.push('/estudio-remotion');
  };

  const handleDownloadVideo = async (proj: SavedProject) => {
    const videoUrl = proj.viral_scenes?.[0]?.media_url || proj.master_image_url;
    if (!videoUrl) return;

    try {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `video-viral-${proj.title ? proj.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'creacion'}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleCopyCaption = (id: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Superior */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-slate-700" />
            <span>Biblioteca de creaciones</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Todos los videos generados y sincronizados en tu cuenta. Puedes volver a descargarlos, copiar sus captions o editarlos en el estudio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/generador-de-videos')}
          className="btn-dark-luxury inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-slate-200" />
          <span>Crear nuevo video</span>
        </button>
      </div>

      {/* Grid de Creaciones */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Cargando creaciones guardadas en la biblioteca...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mx-auto">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Aún no tienes creaciones guardadas</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Genera tu primer video en el asistente y se apilará automáticamente aquí con su caption y archivos de producción.
          </p>
          <button
            type="button"
            onClick={() => router.push('/generador-de-videos')}
            className="btn-dark-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs shadow-md"
          >
            <span>Ir al generador de videos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const thumbUrl = proj.viral_scenes?.[0]?.media_url || proj.master_image_url;
            const dateStr = new Date(proj.created_at).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={proj.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-slate-400 transition-all group"
              >
                <div>
                  {/* Thumbnail 9:16 Header */}
                  <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden border-b border-slate-100">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        Sin vista previa
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10">
                      {proj.scenes_count || 4} escenas
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      {dateStr}
                    </span>
                  </div>

                  {/* Info del Proyecto */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1" title={proj.title}>
                        {proj.title || 'Video Viral'}
                      </h3>
                      {proj.idea_prompt && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          "{proj.idea_prompt}"
                        </p>
                      )}
                    </div>

                    {/* Caption Preview & Copiar */}
                    {proj.caption && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Caption listo</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCaption(proj.id, proj.caption)}
                            className="text-[10px] font-bold text-slate-700 hover:text-black flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200"
                          >
                            {copiedId === proj.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed font-sans">
                          {proj.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadVideo(proj)}
                    className="btn-dark-luxury py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar MP4</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenInStudio(proj)}
                    className="btn-silver-luxury py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Editar Estudio</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
