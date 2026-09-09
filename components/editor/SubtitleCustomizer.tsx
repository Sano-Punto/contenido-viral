'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { SUBTITLE_PRESETS } from '@/lib/frameworks/definitions';
import { SubtitleStyleId, SubtitleWord } from '@/types';
import { generateWordTimings } from '@/services/ai/subtitlesGenerator';
import {
  Type,
  Check,
  Sparkles,
  Sliders,
  Star,
  Plus,
  Trash2,
  Clock,
  Wand2,
} from 'lucide-react';

export const SubtitleCustomizer: React.FC = () => {
  const { project, setSubtitleStyle, updateScene } = useSystemStore();
  const scenes = project.scenes || [];
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'editor' | 'styling'>('presets');

  const currentScene = scenes[selectedSceneIndex] || scenes[0];

  // Generar subtítulos automáticos para todas las escenas
  const handleAutoGenerateAll = () => {
    setAutoGenerating(true);
    setTimeout(() => {
      scenes.forEach((scene) => {
        const textToUse = scene.scriptText || scene.title || scene.subjectOrItem || '';
        if (textToUse) {
          const generatedWords = generateWordTimings(textToUse, scene.durationSec);
          updateScene(scene.id, {
            words: generatedWords,
            scriptText: textToUse,
          });
        }
      });
      setAutoGenerating(false);
    }, 600);
  };

  // Actualizar palabra individual
  const handleUpdateWord = (wordIndex: number, updates: Partial<SubtitleWord>) => {
    if (!currentScene) return;
    const updatedWords = [...(currentScene.words || [])];
    if (updatedWords[wordIndex]) {
      updatedWords[wordIndex] = { ...updatedWords[wordIndex], ...updates };
      updateScene(currentScene.id, { words: updatedWords });
    }
  };

  // Añadir nueva palabra
  const handleAddWord = () => {
    if (!currentScene) return;
    const existing = currentScene.words || [];
    const lastEnd = existing.length > 0 ? existing[existing.length - 1].end : 0.2;
    const newWord: SubtitleWord = {
      text: 'NUEVA',
      start: parseFloat(lastEnd.toFixed(2)),
      end: parseFloat((lastEnd + 0.5).toFixed(2)),
      highlight: false,
    };
    updateScene(currentScene.id, { words: [...existing, newWord] });
  };

  // Eliminar palabra
  const handleDeleteWord = (wordIndex: number) => {
    if (!currentScene) return;
    const updatedWords = (currentScene.words || []).filter((_, idx) => idx !== wordIndex);
    updateScene(currentScene.id, { words: updatedWords });
  };

  // Actualizar texto completo de la escena y regenerar timings
  const handleScriptChange = (newText: string) => {
    if (!currentScene) return;
    const newWords = generateWordTimings(newText, currentScene.durationSec);
    updateScene(currentScene.id, {
      scriptText: newText,
      words: newWords,
    });
  };

  return (
    <div className="space-y-5">
      {/* Sub-tabs del editor de subtítulos */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'presets' ? 'btn-silver-luxury text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Estilos & Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'editor' ? 'btn-silver-luxury text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Editor Palabra por Palabra
          </button>
        </div>

        {/* Botón de Auto-generar estilo CapCut */}
        <button
          type="button"
          disabled={autoGenerating || scenes.length === 0}
          onClick={handleAutoGenerateAll}
          className="btn-dark-luxury inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
          title="Generar y sincronizar subtítulos automáticamente con los textos de cada escena"
        >
          {autoGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
              <span>Sincronizando...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5 text-slate-200" />
              <span>Auto-Subtítulos ⚡</span>
            </>
          )}
        </button>
      </div>

      {/* 1. PESTAÑA: ESTILOS Y PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-slate-700" />
              <span>Estilos de subtítulos dinámicos de alta retención</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Animación pop activa</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {Object.values(SUBTITLE_PRESETS).map((preset) => {
              const isSelected = project.subtitleStyleId === preset.id;

              return (
                <div
                  key={preset.id}
                  onClick={() => setSubtitleStyle(preset.id as SubtitleStyleId)}
                  className={`cursor-pointer rounded-2xl p-3.5 border transition-all ${
                    isSelected
                      ? 'bg-slate-50 border-slate-900 shadow-sm ring-1 ring-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Activo
                      </span>
                    ) : null}
                  </div>

                  {/* Sample Subtitle Preview */}
                  <div className="bg-black rounded-xl p-3 flex items-center justify-center text-center shadow-inner">
                    <span
                      style={{
                        fontFamily: preset.fontFamily,
                        fontSize: '13px',
                        fontWeight: 900,
                        color: preset.highlightColor,
                        backgroundColor: preset.boxStyle ? (preset.backgroundColor || '#000') : 'transparent',
                        padding: preset.boxStyle ? '2px 6px' : '0',
                        borderRadius: '4px',
                        textTransform: preset.uppercase ? 'uppercase' : 'none',
                        textShadow: preset.textShadow,
                      }}
                    >
                      PALABRA VIRAL
                    </span>
                    <span
                      style={{
                        fontFamily: preset.fontFamily,
                        fontSize: '13px',
                        fontWeight: 800,
                        color: preset.textColor,
                        marginLeft: '6px',
                        textTransform: preset.uppercase ? 'uppercase' : 'none',
                      }}
                    >
                      DE IMPACTO
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. PESTAÑA: EDITOR PALABRA POR PALABRA (TIPO CAPCUT) */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          {scenes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              No hay escenas activas. Selecciona un video de tu biblioteca para editar sus subtítulos.
            </div>
          ) : (
            <>
              {/* Selector de Escenas */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700">Seleccionar Escena para editar subtítulos:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {scenes.map((scene, idx) => (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setSelectedSceneIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        selectedSceneIndex === idx
                          ? 'btn-dark-luxury text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>#{idx + 1}</span>
                      <span className="max-w-[100px] truncate">{scene.subjectOrItem || scene.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea del guion completo de la escena */}
              {currentScene && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Texto de locución / subtítulo:</span>
                    <span className="text-[10px] text-slate-500">{currentScene.durationSec}s de duración</span>
                  </div>
                  <textarea
                    rows={2}
                    value={currentScene.scriptText || ''}
                    onChange={(e) => handleScriptChange(e.target.value)}
                    placeholder="Escribe el texto de la locución para generar los subtítulos..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400 leading-relaxed resize-none"
                  />
                </div>
              )}

              {/* Lista de Palabras / Tokens Sincronizados */}
              {currentScene && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-700" />
                      <span>Palabras sincronizadas ({currentScene.words?.length || 0})</span>
                    </span>

                    <button
                      type="button"
                      onClick={handleAddWord}
                      className="text-[11px] font-bold text-slate-700 hover:text-black inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir palabra</span>
                    </button>
                  </div>

                  {(!currentScene.words || currentScene.words.length === 0) ? (
                    <div className="p-6 text-center text-slate-400 bg-white rounded-xl border border-slate-200 text-xs">
                      No hay palabras sincronizadas. Haz clic en "Auto-Subtítulos ⚡" arriba para generarlas automáticamente.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {currentScene.words.map((word, wIdx) => (
                        <div
                          key={wIdx}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                            word.highlight
                              ? 'bg-amber-50/80 border-amber-300'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          {/* Input de texto de la palabra */}
                          <input
                            type="text"
                            value={word.text}
                            onChange={(e) => handleUpdateWord(wIdx, { text: e.target.value })}
                            className="bg-transparent font-bold text-xs text-slate-900 focus:outline-none flex-1 min-w-0"
                          />

                          {/* Tiempos de inicio y fin */}
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono shrink-0">
                            <input
                              type="number"
                              step="0.1"
                              value={word.start}
                              onChange={(e) => handleUpdateWord(wIdx, { start: parseFloat(e.target.value) || 0 })}
                              className="w-12 p-1 bg-slate-100 rounded border border-slate-200 text-center text-slate-800"
                            />
                            <span>-</span>
                            <input
                              type="number"
                              step="0.1"
                              value={word.end}
                              onChange={(e) => handleUpdateWord(wIdx, { end: parseFloat(e.target.value) || 0 })}
                              className="w-12 p-1 bg-slate-100 rounded border border-slate-200 text-center text-slate-800"
                            />
                            <span>s</span>
                          </div>

                          {/* Botón de destacar (Highlight) */}
                          <button
                            type="button"
                            onClick={() => handleUpdateWord(wIdx, { highlight: !word.highlight })}
                            className={`p-1.5 rounded-lg border transition-all shrink-0 ${
                              word.highlight
                                ? 'bg-amber-400 text-amber-950 border-amber-400'
                                : 'bg-slate-100 text-slate-400 hover:text-amber-500 border-slate-200'
                            }`}
                            title={word.highlight ? 'Palabra destacada con color viral' : 'Marcar como palabra viral destacada'}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>

                          {/* Botón de eliminar */}
                          <button
                            type="button"
                            onClick={() => handleDeleteWord(wIdx)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors shrink-0"
                            title="Eliminar palabra"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
