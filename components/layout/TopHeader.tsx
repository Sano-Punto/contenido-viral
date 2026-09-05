'use client';

import React from 'react';
import { useSystemStore, SystemView } from '@/store/useProjectStore';
import { Plus, Film, Menu } from 'lucide-react';

const VIEW_TITLES: Record<SystemView, { titleMain: string; titleAccent: string }> = {
  generator: { titleMain: 'Generador de', titleAccent: 'Videos' },
  editor: { titleMain: 'Estudio', titleAccent: 'Remotion' },
  frameworks: { titleMain: 'Formatos &', titleAccent: 'Frameworks' },
  'media-library': { titleMain: 'Biblioteca de', titleAccent: 'Medios' },
  'render-queue': { titleMain: 'Cola de', titleAccent: 'Renders' },
  'ai-settings': { titleMain: 'Configuración de', titleAccent: 'APIs' },
  logs: { titleMain: 'Logs &', titleAccent: 'Trazabilidad' },
};

export const TopHeader: React.FC = () => {
  const { activeView, setActiveView, resetProject, project, toggleMobileMenu } = useSystemStore();
  const info = VIEW_TITLES[activeView] || VIEW_TITLES.generator;

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
          {activeView !== 'generator' && (
            <button
              type="button"
              onClick={() => {
                resetProject();
                setActiveView('generator');
              }}
              className="btn-dark-luxury inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo video</span>
            </button>
          )}

          {project.scenes.length > 0 && activeView !== 'editor' && (
            <button
              type="button"
              onClick={() => setActiveView('editor')}
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
