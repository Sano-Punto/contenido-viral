import React, { useState } from 'react';
import { useLogStore } from '@/store/useLogStore';
import { Activity, Clock, Server, Terminal, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const LogsView: React.FC = () => {
  const { logs, clearLogs, addLog } = useLogStore();
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'ERROR' | 'PENDING'>('ALL');
  const [hasLoadedDbLogs, setHasLoadedDbLogs] = useState(false);

  React.useEffect(() => {
    async function loadDbLogs() {
      if (hasLoadedDbLogs) return;
      try {
        const res = await fetch('/api/logs');
        const data = await res.json();
        if (data.logs && Array.isArray(data.logs)) {
          // Si no hay logs en el store local, hidratar con los de Supabase
          if (logs.length === 0) {
            data.logs.forEach((dbLog: any) => {
              addLog({
                frameworkId: dbLog.framework_id,
                modelName: dbLog.model_name,
                callType: dbLog.call_type,
                status: dbLog.status,
                latencyMs: dbLog.latency_ms,
                requestPayload: dbLog.request_payload,
                responsePayload: dbLog.response_payload,
                message: `Persistido en Supabase (${dbLog.created_at})`,
              });
            });
          }
        }
      } catch (err) {
        console.warn('No se pudieron cargar logs de Supabase:', err);
      } finally {
        setHasLoadedDbLogs(true);
      }
    }
    loadDbLogs();
  }, [hasLoadedDbLogs, logs.length, addLog]);

  const filteredLogs = logs.filter((log) => filter === 'ALL' || log.status === filter);

  return (
    <div className="flex flex-col h-full bg-[#0d0e14] text-slate-300 font-mono text-xs">
      {/* Header Panel */}
      <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-silver-metallic" />
          <h2 className="font-semibold text-slate-100">AI Traceability & Logs</h2>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-[#1a1b26] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none"
          >
            <option value="ALL">All Events</option>
            <option value="SUCCESS">Success</option>
            <option value="ERROR">Errors</option>
            <option value="PENDING">Pending</option>
          </select>
          <button 
            onClick={clearLogs}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Clear Logs"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-px bg-white/5 border-b border-white/10 shrink-0">
        <div className="bg-[#0d0e14] p-3 flex flex-col gap-1">
          <span className="text-slate-500 uppercase text-[10px]">Total Calls</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{logs.length}</span>
          </div>
        </div>
        <div className="bg-[#0d0e14] p-3 flex flex-col gap-1">
          <span className="text-slate-500 uppercase text-[10px]">Avg Latency</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold">
              {logs.length > 0 
                ? Math.round(logs.reduce((acc, l) => acc + (l.latencyMs || 0), 0) / logs.length)
                : 0}ms
            </span>
          </div>
        </div>
        <div className="bg-[#0d0e14] p-3 flex flex-col gap-1">
          <span className="text-slate-500 uppercase text-[10px]">Models Active</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold truncate">Banana/Google</span>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-slate-600 mt-10">
            No system logs generated yet.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="border border-white/5 bg-white/5 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-2.5 bg-black/20 border-b border-white/5">
                <div className="flex items-center gap-2">
                  {log.status === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {log.status === 'ERROR' && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                  {log.status === 'PENDING' && <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
                  <span className="font-semibold text-slate-300">[{log.modelName}]</span>
                  <span className="text-slate-400">{log.callType}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  {log.latencyMs && <span>{log.latencyMs}ms</span>}
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="p-3 space-y-2 text-[11px]">
                {log.message && (
                  <div className="text-slate-300">{log.message}</div>
                )}
                
                {log.requestPayload && (
                  <div>
                    <span className="text-slate-500 mb-1 block">Request Payload:</span>
                    <pre className="bg-black/40 p-2 rounded text-emerald-300/80 overflow-x-auto whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                      {JSON.stringify(log.requestPayload, null, 2)}
                    </pre>
                  </div>
                )}
                
                {log.responsePayload && (
                  <div>
                    <span className="text-slate-500 mb-1 block">Response:</span>
                    <pre className="bg-black/40 p-2 rounded text-blue-300/80 overflow-x-auto whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                      {JSON.stringify(log.responsePayload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
