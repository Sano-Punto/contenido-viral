import React from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { Film, Type, Mic, Music } from 'lucide-react';

interface TimelineEditorProps {
  currentFrame: number;
  totalDurationSec: number;
  fps?: number;
  onSeek?: (frame: number) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  currentFrame,
  totalDurationSec,
  fps = 30,
}) => {
  const { project } = useSystemStore();
  const scenes = project.scenes || [];
  const currentTimeSec = currentFrame / fps;

  return (
    <div className="bg-white border border-[#e0dad0] rounded-2xl p-4 space-y-3 shadow-sm">
      {/* Header de la Timeline */}
      <div className="flex items-center justify-between text-xs text-gray-600 pb-2 border-b border-[#f0ebe0]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">Timeline Multipista</span>
          <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-200">
            {totalDurationSec}s / {totalDurationSec * fps} Frames
          </span>
        </div>
        <div className="font-mono text-purple-700 font-bold">
          {currentTimeSec.toFixed(1)}s / {totalDurationSec.toFixed(1)}s
        </div>
      </div>

      {/* Regla de Tiempo Superior */}
      <div className="relative h-6 bg-[#f7f4ed] rounded-lg overflow-hidden border border-[#e2ded5] flex items-center px-2">
        {Array.from({ length: Math.ceil(totalDurationSec / 5) + 1 }).map((_, i) => {
          const sec = i * 5;
          const leftPercent = (sec / totalDurationSec) * 100;
          if (leftPercent > 100) return null;

          return (
            <div
              key={sec}
              className="absolute top-0 bottom-0 border-l border-gray-300 text-[9px] font-mono text-gray-500 pl-1 pt-0.5"
              style={{ left: `${leftPercent}%` }}
            >
              {sec}s
            </div>
          );
        })}

        {/* Aguja de Reproducción (Playhead) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-purple-600 z-30 pointer-events-none"
          style={{ left: `${(currentTimeSec / totalDurationSec) * 100}%` }}
        >
          <div className="w-2.5 h-2.5 bg-purple-600 -ml-1 -top-1 absolute rounded-full" />
        </div>
      </div>

      {/* Pista 1: Escenas / Clips de Video */}
      <div className="flex items-center gap-3">
        <div className="w-24 shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
          <Film className="w-3.5 h-3.5 text-purple-600" />
          <span>Escenas</span>
        </div>
        <div className="flex-1 flex gap-1 h-12 bg-[#f7f4ed] rounded-xl p-1 overflow-hidden border border-[#e2ded5]">
          {scenes.map((scene, idx) => {
            const widthPercent = (scene.durationSec / totalDurationSec) * 100;

            return (
              <div
                key={scene.id}
                style={{ width: `${widthPercent}%` }}
                className="h-full rounded-lg bg-purple-100 border border-purple-300 p-1.5 flex items-center gap-2 overflow-hidden group hover:border-purple-500 transition-all cursor-pointer"
              >
                <img
                  src={scene.mediaUrl}
                  alt={scene.title}
                  className="w-7 h-7 rounded object-cover shrink-0"
                />
                <div className="truncate text-[10px] font-bold text-purple-950">
                  #{idx + 1} {scene.role} ({scene.durationSec}s)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pista 2: Subtítulos Dinámicos */}
      <div className="flex items-center gap-3">
        <div className="w-24 shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
          <Type className="w-3.5 h-3.5 text-amber-600" />
          <span>Subtítulos</span>
        </div>
        <div className="flex-1 flex gap-1 h-7 bg-[#f7f4ed] rounded-xl p-1 overflow-hidden border border-[#e2ded5]">
          {scenes.map((scene) => {
            const widthPercent = (scene.durationSec / totalDurationSec) * 100;

            return (
              <div
                key={`sub-${scene.id}`}
                style={{ width: `${widthPercent}%` }}
                className="h-full rounded-lg bg-amber-100 border border-amber-300 px-2 flex items-center truncate text-[10px] text-amber-900 font-bold"
              >
                📝 {scene.words.length} palabras
              </div>
            );
          })}
        </div>
      </div>

      {/* Pista 3: Locución / Voz en off */}
      <div className="flex items-center gap-3">
        <div className="w-24 shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
          <Mic className="w-3.5 h-3.5 text-emerald-600" />
          <span>Voz IA</span>
        </div>
        <div className="flex-1 flex gap-1 h-7 bg-[#f7f4ed] rounded-xl p-1 overflow-hidden border border-[#e2ded5]">
          {scenes.map((scene) => {
            const widthPercent = (scene.durationSec / totalDurationSec) * 100;

            return (
              <div
                key={`voice-${scene.id}`}
                style={{ width: `${widthPercent}%` }}
                className="h-full rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[10px] text-emerald-900 font-bold"
              >
                🎙️ TTS Audio
              </div>
            );
          })}
        </div>
      </div>

      {/* Pista 4: Música BGM */}
      <div className="flex items-center gap-3">
        <div className="w-24 shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
          <Music className="w-3.5 h-3.5 text-indigo-600" />
          <span>Música BGM</span>
        </div>
        <div className="flex-1 h-7 bg-[#f7f4ed] rounded-xl p-1 overflow-hidden border border-[#e2ded5]">
          <div className="w-full h-full rounded-lg bg-indigo-100 border border-indigo-300 px-3 flex items-center text-[10px] text-indigo-950 font-bold">
            🎵 {project.bgmTrackId || 'Phonk Viral Beat'} (Vol: {Math.round((project.bgmVolume ?? 0.25) * 100)}%)
          </div>
        </div>
      </div>
    </div>
  );
};
