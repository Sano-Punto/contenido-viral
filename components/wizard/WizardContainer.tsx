'use client';

import React from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { Step1FrameworkSelector } from './Step1FrameworkSelector';
import { Step2IdeaInput } from './Step2IdeaInput';
import { Step3ScriptReview } from './Step3ScriptReview';
import { Step4Storyboard } from './Step4Storyboard';
import { Step5VideoReady } from './Step5VideoReady';
import { Check } from 'lucide-react';

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

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xs w-full text-center border border-[#e2dcce]">
            <div className="w-10 h-10 rounded-full border-[3px] border-slate-200 border-t-slate-900 animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900">
              Generando con{' '}
              <span className="font-serif italic font-semibold text-silver-shine">IA</span>
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              {generatingStep || 'Procesando conceptos...'}
            </p>
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
