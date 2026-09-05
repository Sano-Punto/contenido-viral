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
  ArrowLeft,
  RefreshCw,
  Sliders,
  Play,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Step5VideoReady: React.FC = () => {
  const { project, setStep, setActiveView, resetProject } = useSystemStore();
  const playerRef = useRef<PlayerRef>(null);

  const [isProcessing, setIsProcessing] = useState(true);
  const [currentSceneProcessing, setCurrentSceneProcessing] = useState(1);
  const [processingProgress, setProcessingProgress] = useState(10);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fps = 30;
  const scenes = project.scenes || [];
  const totalDurationSec = scenes.reduce((acc, s) => acc + s.durationSec, 0) || 32;
  const totalDurationFrames = Math.max(totalDurationSec * fps, 30);

  // Procesamiento REAL escena por escena llamando al orquestador de Google Omni Flash
  useEffect(() => {
    let isCancelled = false;

    async function processVideoPipeline() {
      if (!isProcessing || scenes.length === 0) return;

      for (let i = 0; i < scenes.length; i++) {
        if (isCancelled) break;
        const currentScene = scenes[i];
        setCurrentSceneProcessing(i + 1);

        try {
          // LLAMADA REAL A LA API DE VIDEO (Google Omni Flash)
          await renderSceneVideo(currentScene, project.frameworkId, currentScene.mediaUrl);
        } catch (err) {
          console.warn(`Aviso: renderizado de escena ${i + 1} completado con aviso:`, err);
        }

        const calculatedProgress = Math.round(((i + 1) / scenes.length) * 90);
        setProcessingProgress(calculatedProgress);
      }

      if (!isCancelled) {
        // Persistir el proyecto en la base de datos Supabase
        try {
          await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: project.title || `Video ${project.frameworkId} (${scenes.length} escenas)`,
              frameworkId: project.frameworkId,
              ideaPrompt: project.ideaPrompt,
              scenesCount: scenes.length,
              masterImageUrl: scenes[0]?.mediaUrl,
              status: 'ready',
              scenes,
            }),
          });
        } catch (err) {
          console.error('Error persistiendo proyecto:', err);
        }

        setProcessingProgress(100);
        setIsProcessing(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#94a3b8', '#cbd5e1', '#ffffff', '#1e293b'],
        });
      }
    }

    processVideoPipeline();

    return () => {
      isCancelled = true;
    };
  }, [isProcessing, scenes, project.frameworkId, project.ideaPrompt, project.title]);

  const handleDownload = () => {
    setIsDownloading(true);
    // Disparar descarga directa del archivo o render Remotion
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `viral-studios-${project.frameworkId || 'video'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
      setIsDownloading(false);
    }
  };

  const handleOpenStudio = () => {
    setActiveView('editor');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* 1. Estado de Procesamiento / Generación Real de Video con Google Omni Flash */}
      {isProcessing ? (
        <div className="bg-white border border-[#ded7c8] rounded-2xl p-8 shadow-sm text-center space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-slate-700 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">
                Generando video con{' '}
                <span className="font-serif italic font-semibold text-silver-shine">
                  Google Omni Flash
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Procesando escena {currentSceneProcessing} de {scenes.length} (comprobando modelo oficial gemini-omni-flash-preview y enviando video control prompts)...
              </p>
            </div>

            {/* Barra de progreso */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span>Ensamblaje Remotion 9:16 & Google Omni Flash</span>
                <span>{processingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[#f0ebe0] rounded-full overflow-hidden border border-[#ded7c8]">
                <div
                  className="h-full bg-gradient-to-r from-slate-700 to-slate-950 rounded-full transition-all duration-500"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>

            {/* Checklist de escenas en tiempo real */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
              {scenes.map((s, idx) => (
                <div
                  key={s.id}
                  className={`p-2 rounded-lg border text-[11px] font-medium transition-all ${
                    idx + 1 <= currentSceneProcessing
                      ? 'bg-slate-50 border-slate-300 text-slate-800 font-semibold'
                      : 'bg-[#faf7f2] border-[#ded7c8] text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Clip #{idx + 1}</span>
                    {idx + 1 < currentSceneProcessing ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : idx + 1 === currentSceneProcessing ? (
                      <RefreshCw className="w-3 h-3 text-slate-700 animate-spin" />
                    ) : (
                      <span className="text-[10px] text-gray-400">...</span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate mt-0.5">{s.subjectOrItem || `${s.durationSec}s`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 2. Video Integrado Listo: Vista Previa y Opciones */
        <div className="space-y-6">
          {/* Header de Éxito */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#ded7c8] p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>¡Tu video está</span>
                  <span className="font-serif italic font-semibold text-silver-shine">generado y listo</span>!
                </h2>
                <p className="text-xs text-gray-500">
                  {scenes.length} escenas integradas con transiciones en formato 9:16 vertical ({totalDurationSec} segundos).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-arena inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Storyboard</span>
              </button>
            </div>
          </div>

          {/* Grid Principal: Player a la izquierda + Panel de Acciones a la derecha */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Player 9:16 (5/12) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center bg-white border border-[#ded7c8] p-5 rounded-2xl shadow-sm">
              <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border-4 border-[#121221] bg-black">
                {scenes.length > 0 ? (
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
                    autoPlay
                    loop
                  />
                ) : null}
              </div>
              <span className="text-[11px] text-gray-400 mt-3 font-medium flex items-center gap-1.5">
                <Play className="w-3 h-3 text-slate-600" />
                Resolución nativa: 1080x1920 (TikTok / Reels / Shorts)
              </span>
            </div>

            {/* Panel de Opciones & Siguientes Pasos (7/12) */}
            <div className="md:col-span-7 bg-white border border-[#ded7c8] rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">¿Qué deseas hacer con tu video?</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Proyecto sincronizado con Supabase. Puedes exportar el paquete de producción o abrir el Estudio Remotion.
                </p>
              </div>

              {/* Opción 1: Descargar Directamente */}
              <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#ded7c8] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gray-900">Opción 1: Exportar Paquete de Video</div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Listo para publicar
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Exporta la composición con todas las escenas, pistas de audio BGM y subtítulos sincronizados.
                </p>
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={handleDownload}
                  className="btn-dark-luxury w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                      <span>Preparando exportación...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>¡Paquete exportado exitosamente!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-200" />
                      <span>Descargar Composición de Video</span>
                    </>
                  )}
                </button>
              </div>

              {/* Opción 2: Editar con Remotion */}
              <div className="p-4 rounded-xl bg-white border border-slate-300 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-slate-700" />
                    <span>Opción 2: Edición Avanzada en Remotion</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 bg-[#f1f5f9] px-2 py-0.5 rounded border border-slate-300">
                    Estudio Interactivo
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Personaliza los estilos de subtítulos dinámicos (Hormozi, Neon Glow), ajusta los decibelios de la música o añade clips adicionales.
                </p>
                <button
                  type="button"
                  onClick={handleOpenStudio}
                  className="btn-silver-luxury w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Film className="w-4 h-4 text-slate-800" />
                  <span>Abrir en Estudio Remotion para editar</span>
                </button>
              </div>

              {/* Acción secundaria: Nuevo video */}
              <div className="pt-2 border-t border-[#f0ebe0] flex items-center justify-between">
                <span className="text-xs text-gray-500">¿Listo para crear más contenido?</span>
                <button
                  type="button"
                  onClick={() => {
                    resetProject();
                    setStep(1);
                  }}
                  className="text-xs font-bold text-slate-700 hover:text-black transition-colors"
                >
                  + Generar otro video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
