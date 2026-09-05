import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SubtitleWord, SubtitleStylePreset } from '@/types';
import { SUBTITLE_PRESETS } from '@/lib/frameworks/definitions';

interface ViralCaptionsProps {
  words: SubtitleWord[];
  stylePresetId: string;
}

export const ViralCaptions: React.FC<ViralCaptionsProps> = ({ words, stylePresetId }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / fps;

  const preset: SubtitleStylePreset = SUBTITLE_PRESETS[stylePresetId] || SUBTITLE_PRESETS['hormozi'];

  // Agrupar palabras en fragmentos de 3-4 palabras para que aparezcan en pantalla
  // y resaltar la palabra activa en el segundo actual
  const activeWordIndex = words.findIndex(
    (w) => currentTimeSec >= w.start && currentTimeSec <= w.end
  );

  if (activeWordIndex === -1 && words.length > 0) {
    // Si estamos antes o entre palabras, buscar la más cercana
    const nextOrPrev = words.find((w) => currentTimeSec >= w.start - 0.2 && currentTimeSec <= w.end + 0.3);
    if (!nextOrPrev) return null;
  }

  // Tomamos una ventana de 3 palabras centrada en la palabra activa
  const startIndex = Math.max(0, activeWordIndex - 1);
  const visibleWords = words.slice(startIndex, startIndex + 3);

  if (visibleWords.length === 0) return null;

  return (
    <div className="absolute inset-x-0 bottom-32 z-20 flex items-center justify-center px-8 text-center pointer-events-none">
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-[85%]">
        {visibleWords.map((word, idx) => {
          const isCurrentlyActive = currentTimeSec >= word.start && currentTimeSec <= word.end;
          
          // Efecto de pop/rebote para la palabra activa
          const wordFrameOffset = Math.max(0, frame - Math.round(word.start * fps));
          const scale = isCurrentlyActive
            ? spring({
                frame: wordFrameOffset,
                fps,
                config: { damping: 12, mass: 0.5, stiffness: 200 },
              }) * 0.15 + 1.05
            : 1.0;

          const textColor = isCurrentlyActive
            ? preset.highlightColor
            : preset.textColor;

          return (
            <span
              key={`${word.text}-${idx}-${word.start}`}
              style={{
                fontFamily: preset.fontFamily,
                fontSize: `${preset.fontSize}px`,
                fontWeight: 900,
                color: textColor,
                textTransform: preset.uppercase ? 'uppercase' : 'none',
                textShadow: preset.textShadow,
                transform: `scale(${scale})`,
                display: 'inline-block',
                transition: 'transform 0.05s ease-out',
                backgroundColor: preset.boxStyle && isCurrentlyActive ? (preset.backgroundColor || '#000000') : 'transparent',
                padding: preset.boxStyle && isCurrentlyActive ? '2px 8px' : '0px',
                borderRadius: preset.boxStyle ? '6px' : '0px',
              }}
              className="tracking-wide drop-shadow-2xl"
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
