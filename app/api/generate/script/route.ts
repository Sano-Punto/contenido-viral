import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const {
      frameworkId,
      ideaPrompt,
      scenesCount = 4,
      projectId = null,
    } = body;

    const apiKey = process.env.GOOGLE_VERTEX_API_KEY || '';
    const hasRealKey = apiKey && apiKey !== 'tu_google_omni_flash_api_key_aqui';

    let generatedScript: any = null;
    let apiStatus: string = 'SUCCESS';

    const requestPayload = {
      framework_id: frameworkId,
      idea_prompt: ideaPrompt,
      scenes_count: scenesCount,
      timestamp: new Date().toISOString(),
    };

    if (hasRealKey) {
      try {
        const promptSystem = `Eres el director creativo y guionista experto en contenido viral 3D para TikTok e Instagram Reels especializado en el formato: "${frameworkId}".
Tema o Idea del usuario: "${ideaPrompt}". Cantidad de alimentos/escenas: ${scenesCount}.

Genera exactamente ${scenesCount} escenas estructuradas más el Hook inicial (Escena 0) y el Caption profesional listo para copiar.

REGLAS ESTRICTAS DE PROMPT VISUAL (IA):
1. Estructura Base OBLIGATORIA para los visualPrompt (en inglés):
"Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. A cute and friendly Pixar-style [nombre y anatomía específica del órgano, ej: human intestine character, showing its realistic folded tubular structure] with big expressive eyes, [acción o emoción facial del personaje]. Situated realistically inside the soft [cavidad biológica real del órgano, ej: abdominal cavity environment / thoracic cavity] with [tonos biológicos del fondo en pastel, ej: pink and salmon-colored biological tissues]. Volumetric warm cozy lighting, microscopic depth of field, soft bokeh background. No text, no letters, no words, no watermarks, no UI overlays. --ar 9:16 --v 6.0"

2. ENTORNO Y FONDO: El fondo SIEMPRE debe ser el interior de la cavidad anatómica humana real del órgano. PROHIBIDO usar mesas de cocina, platos, habitaciones o vacíos abstractos. PROHIBIDO gore, texturas sucias o fluidos desagradables. Usar formas celulares redondeadas y tejidos estilizados en tonos pastel (salmón, coral, rosado) con desenfoque bokeh.

3. ESTADO DEL ÓRGANO (Escena 0 Hook): El cansancio o fatiga se muestra EXCLUSIVAMENTE con emoción facial (sleepy eyes, droopy sad smile), NUNCA con heridas ni deformaciones.

4. REGLA DE IMPACTO EN ESCENA 1: La Escena 1 (primer alimento) debe ser la más espectacular y visualmente impactante, con movimiento de cámara dinámico y efectos ASMR destacados.

5. CONTROL DE VIDEO (videoControlPrompt):
- La mano humana entra despacio y alimenta al personaje directamente en la boca.
- La forma de entrega debe coincidir con la recomendación del caption (ej: si es infusión, entra taza de té; si es fruto seco, entra el fruto).
- El personaje mastica lentamente antes de iluminarse o sonreír de energía.
- Sin texto en pantalla ni voces. Movimiento de cámara fluido.

6. CAPTION PROFESIONAL (Redes Sociales):
- Gancho e introducción corta (2-3 líneas) sobre la causa fisiológica y cómo estos superalimentos ayudan desde la raíz.
- Lista con emojis por alimento (sin números 1️⃣, 2️⃣):
  [Emoji] NOMBRE DEL ALIMENTO: [Cómo consumirlo, ej: Consume 2 unidades al día / 1 taza en infusión]. Razón: [Explicación científica muy corta y directa].
- Llamado a la acción (CTA) para guardar y compartir.
- Hashtags relevantes.

Devuelve ÚNICAMENTE un JSON válido con este formato:
{
  "scenes": [
    {
      "order": 1,
      "title": "Nombre del alimento o escena",
      "subjectOrItem": "Alimento u órgano",
      "conceptOrReaction": "Descripción de la interacción y reacción",
      "visualPrompt": "Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. A cute and friendly Pixar-style [organ anatomy] with big expressive eyes, [action/emotion]. Situated realistically inside the soft [cavity] with [pastel biological tones]. Volumetric warm cozy lighting, microscopic depth of field, soft bokeh background. No text, no letters, no words, no watermarks, no UI overlays. --ar 9:16 --v 6.0",
      "cameraMovement": "Toma macro frontal / Zoom push-in lento",
      "asmrFx": "¡Crunch-crunch! 🍎 | ¡Shiing! ✨",
      "scriptText": "Texto descriptivo o de subtítulo",
      "videoControlPrompt": "Hand enters slowly holding [item] feeding the cute Pixar [organ]. The organ chews slowly then smiles glowing with soft aura. Smooth camera push-in. No text.",
      "durationSec": 8
    }
  ],
  "caption": "Texto completo del caption en Markdown con emojis, razones científicas y CTA"
}`;

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: promptSystem }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
          }),
        });

        const rawData = await response.json();
        if (response.ok && rawData?.candidates?.[0]?.content?.parts?.[0]?.text) {
          generatedScript = JSON.parse(rawData.candidates[0].content.parts[0].text);
          apiStatus = 'SUCCESS';
        } else {
          apiStatus = 'FALLBACK_LOCAL';
        }
      } catch (err) {
        console.error('Error llamando al LLM para guión:', err);
        apiStatus = 'FALLBACK_LOCAL';
      }
    } else {
      apiStatus = 'FALLBACK_LOCAL';
    }

    const latencyMs = Date.now() - startTime;

    // Persistir log en Supabase
    try {
      if (supabaseServer) {
        await supabaseServer.from('viral_generation_logs').insert({
          project_id: projectId,
          framework_id: frameworkId,
          model_name: 'gemini-1.5-flash',
          call_type: 'script_generation',
          request_payload: requestPayload,
          response_payload: { status: apiStatus, generatedScenes: generatedScript?.scenes?.length || 0 },
          latency_ms: latencyMs,
          status: apiStatus === 'ERROR' ? 'ERROR' : 'SUCCESS',
        });
      }
    } catch (logErr) {
      console.warn('Aviso: log no persistido en Supabase:', logErr);
    }

    return NextResponse.json({
      success: true,
      hasRealKey,
      scriptData: generatedScript,
      latencyMs,
    });
  } catch (error: any) {
    console.error('Error en /api/generate/script:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
