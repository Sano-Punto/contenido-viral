import React, { useState } from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { SceneDuration } from '@/types';
import { regenerateSceneVisual } from '@/services/ai/mediaGenerator';
import { generateWordTimings } from '@/services/ai/subtitlesGenerator';
import { ArrowLeft, ArrowRight, RefreshCw, Clock, Image as ImageIcon, Sparkles, Video } from 'lucide-react';

export const Step4Storyboard: React.FC = () => {
  const { project, frameworks, updateScene, setStep } = useSystemStore();
  const [regeneratingIds, setRegeneratingIds] = useState<Record<string, boolean>>({});
  const [isCascading, setIsCascading] = useState(false);

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
    try {
      const newMediaUrl = await regenerateSceneVisual(prompt, selectedFw.id);
      updateScene(sceneId, { mediaUrl: newMediaUrl });
    } catch (err) {
      console.error(err);
    } finally {
      setRegeneratingIds((prev) => ({ ...prev, [sceneId]: false }));
    }
  };

  const handleCascadeRegenerate = async () => {
    if (project.scenes.length === 0 || isCascading) return;
    setIsCascading(true);
    try {
      const masterPrompt = project.scenes[0]?.visualPrompt || project.ideaPrompt || '3D Pixar character';
      const newMediaUrl = await regenerateSceneVisual(masterPrompt, selectedFw.id);
      project.scenes.forEach((scene) => {
        updateScene(scene.id, { mediaUrl: newMediaUrl });
      });
    } catch (err) {
      console.error('Error al regenerar en cascada:', err);
    } finally {
      setIsCascading(false);
    }
  };

  const handleProceedToVideoGeneration = () => {
    setStep(5);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#ded7c8] p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#14141e] flex items-center gap-2">
            <span>Storyboard</span>
            <span className="font-serif italic font-semibold text-silver-shine">visual</span>
            <span>& escenas ({project.scenes.length})</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Revisa los visuales generados para cada escena. Puedes regenerar las imágenes tantas veces como quieras antes de procesar el video.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#f6f3eb] px-4 py-2 rounded-xl border border-[#ded7c8]">
          <Clock className="w-4 h-4 text-slate-700" />
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-medium">Duración total</div>
            <div className="text-xs font-bold text-gray-900">{totalDuration}s ({project.scenes.length} clips de {selectedFw.defaultSceneDuration || 8}s)</div>
          </div>
        </div>
      </div>



      {/* Grid de Escenas del Storyboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {project.scenes.map((scene, idx) => {
          const isRegenerating = regeneratingIds[scene.id];

          return (
            <div
              key={scene.id}
              className="bg-white border border-[#ded7c8] rounded-2xl overflow-hidden flex flex-col shadow-sm hover:border-slate-400 transition-all"
            >
              {/* Contenedor Superior: Preview 9:16 y Detalles */}
              <div className="p-4 flex gap-4">
                {/* Visual Thumbnail (Aspect Ratio 9:16) */}
                <div className="relative w-28 h-48 sm:w-32 sm:h-56 shrink-0 rounded-xl overflow-hidden bg-black border border-[#ded7c8] group">
                  <img
                    src={scene.mediaUrl}
                    alt={scene.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isRegenerating ? 'opacity-40 scale-105 blur-sm' : 'group-hover:scale-105'
                    }`}
                  />

                  {isRegenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-black/60">
                      <RefreshCw className="w-6 h-6 text-white animate-spin mb-1" />
                      <span className="text-[10px] text-white font-medium">Generando IA...</span>
                    </div>
                  )}

                  {/* Badge de Orden */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[11px] font-bold text-white border border-white/10">
                    Escena {idx + 1}
                  </div>

                  {/* Botón de Regenerar Flotante */}
                  <button
                    type="button"
                    disabled={isRegenerating}
                    onClick={() => handleRegenerateImage(scene.id, scene.visualPrompt)}
                    className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/80 hover:bg-neutral-700 text-white backdrop-blur-sm border border-white/20 transition-all opacity-90 hover:opacity-100 active:scale-95"
                    title="Regenerar imagen con IA"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Info y Controles de la Escena */}
                <div className="flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {scene.title}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded bg-[#f1f5f9] border border-slate-300">
                        {scene.durationSec}s
                      </span>
                    </div>

                    {/* Desglose de Fruta & Reacción del Órgano si aplica */}
                    {scene.subjectOrItem && (
                      <div className="space-y-1 bg-[#faf7f2] p-2 rounded-lg border border-[#e8e2d4] mb-2">
                        <div className="text-[11px] text-gray-800">
                          <strong className="text-slate-900 font-bold">Elemento/Fruta:</strong> {scene.subjectOrItem}
                        </div>
                        {scene.conceptOrReaction && (
                          <div className="text-[11px] text-gray-600 leading-snug">
                            <strong className="text-slate-900 font-bold">Reacción:</strong> {scene.conceptOrReaction}
                          </div>
                        )}
                      </div>
                    )}

                    {!scene.subjectOrItem && (
                      <p className="text-xs text-gray-700 line-clamp-3 italic leading-relaxed">
                        "{scene.scriptText}"
                      </p>
                    )}
                  </div>

                  {/* Duración predeterminada o selector si es variable */}
                  <div className="pt-2 border-t border-[#f0ebe0]">
                    {isFixedDuration ? (
                      <div className="text-[11px] text-slate-600 font-medium flex items-center justify-between">
                        <span>Duración del clip:</span>
                        <strong className="text-slate-900 font-bold">{scene.durationSec}s (Predeterminado)</strong>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 block">
                          Duración del clip:
                        </label>
                        <div className="flex items-center gap-1.5">
                          {([6, 8, 10] as SceneDuration[]).map((dur) => (
                            <button
                              key={dur}
                              type="button"
                              onClick={() => handleDurationChange(scene.id, dur)}
                              className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-all ${
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

              {/* Visual Prompt Input Inline para Regenerar */}
              <div className="px-4 pb-4 pt-1">
                <div className="rounded-xl bg-[#faf7f2] border border-[#ded7c8] p-2.5">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 mb-1">
                    <span className="flex items-center gap-1 text-slate-700 font-bold">
                      <ImageIcon className="w-3 h-3" />
                      Prompt visual IA:
                    </span>
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => handleRegenerateImage(scene.id, scene.visualPrompt)}
                      className="text-slate-800 hover:text-black font-bold transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Regenerar imagen</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={scene.visualPrompt}
                    onChange={(e) => updateScene(scene.id, { visualPrompt: e.target.value })}
                    className="w-full bg-transparent text-xs text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
                    placeholder="Descripción visual..."
                  />
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
          className="btn-arena inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
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
