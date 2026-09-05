import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Img, Video } from 'remotion';
import { Scene } from '@/types';

interface SceneClipProps {
  scene: Scene;
}

export const SceneClip: React.FC<SceneClipProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Animación suave de zoom / Ken Burns effect para dar dinamismo a la escena fija
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame, [0, durationInFrames], [0, -10], {
    extrapolateRight: 'clamp',
  });

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
      {scene.mediaType === 'video' ? (
        <Video
          src={scene.mediaUrl}
          className="w-full h-full object-cover"
          style={{ transform: `scale(${scale})` }}
        />
      ) : (
        <Img
          src={scene.mediaUrl}
          className="w-full h-full object-cover"
          style={{
            transform: `scale(${scale}) translateY(${translateY}px)`,
          }}
        />
      )}

      {/* Gradiente sutil para maximizar legibilidad de subtítulos */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />
      
      {/* Badge discreto del rol de escena en la esquina superior */}
      <div className="absolute top-8 left-8 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase tracking-wider text-purple-300">
        {scene.role}
      </div>
    </div>
  );
};
