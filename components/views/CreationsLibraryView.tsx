'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSystemStore } from '@/store/useProjectStore';
import { Player, PlayerRef } from '@remotion/player';
import { ViralVideoComposition } from '@/components/remotion/ViralVideoComposition';
import { Project } from '@/types';
import {
  Film,
  Download,
  Copy,
  Check,
  Sparkles,
  Clock,
  ArrowRight,
  Play,
  X,
  Sliders,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface SavedProject {
  id: string;
  title: string;
  framework_id: string;
  idea_prompt: string;
  scenes_count: number;
  master_image_url?: string;
  caption?: string;
  final_video_url?: string;
  created_at: string;
  viral_scenes?: any[];
}

export const CreationsLibraryView: React.FC = () => {
  const router = useRouter();
  const { setScenes, setIdeaDetails, selectFramework, setCaption } = useSystemStore();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Estado para el modal de vista previa
  const [previewProject, setPreviewProject] = useState<SavedProject | null>(null);
  const playerRef = useRef<PlayerRef>(null);

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
      scenesCount: proj.scenes_count || proj.viral_scenes?.length || 4,
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

  const handleDownloadVideo = async (proj: SavedProject, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(proj.id);

    try {
      const mediaUrl = proj.final_video_url || proj.viral_scenes?.[0]?.media_url || proj.master_image_url;
      if (!mediaUrl) {
        setDownloadingId(null);
        return;
      }

      const filename = `video-viral-${proj.title ? proj.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'creacion'}.mp4`;

      // Si es una URL remota de Storage o externa, intentar descargar como blob
      if (mediaUrl.startsWith('http')) {
        try {
          const response = await fetch(mediaUrl);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(blobUrl);
        } catch {
          // Fallback a enlace directo
          const a = document.createElement('a');
          a.href = mediaUrl;
          a.download = filename;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      } else {
        const a = document.createElement('a');
        a.href = mediaUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error('Error al descargar:', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  const handleCopyCaption = (id: string, text?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Construir objeto Project para el Remotion Player en el modal
  const buildRemotionProject = (proj: SavedProject): Project => {
    const scenes = (proj.viral_scenes && proj.viral_scenes.length > 0)
      ? proj.viral_scenes.map((s: any, idx: number) => ({
          id: s.id || `scene-${idx + 1}`,
          order: s.scene_order || idx + 1,
          role: (s.scene_order === 1 ? 'hook' : s.scene_order === proj.scenes_count ? 'cta' : 'body') as any,
          title: s.title || `Escena ${idx + 1}`,
          scriptText: s.voiceover_text || s.title || '',
          visualPrompt: s.visual_prompt || '',
          mediaUrl: s.media_url || proj.master_image_url || '',
          mediaType: (s.media_type || 'image') as any,
          durationSec: s.duration_sec || 8,
          subjectOrItem: s.subject_or_item || '',
          conceptOrReaction: s.concept_or_reaction || '',
          cameraMovement: s.camera_movement || '',
          asmrFx: s.asmr_fx || '',
          words: [],
        }))
      : [
          {
            id: 'scene-1',
            order: 1,
            role: 'hook' as any,
            title: proj.title || 'Escena 1',
            scriptText: proj.title || '',
            visualPrompt: '',
            mediaUrl: proj.master_image_url || '',
            mediaType: 'image' as any,
            durationSec: 8,
            subjectOrItem: '',
            conceptOrReaction: '',
            cameraMovement: '',
            asmrFx: '',
            words: [],
          },
        ];

    return {
      id: proj.id,
      title: proj.title || 'Video Viral',
      frameworkId: proj.framework_id || 'super-alimentos',
      ideaPrompt: proj.idea_prompt || '',
      targetAudience: 'General',
      tone: 'Viral',
      scenesCount: scenes.length,
      subtitleStyleId: 'hormozi',
      bgmTrackId: 'bgm-energetic-phonk',
      bgmVolume: 0.25,
      voiceoverVolume: 1.0,
      scenes,
      caption: proj.caption,
      status: 'ready',
      createdAt: proj.created_at || new Date().toISOString(),
      updatedAt: proj.created_at || new Date().toISOString(),
    };
  };

  const previewRemotionProject = previewProject ? buildRemotionProject(previewProject) : null;
  const previewTotalDurationSec = previewRemotionProject?.scenes?.reduce((acc, s) => acc + s.durationSec, 0) || 24;
  const previewTotalFrames = Math.max(previewTotalDurationSec * 30, 30);

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
            Todos los videos generados y sincronizados en tu cuenta. Haz clic en cualquiera para previsualizarlo, descargarlo o editarlo en el estudio.
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
            Genera tu primer video en el asistente y se apilará automáticamente aquí con su almacenamiento en la nube, caption y archivos de producción.
          </p>
          <button
            type="button"
            onClick={() => router.push('/generador-de-videos')}
            className="btn-dark-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs shadow-md mt-2"
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
            const isDownloading = downloadingId === proj.id;

            return (
              <div
                key={proj.id}
                onClick={() => setPreviewProject(proj)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-slate-400 hover:shadow-md transition-all group cursor-pointer"
              >
                <div>
                  {/* Thumbnail 16:9 con Overlay de Play */}
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

                    {/* Botón Play flotante al pasar el cursor */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <div className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                      </div>
                    </div>

                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10">
                      {proj.scenes_count || proj.viral_scenes?.length || 4} escenas
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      {dateStr}
                    </span>
                  </div>

                  {/* Info del Proyecto */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-black" title={proj.title}>
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
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Caption listo</span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyCaption(proj.id, proj.caption, e)}
                            className="text-[10px] font-bold text-slate-700 hover:text-black flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs"
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

                {/* Botones de Acción Funcionales */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={(e) => handleDownloadVideo(proj, e)}
                    className="btn-dark-luxury py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                        <span>Descargando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar MP4</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenInStudio(proj);
                    }}
                    className="btn-silver-luxury py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all text-slate-800"
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

      {/* POP-UP MODAL DE VISTA PREVIA DEL VIDEO */}
      {previewProject && previewRemotionProject && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewProject(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    {previewProject.framework_id || 'Nutrición'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {previewProject.scenes_count || previewRemotionProject.scenes.length} escenas · {previewTotalDurationSec}s
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {previewProject.title || 'Vista Previa del Video'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido: Player 9:16 + Panel de Detalles */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Player 9:16 (5/12) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="relative w-full max-w-[260px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border-4 border-[#121221] bg-black">
                  <Player
                    ref={playerRef}
                    component={ViralVideoComposition}
                    inputProps={{ project: previewRemotionProject }}
                    durationInFrames={previewTotalFrames}
                    fps={30}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    controls
                    autoPlay
                    loop
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-3 font-medium flex items-center gap-1">
                  <Play className="w-3 h-3 text-slate-500" />
                  Formato vertical 9:16 (1080x1920)
                </span>
              </div>

              {/* Detalles & Acciones (7/12) */}
              <div className="md:col-span-7 space-y-4">
                {/* Idea original */}
                {previewProject.idea_prompt && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Concepto</span>
                    <p className="text-xs font-semibold text-slate-800">
                      "{previewProject.idea_prompt}"
                    </p>
                  </div>
                )}

                {/* Caption Profesional */}
                {previewProject.caption && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Caption para redes</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCaption(previewProject.id, previewProject.caption)}
                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-[10px] font-bold text-slate-700 flex items-center gap-1 hover:bg-slate-100 transition-all shadow-xs"
                      >
                        {copiedId === previewProject.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copiar Caption</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="max-h-36 overflow-y-auto p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700 whitespace-pre-line font-sans leading-relaxed select-all">
                      {previewProject.caption}
                    </div>
                  </div>
                )}

                {/* Desglose de Escenas */}
                {previewRemotionProject.scenes.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Escenas ({previewRemotionProject.scenes.length})</span>
                    <div className="grid grid-cols-2 gap-2 max-h-28 overflow-y-auto pr-1">
                      {previewRemotionProject.scenes.map((s, idx) => (
                        <div key={s.id || idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                          <span className="font-bold text-slate-800 block truncate">#{idx + 1} {s.title}</span>
                          <span className="text-[10px] text-slate-500">{s.durationSec}s · {s.subjectOrItem || 'Escena'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botones Principales en Modal */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={downloadingId === previewProject.id}
                    onClick={() => handleDownloadVideo(previewProject)}
                    className="btn-dark-luxury py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {downloadingId === previewProject.id ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                        <span>Descargando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Descargar MP4</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenInStudio(previewProject)}
                    className="btn-silver-luxury py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all text-slate-900"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Abrir en Estudio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
