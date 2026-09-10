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
        const isOrganFormat = frameworkId === 'super-alimentos' || frameworkId === 'alimentos-que-retan';

        const promptSystem = `Eres el director creativo y guionista experto en contenido viral 3D para TikTok e Instagram Reels especializado en el formato: "${frameworkId}".
Tema o Idea del usuario: "${ideaPrompt}". Cantidad de alimentos/escenas: ${scenesCount}.

Genera exactamente ${scenesCount} escenas estructuradas más el Hook inicial (Escena 0) y el Caption profesional listo para copiar.

REGLAS ESTRICTAS DE CONTENIDO Y ESTRUCTURA:

1. LOCUCIÓN (scriptText):
${isOrganFormat 
  ? '- IMPORTANTE: Para este formato ("' + frameworkId + '"), NO DEBE HABER LOCUCIÓN HABLADA. El campo "scriptText" DEBE SER ESTRICTAMENTE una cadena vacía ("") para todas las escenas. El video se enfoca 100% en la experiencia sensorial ASMR, gestos faciales y la interacción con la comida.'
  : '- Incluye el texto hablado conciso y directo para el narrador.'}

2. CONCEPTO VISUAL (conceptOrReaction):
Debe ser una descripción cinematográfica detallada, rica y paso a paso de la interacción:
- Entrada: La mano humana entra suavemente en la cavidad anatómica ofreciendo el alimento específico.
- Coherencia con el Caption: La forma en que se presenta el alimento en el video DEBE COINCIDIR EXACTAMENTE con la forma de consumo recomendada en el caption (ej: si es infusión, entra una taza de té humeante; si es polvo/miel, entra en una cuchara de madera; si es fruto seco o semilla, entra el fruto fresco entero).
- Proceso: El personaje órgano abre la boca, recibe el alimento y mastica/procesa lentamente.
- Desenlace: Solo después de masticar y tragar (deglución), reacciona físicamente:
  * Para super-alimentos: Se ilumina con un aura bioluminiscente dorada/celeste, sus ojos brillan de alegría, sus mejillas se sonrojan de salud y sus tejidos celulares se revitalizan.
  * Para alimentos-que-retan: Muestra incomodidad leve, fatiga, ojos somnolientos o pesadez (sin heridas ni gore).

3. PROMPT VISUAL BASE (visualPrompt en inglés):
"Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. A cute and friendly [nombre y anatomía específica del órgano en inglés, ej: human liver character] with big expressive eyes, [acción o emoción facial]. Situated realistically inside the soft [cavidad biológica real, ej: abdominal cavity environment] with [tonos pastel del fondo, ej: pink and coral-colored biological tissues]. Volumetric warm cozy lighting, microscopic depth of field, soft bokeh background. No text, no letters, no words, no watermarks, no UI overlays. --ar 9:16 --v 6.0"

${isOrganFormat 
  ? 'NOTA: Para "' + frameworkId + '", genera el visualPrompt completo para el Hook inicial (Escena 0). Para las demás escenas, deja visualPrompt como "" ya que la imagen maestra del Hook se propagará a todas las escenas.'
  : 'Genera el visualPrompt para cada escena.'}

4. ENTORNO Y FONDO:
El fondo SIEMPRE debe ser el interior de la cavidad anatómica humana real del órgano con formas celulares redondeadas y tejidos estilizados en tonos pastel (salmón, coral, rosado) con desenfoque bokeh. PROHIBIDO mesas de cocina, platos, habitaciones o vacíos negros.

5. EFECTOS DE SONIDO / ASMR (asmrFx):
Debe incluir una secuencia detallada y realista de onomatopeyas y emojis:
- Masticado: ¡Crunch, crunch! 🍎 / ¡Nom, nom! 🫐
- Deglución: ¡Gulp! 💦 / ¡Slurp! 🍵
- Reacción mágica: ¡Shiing! ✨ / ¡Glow! 🌟 / ¡Zzz! 😴

6. CONTROL DE VIDEO (videoControlPrompt):
Instrucciones estrictas para la IA de video:
"Hand enters slowly holding [item in exact consumption form, e.g. warm cup of tea / wooden spoon / fresh fruit] feeding the cute [organ] directly into mouth. The character chews slowly and swallows. Then its cheeks glow warmly with soft radiant aura, smiling with joyful big eyes. Smooth camera push-in. Character anatomical structure remains intact. No text, no words, no speech."

7. CAPTION PROFESIONAL (Redes Sociales):
- Gancho e introducción corta (2-3 líneas) sobre la fisiología del órgano.
- Lista con emojis por alimento (sin números 1️⃣, 2️⃣):
  [Emoji] NOMBRE DEL ALIMENTO: [Cómo consumirlo, ej: Consume 2 unidades al día / 1 taza en infusión caliente]. Razón: [Explicación científica muy corta y directa].
- Llamado a la acción (CTA) para guardar y compartir.
- Hashtags relevantes (#Salud #Nutricion #Bienestar).

Devuelve ÚNICAMENTE un JSON válido con este formato:
{
  "scenes": [
    {
      "order": 0,
      "title": "Hook: Nombre del órgano en estado inicial",
      "subjectOrItem": "Órgano principal",
      "conceptOrReaction": "Descripción detallada del estado inicial y llamado de atención",
      "visualPrompt": "Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. A cute and friendly [organ] character with big expressive eyes, looking sleepy and exhausted. Situated inside soft anatomical cavity with pastel biological tissues. Volumetric warm cozy lighting, soft bokeh background. No text. --ar 9:16",
      "cameraMovement": "Zoom-in rápido hacia los ojos del personaje",
      "asmrFx": "Suspiro cansado 😮‍💨 | Latido suave 💓 | Campanilla mágica ✨",
      "scriptText": "${isOrganFormat ? '' : 'Texto hablado del hook'}",
      "videoControlPrompt": "Cute 3D character rubs its eyes tiredly inside anatomical cavity. A gentle sparkle appears in front, character looks up with wide hopeful eyes. Smooth fast push-in camera. No text.",
      "durationSec": 5
    },
    {
      "order": 1,
      "title": "Superalimento 1: [Nombre]",
      "subjectOrItem": "[Nombre del alimento]",
      "conceptOrReaction": "La mano humana entra despacio en la cavidad ofreciendo [alimento en su formato de consumo]. El órgano abre la boca, mastica lentamente y traga. Al deglutir, se ilumina con un aura dorada, sus ojos brillan y sonríe con energía renovada.",
      "visualPrompt": "${isOrganFormat ? '' : 'Prompt visual específico'}",
      "cameraMovement": "Toma macro frontal / Zoom push-in lento",
      "asmrFx": "¡Crunch, crunch! 🍎 | ¡Gulp! 💦 | ¡Shiing! ✨",
      "scriptText": "${isOrganFormat ? '' : 'Texto descriptivo'}",
      "videoControlPrompt": "Hand enters slowly holding [item] feeding the cute [organ]. The organ chews slowly then smiles glowing with soft aura. Smooth camera push-in. No text.",
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

    // Persistir log de auditoría en la base de datos
    try {
      if (supabaseServer) {
        await supabaseServer.from('viral_generation_logs').insert({
          project_id: projectId,
          framework_id: frameworkId,
          model_name: 'gemini-3.6-flash',
          call_type: 'script_generation',
          request_payload: requestPayload,
          response_payload: {
            status: apiStatus,
            generatedScenes: generatedScript?.scenes?.length || 0,
            hasCaption: Boolean(generatedScript?.caption),
          },
          latency_ms: latencyMs,
          status: apiStatus === 'ERROR' ? 'ERROR' : 'SUCCESS',
        });
      }
    } catch (logErr) {
      console.warn('Aviso: log no persistido:', logErr);
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
