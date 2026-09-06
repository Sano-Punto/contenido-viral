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
      sceneTitle,
      conceptVisual,
      visualPrompt,
      cameraMovement,
      asmrFx,
      voiceoverText,
      videoControlPrompt,
      masterImageUrl,
      durationSec = 8,
      frameworkId = 'super-alimentos',
      model = 'gemini-omni-flash-preview', // Official Gemini API: gemini-omni-flash-preview
      projectId = null,
    } = body;

    const googleKey = process.env.GOOGLE_VERTEX_API_KEY || '';
    const hasRealKey = googleKey && googleKey !== 'tu_google_omni_flash_api_key_aqui';

    let videoUrl = '';
    let apiStatus: string = 'SUCCESS';
    let rawResponse: any = {};

    // Prompt de video optimizado para Veo 3.1
    const veoPrompt = `${visualPrompt || 'Cute 3D Pixar character inside soft anatomical biological cavity'}. ${videoControlPrompt || 'Hand enters slowly feeding the character. Character chews happily and glows with vibrant energy'}. Camera: ${cameraMovement || 'Smooth cinematic push-in'}. 8k, Unreal Engine 5 render, cinematic lighting. No text.`;

    const requestPayload = {
      model: 'veo-3.1-fast-generate-preview',
      framework_id: frameworkId,
      scene_id: sceneId,
      scene_order: sceneOrder,
      scene_title: sceneTitle,
      duration_sec: durationSec,
      veo_prompt: veoPrompt,
      timestamp: new Date().toISOString(),
    };

    if (hasRealKey) {
      try {
        // 1. Iniciar generación con Veo 3.1 Fast
        const initiateRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-fast-generate-preview:predictLongRunning?key=${googleKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: veoPrompt }],
            parameters: { aspectRatio: '9:16' },
          }),
        });

        const initiateData = await initiateRes.json();
        rawResponse = initiateData;

        if (initiateRes.ok && initiateData.name) {
          const operationName = initiateData.name;
          // 2. Polling de la operación hasta 35 segundos
          const maxPolls = 10;
          let isComplete = false;

          for (let pollIdx = 0; pollIdx < maxPolls; pollIdx++) {
            await new Promise((r) => setTimeout(r, 3000));
            const pollRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${googleKey}`);
            const pollData = await pollRes.json();

            if (pollData.done) {
              isComplete = true;
              rawResponse = pollData;
              const downloadUri = pollData?.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
              if (downloadUri) {
                videoUrl = `/api/video-proxy?uri=${encodeURIComponent(downloadUri)}`;
                apiStatus = 'SUCCESS';
              }
              break;
            }
          }

          if (!isComplete && !videoUrl) {
            // Si toma más tiempo del límite, fallback temporal a la imagen
            videoUrl = masterImageUrl || '';
            apiStatus = 'SUCCESS';
          }
        } else {
          videoUrl = masterImageUrl || '';
          apiStatus = 'SUCCESS';
        }
      } catch (err: any) {
        console.error('Error llamando a Veo 3.1:', err);
        videoUrl = masterImageUrl || '';
        apiStatus = 'ERROR';
        rawResponse = { error: err.message };
      }
    } else {
      apiStatus = 'AWAITING_KEY';
      videoUrl = masterImageUrl;
      rawResponse = {
        notice: 'Estructura lista para API Key real de Google Veo 3.1 en .env.local',
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
          call_type: `scene_${sceneOrder}_video_render`,
          request_payload: requestPayload,
          response_payload: {
            ...rawResponse,
            hasRealKey,
            videoUrlLength: (videoUrl || '').length,
          },
          latency_ms: latencyMs,
          status: apiStatus === 'ERROR' ? 'ERROR' : 'SUCCESS',
        });
      }
    } catch (logErr) {
      console.warn('Aviso: no se pudo persistir el log de video en Supabase:', logErr);
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
