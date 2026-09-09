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
  '/configuracion-apis': { titleMain: 'Configuración de', titleAccent: 'APIs' },
};

export const TopHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { resetProject, project, toggleMobileMenu } = useSystemStore();

  const info = PATH_TITLES[pathname] || { titleMain: 'Viral Studios', titleAccent: 'Plataforma' };

  return (
    <header className="sticky top-0 z-20 bg-[#f6f3eb]/95 backdrop-blur-md border-b border-[#e2dcce] px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-[#ede8dc] transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-[#14141e] tracking-tight">
            {info.titleMain}{' '}
            <span className="font-serif italic font-semibold text-silver-shine">
              {info.titleAccent}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {pathname !== '/generador-de-videos' && (
            <button
              type="button"
              onClick={() => {
                resetProject();
                router.push('/generador-de-videos');
              }}
              className="btn-dark-luxury inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo video</span>
            </button>
          )}

          {project.scenes.length > 0 && pathname !== '/estudio-remotion' && (
            <button
              type="button"
              onClick={() => router.push('/estudio-remotion')}
              className="btn-silver-luxury inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs shadow-sm"
            >
              <Film className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Estudio</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
