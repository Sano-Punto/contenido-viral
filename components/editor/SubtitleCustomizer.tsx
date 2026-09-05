import React from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { SUBTITLE_PRESETS } from '@/lib/frameworks/definitions';
import { SubtitleStyleId } from '@/types';
import { Type, Check } from 'lucide-react';

export const SubtitleCustomizer: React.FC = () => {
  const { project, setSubtitleStyle } = useSystemStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Type className="w-4 h-4 text-slate-700" />
        <h3 className="font-bold text-gray-900 text-sm">Estilos de subtítulos</h3>
      </div>
      <p className="text-xs text-gray-500">
        Subtítulos dinámicos palabra por palabra para maximizar la retención.
      </p>

      <div className="grid grid-cols-1 gap-2">
        {Object.values(SUBTITLE_PRESETS).map((preset) => {
          const isSelected = project.subtitleStyleId === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => setSubtitleStyle(preset.id as SubtitleStyleId)}
              className={`cursor-pointer rounded-xl p-3 border transition-all ${
                isSelected
                  ? 'silver-selected'
                  : 'bg-[#faf7f2] border-[#ded7c8] hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-900">{preset.name}</span>
                {isSelected && <Check className="w-4 h-4 text-slate-800" />}
              </div>

              {/* Sample Subtitle Preview */}
              <div className="bg-black rounded-lg p-2 flex items-center justify-center text-center">
                <span
                  style={{
                    fontFamily: preset.fontFamily,
                    fontSize: '13px',
                    fontWeight: 900,
                    color: preset.highlightColor,
                    backgroundColor: preset.boxStyle ? (preset.backgroundColor || '#000') : 'transparent',
                    padding: preset.boxStyle ? '1px 5px' : '0',
                    borderRadius: '3px',
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
                    marginLeft: '5px',
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
  );
};
