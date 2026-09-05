import { Scene, ViralFramework, SceneDuration } from '@/types';
import { generateWordTimings } from './subtitlesGenerator';
import { generateMasterImage } from './aiOrchestrator';
import {
  SUPER_ALIMENTOS_CATALOG,
  ALIMENTOS_QUE_RETAN_CATALOG,
  QUE_SUCEDE_AL_COMER_CATALOG,
} from '@/lib/frameworks/sanoYPuntoData';

interface ScriptGenerationParams {
  framework: ViralFramework;
  ideaPrompt: string;
  scenesCount: number;
}

export async function generateViralScript(params: ScriptGenerationParams): Promise<Scene[]> {
  const { framework, ideaPrompt, scenesCount } = params;
  const scenes: Scene[] = [];

  // 1. FORMATO: SUPER ALIMENTOS (Pixar 3D - Órgano Cansado -> Superalimentos -> Brillo & Curación)
  // Regla: 1 sola llamada a Nano Banana Pro (Master Image) propagada en cascada a todas las escenas
  if (framework.id === 'super-alimentos' || framework.id === 'organos-frutas') {
    const masterImageRes = await generateMasterImage(framework, ideaPrompt);
    const masterImageUrl = masterImageRes.imageUrl;

    for (let i = 0; i < scenesCount; i++) {
      const order = i + 1;
      const data = SUPER_ALIMENTOS_CATALOG[(order - 1) % SUPER_ALIMENTOS_CATALOG.length];
      const subjectOrItem = data.item;
      const conceptOrReaction = `${data.organ}: ${data.reaction} (ASMR: ${data.asmr})`;
      const visualPrompt = data.visualPrompt;
      const scriptText = `${data.item} ➔ ${data.organ}: ${data.reaction}`;
      const title = `${data.organ} comiendo ${data.item}`;
      const durationSec: SceneDuration = 8;

      const words = generateWordTimings(scriptText, durationSec);

      scenes.push({
        id: `scene-${Date.now()}-${order}`,
        order,
        role: order === 1 ? 'hook' : order === scenesCount ? 'cta' : 'body',
        title,
        scriptText,
        visualPrompt,
        mediaUrl: masterImageUrl, // <--- Propagación exacta de la imagen maestra única
        mediaType: 'image',
        durationSec,
        audioVoiceUrl: '',
        words,
        subjectOrItem,
        conceptOrReaction,
      });
    }
    return scenes;
  }

  // 2. FORMATO: ALIMENTOS QUE RETAN (Pixar 3D - Órgano Sano -> Comida Dañina -> Fatiga & Grasa)
  // Regla: 1 sola llamada a Nano Banana Pro (Master Image) propagada en cascada a todas las escenas
  if (framework.id === 'alimentos-que-retan') {
    const masterImageRes = await generateMasterImage(framework, ideaPrompt);
    const masterImageUrl = masterImageRes.imageUrl;

    for (let i = 0; i < scenesCount; i++) {
      const order = i + 1;
      const data = ALIMENTOS_QUE_RETAN_CATALOG[(order - 1) % ALIMENTOS_QUE_RETAN_CATALOG.length];
      const subjectOrItem = data.item;
      const conceptOrReaction = `${data.organ}: ${data.reaction} - Daño: ${data.damageReason} (ASMR: ${data.asmr})`;
      const visualPrompt = data.visualPrompt;
      const scriptText = `${data.item} ⚠️ Reto para ${data.organ}: ${data.damageReason}`;
      const title = `${data.organ} ante ${data.item}`;
      const durationSec: SceneDuration = 8;

      const words = generateWordTimings(scriptText, durationSec);

      scenes.push({
        id: `scene-${Date.now()}-${order}`,
        order,
        role: order === 1 ? 'hook' : order === scenesCount ? 'cta' : 'body',
        title,
        scriptText,
        visualPrompt,
        mediaUrl: masterImageUrl, // <--- Propagación exacta de la imagen maestra única
        mediaType: 'image',
        durationSec,
        audioVoiceUrl: '',
        words,
        subjectOrItem,
        conceptOrReaction,
      });
    }
    return scenes;
  }

  // 3. FORMATO: QUÉ SUCEDE EN TU CUERPO AL COMER (Viaje Biológico Cinemático)
  // Regla: Recorrido secuencial (Escena 0 Hook Boca/Esófago con zoom-in, Escena 1..N órganos y timeline)
  if (framework.id === 'que-sucede-al-comer') {
    const masterImageRes = await generateMasterImage(framework, ideaPrompt);
    const masterImageUrl = masterImageRes.imageUrl;
    const journeyData = QUE_SUCEDE_AL_COMER_CATALOG[0];

    for (let i = 0; i < scenesCount; i++) {
      const order = i + 1;
      const journeyScene = journeyData.scenes[(order - 1) % journeyData.scenes.length];
      const subjectOrItem = `${journeyData.foodTopic} en ${journeyScene.location}`;
      const conceptOrReaction = `${journeyScene.timeframe}: ${journeyScene.concept} (ASMR: ${journeyScene.asmr})`;
      const visualPrompt = journeyScene.visualPrompt;
      const scriptText = journeyScene.scriptText;
      const title = journeyScene.step;
      const durationSec: SceneDuration = 8;

      const words = generateWordTimings(scriptText, durationSec);

      scenes.push({
        id: `scene-${Date.now()}-${order}`,
        order,
        role: order === 1 ? 'hook' : order === scenesCount ? 'cta' : 'body',
        title,
        scriptText,
        visualPrompt,
        mediaUrl: masterImageUrl,
        mediaType: 'image',
        durationSec,
        audioVoiceUrl: '',
        words,
        subjectOrItem,
        conceptOrReaction,
      });
    }
    return scenes;
  }

  // 4. FORMATOS RESTANTES
  const genericMasterRes = await generateMasterImage(framework, ideaPrompt);
  const genericUrl = genericMasterRes.imageUrl;

  for (let i = 0; i < scenesCount; i++) {
    const order = i + 1;
    const role = order === 1 ? 'hook' : order === scenesCount ? 'cta' : order === scenesCount - 1 ? 'climax' : 'body';
    const durationSec: SceneDuration = framework.defaultSceneDuration || 8;
    const title = order === 1 ? 'Gancho de Alto Impacto' : order === scenesCount ? 'Llamado a la Acción' : `Paso ${order - 1}: Desarrollo Clave`;
    
    let scriptText = '';
    if (order === 1) {
      scriptText = `El 99% de las personas desconoce este impacto directo sobre ${ideaPrompt.slice(0, 30) || 'su salud'}...`;
    } else if (order === scenesCount) {
      scriptText = `Guarda este video para tu rutina diaria y compártelo con quien necesite saberlo.`;
    } else {
      scriptText = `A nivel celular, este proceso desencadena una reacción inmediata en tus biomarcadores principales.`;
    }

    const visualPrompt = `Cinematic render, 8k resolution, highly detailed, professional lighting, vertical 9:16. Concept: ${ideaPrompt} - Scene ${order}. No text, no letters.`;
    const words = generateWordTimings(scriptText, durationSec);

    scenes.push({
      id: `scene-${Date.now()}-${order}`,
      order,
      role,
      title,
      scriptText,
      visualPrompt,
      mediaUrl: genericUrl,
      mediaType: 'image',
      durationSec,
      audioVoiceUrl: '',
      words,
    });
  }

  return scenes;
}
