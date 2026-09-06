'use client';

import React from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { Step1FrameworkSelector } from './Step1FrameworkSelector';
import { Step2IdeaInput } from './Step2IdeaInput';
import { Step3ScriptReview } from './Step3ScriptReview';
import { Step4Storyboard } from './Step4Storyboard';
import { Step5VideoReady } from './Step5VideoReady';
import { Check, Sparkles } from 'lucide-react';

export const WizardContainer: React.FC = () => {
  const { currentStep, setStep, isLoading, generatingStep, project, frameworks } = useSystemStore();

  const selectedFw = frameworks.find((f) => f.id === project.frameworkId) || frameworks[0];
  const requiresScript = selectedFw.requiresSpokenScript ?? true;

  // Definición dinámica de pasos según el framework seleccionado
  const stepsConfig = requiresScript
    ? [
        { internalStep: 1, displayNum: 1, title: 'Formato' },
        { internalStep: 2, displayNum: 2, title: 'Idea' },
        { internalStep: 3, displayNum: 3, title: 'Guion' },
        { internalStep: 4, displayNum: 4, title: 'Storyboard' },
        { internalStep: 5, displayNum: 5, title: 'Generación' },
      ]
    : [
        { internalStep: 1, displayNum: 1, title: 'Formato' },
        { internalStep: 2, displayNum: 2, title: 'Idea & escenas' },
        { internalStep: 4, displayNum: 3, title: 'Storyboard' },
        { internalStep: 5, displayNum: 4, title: 'Generación' },
      ];

  const currentDisplayStep = stepsConfig.find((s) => s.internalStep === currentStep) || stepsConfig[0];

  return (
    <div className="space-y-6">
      {/* Barra de progreso dinámica */}
      <div className="flex items-center gap-1.5 max-w-xl mx-auto">
        {stepsConfig.map((s, idx) => {
          const isCompleted = currentStep > s.internalStep;
          const isCurrent = currentStep === s.internalStep;

          return (
            <React.Fragment key={s.internalStep}>
              <button
                type="button"
                onClick={() => {
                  if (s.internalStep < currentStep) setStep(s.internalStep as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  isCurrent
                    ? 'btn-dark-luxury text-white shadow-sm'
                    : isCompleted
                    ? 'btn-silver-luxury text-slate-800 cursor-pointer'
                    : 'text-gray-400 cursor-default hover:text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 text-slate-800 stroke-[3]" />
                ) : (
                  <span className="text-[10px]">{s.displayNum}</span>
                )}
                <span className="hidden sm:inline">{s.title}</span>
              </button>

              {idx < stepsConfig.length - 1 && (
                <div
                  className={`flex-1 h-px transition-colors ${
                    currentStep > s.internalStep ? 'bg-slate-400' : 'bg-[#e2dcce]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Centered Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12131c] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 max-w-md w-full mx-auto text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-sky-400 animate-spin" />
              <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
                <span>Generando con</span>
                <span className="font-serif italic font-semibold text-silver-shine">IA</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                {generatingStep || 'Diseñando conceptos visuales y generando imagen maestra...'}
              </p>
            </div>

            {/* Micro steps indicator */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Estructurando conceptos biológicos y retención</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0" />
                <span>Generando render 3D con gemini-3-pro-image</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <div className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
                <span>Sincronizando escenas para el storyboard</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-medium">
              Por favor espera unos segundos mientras la IA completa los renders...
            </div>
          </div>
        </div>
      )}

      {/* Step content */}
      <div>
        {currentStep === 1 && <Step1FrameworkSelector />}
        {currentStep === 2 && <Step2IdeaInput />}
        {currentStep === 3 && <Step3ScriptReview />}
        {currentStep === 4 && <Step4Storyboard />}
        {currentStep === 5 && <Step5VideoReady />}
      </div>
    </div>
  );
};
