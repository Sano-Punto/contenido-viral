import React from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { ArrowRight } from 'lucide-react';

export const Step1FrameworkSelector: React.FC = () => {
  const { frameworks, selectFramework, setStep } = useSystemStore();

  const handleSelectAndProceed = (frameworkId: string) => {
    selectFramework(frameworkId);
    setStep(2);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-1 max-w-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Selecciona el formato
        </h2>
        <p className="text-xs text-gray-500">
          Elige el concepto base para tu video.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            type="button"
            onClick={() => handleSelectAndProceed(fw.id)}
            className="text-left bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm rounded-xl p-5 transition-all flex flex-col justify-between group cursor-pointer space-y-4"
          >
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-slate-800 transition-colors">
                {fw.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {fw.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                {fw.category}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
