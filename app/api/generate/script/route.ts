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
        const promptSystem = `Eres un guionista experto en contenido viral para TikTok y Reels especializado en el formato: ${frameworkId}.
Genera exactamente ${scenesCount} escenas estructuradas para la idea: "${ideaPrompt}".
Devuelve ÚNICAMENTE un JSON con el formato:
{
  "scenes": [
    {
      "order": 1,
      "title": "...",
      "subjectOrItem": "...",
      "conceptOrReaction": "...",
      "visualPrompt": "Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. ... No text. --ar 9:16",
      "videoControlPrompt": "...",
      "asmrFx": "...",
      "scriptText": "...",
      "durationSec": 8
    }
  ],
  "caption": "..."
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
