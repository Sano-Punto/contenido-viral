'use client';

import React from 'react';
import { useSystemStore, SystemView } from '@/store/useProjectStore';
import {
  Wand2,
  Film,
  Layers,
  FolderOpen,
  ListOrdered,
  Settings,
  TrendingUp,
  X,
  Activity,
} from 'lucide-react';

interface MenuItem {
  id: SystemView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'generator', label: 'Generador de videos', icon: Wand2, badge: 'IA' },
  { id: 'editor', label: 'Estudio Remotion', icon: Film },
  { id: 'frameworks', label: 'Formatos & frameworks', icon: Layers, badge: '6' },
  { id: 'media-library', label: 'Biblioteca de medios', icon: FolderOpen },
  { id: 'render-queue', label: 'Cola de renders', icon: ListOrdered },
  { id: 'logs', label: 'Logs & Trazabilidad', icon: Activity, badge: 'En vivo' },
  { id: 'ai-settings', label: 'Configuración & APIs', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, isMobileMenuOpen, setMobileMenuOpen } = useSystemStore();

  const handleSelectView = (view: SystemView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full text-gray-300 select-none">
      <div>
        {/* Header / Logo con línea en ascendencia y nombre Viral Studios con gradiente plateado */}
        <div className="p-5 border-b border-[#1c1e26] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2d303a] via-[#565b6e] to-[#a8b1c4] flex items-center justify-center shadow-lg shadow-black/50 border border-white/20 shrink-0">
              <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div
                className="font-sans font-black text-xl sm:text-[22px] tracking-tight leading-none text-silver-metallic"
                style={{
                  background: 'linear-gradient(120deg, #ffffff 0%, #e2e8f0 20%, #8590a6 45%, #cbd5e1 70%, #ffffff 90%, #64748b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Viral Studios
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                Generación de Videos con IA
              </div>
            </div>
          </div>

          {/* Botón de Cerrar en Móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1c1e26] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Espaciado antes del nav */}
        <div className="pt-4" />

        {/* Lista de Navegación con toque silver de lujo */}
        <nav className="px-3 space-y-1 pt-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20 shadow-sm font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#161720]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-slate-200' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#2b2d38] text-slate-200 border border-[#484b5c]'
                        : 'bg-[#181922] text-gray-400 border border-[#262836]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-[#1c1e26] text-[11px] text-gray-500 text-center">
        Viral Studios v1.0
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Sidebar Fijo Estático para Escritorio (md:) */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 h-screen w-64 bg-[#0d0e14] border-r border-[#1c1e26] z-40 flex-col justify-between overflow-y-auto">
        {SidebarContent}
      </aside>

      {/* 2. Menú Móvil Hamburguesa */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-72 max-w-[85vw] bg-[#0d0e14] border-r border-[#1c1e26] h-full shadow-2xl z-10 flex flex-col justify-between">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
