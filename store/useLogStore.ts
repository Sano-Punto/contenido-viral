import { create } from 'zustand';

export interface AILogEvent {
  id: string;
  timestamp: string;
  frameworkId: string;
  modelName: 'gemini-3-pro-image' | 'gemini-omni-flash-preview' | 'nano-banana-pro' | 'google-omni-flash' | string;
  callType: 'single_master_image' | 'scene_video_render' | 'script_generation' | 'info';
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
  latencyMs?: number;
  requestPayload?: any;
  responsePayload?: any;
  message?: string;
}

interface LogStore {
  logs: AILogEvent[];
  addLog: (log: Omit<AILogEvent, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  addLog: (logInput) => {
    const newLog: AILogEvent = {
      ...logInput,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      logs: [newLog, ...state.logs].slice(0, 100), // Keep last 100 logs in memory
    }));
  },
  clearLogs: () => set({ logs: [] }),
}));
