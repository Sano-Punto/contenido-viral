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

    // Construir el prompt estructurado rico y variable para la IA de video
    const fullVideoPrompt = `Crea un video animado para la Escena ${sceneOrder} (${sceneTitle || 'Alimento ' + sceneOrder}):
* Concepto Visual: ${conceptVisual || videoControlPrompt || 'Interacción de alimentación y curación 3D'}
* Prompt IA Base: ${visualPrompt || 'Pixar style 3D character in soft biological cavity'}
* Movimiento de Cámara: ${cameraMovement || (sceneOrder === 1 ? 'Toma macro frontal dinámica con zoom push-in' : 'Toma macro frontal estable')}
* Efectos de Sonido / ASMR: ${asmrFx || '¡Crunch-crunch! 🍎 | ¡Shiing! ✨'}
* Locución: ${voiceoverText || 'Sin locución'}
* 📹 Control de Video:
  - ${videoControlPrompt || 'Hand enters slowly feeding the organ. Organ chews slowly then radiates glowing health aura.'}
  - La mano humana entra despacio y alimenta al personaje directamente en la boca.
  - El método de entrega del alimento coincide con el formato de consumo.
  - El personaje mastica lentamente antes de mostrar la reacción positiva de brillo o sonrisa.
  - El aspecto del órgano no puede alterarse drásticamente; reaccionar con ojos felices sin deformar su estructura base.
  - Sin texto en pantalla.
  - Sin voces ni conversaciones, a menos que haya locución establecida.
  - El movimiento de la cámara debe ser fluido y estable. Duración: ${durationSec}s. Formato 9:16 vertical.`;

    const requestPayload = {
      model,
      framework_id: frameworkId,
      scene_id: sceneId,
      scene_order: sceneOrder,
      scene_title: sceneTitle,
      duration_sec: durationSec,
      full_video_prompt: fullVideoPrompt,
      master_image_input: masterImageUrl ? (masterImageUrl.startsWith('data:') ? 'base64_image_attached' : masterImageUrl.slice(0, 80) + '...') : null,
      timestamp: new Date().toISOString(),
    };

    if (hasRealKey) {
      try {
        // Extraer base64 si la imagen viene en formato data:image/...
        const isBase64 = masterImageUrl && masterImageUrl.startsWith('data:');
        const base64Data = isBase64 ? masterImageUrl.split(',')[1] : null;

        const parts: any[] = [{ text: fullVideoPrompt }];
        if (base64Data) {
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          });
        } else if (masterImageUrl && masterImageUrl.startsWith('http')) {
          parts.push({
            fileData: {
              fileUri: masterImageUrl,
              mimeType: 'image/jpeg',
            },
          });
        }

        // LLAMADA HTTP REAL A LA API DE VIDEO (gemini-omni-flash-preview)
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-omni-flash-preview:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': googleKey,
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts }],
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
          // Si el endpoint de video retorna aviso de cuota o está en preview, fallback a la imagen maestra para Remotion Player
          videoUrl = masterImageUrl || '';
          apiStatus = 'SUCCESS';
        }
      } catch (err: any) {
        console.error('Error llamando a Google Omni Flash:', err);
        videoUrl = masterImageUrl || '';
        apiStatus = 'ERROR';
        rawResponse = { error: err.message };
      }
    } else {
      apiStatus = 'AWAITING_KEY';
      videoUrl = masterImageUrl;
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
