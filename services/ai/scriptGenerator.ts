import { Scene, ViralFramework, SceneDuration } from '@/types';
import { generateWordTimings } from './subtitlesGenerator';
import { generateMasterImage } from './aiOrchestrator';
import {
  SUPER_ALIMENTOS_CATALOG,
  ALIMENTOS_QUE_RETAN_CATALOG,
  QUE_SUCEDE_AL_COMER_CATALOG,
} from '@/lib/frameworks/organCatalogData';

interface ScriptGenerationParams {
  framework: ViralFramework;
  ideaPrompt: string;
  scenesCount: number;
}

export interface GeneratedScriptResult {
  scenes: Scene[];
  caption: string;
}

export async function generateViralScript(params: ScriptGenerationParams): Promise<GeneratedScriptResult> {
  const { framework, ideaPrompt, scenesCount } = params;

  let apiScenes: any[] = [];
  let generatedCaption = '';

  // =========================================================================
  // PASO 1: LLAMADA AL MODELO DE GUION Y CONCEPTO ESCENA POR ESCENA (gemini-3.6-flash)
  // =========================================================================
  try {
    const scriptResponse = await fetch('/api/generate/script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ideaPrompt,
        frameworkId: framework.id,
        scenesCount,
      }),
    });

    if (scriptResponse.ok) {
      const scriptData = await scriptResponse.json();
      if (scriptData.scriptData?.scenes && Array.isArray(scriptData.scriptData.scenes)) {
        apiScenes = scriptData.scriptData.scenes;
      }
      if (scriptData.scriptData?.caption) {
        generatedCaption = scriptData.scriptData.caption;
      }
    }
  } catch (scriptErr) {
    console.warn('Aviso: fallback a catalogo local para generacion de guion:', scriptErr);
  }

  // =========================================================================
  // PASO 2: SELECCION DEL PROMPT VISUAL Y LLAMADA A IMAGEN 3 PRO (gemini-3-pro-image)
  // =========================================================================
  const firstVisualPrompt = apiScenes[0]?.visualPrompt || 
    (framework.id === 'super-alimentos' ? SUPER_ALIMENTOS_CATALOG[0]?.visualPrompt : null) ||
    (framework.id === 'alimentos-que-retan' ? ALIMENTOS_QUE_RETAN_CATALOG[0]?.visualPrompt : null) ||
    ideaPrompt;

  const masterImageRes = await generateMasterImage(framework, firstVisualPrompt);
  const masterImageUrl = masterImageRes.imageUrl;

  // =========================================================================
  // PASO 3: ENSAMBLAR LAS ESCENAS CON CONCEPTOS, TEXTOS Y LA IMAGEN RECIBIDA
  // =========================================================================
  const scenes: Scene[] = [];

  for (let i = 0; i < scenesCount; i++) {
    const order = i + 1;
    const durationSec: SceneDuration = 8;
    const apiScene = apiScenes[i];

    let title = '';
    let scriptText = '';
    let visualPrompt = '';
    let subjectOrItem = '';
    let conceptOrReaction = '';
    let cameraMovement = '';
    let asmrFx = '';
    let videoControlPrompt = '';

    if (apiScene) {
      title = apiScene.title || `Escena ${order}`;
      scriptText = apiScene.scriptText || `${apiScene.subjectOrItem || ''} - ${apiScene.conceptOrReaction || ''}`;
      visualPrompt = apiScene.visualPrompt || firstVisualPrompt;
      subjectOrItem = apiScene.subjectOrItem || '';
      conceptOrReaction = apiScene.conceptOrReaction || '';
      cameraMovement = apiScene.cameraMovement || (order === 1 ? 'Toma macro frontal dinámica' : 'Paneo de alejamiento lento');
      asmrFx = apiScene.asmrFx || '¡Crunch-crunch! 🍎 | ¡Shiing! ✨';
      videoControlPrompt = apiScene.videoControlPrompt || `Hand enters slowly feeding ${apiScene.subjectOrItem || 'food'} to cute 3D character. Character chews then glows smiling. Smooth camera push-in. No text.`;
    } else {
      // Fallback a catálogo enriquecido del framework
      if (framework.id === 'super-alimentos') {
        const data = SUPER_ALIMENTOS_CATALOG[(order - 1) % SUPER_ALIMENTOS_CATALOG.length];
        subjectOrItem = data.item;
        conceptOrReaction = `${data.organ}: ${data.reaction} (ASMR: ${data.asmr})`;
        visualPrompt = data.visualPrompt;
        scriptText = `${data.item} ➔ ${data.organ}: ${data.reaction}`;
        title = `${data.organ} comiendo ${data.item}`;
        cameraMovement = order === 1 ? 'Toma macro frontal con zoom push-in dramático' : 'Toma macro frontal estable';
        asmrFx = data.asmr;
        videoControlPrompt = `Hand enters from right holding ${data.item} towards cute Pixar thyroid. Thyroid bites, chews slowly, smiles and radiates glowing light. No text.`;
      } else if (framework.id === 'alimentos-que-retan') {
        const data = ALIMENTOS_QUE_RETAN_CATALOG[(order - 1) % ALIMENTOS_QUE_RETAN_CATALOG.length];
        subjectOrItem = data.item;
        conceptOrReaction = `${data.organ}: ${data.reaction} - Daño: ${data.damageReason} (ASMR: ${data.asmr})`;
        visualPrompt = data.visualPrompt;
        scriptText = `${data.item} ⚠️ Reto para ${data.organ}: ${data.damageReason}`;
        title = `${data.organ} ante ${data.item}`;
        cameraMovement = order === 1 ? 'Toma frontal dramática con zoom lento' : 'Toma macro estable';
        asmrFx = data.asmr;
        videoControlPrompt = `Hand enters offering ${data.item} towards cute Pixar organ. Organ eats reluctantly and looks bloated with tiny sweat drops. No text.`;
      } else {
        const journeyData = QUE_SUCEDE_AL_COMER_CATALOG[0];
        const journeyScene = journeyData.scenes[(order - 1) % journeyData.scenes.length];
        subjectOrItem = `${journeyData.foodTopic} en ${journeyScene.location}`;
        conceptOrReaction = `${journeyScene.timeframe}: ${journeyScene.concept} (ASMR: ${journeyScene.asmr})`;
        visualPrompt = journeyScene.visualPrompt;
        scriptText = journeyScene.scriptText;
        title = journeyScene.step;
        cameraMovement = 'Travelling cinemático biológico';
        asmrFx = journeyScene.asmr;
        videoControlPrompt = `Cinematic camera travelling inside biological tract following ${journeyData.foodTopic}. Smooth cinematic lighting. No text.`;
      }
    }

    const words = generateWordTimings(scriptText, durationSec);

    scenes.push({
      id: `scene-${Date.now()}-${order}`,
      order,
      role: order === 1 ? 'hook' : order === scenesCount ? 'cta' : 'body',
      title,
      scriptText,
      visualPrompt,
      mediaUrl: masterImageUrl, // Imagen generada por gemini-3-pro-image
      mediaType: 'image',
      durationSec,
      audioVoiceUrl: '',
      words,
      subjectOrItem,
      conceptOrReaction,
      cameraMovement,
      asmrFx,
      videoControlPrompt,
    });
  }

  // Si no se generó caption desde el API, crear uno por defecto
  if (!generatedCaption) {
    generatedCaption = `¿Quieres proteger tu salud desde la raíz? 👇\n\nPrueba integrar estos alimentos a tu rutina:\n\n${scenes.map(s => `✨ ${s.subjectOrItem || s.title.toUpperCase()}: Consume de forma habitual. Razón: ${s.conceptOrReaction || 'Aporta nutrientes clave para tu bienestar'}.`).join('\n\n')}\n\n👉 Guarda este reel para tu próxima lista de compras y compártelo con alguien especial. 📲✨\n\n#SaludNatural #NutricionFuncional #SuperAlimentos #Longevidad #HabitosSaludables`;
  }

  return { scenes, caption: generatedCaption };
}
