import React, { useState } from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { generateViralScript } from '@/services/ai/scriptGenerator';
import { Sparkles, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';

const INSPIRATIONS_BY_FRAMEWORK: Record<string, string[]> = {
  'super-alimentos': [
    '5 Super alimentos para rescatar y activar tu tiroides cansada.',
    'Los 4 mejores alimentos para regenerar hepatocitos y limpiar tu hígado.',
    'Frutas ricas en antocianinas que potencian la memoria y el cerebro.',
    'Alimentos con probióticos y fibra soluble para restaurar tu intestino.',
  ],
  'alimentos-que-retan': [
    '3 Alimentos cotidianos que saturan de grasa y fatigan tu hígado.',
    'Grasas trans y ultraprocesados que inflaman tus arterias coronarias.',
    'Bebidas azucaradas que agotan las células de tu páncreas y estómago.',
    'Exceso de sodio y harinas refinadas que retan tus riñones.',
  ],
  'que-sucede-al-comer': [
    'Qué sucede realmente dentro de ti al tomar un vaso de gaseosa oscura.',
    'El viaje interno cinematográfico de una porción de papas fritas.',
    'Recorrido biológico paso a paso al consumir café en ayunas.',
    'Qué ocurre en tus células y sangre al tomar agua con limón y chía.',
  ],
  default: [
    'Qué le pasa a tu cerebro y memoria cuando comes arándanos en ayunas.',
    'El efecto oculto del limón con agua tibia en el hígado graso.',
    'La fruta que repara las arterias del corazón según estudios recientes.',
    'Por qué los atletas consumen plátano antes de entrenamientos intensos.',
  ],
};

export const Step2IdeaInput: React.FC = () => {
  const { project, frameworks, setIdeaDetails, setScenes, setStep, setLoading, isLoading } = useSystemStore();
  
  const selectedFw = frameworks.find((f) => f.id === project.frameworkId) || frameworks[0];
  const requiresScript = selectedFw.requiresSpokenScript ?? true;

  const [idea, setIdea] = useState(
    project.ideaPrompt ||
    (selectedFw.id === 'super-alimentos'
      ? '5 Super alimentos para activar y regenerar la tiroides'
      : selectedFw.id === 'alimentos-que-retan'
      ? '3 Alimentos cotidianos que dañan e inflaman tu hígado'
      : selectedFw.id === 'que-sucede-al-comer'
      ? 'Qué sucede en tu cuerpo cuando tomas un vaso de gaseosa oscura'
      : '')
  );
  const [scenesCount, setScenesCount] = useState<number>(project.scenesCount || selectedFw.recommendedScenes || 4);

  const inspirations = INSPIRATIONS_BY_FRAMEWORK[selectedFw.id] || INSPIRATIONS_BY_FRAMEWORK.default;

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
        : 'Generando conceptos visuales Pixar 3D y reacciones de órganos por escena...'
    );

    try {
      const generatedScenes = await generateViralScript({
        framework: selectedFw,
        ideaPrompt: idea,
        scenesCount,
      });

      setScenes(generatedScenes);
      setLoading(false);

      // Si el formato no requiere guion hablado, pasamos directo al Storyboard (Paso 4)
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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full silver-selected text-xs font-semibold text-slate-800">
          <span>Formato seleccionado:</span>
          <strong className="text-slate-950 font-bold">{selectedFw.name}</strong>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#14141e] tracking-tight">
          Define la{' '}
          <span className="font-serif italic font-semibold text-silver-shine">
            idea de tu video
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Indica el tema central. La IA estructurará los conceptos en la cantidad exacta de escenas que elijas.
        </p>
      </div>

      {/* Formulario Principal */}
      <div className="bg-white border border-[#ded7c8] rounded-2xl p-6 space-y-5 shadow-sm">
        {/* Input Idea Central */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-800">
            ¿De qué trata tu video? (Tema, órgano, alimento o recorrido interno)
          </label>
          <textarea
            rows={3}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Ejemplo: Qué le pasa a tu hígado y cerebro cuando tomas papaya con semillas..."
            className="w-full rounded-xl bg-[#faf7f2] border border-[#ded7c8] p-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-slate-500 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Ideas Rápidas de Inspiración */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <Lightbulb className="w-3.5 h-3.5 text-slate-600" />
            <span>Ideas sugeridas para este formato (haz clic para aplicar):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {inspirations.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIdea(item)}
                className="text-left text-xs p-2.5 rounded-xl bg-[#f6f3eb] border border-[#e2dcce] hover:border-slate-400 hover:bg-white text-gray-700 transition-all line-clamp-2"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de Cantidad de Escenas (3 a 8) */}
        <div className="pt-3 border-t border-[#f0ebe0] space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-800">
              Cantidad de escenas en el video
            </label>
            <span className="text-[11px] text-slate-600 font-medium">
              Duración estimada: ~{scenesCount * (selectedFw.defaultSceneDuration || 8)}s ({scenesCount} escenas de {selectedFw.defaultSceneDuration || 8}s)
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f6f3eb] p-1.5 rounded-xl border border-[#ded7c8]">
            {[3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setScenesCount(num)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  scenesCount === num
                    ? 'btn-silver-luxury shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
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
          className="btn-arena inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
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
