import React from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { generateWordTimings } from '@/services/ai/subtitlesGenerator';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const Step3ScriptReview: React.FC = () => {
  const { project, updateScene, setStep } = useSystemStore();

  const handleScriptChange = (sceneId: string, newText: string, durationSec: number) => {
    const updatedWords = generateWordTimings(newText, durationSec);
    updateScene(sceneId, {
      scriptText: newText,
      words: updatedWords,
    });
  };

  const roleColors: Record<string, { bg: string; text: string; label: string }> = {
    hook: { bg: 'bg-[#faf7f2] border-slate-300', text: 'text-slate-900 font-bold', label: 'Gancho inicial (0-6s)' },
    body: { bg: 'bg-[#faf7f2] border-slate-300', text: 'text-slate-800 font-bold', label: 'Retención / Desarrollo' },
    climax: { bg: 'bg-[#faf7f2] border-slate-300', text: 'text-slate-900 font-bold', label: 'Clímax / Revelación' },
    cta: { bg: 'bg-[#faf7f2] border-slate-300', text: 'text-slate-800 font-bold', label: 'Llamado a la acción' },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#14141e] tracking-tight">
          Revisa y ajusta el{' '}
          <span className="font-serif italic font-semibold text-silver-shine">
            guion por escenas
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Edita el texto de cada escena. Las marcas de tiempo de los subtítulos se recalcularán automáticamente.
        </p>
      </div>

      {/* Lista de Escenas */}
      <div className="space-y-4">
        {project.scenes.map((scene, idx) => {
          const roleConfig = roleColors[scene.role] || roleColors.body;

          return (
            <div
              key={scene.id}
              className="bg-white border border-[#ded7c8] rounded-2xl p-5 space-y-3 shadow-sm transition-all hover:border-slate-400"
            >
              {/* Header de la escena */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f6f3eb] text-xs font-bold text-gray-700">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {scene.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${roleConfig.bg} ${roleConfig.text}`}>
                    {roleConfig.label}
                  </span>
                  <span className="text-xs font-semibold text-gray-600 bg-[#f6f3eb] px-2 py-0.5 rounded-md border border-[#ded7c8]">
                    {scene.durationSec}s
                  </span>
                </div>
              </div>

              {/* Textarea del guion */}
              <textarea
                rows={2}
                value={scene.scriptText}
                onChange={(e) => handleScriptChange(scene.id, e.target.value, scene.durationSec)}
                className="w-full rounded-xl bg-[#faf7f2] border border-[#ded7c8] p-3 text-sm text-gray-900 focus:outline-none focus:border-slate-500 focus:bg-white transition-all resize-none font-medium leading-relaxed"
              />

              {/* Subtítulos preview tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-medium text-gray-400 mr-1">Palabras clave:</span>
                {scene.words.filter(w => w.highlight).map((w, wIdx) => (
                  <span
                    key={wIdx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f1f5f9] border border-slate-300 text-slate-800"
                  >
                    ★ {w.text}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="btn-arena inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la idea</span>
        </button>

        <button
          type="button"
          onClick={() => setStep(4)}
          className="btn-dark-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs shadow-md transition-all"
        >
          <span>Ir al storyboard visual</span>
          <ArrowRight className="w-4 h-4 text-slate-200" />
        </button>
      </div>
    </div>
  );
};
