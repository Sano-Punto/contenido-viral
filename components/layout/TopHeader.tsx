'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSystemStore } from '@/store/useProjectStore';
import { Plus, Film, Menu } from 'lucide-react';

const PATH_TITLES: Record<string, { titleMain: string; titleAccent: string }> = {
  '/generador-de-videos': { titleMain: 'Generador de', titleAccent: 'Videos' },
  '/': { titleMain: 'Generador de', titleAccent: 'Videos' },
  '/estudio-remotion': { titleMain: 'Estudio', titleAccent: 'Remotion' },
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

        {/* Columna Central: Título Centrado y Destacado con amplio espacio superior */}
        <div className="flex-1 text-center px-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>{info.titleMain}</span>
            <span className="font-serif italic font-extrabold text-silver-shine drop-shadow-sm">
              {info.titleAccent}
            </span>
          </h1>
        </div>

        {/* Columna Derecha: Botones de Acción */}
        <div className="flex items-center justify-end gap-2.5 min-w-[40px]">
          {pathname !== '/generador-de-videos' && (
            <button
              type="button"
              onClick={() => {
                resetProject();
                router.push('/generador-de-videos');
              }}
              className="btn-dark-luxury inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs shadow-sm"
            >
              <Plus className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">Nuevo video</span>
            </button>
          )}

          {project.scenes.length > 0 && pathname !== '/estudio-remotion' && (
            <button
              type="button"
              onClick={() => router.push('/estudio-remotion')}
              className="btn-silver-luxury inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs shadow-sm"
            >
              <Film className="w-4 h-4 text-slate-800" />
              <span className="hidden sm:inline">Estudio</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
