'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { useSystemStore } from '@/store/useProjectStore';
import { ViralVideoComposition } from '@/components/remotion/ViralVideoComposition';
import { TimelineEditor } from './TimelineEditor';
import { SubtitleCustomizer } from './SubtitleCustomizer';
import { AudioControls } from './AudioControls';
import { Download, Type, Music, ArrowLeft, CheckCircle, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

export const EditorStudio: React.FC = () => {
  const { project, setStep, setActiveView } = useSystemStore();
  const playerRef = useRef<PlayerRef>(null);
  const [activeTab, setActiveTab] = useState<'subtitles' | 'audio' | 'scenes'>('subtitles');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const fps = 30;
  const scenes = project.scenes || [];
  const totalDurationSec = scenes.reduce((acc, s) => acc + s.durationSec, 0) || 24;
  const totalDurationFrames = Math.max(totalDurationSec * fps, 30);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const frame = playerRef.current.getCurrentFrame();
        if (typeof frame === 'number') {
          setCurrentFrame(frame);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#475569', '#64748b', '#94a3b8', '#cbd5e1', '#ffffff']
      });
      setTimeout(() => setExportSuccess(false), 5000);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header Superior del Editor */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#ded7c8] p-4 sm:p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setStep(4);
              setActiveView('generator');
            }}
            className="btn-arena p-2 rounded-xl transition-all"
            title="Volver al Storyboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate max-w-md">
                {project.title || 'Video Viral'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#f1f5f9] text-slate-800 border border-slate-300 uppercase">
                9:16 Vertical
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Estudio Remotion con subtítulos dinámicos y audio sincronizado
            </p>
          </div>
        </div>

        {/* Botón Principal de Exportar */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExport}
            className="btn-dark-luxury flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl disabled:opacity-50 text-xs shadow-md transition-all"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                <span>Renderizando video...</span>
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>¡Video listo!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-200" />
                <span>Exportar Video MP4</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid Central */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Remotion Player (5/12) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white border border-[#ded7c8] p-4 sm:p-6 rounded-2xl shadow-sm">
          <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border-4 border-[#121221] bg-black">
            {scenes.length > 0 ? (
              <Player
                ref={playerRef}
                component={ViralVideoComposition}
                inputProps={{ project }}
                durationInFrames={totalDurationFrames}
                fps={fps}
                compositionWidth={1080}
                compositionHeight={1920}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
                autoPlay={false}
                loop
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                Sin escenas configuradas
              </div>
            )}
          </div>
          <span className="text-[11px] text-gray-400 mt-3 font-medium">
            1080x1920 (TikTok / Reels / Shorts)
          </span>
        </div>

        {/* Columna Derecha: Panel de Herramientas de Edición (7/12) */}
        <div className="lg:col-span-7 bg-white border border-[#ded7c8] rounded-2xl p-5 shadow-sm flex flex-col h-full min-h-[480px]">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f7f4ed] rounded-xl border border-[#ded7c8] mb-5">
            <button
              type="button"
              onClick={() => setActiveTab('subtitles')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'subtitles'
                  ? 'btn-silver-luxury shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Subtítulos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'audio'
                  ? 'btn-silver-luxury shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Música & audio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('scenes')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'scenes'
                  ? 'btn-silver-luxury shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Escenas ({scenes.length})</span>
            </button>
          </div>

          {/* Contenido de la pestaña */}
          <div className="flex-1 overflow-y-auto pr-1">
            {activeTab === 'subtitles' && <SubtitleCustomizer />}
            {activeTab === 'audio' && <AudioControls />}
            {activeTab === 'scenes' && (
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 text-sm">Escenas del video</h3>
                {scenes.map((s, idx) => (
                  <div
                    key={s.id}
                    className="p-3 bg-[#f7f4ed] rounded-xl border border-[#ded7c8] flex items-center gap-3"
                  >
                    <img
                      src={s.mediaUrl}
                      alt={s.title}
                      className="w-12 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <strong className="text-gray-900">#{idx + 1} {s.title}</strong>
                        <span className="text-slate-800 font-bold">{s.durationSec}s</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate italic">
                        "{s.scriptText}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Inferior */}
      <TimelineEditor
        currentFrame={currentFrame}
        totalDurationSec={totalDurationSec}
        fps={fps}
        onSeek={(frame) => {
          if (playerRef.current) {
            playerRef.current.seekTo(frame);
          }
        }}
      />
    </div>
  );
};
