import React from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const Step1FrameworkSelector: React.FC = () => {
  const { project, frameworks, selectFramework, setStep } = useSystemStore();

  const handleSelectAndProceed = (frameworkId: string) => {
    selectFramework(frameworkId);
    setStep(2);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-1 max-w-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-[#14141e] tracking-tight">
          Selecciona el{' '}
          <span className="font-serif italic font-semibold text-silver-shine">
            formato
          </span>
        </h2>
        <p className="text-xs text-gray-500">
          Elige el concepto base para tu video.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {frameworks.map((fw) => {
          const isSelected = project.frameworkId === fw.id;

          return (
            <button
              key={fw.id}
              type="button"
              onClick={() => handleSelectAndProceed(fw.id)}
              className={`text-left rounded-xl p-4 border transition-all ${
                isSelected
                  ? 'silver-selected'
                  : 'bg-white border-[#ded7c8] hover:border-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                  {fw.name}
                </h3>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
                )}
              </div>

              <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                {fw.niche} · {fw.targetAudience}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">
                  {fw.category}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
