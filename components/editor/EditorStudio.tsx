'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { useSystemStore } from '@/store/useProjectStore';
import { ViralVideoComposition } from '@/components/remotion/ViralVideoComposition';
import { TimelineEditor } from './TimelineEditor';
import { SubtitleCustomizer } from './SubtitleCustomizer';
import { AudioControls } from './AudioControls';
import { useRouter } from 'next/navigation';
import {
  Download,
  Type,
  Music,
  CheckCircle,
  Layers,
  Film,
  Sparkles,
  ChevronDown,
  Clock,
  Play,
  FolderOpen,
  ArrowRight,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateWordTimings } from '@/services/ai/subtitlesGenerator';

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

export const EditorStudio: React.FC = () => {
  const router = useRouter();
  const { project, setScenes, setIdeaDetails, selectFramework, setCaption } = useSystemStore();
  const playerRef = useRef<PlayerRef>(null);

  const [activeTab, setActiveTab] = useState<'subtitles' | 'audio' | 'scenes'>('subtitles');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Lista de proyectos de la biblioteca para selector
  const [availableProjects, setAvailableProjects] = useState<SavedProject[]>([]);
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const fps = 30;
  const scenes = project.scenes || [];
  const totalDurationSec = scenes.reduce((acc, s) => acc + s.durationSec, 0) || 24;
  const totalDurationFrames = Math.max(totalDurationSec * fps, 30);

  // Cargar proyectos disponibles desde la base de datos
  useEffect(() => {
    async function loadLibraryProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (data.projects) {
            setAvailableProjects(data.projects);
          }
        }
      } catch (err) {
        console.error('Error cargando proyectos en el estudio:', err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadLibraryProjects();
  }, []);

  // Sincronizar frame y estado de reproducción desde Remotion Player
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const frame = playerRef.current.getCurrentFrame();
        if (typeof frame === 'number') {
          setCurrentFrame(frame);
        }
        setIsPlaying(playerRef.current.isPlaying());
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Cargar proyecto seleccionado en el estado global
  const handleSelectProject = (proj: SavedProject) => {
    selectFramework(proj.framework_id || 'super-alimentos');
    setIdeaDetails({
      ideaPrompt: proj.idea_prompt,
      scenesCount: proj.scenes_count || proj.viral_scenes?.length || 4,
    });
    if (proj.caption) {
      setCaption(proj.caption);
    }

    if (proj.viral_scenes && proj.viral_scenes.length > 0) {
      const mappedScenes = proj.viral_scenes.map((s: any) => {
        const text = s.voiceover_text || s.title || '';
        const dur = s.duration_sec || 8;
        const words = generateWordTimings(text, dur);

        return {
          id: s.id || `scene-${s.scene_order}`,
          order: s.scene_order,
          role: (s.scene_order === 1 ? 'hook' : s.scene_order === proj.scenes_count ? 'cta' : 'body') as any,
          title: s.title || `Escena ${s.scene_order}`,
          scriptText: text,
          visualPrompt: s.visual_prompt || '',
          mediaUrl: s.media_url || proj.master_image_url || '',
          mediaType: (s.media_type || 'image') as any,
          durationSec: dur,
          subjectOrItem: s.subject_or_item,
          conceptOrReaction: s.concept_or_reaction,
          cameraMovement: s.camera_movement,
          asmrFx: s.asmr_fx,
          words,
        };
      });
      setScenes(mappedScenes);
    }

    setIsProjectSelectorOpen(false);
  };

  const handleTogglePlay = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isPlaying()) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (frame: number) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(frame);
    setCurrentFrame(frame);
  };

  const handleExport = () => {
    setIsExporting(true);

    const mediaUrl = project.generatedVideoUrl || scenes.find((s) => s.mediaUrl)?.mediaUrl || scenes[0]?.mediaUrl;
    const filename = `video-viral-${project.title ? project.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'edicion'}.mp4`;

    setTimeout(() => {
      if (mediaUrl) {
        try {
          const a = document.createElement('a');
          a.href = mediaUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch {
          window.open(mediaUrl, '_blank');
        }
      }

      setIsExporting(false);
      setExportSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#475569', '#64748b', '#94a3b8', '#cbd5e1', '#ffffff'],
      });
      setTimeout(() => setExportSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Superior del Editor (Limpio, sin botón de retroceso) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate max-w-md">
              {project.title || 'Estudio Viral'}
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300 uppercase tracking-wider">
              9:16 Vertical
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Estudio viral de edición con subtítulos dinámicos y audio sincronizado
          </p>
        </div>

        {/* Acciones: Selector de Video + Exportar */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto relative">
          {/* Botón Selector de Video */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)}
              className="btn-silver-luxury inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 shadow-xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-700" />
              <span>Cambiar video</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown flotante con lista de videos */}
            {isProjectSelectorOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Biblioteca de Creaciones
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1">
                  {loadingProjects ? (
                    <div className="p-4 text-center text-slate-400 text-xs">Cargando...</div>
                  ) : availableProjects.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      No hay creaciones guardadas en tu biblioteca aún.
                    </div>
                  ) : (
                    availableProjects.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProject(p)}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center gap-2.5 ${
                          project.id === p.id
                            ? 'bg-slate-100 font-bold text-slate-900'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {p.master_image_url || p.viral_scenes?.[0]?.media_url ? (
                          <img
                            src={p.master_image_url || p.viral_scenes?.[0]?.media_url}
                            alt=""
                            className="w-7 h-9 rounded object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-9 rounded bg-slate-100 flex items-center justify-center shrink-0">
                            <Film className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold text-slate-900">{p.title || 'Video'}</div>
                          <div className="text-[10px] text-slate-400">{p.scenes_count || 4} escenas</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => router.push('/generador-de-videos')}
                    className="w-full py-1.5 px-2 text-[11px] font-bold text-slate-700 hover:text-black hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Crear nuevo video</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botón Principal de Exportar */}
          <button
            type="button"
            disabled={isExporting || scenes.length === 0}
            onClick={handleExport}
            className="btn-dark-luxury inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl disabled:opacity-50 text-xs shadow-md transition-all"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                <span>Exportando...</span>
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>¡Descargado!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-200" />
                <span>Exportar MP4</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid Central: Player a la izquierda + Panel de Herramientas a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Reproductor 9:16 o Selector cuando no hay video (5/12) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-sm min-h-[500px]">
          {scenes.length > 0 ? (
            <>
              <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border-4 border-[#121221] bg-black">
                <Player
                  ref={playerRef}
                  component={ViralVideoComposition}
                  inputProps={{ project }}
                  durationInFrames={totalDurationFrames}
                  fps={fps}
                  compositionWidth={1080}
                  compositionHeight={1920}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  controls
                  autoPlay={false}
                  loop
                />
              </div>

              <span className="text-[11px] text-slate-400 mt-3 font-medium flex items-center gap-1">
                <Play className="w-3 h-3 text-slate-500" />
                Resolución 1080x1920 (TikTok / Reels / Shorts)
              </span>
            </>
          ) : (
            /* Empty State con Selector de Creaciones */
            <div className="w-full text-center space-y-4 py-8 px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 mx-auto">
                <Film className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Selecciona un video para editar</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Elige una creación guardada de tu biblioteca para personalizar sus subtítulos, música y escenas en el estudio:
                </p>
              </div>

              {availableProjects.length > 0 ? (
                <div className="space-y-2 max-w-sm mx-auto text-left pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                    Creaciones en tu biblioteca:
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {availableProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProject(p)}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-400 cursor-pointer transition-all flex items-center justify-between gap-2 shadow-xs group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {p.master_image_url || p.viral_scenes?.[0]?.media_url ? (
                            <img
                              src={p.master_image_url || p.viral_scenes?.[0]?.media_url}
                              alt=""
                              className="w-9 h-11 rounded-lg object-cover shrink-0 border border-slate-200"
                            />
                          ) : (
                            <div className="w-9 h-11 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                              <Film className="w-4 h-4 text-slate-500" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-black">
                              {p.title || 'Video Viral'}
                            </h4>
                            <span className="text-[10px] text-slate-500">
                              {p.scenes_count || 4} escenas · {p.framework_id || 'Nutrición'}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-slate-700 bg-white group-hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 shrink-0">
                          Abrir →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push('/generador-de-videos')}
                  className="btn-dark-luxury inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-slate-200" />
                  <span>Crear mi primer video</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Columna Derecha: Panel de Herramientas de Edición (7/12) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col h-full min-h-[500px]">
          {/* Tabs de Edición */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200 mb-5">
            <button
              type="button"
              onClick={() => setActiveTab('subtitles')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'subtitles'
                  ? 'btn-silver-luxury text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Subtítulos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'audio'
                  ? 'btn-silver-luxury text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Música & audio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('scenes')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'scenes'
                  ? 'btn-silver-luxury text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Escenas ({scenes.length})</span>
            </button>
          </div>

          {/* Contenido de la pestaña activa */}
          <div className="flex-1 overflow-y-auto pr-1">
            {activeTab === 'subtitles' && <SubtitleCustomizer />}
            {activeTab === 'audio' && <AudioControls />}
            {activeTab === 'scenes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs">Desglose de escenas ({scenes.length})</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{totalDurationSec}s total</span>
                </div>

                {scenes.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
                    No hay escenas configuradas. Selecciona un video de tu biblioteca.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scenes.map((s, idx) => (
                      <div
                        key={s.id || idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={s.mediaUrl}
                            alt=""
                            className="w-10 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 truncate">
                              #{idx + 1} {s.subjectOrItem || s.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {s.scriptText || s.conceptOrReaction}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                          {s.durationSec}s
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TIMELINE MULTI-TRACK INFERIOR (TIPO CAPCUT) */}
      <TimelineEditor
        currentFrame={currentFrame}
        totalDurationSec={totalDurationSec}
        fps={fps}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
      />
    </div>
  );
};
