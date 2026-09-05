'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { Sparkles } from 'lucide-react';

export const FrameworksView: React.FC = () => {
  const { frameworks, selectFramework, setActiveView, setStep } = useSystemStore();
  const [selectedFwId, setSelectedFwId] = useState<string>(frameworks[0]?.id || '');

  const activeFramework = frameworks.find((f) => f.id === selectedFwId) || frameworks[0];

  const handleUseFramework = (id: string) => {
    selectFramework(id);
    setStep(2);
    setActiveView('generator');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Lista de frameworks */}
        <div className="lg:col-span-5 space-y-2">
          <h3 className="text-sm font-bold text-gray-800 mb-3">
            Formatos disponibles ({frameworks.length})
          </h3>

          <div className="space-y-2">
            {frameworks.map((fw) => {
              const isSelected = selectedFwId === fw.id;

              return (
                <div
                  key={fw.id}
                  onClick={() => setSelectedFwId(fw.id)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                    isSelected
                      ? 'silver-selected'
                      : 'bg-white border-[#ded7c8] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-900 text-sm">{fw.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-500">{fw.category}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">
                    {fw.niche}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalle del framework seleccionado */}
        <div className="lg:col-span-7 bg-white border border-[#ded7c8] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ebe0]">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block mb-0.5">{activeFramework.category}</span>
              <h3 className="text-base font-bold text-gray-900">{activeFramework.name}</h3>
            </div>

            <button
              type="button"
              onClick={() => handleUseFramework(activeFramework.id)}
              className="btn-dark-luxury inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-200" />
              <span>Usar formato</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-semibold text-gray-400 block mb-1">Descripción</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                {activeFramework.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#faf7f2] border border-[#ded7c8]">
                <span className="text-[10px] font-semibold text-gray-400 block mb-1">Nichos</span>
                <p className="text-xs text-gray-800 font-bold">{activeFramework.niche}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#faf7f2] border border-[#ded7c8]">
                <span className="text-[10px] font-semibold text-gray-400 block mb-1">Audiencia</span>
                <p className="text-xs text-gray-800 font-bold">{activeFramework.targetAudience}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
