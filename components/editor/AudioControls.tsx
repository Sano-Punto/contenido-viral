import React from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { BGM_TRACKS } from '@/lib/frameworks/definitions';
import { Music, Volume2, Mic, Check } from 'lucide-react';

export const AudioControls: React.FC = () => {
  const { project, setBgmTrack, setBgmVolume, setVoiceoverVolume } = useSystemStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Music className="w-4 h-4 text-slate-700" />
        <h3 className="font-bold text-gray-900 text-sm">Música de fondo & audio</h3>
      </div>

      {/* Sliders de Volumen */}
      <div className="space-y-3.5 bg-[#faf7f2] p-3.5 rounded-xl border border-[#ded7c8]">
        {/* Volumen de Voz en Off */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-slate-600" />
              Volumen locución IA:
            </span>
            <span className="text-slate-900 font-bold">{Math.round((project.voiceoverVolume ?? 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={project.voiceoverVolume ?? 1.0}
            onChange={(e) => setVoiceoverVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#e5e0d4] rounded-lg appearance-none cursor-pointer accent-slate-800"
          />
        </div>

        {/* Volumen de Música BGM */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-slate-600" />
              Volumen música de fondo:
            </span>
            <span className="text-slate-900 font-bold">{Math.round((project.bgmVolume ?? 0.25) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={project.bgmVolume ?? 0.25}
            onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#e5e0d4] rounded-lg appearance-none cursor-pointer accent-slate-800"
          />
        </div>
      </div>

      {/* Selector de Pistas BGM */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-800 block">
          Pistas disponibles:
        </label>
        <div className="space-y-2">
          {BGM_TRACKS.map((track) => {
            const isSelected = project.bgmTrackId === track.id;

            return (
              <div
                key={track.id}
                onClick={() => setBgmTrack(track.id)}
                className={`cursor-pointer rounded-xl p-3 border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'silver-selected'
                    : 'bg-[#faf7f2] border-[#ded7c8] hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-gray-900">{track.title}</div>
                  <div className="text-[11px] text-gray-500">{track.genre}</div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && <Check className="w-4 h-4 text-slate-800" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
