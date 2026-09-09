import React, { useState } from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { generateViralScript } from '@/services/ai/scriptGenerator';
import { Sparkles, ArrowLeft, ArrowRight, Lightbulb, Film } from 'lucide-react';

interface InspirationItem {
  text: string;
  scenes: number;
}

const INSPIRATIONS_BY_FRAMEWORK: Record<string, InspirationItem[]> = {
  'super-alimentos': [
    { text: '6 super alimentos para tus orejas', scenes: 6 },
    { text: '3 super alimentos para tu riñón', scenes: 3 },
  ],
  'alimentos-que-retan': [
    { text: '5 alimentos que retan tus riñones', scenes: 5 },
    { text: '4 alimentos que retan tus ojos', scenes: 4 },
  ],
  'que-sucede-al-comer': [
    { text: '4 cosas que suceden en tu cuerpo al comer aguacate', scenes: 4 },
    { text: '3 cambios biológicos al tomar agua con limón y chía', scenes: 3 },
  ],
  default: [
    { text: '6 super alimentos para tus orejas', scenes: 6 },
    { text: '3 super alimentos para tu riñón', scenes: 3 },
  ],
};

const getPlaceholderByFramework = (frameworkId: string): string => {
  switch (frameworkId) {
    case 'alimentos-que-retan':
      return 'Ejemplo: Alimentos que retan esto... (ej. 5 alimentos que retan tus riñones)';
    case 'super-alimentos':
      return 'Ejemplo: Super alimentos para... (ej. 6 super alimentos para tus orejas)';
    case 'que-sucede-al-comer':
      return 'Ejemplo: Qué sucede en tu cuerpo al comer... (ej. 4 cosas que suceden al comer aguacate)';
    default:
      return 'Ejemplo: Super alimentos para...';
  }
};

export const Step2IdeaInput: React.FC = () => {
  const { project, frameworks, setIdeaDetails, setScenes, setStep, setLoading, isLoading, generatingStep } = useSystemStore();
  
  const selectedFw = frameworks.find((f) => f.id === project.frameworkId) || frameworks[0];
  const requiresScript = selectedFw.requiresSpokenScript ?? true;

  const defaultInspiration = INSPIRATIONS_BY_FRAMEWORK[selectedFw.id]?.[0] || INSPIRATIONS_BY_FRAMEWORK.default[0];

  const [idea, setIdea] = useState(
    project.ideaPrompt || defaultInspiration.text
  );
  const [scenesCount, setScenesCount] = useState<number>(
    project.scenesCount || defaultInspiration.scenes
  );

  const inspirations = INSPIRATIONS_BY_FRAMEWORK[selectedFw.id] || INSPIRATIONS_BY_FRAMEWORK.default;
  const placeholderText = getPlaceholderByFramework(selectedFw.id);

  const handleSelectInspiration = (item: InspirationItem) => {
    setIdea(item.text);
    setScenesCount(item.scenes);
  };

  const handleGenerateScenes = async () => {
    if (!idea.trim()) return;

    setIdeaDetails({
      ideaPrompt: idea,
      scenesCount,
    });

    setLoading(
      true,
      requiresScript
        ? 'Estructurando guion de alta retención y viaje biológico...'
        : 'Generando conceptos visuales 3D y reacciones de órganos por escena...'
    );

    try {
      const result = await generateViralScript({
        framework: selectedFw,
        ideaPrompt: idea,
        scenesCount,
      });

      setScenes(result.scenes);
      if (result.caption) {
        useSystemStore.getState().setCaption(result.caption);
      }
      setLoading(false);

      if (!requiresScript) {
        setStep(4);
      } else {
        setStep(3);
      }
    } catch (error) {
      console.error('Error generating scenes:', error);
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full silver-selected text-xs font-semibold text-slate-800">
            <span>Formato seleccionado:</span>
            <strong className="text-slate-950 font-bold">{selectedFw.name}</strong>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Generando storyboard de escenas con IA
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {generatingStep || 'Diseñando conceptos visuales y estructurando la animación de escenas...'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="w-full h-full rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-slate-700 animate-pulse" />
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              Procesando idea: <span className="font-semibold text-slate-700">"{idea}"</span>
            </h3>
            <p className="text-xs text-slate-500">
              Generando {scenesCount} escenas visuales con IA
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2.5 max-w-md mx-auto">
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Estructurando conceptos biológicos y retención</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <div className="w-2 h-2 rounded-full bg-slate-900 animate-pulse shrink-0" />
              <span>Generando renders 3D para cada una de las {scenesCount} escenas</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium">
              <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
              <span>Sincronizando escenas para el storyboard</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-medium pt-2">
            Por favor espera unos segundos mientras la IA completa los renders y la estructura del video...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full silver-selected text-xs font-semibold text-slate-800">
          <span>Formato seleccionado:</span>
          <strong className="text-slate-950 font-bold">{selectedFw.name}</strong>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Define la idea de tu video
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Indica el tema central. La IA estructurará los conceptos en la cantidad exacta de escenas que elijas.
        </p>
      </div>

      {/* Formulario Principal */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
        {/* Input Idea Central */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800">
            ¿De qué trata tu video? (Tema, órgano, alimento o recorrido interno)
          </label>
          <textarea
            rows={3}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder={placeholderText}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Ideas Rápidas de Inspiración (Exactamente 2) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Lightbulb className="w-3.5 h-3.5 text-slate-600" />
            <span>Ideas sugeridas para este formato (haz clic para aplicar e indicar escenas):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inspirations.map((item, idx) => {
              const isActive = idea === item.text && scenesCount === item.scenes;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectInspiration(item)}
                  className={`text-left text-xs p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-white text-slate-700'
                  }`}
                >
                  <span className="font-medium leading-snug">{item.text}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1 ${
                      isActive
                        ? 'bg-slate-800 text-slate-200 border border-slate-700'
                        : 'bg-white text-slate-600 border border-slate-200 group-hover:border-slate-300'
                    }`}
                  >
                    <Film className="w-3 h-3" />
                    {item.scenes} escenas
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector de Cantidad de Escenas (3 a 8) */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-800">
              Cantidad de escenas en el video
            </label>
            <span className="text-[11px] text-slate-500 font-medium">
              Duración estimada: ~{scenesCount * (selectedFw.defaultSceneDuration || 8)}s ({scenesCount} escenas de {selectedFw.defaultSceneDuration || 8}s)
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
            {[3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setScenesCount(num)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  scenesCount === num
                    ? 'btn-silver-luxury shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {num} {num === 1 ? 'escena' : 'escenas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botones de Navegación */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="btn-arena inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cambiar formato</span>
        </button>

        <button
          type="button"
          disabled={!idea.trim() || isLoading}
          onClick={handleGenerateScenes}
          className="btn-dark-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-xl disabled:opacity-50 text-xs shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4 text-slate-200" />
          <span>
            {isLoading
              ? 'Procesando escenas...'
              : requiresScript
              ? 'Generar guion con IA'
              : 'Generar storyboard de escenas'}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-200" />
        </button>
      </div>
    </div>
  );
};
