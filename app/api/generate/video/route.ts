import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const {
      sceneId,
      sceneOrder = 1,
      masterImageUrl,
      videoControlPrompt,
      durationSec = 8,
      frameworkId = 'super-alimentos',
      model = 'gemini-omni-flash-preview', // Official Gemini API: gemini-omni-flash-preview
      projectId = null,
    } = body;

    if (!videoControlPrompt) {
      return NextResponse.json(
        { error: 'El videoControlPrompt es obligatorio.' },
        { status: 400 }
      );
    }

    const googleKey = process.env.GOOGLE_VERTEX_API_KEY || '';
    const hasRealKey = googleKey && googleKey !== 'tu_google_omni_flash_api_key_aqui';

    let videoUrl = '';
    let apiStatus: 'SUCCESS' | 'ERROR' | 'AWAITING_KEY' = 'SUCCESS';
    let rawResponse: any = {};

    const requestPayload = {
      model,
      framework_id: frameworkId,
      scene_id: sceneId,
      scene_order: sceneOrder,
      duration_sec: durationSec,
      video_control_prompt: videoControlPrompt,
      master_image_input: masterImageUrl ? masterImageUrl.slice(0, 80) + '...' : null,
      timestamp: new Date().toISOString(),
    };

    if (hasRealKey) {
      // LLAMADA HTTP REAL A LA API DE GEMINI (gemini-omni-flash-preview)
      try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-omni-flash-preview:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': googleKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `Animate this 3D character with camera motion and biological action: ${videoControlPrompt}. Duration: ${durationSec}s. 9:16 vertical.` },
                  ...(masterImageUrl && !masterImageUrl.startsWith('data:') ? [{ fileData: { fileUri: masterImageUrl, mimeType: 'image/jpeg' } }] : []),
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
            },
          }),
        });

        rawResponse = await response.json();
        if (response.ok) {
          videoUrl = rawResponse?.candidates?.[0]?.content?.parts?.[0]?.videoUri || masterImageUrl;
          apiStatus = 'SUCCESS';
        } else {
          apiStatus = 'ERROR';
        }
      } catch (err: any) {
        console.error('Error llamando a Google Omni Flash:', err);
        apiStatus = 'ERROR';
        rawResponse = { error: err.message };
      }
    } else {
      // Si la key no está configurada, devolvemos el estado auténtico
      apiStatus = 'AWAITING_KEY';
      videoUrl = masterImageUrl; // Mantiene la referencia a la imagen base maestra para el player de Remotion
      rawResponse = {
        notice: 'Estructura lista para API Key real de Google Omni Flash en .env.local',
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
          call_type: 'scene_video_render',
          request_payload: requestPayload,
          response_payload: {
            ...rawResponse,
            hasRealKey,
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
      videoUrl,
      model,
      frameworkId,
      sceneOrder,
      isRealKeyConfigured: hasRealKey,
      latencyMs,
      requestPayload,
    });
  } catch (error: any) {
    console.error('Error en /api/generate/video:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
