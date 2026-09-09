import React, { useState, useEffect } from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { SceneDuration } from '@/types';
import { regenerateSceneVisual } from '@/services/ai/mediaGenerator';
import { generateWordTimings } from '@/services/ai/subtitlesGenerator';
import { ArrowLeft, ArrowRight, RefreshCw, Clock, Video, Camera, Volume2, Mic, Eye } from 'lucide-react';

export const Step4Storyboard: React.FC = () => {
  const { project, frameworks, updateScene, setStep } = useSystemStore();
  const [regeneratingIds, setRegeneratingIds] = useState<Record<string, boolean>>({});
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const selectedFw = frameworks.find((f) => f.id === project.frameworkId) || frameworks[0];
  const requiresScript = selectedFw.requiresSpokenScript ?? true;
  const isFixedDuration = !requiresScript || selectedFw.allowedDurations.length === 1;

  const totalDuration = project.scenes.reduce((acc, s) => acc + s.durationSec, 0);

  const handleDurationChange = (sceneId: string, duration: SceneDuration) => {
    const scene = project.scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    
    const updatedWords = generateWordTimings(scene.scriptText, duration);
    updateScene(sceneId, {
      durationSec: duration,
      words: updatedWords,
    });
  };

  const handleRegenerateImage = async (sceneId: string, prompt: string) => {
    setRegeneratingIds((prev) => ({ ...prev, [sceneId]: true }));
    setProgressMap((prev) => ({ ...prev, [sceneId]: 10 }));

    // Simular el efecto de llenado de agua/vaso progresivo (0% -> 100%)
    const interval = setInterval(() => {
      setProgressMap((prev) => {
        const current = prev[sceneId] || 10;
        if (current >= 90) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [sceneId]: current + Math.floor(Math.random() * 15 + 10) };
      });
    }, 300);

    try {
      const newMediaUrl = await regenerateSceneVisual(prompt, selectedFw.id);
      setProgressMap((prev) => ({ ...prev, [sceneId]: 100 }));
      setTimeout(() => {
        updateScene(sceneId, { mediaUrl: newMediaUrl });
        setRegeneratingIds((prev) => ({ ...prev, [sceneId]: false }));
        setProgressMap((prev) => ({ ...prev, [sceneId]: 0 }));
      }, 400);
    } catch (err) {
      console.error(err);
      setRegeneratingIds((prev) => ({ ...prev, [sceneId]: false }));
      setProgressMap((prev) => ({ ...prev, [sceneId]: 0 }));
    } finally {
      clearInterval(interval);
    }
  };

  const handleProceedToVideoGeneration = () => {
    setStep(5);
  };

  const ideaText = project.ideaPrompt ? `"${project.ideaPrompt}"` : '';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Superior */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex flex-wrap items-center gap-2">
            <span>Storyboard visual</span>
            {ideaText && <span className="text-slate-700 font-semibold">{ideaText}</span>}
            <span className="text-slate-500 font-normal">({project.scenes.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Revisa los visuales generados para cada escena. Puedes volver a generar las imágenes con el botón dentro de la imagen.
          </p>
        </div>

        {/* Duración Total Simplificada (Sin desglose repetido) */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shrink-0">
          <Clock className="w-4 h-4 text-slate-700" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Duración total</div>
            <div className="text-sm font-bold text-slate-900">{totalDuration}s</div>
          </div>
        </div>
      </div>

      {/* Grid de Escenas del Storyboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {project.scenes.map((scene, idx) => {
          const isRegenerating = regeneratingIds[scene.id];
          const fillPercentage = progressMap[scene.id] || 0;

          // Extracción inteligente de información estructurada por frame
          const visualConcept = scene.conceptOrReaction || scene.visualPrompt || scene.scriptText;
          const camera = scene.cameraMovement || (idx === 0 ? 'Toma macro frontal con zoom push-in' : 'Toma macro estable');
          const asmrSound = scene.asmrFx || 'Efecto crunch-crunch ASMR & destellos ✨';
          const voiceover = scene.scriptText && scene.scriptText !== scene.subjectOrItem ? scene.scriptText : null;
          const displayTitle = scene.subjectOrItem || scene.title || `Escena ${idx + 1}`;

          return (
            <div
              key={scene.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:border-slate-400 transition-all"
            >
              {/* Contenedor Superior: Preview 9:16 y Detalles Coherentes */}
              <div className="p-4 flex gap-4">
                {/* Visual Thumbnail 9:16 con Efecto Llenado de Vaso */}
                <div className="relative w-32 h-56 shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 group select-none">
                  <img
                    src={scene.mediaUrl}
                    alt={displayTitle}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isRegenerating ? 'brightness-50 blur-[2px]' : 'group-hover:scale-105'
                    }`}
                  />

                  {/* Animación de Llenado de Vaso (Liquid Fill Effect) */}
                  {isRegenerating && (
                    <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
                      <div
                        className="w-full bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700/80 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
                        style={{ height: `${fillPercentage}%` }}
                      >
                        {/* Onda / Brillo en el borde del agua */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/40 animate-pulse" />
                      </div>
                      
                      {/* Texto e icono flotantes en el centro de la imagen */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                        <RefreshCw className="w-6 h-6 text-white animate-spin mb-1.5 drop-shadow-md" />
                        <span className="text-[11px] font-bold text-white drop-shadow-md">{fillPercentage}%</span>
                        <span className="text-[9px] font-medium text-slate-200 drop-shadow-md">Generando 3D...</span>
                      </div>
                    </div>
                  )}

                  {/* Badge de Orden */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10">
                    Escena {idx + 1}
                  </div>

                  {/* Botón de Volver a hacer (Regenerar) dentro de la imagen */}
                  <button
                    type="button"
                    disabled={isRegenerating}
                    onClick={() => handleRegenerateImage(scene.id, scene.visualPrompt)}
                    className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/80 hover:bg-neutral-800 text-white backdrop-blur-sm border border-white/20 transition-all opacity-95 hover:opacity-100 active:scale-95 shadow-md flex items-center gap-1"
                    title="Volver a hacer imagen con IA"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Información Coherente y Estandarizada por Frame */}
                <div className="flex-1 flex flex-col justify-between space-y-2 min-w-0">
                  <div className="space-y-2">
                    {/* Titular con el alimento/protagonista */}
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <h3 className="font-bold text-slate-900 text-sm truncate max-w-[170px]" title={displayTitle}>
                        {displayTitle}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
                        {scene.durationSec}s
                      </span>
                    </div>

                    {/* 1. Concepto Visual */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                        <Eye className="w-3 h-3 text-slate-700 shrink-0" />
                        <span>Concepto visual:</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2 pl-4">
                        {visualConcept}
                      </p>
                    </div>

                    {/* 2. Movimiento de Cámara */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                        <Camera className="w-3 h-3 text-slate-700 shrink-0" />
                        <span>Movimiento de cámara:</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug pl-4">
                        {camera}
                      </p>
                    </div>

                    {/* 3. Efectos de Sonido */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                        <Volume2 className="w-3 h-3 text-slate-700 shrink-0" />
                        <span>Efectos de sonido:</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug pl-4">
                        {asmrSound}
                      </p>
                    </div>

                    {/* 4. Locución (Si hay o si no hay) */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                        <Mic className="w-3 h-3 text-slate-700 shrink-0" />
                        <span>Locución:</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug pl-4">
                        {voiceover ? `"${voiceover}"` : <span className="text-slate-400 italic">Sin locución (Efectos ASMR & Música)</span>}
                      </p>
                    </div>
                  </div>

                  {/* 5. Control de Video (Duración del clip) */}
                  <div className="pt-2 border-t border-slate-100">
                    {isFixedDuration ? (
                      <div className="text-[10px] text-slate-500 font-medium flex items-center justify-between">
                        <span>Control de video:</span>
                        <strong className="text-slate-800 font-semibold">{scene.durationSec}s (Fijo 9:16)</strong>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 block">
                          Control de video (Duración):
                        </label>
                        <div className="flex items-center gap-1.5">
                          {([6, 8, 10] as SceneDuration[]).map((dur) => (
                            <button
                              key={dur}
                              type="button"
                              onClick={() => handleDurationChange(scene.id, dur)}
                              className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                                scene.durationSec === dur
                                  ? 'btn-silver-luxury shadow-sm'
                                  : 'btn-arena hover:border-slate-400'
                              }`}
                            >
                              {dur}s
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navegación y Generación de Video */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep(requiresScript ? 3 : 2)}
          className="btn-arena inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{requiresScript ? 'Editar guion' : 'Volver a la idea'}</span>
        </button>

        <button
          type="button"
          onClick={handleProceedToVideoGeneration}
          className="btn-dark-luxury inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-xs shadow-md transition-all"
        >
          <Video className="w-4 h-4 text-slate-200" />
          <span>Generar video integrado escena por escena</span>
          <ArrowRight className="w-4 h-4 text-slate-200" />
        </button>
      </div>
    </div>
  );
};
