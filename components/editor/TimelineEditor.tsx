'use client';

import React from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { SceneDuration } from '@/types';
import {
  Film,
  Type,
  Music,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface TimelineEditorProps {
  currentFrame: number;
  totalDurationSec: number;
  fps?: number;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onSeek?: (frame: number) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  currentFrame,
  totalDurationSec,
  fps = 30,
  isPlaying = false,
  onTogglePlay,
  onSeek,
}) => {
  const { project, updateSceneDuration, setBgmVolume } = useSystemStore();
  const scenes = project.scenes || [];
  const currentTimeSec = currentFrame / fps;
  const totalFrames = Math.max(totalDurationSec * fps, 30);

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const targetFrame = Math.round(percent * totalFrames);
    onSeek(targetFrame);
  };

  const handleChangeDuration = (sceneId: string, currentDur: number, delta: number) => {
    const newDur = Math.max(4, Math.min(16, currentDur + delta)) as SceneDuration;
    updateSceneDuration(sceneId, newDur);
  };

  // Formato MM:SS.S
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins.toString().padStart(2, '0')}:${parseFloat(secs) < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm select-none">
      {/* Header & Controles de Reproducción de la Timeline */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {/* Botones de Control de Playhead */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onSeek && onSeek(0)}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Reiniciar al inicio"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {onTogglePlay && (
              <button
                type="button"
                onClick={onTogglePlay}
                className="btn-dark-luxury p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Reproducir</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-xs">Timeline Multipista</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200">
              {scenes.length} escenas · {totalDurationSec}s
            </span>
          </div>
        </div>

        {/* Contador de Tiempo Exacto */}
        <div className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
          <span className="text-slate-900">{formatTime(currentTimeSec)}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500">{formatTime(totalDurationSec)}</span>
        </div>
      </div>

      {/* Regla de Tiempo Superior (Interactiva para scrubbing) */}
      <div
        onClick={handleRulerClick}
        className="relative h-7 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex items-center cursor-pointer group"
      >
        {Array.from({ length: Math.ceil(totalDurationSec / 2) + 1 }).map((_, i) => {
          const sec = i * 2;
          const leftPercent = (sec / totalDurationSec) * 100;
          if (leftPercent > 100) return null;

          return (
            <div
              key={sec}
              className="absolute top-0 bottom-0 border-l border-slate-300 text-[9px] font-mono text-slate-400 pl-1 pt-0.5 pointer-events-none"
              style={{ left: `${leftPercent}%` }}
            >
              {sec}s
            </div>
          );
        })}

        {/* Aguja de Reproducción (Playhead Cursor) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-30 pointer-events-none transition-all duration-75"
          style={{ left: `${(currentTimeSec / totalDurationSec) * 100}%` }}
        >
          <div className="w-3 h-3 bg-slate-900 -ml-1.5 -top-1 absolute rounded-full shadow-md" />
        </div>
      </div>

      {/* PISTAS MULTI-TRACK TIPO CAPCUT */}
      <div className="space-y-2.5">
        {/* Pista 1: Escenas / Clips de Video 9:16 */}
        <div className="flex items-center gap-3">
          <div className="w-24 shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
            <Film className="w-3.5 h-3.5 text-slate-800" />
            <span>Escenas</span>
          </div>

          <div className="flex-1 flex gap-1.5 h-14 bg-slate-50 rounded-xl p-1 overflow-hidden border border-slate-200">
            {scenes.map((scene, idx) => {
              const widthPercent = (scene.durationSec / totalDurationSec) * 100;

              return (
                <div
                  key={scene.id}
                  style={{ width: `${widthPercent}%` }}
                  className="h-full rounded-lg bg-white border border-slate-300 p-1.5 flex items-center justify-between gap-1.5 overflow-hidden group hover:border-slate-500 transition-all relative shadow-xs"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={scene.mediaUrl}
                      alt={scene.title}
                      className="w-8 h-10 rounded object-cover shrink-0 border border-slate-200"
                    />
                    <div className="truncate text-[10px] font-bold text-slate-900 leading-tight">
                      <div>#{idx + 1} {scene.subjectOrItem || `Escena ${idx + 1}`}</div>
                      <div className="text-[9px] text-slate-500 font-normal">{scene.durationSec}s</div>
                    </div>
                  </div>

                  {/* Botones de ajuste de duración rápida (+1s / -1s) */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-0.5 rounded shadow-xs shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeDuration(scene.id, scene.durationSec, -1);
                      }}
                      className="p-0.5 hover:bg-slate-100 rounded text-slate-600"
                      title="Reducir 1 segundo"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeDuration(scene.id, scene.durationSec, 1);
                      }}
                      className="p-0.5 hover:bg-slate-100 rounded text-slate-600"
                      title="Aumentar 1 segundo"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pista 2: Subtítulos Dinámicos */}
        <div className="flex items-center gap-3">
          <div className="w-24 shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
            <Type className="w-3.5 h-3.5 text-amber-600" />
            <span>Subtítulos</span>
          </div>

          <div className="flex-1 flex gap-1.5 h-8 bg-slate-50 rounded-xl p-1 overflow-hidden border border-slate-200">
            {scenes.map((scene, idx) => {
              const widthPercent = (scene.durationSec / totalDurationSec) * 100;
              const wordsCount = scene.words?.length || 0;

              return (
                <div
                  key={`sub-${scene.id}`}
                  style={{ width: `${widthPercent}%` }}
                  className="h-full rounded-lg bg-amber-50 border border-amber-200 px-2 flex items-center justify-between truncate text-[10px] text-amber-900 font-bold"
                >
                  <span className="truncate">
                    {wordsCount > 0 ? `💬 ${wordsCount} palabras` : '⚠️ Sin subtítulos'}
                  </span>
                  <span className="text-[9px] text-amber-700 font-mono shrink-0">#{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pista 3: Música de Fondo BGM */}
        <div className="flex items-center gap-3">
          <div className="w-24 shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
            <Music className="w-3.5 h-3.5 text-indigo-600" />
            <span>Música BGM</span>
          </div>

          <div className="flex-1 h-8 bg-slate-50 rounded-xl p-1 overflow-hidden border border-slate-200 flex items-center justify-between px-3">
            <div className="flex items-center gap-2 text-[10px] text-indigo-950 font-bold">
              <span>🎵 {project.bgmTrackId || 'Phonk Viral Beat'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-medium">Volumen:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={project.bgmVolume ?? 0.25}
                onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                className="w-20 accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-700 w-8 text-right">
                {Math.round((project.bgmVolume ?? 0.25) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
