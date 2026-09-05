import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const {
      prompt,
      frameworkId = 'super-alimentos',
      model = 'gemini-3-pro-image', // Google Official: gemini-3-pro-image (Nano Banana Pro)
      aspectRatio = '9:16',
      projectId = null,
      callType = 'single_master_image',
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'El parámetro prompt es obligatorio.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NANO_BANANA_PRO_API_KEY || '';
    const googleKey = process.env.GOOGLE_VERTEX_API_KEY || '';
    const hasRealKey = apiKey && apiKey !== 'tu_nano_banana_api_key_aqui';

    let generatedUrl = '';
    let apiStatus: 'SUCCESS' | 'ERROR' | 'AWAITING_KEY' = 'SUCCESS';
    let rawResponse: any = {};

    const requestPayload = {
      model,
      prompt,
      aspect_ratio: aspectRatio,
      framework_id: frameworkId,
      call_type: callType,
      timestamp: new Date().toISOString(),
    };

    if (hasRealKey) {
      // LLAMADA HTTP REAL A NANO BANANA PRO / PROVEEDOR
      try {
        const response = await fetch('https://api.banana.dev/v1/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            modelKey: 'nano-banana-pro',
            modelInputs: {
              prompt,
              negative_prompt: 'text, watermark, ugly, gore, dirty textures, blurry',
              aspect_ratio: aspectRatio,
              num_inference_steps: 30,
            },
          }),
        });

        rawResponse = await response.json();
        if (response.ok && rawResponse?.modelOutputs?.[0]?.image_url) {
          generatedUrl = rawResponse.modelOutputs[0].image_url;
          apiStatus = 'SUCCESS';
        } else if (response.ok && rawResponse?.image_url) {
          generatedUrl = rawResponse.image_url;
          apiStatus = 'SUCCESS';
        } else {
          apiStatus = 'ERROR';
        }
      } catch (err: any) {
        console.error('Error llamando a Nano Banana Pro:', err);
        apiStatus = 'ERROR';
        rawResponse = { error: err.message };
      }
    } else {
      // Si aún no se ingresa la API Key real, NO usamos fotos falsas de Unsplash.
      // Generamos un render visual SVG estilizado 9:16 en alta resolución que refleja fielmente el prompt y estado.
      apiStatus = 'AWAITING_KEY';
      const cleanPrompt = prompt.replace(/"/g, "'").slice(0, 120);
      const svgGraphic = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0b0d14"/>
            <stop offset="50%" stop-color="#181a26"/>
            <stop offset="100%" stop-color="#0f111a"/>
          </linearGradient>
          <linearGradient id="silver" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="50%" stop-color="#cbd5e1"/>
            <stop offset="100%" stop-color="#94a3b8"/>
          </linearGradient>
        </defs>
        <rect width="1080" height="1920" fill="url(#bg)"/>
        <rect x="60" y="60" width="960" height="1800" rx="40" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="4"/>
        <circle cx="540" cy="700" r="220" fill="#1e2235" stroke="rgba(255,255,255,0.2)" stroke-width="3"/>
        <text x="540" y="690" font-family="system-ui, sans-serif" font-size="72" text-anchor="middle" fill="#f8fafc">✨ 3D PIXAR</text>
        <text x="540" y="760" font-family="system-ui, sans-serif" font-size="32" text-anchor="middle" fill="#94a3b8">NANO BANANA PRO</text>
        <rect x="120" y="1040" width="840" height="280" rx="24" fill="#12141f" stroke="#2b3047" stroke-width="2"/>
        <text x="540" y="1120" font-family="system-ui, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="url(#silver)">FRAMEWORK: ${frameworkId.toUpperCase()}</text>
        <text x="540" y="1190" font-family="system-ui, sans-serif" font-size="26" text-anchor="middle" fill="#e2e8f0">${cleanPrompt}...</text>
        <rect x="240" y="1460" width="600" height="90" rx="45" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="2"/>
        <text x="540" y="1516" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#fbbf24">⏳ LISTO PARA API KEY (NANO BANANA PRO)</text>
      </svg>`;

      generatedUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgGraphic)}`;
      rawResponse = {
        notice: 'Estructura lista para API Key real de Nano Banana Pro en .env.local',
        configuredKey: false,
      };
    }

    const latencyMs = Date.now() - startTime;

    // REGISTRO DE TRAZABILIDAD REAL EN SUPABASE
    try {
      if (supabaseServer) {
        await supabaseServer.from('viral_generation_logs').insert({
          project_id: projectId,
          framework_id: frameworkId,
          model_name: model,
          call_type: callType,
          request_payload: requestPayload,
          response_payload: {
            ...rawResponse,
            hasRealKey,
            generatedUrlLength: generatedUrl.length,
          },
          latency_ms: latencyMs,
          status: apiStatus === 'ERROR' ? 'ERROR' : 'SUCCESS',
        });
      }
    } catch (logErr) {
      console.warn('Aviso: no se pudo persistir el log en Supabase:', logErr);
    }

    return NextResponse.json({
      success: apiStatus !== 'ERROR',
      imageUrl: generatedUrl,
      model,
      frameworkId,
      callType,
      isRealKeyConfigured: hasRealKey,
      latencyMs,
      requestPayload,
    });
  } catch (error: any) {
    console.error('Error en /api/generate/image:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
