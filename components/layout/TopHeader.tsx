'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSystemStore } from '@/store/useProjectStore';
import { Plus, Film, Menu } from 'lucide-react';

const PATH_TITLES: Record<string, { titleMain: string; titleAccent: string }> = {
  '/generador-de-videos': { titleMain: 'Generador de', titleAccent: 'Videos' },
  '/': { titleMain: 'Generador de', titleAccent: 'Videos' },
  '/estudio-viral': { titleMain: 'Estudio', titleAccent: 'Viral' },
  '/estudio-remotion': { titleMain: 'Estudio', titleAccent: 'Viral' },
  '/biblioteca-creaciones': { titleMain: 'Biblioteca de', titleAccent: 'Creaciones' },
  '/formatos-frameworks': { titleMain: 'Formatos &', titleAccent: 'Frameworks' },
  '/biblioteca-medios': { titleMain: 'Biblioteca de', titleAccent: 'Medios' },
  '/cola-renders': { titleMain: 'Cola de', titleAccent: 'Renders' },
};

export const TopHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { resetProject, project, toggleMobileMenu } = useSystemStore();

  const info = PATH_TITLES[pathname] || { titleMain: 'Viral Studios', titleAccent: 'Plataforma' };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-6 sm:py-8 shadow-xs transition-all">
      <div className="flex items-center justify-between relative w-full">
        {/* Columna Izquierda: Botón Hamburguesa en Móvil */}
        <div className="flex items-center min-w-[40px]">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Columna Central: Título Centrado y Perfectamente Balanceado */}
        <div className="flex-1 text-center px-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight inline-flex items-center justify-center gap-2.5">
            <span className="leading-none">{info.titleMain}</span>
            <span className="font-serif italic font-bold text-silver-shine drop-shadow-sm leading-none">
              {info.titleAccent}
            </span>
          </h1>
        </div>

        {/* Columna Derecha: Espaciador equilibrado */}
        <div className="flex items-center justify-end min-w-[40px]" />
      </div>
    </header>
  );
};
