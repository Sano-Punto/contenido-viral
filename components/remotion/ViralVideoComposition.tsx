import React from 'react';
import { Sequence, Audio, AbsoluteFill } from 'remotion';
import { Project } from '@/types';
import { SceneClip } from './SceneClip';
import { ViralCaptions } from './ViralCaptions';
import { BGM_TRACKS } from '@/lib/frameworks/definitions';

interface ViralVideoCompositionProps {
  project: Project;
}

export const ViralVideoComposition: React.FC<ViralVideoCompositionProps> = ({ project }) => {
  const fps = 30;
  const scenes = project.scenes || [];
  const selectedBgm = BGM_TRACKS.find((b) => b.id === project.bgmTrackId);

  let currentFrameOffset = 0;

  return (
    <AbsoluteFill className="bg-black">
      {/* Pistas de Escenas en Secuencia */}
      {scenes.map((scene, index) => {
        const durationInFrames = Math.round(scene.durationSec * fps);
        const fromFrame = currentFrameOffset;
        currentFrameOffset += durationInFrames;

        return (
          <Sequence
            key={scene.id || index}
            from={fromFrame}
            durationInFrames={durationInFrames}
            name={`Scene ${index + 1}: ${scene.title}`}
          >
            {/* Visual Media (Imagen o Video con Ken Burns) */}
            <SceneClip scene={scene} />

            {/* Subtítulos animados de la escena */}
            <ViralCaptions
              words={scene.words || []}
              stylePresetId={project.subtitleStyleId}
            />

            {/* Audio de voz en off para la escena si existe */}
            {scene.audioVoiceUrl && (
              <Audio
                src={scene.audioVoiceUrl}
                volume={project.voiceoverVolume ?? 1.0}
              />
            )}
          </Sequence>
        );
      })}

      {/* Música de fondo BGM continua */}
      {selectedBgm && (
        <Audio
          src={selectedBgm.url}
          volume={project.bgmVolume ?? 0.25}
          loop
        />
      )}
    </AbsoluteFill>
  );
};
