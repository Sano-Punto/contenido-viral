'use client';

import React from 'react';
import { AmbientWaveBackground } from './AmbientWaveBackground';

/**
 * ContentWrapper — Contenedor aislado para el área de contenido principal.
 * Aplica el offset de 256px (w-64) respecto al sidebar fijo en desktop.
 * En móvil, ocupa 100% del ancho sin offset.
 */
export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div id="content-wrapper" className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50/90 to-slate-100/70 w-full min-w-0 relative overflow-hidden">
        <AmbientWaveBackground />
        <div className="relative z-10 flex flex-col flex-1 w-full min-w-0">
          {children}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          #content-wrapper {
            margin-left: 256px;
          }
        }
      `}</style>
    </>
  );
};
