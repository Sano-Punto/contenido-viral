'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { useSystemStore } from '@/store/useProjectStore';
import { ViralVideoComposition } from '@/components/remotion/ViralVideoComposition';
import { renderSceneVideo } from '@/services/ai/aiOrchestrator';
import {
  Download,
  Film,
  Sparkles,
  CheckCircle2,
  Sliders,
  Play,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';

export const Step5VideoReady: React.FC = () => {
  const router = useRouter();
  const { project, updateScene } = useSystemStore();
  const playerRef = useRef<PlayerRef>(null);

  const [isProcessing, setIsProcessing] = useState(true);
  const [currentSceneProcessing, setCurrentSceneProcessing] = useState(1);
  const [processingProgress, setProcessingProgress] = useState(10);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const fps = 30;
  const scenes = project.scenes || [];
  const totalDurationSec = scenes.reduce((acc, s) => acc + s.durationSec, 0) || 32;
  const totalDurationFrames = Math.max(totalDurationSec * fps, 30);

  // Procesamiento progresivo escena por escena llamando a Veo 3.1
  useEffect(() => {
    let isCancelled = false;

    async function processVideoPipeline() {
      if (!isProcessing || scenes.length === 0) return;

      const masterImg = scenes[0]?.mediaUrl;
      const finalScenes = [...scenes];

      for (let i = 0; i < scenes.length; i++) {
        if (isCancelled) break;
        const currentScene = scenes[i];
        setCurrentSceneProcessing(i + 1);

        try {
          // LLAMADA PROGRESIVA A VEO 3.1 CON FOTOGRAMA BASE OBLIGATORIO
          const videoResult = await renderSceneVideo(
            currentScene,
            project.frameworkId,
            currentScene.mediaUrl || masterImg
          );

          if (videoResult.videoUrl) {
            updateScene(currentScene.id, {
              mediaUrl: videoResult.videoUrl,
              mediaType: 'video',
            });
            finalScenes[i] = {
              ...finalScenes[i],
              mediaUrl: videoResult.videoUrl,
              mediaType: 'video',
            };
          }
        } catch (err) {
          console.warn(`Aviso: renderizado de escena ${i + 1}:`, err);
        }

        const calculatedProgress = Math.round(((i + 1) / scenes.length) * 90);
        setProcessingProgress(calculatedProgress);
      }

      if (!isCancelled) {
        // Persistir el proyecto completo en la base de datos Supabase
        try {
          await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: project.title || `Video ${project.frameworkId} (${scenes.length} escenas)`,
              frameworkId: project.frameworkId,
              ideaPrompt: project.ideaPrompt,
              scenesCount: scenes.length,
              masterImageUrl: masterImg,
              caption: project.caption,
              status: 'ready',
              scenes: finalScenes,
            }),
          });
        } catch (err) {
          console.error('Error persistiendo proyecto en Supabase:', err);
        }

        setProcessingProgress(100);
        setIsProcessing(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#475569', '#64748b', '#94a3b8', '#cbd5e1', '#ffffff'],
        });
      }
    }

    processVideoPipeline();

    return () => {
      isCancelled = true;
    };
  }, [isProcessing, scenes, project.frameworkId, project.ideaPrompt, project.title, project.caption]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const mediaUrl = scenes.find((s) => s.mediaUrl)?.mediaUrl || scenes[0]?.mediaUrl;
      if (mediaUrl) {
        const filename = `video-viral-${project.title ? project.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'final'}.mp4`;

        if (mediaUrl.startsWith('http')) {
          try {
            const res = await fetch(mediaUrl);
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
          } catch {
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
      }

      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
      setIsDownloading(false);
    }
  };

  const handleOpenStudio = () => {
    router.push('/estudio-viral');
  };

  const handleCopyCaption = () => {
    if (!project.caption) return;
    navigator.clipboard.writeText(project.caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* 1. Estado de Procesamiento Progresivo Escena por Escena */}
      {isProcessing ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-slate-700 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Generando video con IA Cinemática
              </h3>
              <p className="text-xs text-slate-500">
                Renderizando escena {currentSceneProcessing} de {scenes.length} (animación 3D y movimiento de cámara)...
              </p>
            </div>

            {/* Barra de progreso Plateada */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span>Composición vertical 9:16 & animación</span>
                <span>{processingProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 transition-all duration-500 rounded-full"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>

            {/* Grid de estado de escenas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
              {scenes.map((s, idx) => {
                const isDone = idx < currentSceneProcessing - 1 || processingProgress === 100;
                const isCurrent = idx === currentSceneProcessing - 1 && processingProgress < 100;

                return (
                  <div
                    key={s.id || idx}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-800'
                        : isCurrent
                        ? 'bg-slate-100 border-slate-400 text-slate-900 font-bold animate-pulse'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] font-bold">Clip {idx + 1}</div>
                    <div className="text-[10px] truncate mt-0.5">{s.subjectOrItem || `Escena ${idx + 1}`}</div>
                    <div className="text-[9px] mt-1">
                      {isDone ? '✓ Listo' : isCurrent ? '⏳ Animando...' : 'En espera'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* 2. Pantalla Final: Video Listo, Preview 9:16, Descarga y Caption */
        <div className="space-y-6">
          {/* Header Superior Limpio */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  ¡Tu video viral está listo!
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Composición completa ensamblada con {scenes.length} escenas, audio y subtítulos dinámicos.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="btn-dark-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all"
              >
                {isDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                    <span>Descargando...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Descargado!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-200" />
                    <span>Descargar MP4</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenStudio}
                className="btn-silver-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-900 shadow-sm transition-all"
              >
                <Sliders className="w-4 h-4" />
                <span>Editar en Estudio</span>
              </button>
            </div>
          </div>

          {/* Grid Principal: Player a la Izquierda + Panel de Opciones a la Derecha */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda: Reproductor Vertical 9:16 (5/12) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-sm">
              <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border-4 border-[#121221] bg-black">
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
                Formato Vertical 9:16 (1080x1920) · {totalDurationSec}s total
              </span>
            </div>

            {/* Columna Derecha: Opciones y Caption para Redes Sociales (7/12) */}
            <div className="md:col-span-7 space-y-4">
              {/* Bloque: ¿Qué deseas hacer con tu video? */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">
                  ¿Qué deseas hacer con tu video?
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Opción 1: Descargar */}
                  <div
                    onClick={handleDownload}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-400 transition-all cursor-pointer space-y-2 group shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Exportar MP4</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Descarga el video completo con todas las escenas unidas.
                      </p>
                    </div>
                  </div>

                  {/* Opción 2: Editar en Estudio */}
                  <div
                    onClick={handleOpenStudio}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-400 transition-all cursor-pointer space-y-2 group shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Edición en Estudio</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ajusta subtítulos, pistas de audio y efectos ASMR.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Caption Profesional para Redes Sociales con Botón Copiar */}
              {project.caption && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Caption para Redes Sociales</span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        TikTok / Reels
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCaption}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-all shadow-xs"
                    >
                      {copiedCaption ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copiar Caption</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="max-h-52 overflow-y-auto p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line font-sans leading-relaxed select-all">
                    {project.caption}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
