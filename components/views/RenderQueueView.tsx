'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSystemStore } from '@/store/useProjectStore';
import {
  ListOrdered,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  Server,
  Code2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';

interface ApiLog {
  id: string;
  project_id?: string;
  framework_id?: string;
  model_name?: string;
  call_type?: string;
  request_payload?: any;
  response_payload?: any;
  latency_ms?: number;
  status: string;
  created_at: string;
}

export const RenderQueueView: React.FC = () => {
  const router = useRouter();
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'ERROR'>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      }
    } catch (err) {
      console.error('Error cargando logs de la API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalCalls = logs.length;
  const successCalls = logs.filter((l) => l.status === 'SUCCESS').length;
  const errorCalls = logs.filter((l) => l.status === 'ERROR').length;
  const avgLatency =
    totalCalls > 0
      ? Math.round(logs.reduce((acc, l) => acc + (l.latency_ms || 0), 0) / totalCalls)
      : 0;

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'ALL' || log.status === filter;
    const matchesSearch =
      !searchTerm ||
      (log.call_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.framework_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.model_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Indicadores Métricos de las Llamadas API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Llamadas API</span>
            <Activity className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalCalls}</div>
          <div className="text-[11px] text-slate-500 mt-1">Registradas en base de datos</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exitosas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{successCalls}</div>
          <div className="text-[11px] text-slate-500 mt-1">Status HTTP 200 OK</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Errores / Cuota</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-2">{errorCalls}</div>
          <div className="text-[11px] text-slate-500 mt-1">Fallos o límites de API</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latencia Promedio</span>
            <Clock className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{avgLatency}ms</div>
          <div className="text-[11px] text-slate-500 mt-1">Tiempo de respuesta</div>
        </div>
      </div>

      {/* Panel Principal de Logs de la Cola y API */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Header y Filtros */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-slate-700" />
              <span>Cola de Renders y Registro de Llamadas API</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Auditoría en tiempo real de cada llamada a la API con sus payloads, códigos de error y respuestas.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={fetchLogs}
              disabled={isLoading}
              className="btn-silver-luxury inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 shadow-xs"
              title="Recargar registros"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/generador-de-videos')}
              className="btn-dark-luxury inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-200" />
              <span>Nuevo Video</span>
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros de Estado */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por tipo de llamada, modelo o framework..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'ALL' ? 'btn-silver-luxury text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({logs.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('SUCCESS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'SUCCESS' ? 'btn-silver-luxury text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exitosos ({successCalls})
            </button>
            <button
              type="button"
              onClick={() => setFilter('ERROR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'ERROR' ? 'btn-silver-luxury text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Errores ({errorCalls})
            </button>
          </div>
        </div>

        {/* Lista de Registros */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-slate-600 mx-auto" />
            <div className="text-xs font-semibold">Consultando registros en la base de datos...</div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
            <Code2 className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-bold text-slate-700">No hay llamadas API registradas</div>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Cuando ejecutes una prueba o generes un video en el Generador, cada llamada aparecerá aquí con su código de estado y payload.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const isSuccess = log.status === 'SUCCESS';
              const dateStr = new Date(log.created_at).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isSuccess
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                  }`}
                >
                  {/* Fila Resumen */}
                  <div
                    onClick={() => toggleExpand(log.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSuccess
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                            : 'bg-rose-100 border border-rose-200 text-rose-600'
                        }`}
                      >
                        {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-900">
                            {log.call_type || 'API Call'}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                            {log.model_name || 'IA Engine'}
                          </span>
                          {log.framework_id && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 uppercase">
                              {log.framework_id}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {dateStr}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                        {log.latency_ms ? `${log.latency_ms}ms` : '0ms'}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                          isSuccess
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-100 text-rose-700 border-rose-200'
                        }`}
                      >
                        {isSuccess ? 'STATUS 200 OK' : 'ERROR'}
                      </span>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Panel Expandido: Payload y Respuesta en Código */}
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-slate-100 space-y-3 bg-slate-50/50">
                      {/* Request Payload */}
                      {log.request_payload && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Code2 className="w-3 h-3 text-slate-600" />
                            <span>Request Payload (Enviado a la API):</span>
                          </span>
                          <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl text-[11px] font-mono overflow-x-auto whitespace-pre-wrap break-words max-h-52 border border-slate-800">
                            {JSON.stringify(log.request_payload, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Response Payload / Error details */}
                      {log.response_payload && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Server className="w-3 h-3 text-slate-600" />
                            <span>Response Payload (Respuesta recibida):</span>
                          </span>
                          <pre
                            className={`p-3 rounded-xl text-[11px] font-mono overflow-x-auto whitespace-pre-wrap break-words max-h-52 border ${
                              isSuccess
                                ? 'bg-slate-900 text-emerald-300 border-slate-800'
                                : 'bg-rose-950 text-rose-200 border-rose-900'
                            }`}
                          >
                            {JSON.stringify(log.response_payload, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
