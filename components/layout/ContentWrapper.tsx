'use client';

import React from 'react';

/**
 * ContentWrapper — Contenedor aislado para el área de contenido principal.
 * Aplica el offset de 256px (w-64) respecto al sidebar fijo en desktop.
 * En móvil, ocupa 100% del ancho sin offset.
 */
export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div id="content-wrapper" className="flex flex-col min-h-screen bg-[#f6f3eb]">
        {children}
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
