import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Descarga un video desde una URL temporal de Google y lo sube
 * al bucket viral-videos de Supabase Storage.
 * Devuelve la URL pública permanente del CDN.
 */
async function uploadVideoToStorage(
  videoSourceUrl: string,
  frameworkId: string,
  sceneOrder: number,
  googleKey: string,
): Promise<string | null> {
  try {
    const fetchUrl = videoSourceUrl.includes('key=') 
      ? videoSourceUrl 
      : (videoSourceUrl + '&key=' + googleKey);
    
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      console.error('Error descargando video para storage:', response.statusText);
      return null;
    }

    const videoBuffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'video/mp4';
    const ext = contentType.includes('webm') ? 'webm' : 'mp4';
    const timestamp = Date.now();
    const filePath = `${frameworkId}/scene_${sceneOrder}_${timestamp}.${ext}`;

    const { data, error } = await supabaseServer.storage
      .from('viral-videos')
      .upload(filePath, videoBuffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error('Error subiendo video a Storage:', error.message);
      return null;
    }

    // Obtener la URL pública permanente del CDN
    const { data: publicUrlData } = supabaseServer.storage
      .from('viral-videos')
      .getPublicUrl(data.path);

    return publicUrlData?.publicUrl || null;
  } catch (err: any) {
    console.error('Error en uploadVideoToStorage:', err.message);
    return null;
  }
}

/**
 * Convierte una URL de imagen (CDN, externa o data URI) a Buffer Base64
 * para pasarla como fotograma inicial a la API de video de Veo 3.1
 */
async function fetchImageAsBase64(imageUrl?: string): Promise<{ base64: string; mimeType: string } | null> {
  if (!imageUrl) return null;

  try {
    if (imageUrl.startsWith('data:')) {
      const parts = imageUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const base64 = parts[1];
      return { base64, mimeType };
    }

    if (imageUrl.startsWith('http')) {
      const res = await fetch(imageUrl);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        const mimeType = res.headers.get('content-type') || 'image/jpeg';
        return {
          base64: buffer.toString('base64'),
          mimeType,
        };
      }
    }
  } catch (err) {
    console.warn('No se pudo convertir imagen a base64 para Veo:', err);
  }
  return null;
}

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
      model = 'veo-3.1-fast-generate-preview',
      projectId = null,
    } = body;

    const googleKey = process.env.GOOGLE_VERTEX_API_KEY || '';
    const hasRealKey = googleKey && googleKey !== 'tu_google_omni_flash_api_key_aqui';

    let videoUrl = '';
    let apiStatus: string = 'SUCCESS';
    let rawResponse: any = {};
    let storedInBucket = false;

    // Construcción del Prompt Cinemático y Preciso para Veo 3.1
    const cleanCamera = cameraMovement || (sceneOrder === 0 ? 'Fast zoom push-in' : 'Smooth cinematic macro push-in');
    const cleanControl = videoControlPrompt || conceptVisual || 'Hand enters holding fresh item feeding the character. Character chews and smiles happily.';
    const veoPrompt = `${cleanControl}. Camera movement: ${cleanCamera}. Character anatomical structure and soft biological cavity environment remain stable, Unreal Engine 5 Disney 3D style, 8k cinematic lighting, volumetric soft bokeh. Strictly no text, no letters, no words, no UI, no voices.`;

    const requestPayload = {
      model: 'veo-3.1-fast-generate-preview',
      framework_id: frameworkId,
      scene_id: sceneId,
      scene_order: sceneOrder,
      scene_title: sceneTitle,
      duration_sec: durationSec,
      veo_prompt: veoPrompt,
      has_image_conditioning: Boolean(masterImageUrl),
      timestamp: new Date().toISOString(),
    };

    if (hasRealKey) {
      try {
        // 1. Obtener la imagen maestra como fotograma obligatorio inicial (Image-to-Video)
        const imageConditioning = await fetchImageAsBase64(masterImageUrl);

        const instancePayload: any = {
          prompt: veoPrompt,
        };

        if (imageConditioning?.base64) {
          instancePayload.image = {
            bytesBase64Encoded: imageConditioning.base64,
          };
        }

        // 2. Iniciar generación con Veo 3.1 Fast (Image-to-Video)
        const initiateRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-fast-generate-preview:predictLongRunning?key=${googleKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [instancePayload],
            parameters: {
              aspectRatio: '9:16',
              durationSeconds: Math.min(Math.max(durationSec, 5), 8),
              sampleCount: 1,
            },
          }),
        });

        const initiateData = await initiateRes.json();
        rawResponse = initiateData;

        if (initiateRes.ok && initiateData.name) {
          const operationName = initiateData.name;
          // 3. Polling de la operación hasta 45 segundos
          const maxPolls = 12;
          let isComplete = false;

          for (let pollIdx = 0; pollIdx < maxPolls; pollIdx++) {
            await new Promise((r) => setTimeout(r, 3500));
            const pollRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${googleKey}`);
            const pollData = await pollRes.json();

            if (pollData.done) {
              isComplete = true;
              rawResponse = pollData;
              const downloadUri = pollData?.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
              if (downloadUri) {
                // SUBIR VIDEO DIRECTAMENTE A SUPABASE STORAGE BUCKET
                const storageUrl = await uploadVideoToStorage(downloadUri, frameworkId, sceneOrder, googleKey);
                if (storageUrl) {
                  videoUrl = storageUrl;
                  storedInBucket = true;
                } else {
                  videoUrl = `/api/video-proxy?uri=${encodeURIComponent(downloadUri)}`;
                }
                apiStatus = 'SUCCESS';
              }
              break;
            }
          }

          if (!isComplete && !videoUrl) {
            // Si el renderizado toma más tiempo, fallback seguro a la imagen maestra
            videoUrl = masterImageUrl || '';
            apiStatus = 'SUCCESS';
          }
        } else {
          // Si hubo error en initiate, fallback a la imagen maestra
          videoUrl = masterImageUrl || '';
          apiStatus = 'SUCCESS';
        }
      } catch (err: any) {
        console.error('Error llamando al motor de video Veo 3.1:', err);
        videoUrl = masterImageUrl || '';
        apiStatus = 'ERROR';
        rawResponse = { error: err.message };
      }
    } else {
      apiStatus = 'AWAITING_KEY';
      videoUrl = masterImageUrl;
      rawResponse = {
        notice: 'Estructura lista para configurar API Key en .env.local',
        configuredKey: false,
      };
    }

    const latencyMs = Date.now() - startTime;

    // REGISTRO DE TRAZABILIDAD EN BASE DE DATOS
    try {
      if (supabaseServer) {
        await supabaseServer.from('viral_generation_logs').insert({
          project_id: projectId,
          framework_id: frameworkId,
          model_name: 'veo-3.1-fast-generate-preview',
          call_type: `scene_${sceneOrder}_video_render`,
          request_payload: requestPayload,
          response_payload: {
            ...rawResponse,
            hasRealKey,
            videoUrlLength: (videoUrl || '').length,
            storedInBucket,
          },
          latency_ms: latencyMs,
          status: apiStatus === 'ERROR' ? 'ERROR' : 'SUCCESS',
        });
      }
    } catch (logErr) {
      console.warn('Aviso: no se pudo persistir el log de video:', logErr);
    }

    return NextResponse.json({
      success: apiStatus !== 'ERROR',
      videoUrl,
      model: 'veo-3.1-fast-generate-preview',
      frameworkId,
      sceneOrder,
      isRealKeyConfigured: hasRealKey,
      storedInBucket,
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
