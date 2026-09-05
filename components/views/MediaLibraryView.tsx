'use client';

import React, { useState } from 'react';
import { FolderOpen, Music, Play, Image as ImageIcon } from 'lucide-react';
import { BGM_TRACKS } from '@/lib/frameworks/definitions';
import { useSystemStore } from '@/store/useProjectStore';

export const MediaLibraryView: React.FC = () => {
  const { project } = useSystemStore();
  const [filter, setFilter] = useState<'all' | 'images' | 'audio'>('all');

  // Obtener medios reales generados en el proyecto actual
  const realGeneratedImages = project.scenes
    .filter((s) => s.mediaUrl)
    .map((s, idx) => ({
      id: s.id || `media-${idx}`,
      title: s.title || `Escena ${idx + 1}`,
      url: s.mediaUrl,
      tag: s.subjectOrItem || '3D Pixar Clip',
    }));

  return (
    <div className="space-y-6">
      {/* Header y Filtros */}
      <div className="bg-white border border-[#ded7c8] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-gray-700" />
            <span>Biblioteca de medios del proyecto</span>
          </h3>
          <p className="text-xs text-gray-500">
            Recursos visuales 9:16 generados con Nano Banana Pro y pistas de audio licenciadas.
          </p>
        </div>

        {/* Botones de Filtro */}
        <div className="flex items-center gap-1 bg-[#f7f4ed] p-1 rounded-xl border border-[#ded7c8]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all' ? 'btn-silver-luxury text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todos ({realGeneratedImages.length + BGM_TRACKS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('images')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'images' ? 'btn-silver-luxury text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Visuales 9:16 ({realGeneratedImages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('audio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'audio' ? 'btn-silver-luxury text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pistas BGM ({BGM_TRACKS.length})
          </button>
        </div>
      </div>

      {/* Grid de Imágenes 9:16 Reales */}
      {(filter === 'all' || filter === 'images') && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-slate-700" />
            <span>Visuales generados con IA (9:16)</span>
          </h4>

          {realGeneratedImages.length === 0 ? (
            <div className="bg-white border border-[#ded7c8] rounded-xl p-8 text-center text-gray-400 space-y-1.5">
              <ImageIcon className="w-6 h-6 text-gray-300 mx-auto" />
              <div className="text-xs font-semibold text-gray-600">No hay visuales generados en esta sesión</div>
              <p className="text-[11px] text-gray-400">
                Cuando generes escenas con Nano Banana Pro en el Generador, aparecerán catalogadas aquí en tiempo real.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {realGeneratedImages.map((img) => (
                <div
                  key={img.id}
                  className="bg-white border border-[#ded7c8] rounded-xl overflow-hidden group hover:border-gray-400 transition-all shadow-sm flex flex-col"
                >
                  <div className="relative aspect-[9/16] overflow-hidden bg-black">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white border border-white/10">
                      {img.tag}
                    </span>
                  </div>
                  <div className="p-2">
                    <div className="text-[11px] font-medium text-gray-900 truncate">{img.title}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid de Pistas de Audio Licenciadas */}
      {(filter === 'all' || filter === 'audio') && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-slate-700" />
            <span>Pistas de música de fondo (BGM)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BGM_TRACKS.map((track) => (
              <div
                key={track.id}
                className="p-3 bg-white border border-[#ded7c8] rounded-xl flex items-center justify-between hover:border-gray-400 shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f6f3eb] border border-[#ded7c8] flex items-center justify-center text-gray-700">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">{track.title}</div>
                    <div className="text-[11px] text-gray-500">{track.genre} • {track.durationSec}s</div>
                  </div>
                </div>

                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#f7f4ed] hover:bg-neutral-800 hover:text-white text-gray-700 border border-[#ded7c8] transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
