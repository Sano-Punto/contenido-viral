'use client';

import React from 'react';

export const AmbientWaveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Esferas de luz plateada líquida con movimiento orgánico */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-slate-200/50 via-slate-300/30 to-transparent blur-[120px] animate-wave-slow" />
      <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-slate-300/40 via-blue-100/30 to-transparent blur-[130px] animate-wave-reverse" />
      <div className="absolute -bottom-32 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-t from-slate-200/60 via-slate-100/40 to-transparent blur-[140px] animate-wave-slow" />

      {/* Olas líquidas vectoriales SVG con transparencia platino */}
      <div className="absolute bottom-0 left-0 w-[200%] h-48 opacity-25 animate-liquid-wave">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full text-slate-300 fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-[200%] h-64 opacity-15 animate-liquid-wave [animation-duration:28s] [animation-direction:reverse]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full text-slate-400 fill-current"
        >
          <path d="M0,30 C200,110 450,10 700,80 C950,150 1100,20 1200,40 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
};
