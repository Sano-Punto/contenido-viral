'use client';

import React from 'react';

export const AmbientWaveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Esferas de luz ambiental difuminada */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-slate-200/40 via-slate-300/20 to-transparent blur-[140px] animate-spiral-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-slate-300/30 via-slate-200/20 to-transparent blur-[150px] animate-spiral-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-slate-100/50 to-slate-200/30 blur-[160px] animate-spiral-slow" />

      {/* Espiral Líquida 1: Superior Izquierda a Centro */}
      <div className="absolute -top-40 -left-40 w-[950px] h-[950px] opacity-[0.18] animate-spiral-slow origin-center">
        <svg viewBox="0 0 500 500" className="w-full h-full text-slate-500 fill-none stroke-current stroke-[1.2]">
          <path d="M 250, 250 m -220, 0 a 220,220 0 1,0 440,0 a 220,220 0 1,0 -440,0" strokeDasharray="12 18" />
          <path d="M 250, 250 m -180, 0 a 180,180 0 1,1 360,0 a 180,180 0 1,1 -360,0" strokeDasharray="8 14" />
          <path d="M 250, 250 m -140, 0 a 140,140 0 1,0 280,0 a 140,140 0 1,0 -280,0" strokeDasharray="6 10" />
          <path d="M 250, 250 m -100, 0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0" strokeDasharray="4 8" />
          <path d="M 250, 250 m -60, 0 a 60,60 0 1,0 120,0 a 60,60 0 1,0 -120,0" />
        </svg>
      </div>

      {/* Espiral Líquida 2: Inferior Derecha a Centro */}
      <div className="absolute -bottom-40 -right-40 w-[1100px] h-[1100px] opacity-[0.14] animate-spiral-reverse origin-center">
        <svg viewBox="0 0 500 500" className="w-full h-full text-slate-600 fill-none stroke-current stroke-[1.4]">
          <path d="M 250, 250 m -230, 0 a 230,230 0 1,1 460,0 a 230,230 0 1,1 -460,0" strokeDasharray="14 20" />
          <path d="M 250, 250 m -190, 0 a 190,190 0 1,0 380,0 a 190,190 0 1,0 -380,0" strokeDasharray="10 16" />
          <path d="M 250, 250 m -150, 0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0" strokeDasharray="8 12" />
          <path d="M 250, 250 m -110, 0 a 110,110 0 1,0 220,0 a 110,110 0 1,0 -220,0" strokeDasharray="5 9" />
          <path d="M 250, 250 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
        </svg>
      </div>

      {/* Espiral Central Fluida sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.08] animate-spiral-slow origin-center">
        <svg viewBox="0 0 600 600" className="w-full h-full text-slate-700 fill-none stroke-current stroke-[1]">
          <path d="M 300,300 Q 350,200 450,250 T 400,450 T 150,400 T 200,150 T 500,200" />
          <path d="M 300,300 Q 250,400 150,350 T 200,150 T 450,200 T 400,450 T 100,400" />
        </svg>
      </div>
    </div>
  );
};
