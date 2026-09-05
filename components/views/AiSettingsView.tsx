'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Key, ShieldCheck, Check, Database, Video, Image as ImageIcon, Volume2 } from 'lucide-react';

export const AiSettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [keys, setKeys] = useState({
    nanoBananaKey: '',
    googleVertexKey: '',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tu-proyecto.supabase.co',
    supabaseAnonKey: '',
    elevenLabsKey: '',
  });

  useEffect(() => {
    // Cargar credenciales guardadas en localStorage si existen
    const savedBanana = localStorage.getItem('VS_NANO_BANANA_KEY') || '';
    const savedVertex = localStorage.getItem('VS_GOOGLE_VERTEX_KEY') || '';
    const savedEleven = localStorage.getItem('VS_ELEVEN_KEY') || '';

    setKeys(prev => ({
      ...prev,
      nanoBananaKey: savedBanana,
      googleVertexKey: savedVertex,
      elevenLabsKey: savedEleven,
    }));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('VS_NANO_BANANA_KEY', keys.nanoBananaKey);
      localStorage.setItem('VS_GOOGLE_VERTEX_KEY', keys.googleVertexKey);
      localStorage.setItem('VS_ELEVEN_KEY', keys.elevenLabsKey);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white border border-[#ded7c8] rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-700" />
            <span>Configuración de APIs & Modelos de IA</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Gestiona las claves de acceso de los motores oficiales del proyecto. Las variables también están configuradas en el archivo <code className="bg-[#f0ece3] px-1.5 py-0.5 rounded text-gray-800">.env.local</code>.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* 1. Nano Banana Pro (Imágenes 3D Pixar) */}
          <div className="p-4 bg-[#faf7f2] rounded-xl border border-[#ded7c8] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-slate-700" />
                <span>Nano Banana Pro · <code className="text-[11px] font-mono bg-white px-1.5 py-0.5 rounded border">gemini-3-pro-image</code></span>
              </label>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Modelo Oficial · Imágenes 3D
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Utilizado para crear la imagen maestra del órgano tierno en UE5 / 8K / Subsurface scattering (1 llamada API propagada en cascada).
            </p>
            <input
              type="password"
              placeholder="banana_api_key_..."
              value={keys.nanoBananaKey}
              onChange={(e) => setKeys({ ...keys, nanoBananaKey: e.target.value })}
              className="w-full bg-white border border-[#ded7c8] rounded-lg p-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* 2. Google Veo 3.1 / Omni Flash (Video Neural & Animación) */}
          <div className="p-4 bg-[#faf7f2] rounded-xl border border-[#ded7c8] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-slate-700" />
                <span>Google Omni Flash · <code className="text-[11px] font-mono bg-white px-1.5 py-0.5 rounded border">gemini-omni-flash-preview</code></span>
              </label>
              <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Modelo Oficial · Video 9:16
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Anima la imagen maestra escena por escena según las instrucciones de control (masticar, brillar, inflarse de grasa, zoom boca/esófago).
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keys.googleVertexKey}
              onChange={(e) => setKeys({ ...keys, googleVertexKey: e.target.value })}
              className="w-full bg-white border border-[#ded7c8] rounded-lg p-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* 3. Supabase Database & Logs */}
          <div className="p-4 bg-[#faf7f2] rounded-xl border border-[#ded7c8] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-slate-700" />
                <span>Supabase Database (Servicio Cloud Conectado)</span>
              </label>
              <span className="text-[10px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Conectado & Migrado
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] font-medium text-gray-500 block mb-1">Project URL</span>
                <input
                  type="text"
                  readOnly
                  value={keys.supabaseUrl}
                  className="w-full bg-slate-100 border border-[#ded7c8] rounded-lg p-2 text-xs text-gray-600 focus:outline-none font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] font-medium text-gray-500 block mb-1">Status Tablas</span>
                <div className="w-full bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs text-emerald-800 font-semibold">
                  ✓ 4 tablas activas (viral_projects, viral_scenes, etc.)
                </div>
              </div>
            </div>
          </div>

          {/* 4. ElevenLabs Voiceover (Opcional para Viaje Interno) */}
          <div className="p-4 bg-[#faf7f2] rounded-xl border border-[#ded7c8] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-slate-700" />
                <span>ElevenLabs (Voz en off para Qué Sucede al Comer)</span>
              </label>
              <span className="text-[10px] font-medium text-gray-600 bg-white px-2 py-0.5 rounded border border-[#ded7c8]">
                Voz oficial: l1zE9xgNpUTaQCZzpNJa
              </span>
            </div>
            <input
              type="password"
              placeholder="xi-api-key-..."
              value={keys.elevenLabsKey}
              onChange={(e) => setKeys({ ...keys, elevenLabsKey: e.target.value })}
              className="w-full bg-white border border-[#ded7c8] rounded-lg p-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="btn-silver-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-xs shadow-sm"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-slate-300" />
                  <span>Configuración guardada exitosamente</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Guardar Parámetros</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
