'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSystemStore } from '@/store/useProjectStore';
import {
  ListOrdered,
  Download,
  Video,
  Sparkles,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

interface ProjectJob {
  id: string;
  title: string;
  framework_id: string;
  scenes_count: number;
  status: string;
  created_at: string;
  master_image_url?: string;
}

export const RenderQueueView: React.FC = () => {
  const router = useRouter();
  const { project } = useSystemStore();
  const [dbProjects, setDbProjects] = useState<ProjectJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.projects) {
          setDbProjects(data.projects);
        }
      } catch (err) {
        console.error('Error cargando proyectos de la base de datos:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const activeProjects: ProjectJob[] = [...dbProjects];
  if (project.scenes.length > 0 && !activeProjects.some(p => p.title === project.title)) {
    activeProjects.unshift({
      id: project.id || 'current-project',
      title: project.title || 'Proyecto en Curso',
      framework_id: project.frameworkId,
      scenes_count: project.scenes.length,
      status: project.status,
      created_at: project.createdAt || new Date().toISOString(),
      master_image_url: project.scenes[0]?.mediaUrl,
    });
  }

  const completedCount = activeProjects.filter(p => p.status === 'ready' || p.status === 'exported').length;
  const inProgressCount = activeProjects.filter(p => p.status === 'rendering' || p.status === 'storyboarding').length;

  return (
    <div className="space-y-6">
      {/* Indicadores Superiores Reales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Videos en sistema</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{activeProjects.length}</div>
          <div className="text-[11px] text-slate-600 mt-1">{completedCount} listos para exportar</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Pipeline Activo</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{inProgressCount}</div>
          <div className="text-[11px] text-slate-600 mt-1">En storyboard o render</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Resolución de Salida</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">1080x1920</div>
          <div className="text-[11px] text-slate-500 mt-1">9:16 Vertical · 30 FPS</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Motor de Video</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">Remotion</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Google Omni Flash</div>
        </div>
      </div>

      {/* Lista de Trabajos Reales */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-slate-700" />
              <span>Cola de producción y renders</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historial de proyectos y composiciones generadas con IA.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/generador-de-videos')}
            className="btn-dark-luxury inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-200" />
            <span>+ Nuevo Video</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-slate-600" />
            <span className="text-xs">Consultando Supabase...</span>
          </div>
        ) : activeProjects.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FolderOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-semibold text-slate-600">No hay videos en cola de render aún</div>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Comienza en el Generador de Videos para crear tu primer proyecto con superalimentos o viaje biológico.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeProjects.map((job) => (
              <div
                key={job.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-400 transition-all"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{job.title}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shrink-0 uppercase">
                      {job.framework_id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{job.scenes_count} escenas ({job.scenes_count * 8}s)</span>
                    <span>•</span>
                    <span>{new Date(job.created_at).toLocaleDateString()} {new Date(job.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => router.push('/estudio-remotion')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Abrir en Estudio</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
