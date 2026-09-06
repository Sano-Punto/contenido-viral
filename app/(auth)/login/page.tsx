'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isUnauthorized = searchParams.get('error') === 'unauthorized';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="w-full bg-[#0a0a0a] border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/10 to-transparent rounded-3xl pointer-events-none" />
      
      <form onSubmit={handleLogin} className="space-y-6 relative z-10">
        {isUnauthorized && (
          <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400 leading-relaxed">
              Acceso denegado. Este usuario no tiene permisos administrativos para acceder a la plataforma.
            </p>
          </div>
        )}
        
        {error && !isUnauthorized && (
          <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400 leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">
              Email Privado
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dominio.com"
              className="w-full bg-[#121212] border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all placeholder:text-slate-700"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">
              Contraseña de Seguridad
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#121212] border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all placeholder:text-slate-700"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-slate-200 font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(51,65,85,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group border border-slate-600/50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
              <span>Autenticar Sesión</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Luces y brillos de fondo */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-slate-800/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-700/20 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md flex flex-col items-center z-10"
      >
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 p-[2px] shadow-[0_0_30px_rgba(148,163,184,0.3)]">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-slate-300" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-200 via-slate-400 to-slate-600 mb-2">
            Viral Studio
          </h1>
          <p className="text-sm font-medium tracking-widest text-slate-500 uppercase">
            Secured Access
          </p>
        </div>

        <Suspense fallback={
          <div className="w-full bg-[#0a0a0a] border border-slate-800 rounded-3xl p-8 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </motion.div>
      
      <div className="absolute bottom-8 text-center w-full">
        <p className="text-[10px] font-medium tracking-widest text-slate-700 uppercase">
          Restricted System Access • Viral Studio
        </p>
      </div>
    </div>
  );
}
