import { ViralFramework, Scene } from '@/types';
import { useLogStore } from '@/store/useLogStore';

interface MasterImageResponse {
  imageUrl: string;
  payload: any;
  isRealKeyConfigured?: boolean;
}

/**
 * Orquestador de IA para generación de imágenes maestras y video escena por escena.
 * Aplica la regla Single Master Image (1 llamada para formatos de órganos)
 * y llamadas progresivas por escena para video animado con Veo 3.1.
 * Registra trazabilidad en memoria y en la base de datos.
 */
export async function generateMasterImage(
  framework: ViralFramework,
  ideaPrompt: string
): Promise<MasterImageResponse> {
  const isSingleMaster = framework.id === 'super-alimentos' || framework.id === 'alimentos-que-retan';
  const modelName = 'gemini-3.1-flash-image';
  
  const characterSubject = ideaPrompt;

  const promptPayload = {
    model: modelName,
    prompt: characterSubject,
    negative_prompt: 'text, watermark, ugly, gore, dirty textures, biological slime',
    aspect_ratio: '9:16',
    framework_id: framework.id,
    idea_prompt: ideaPrompt,
  };

  useLogStore.getState().addLog({
    frameworkId: framework.id,
    modelName: modelName,
    callType: isSingleMaster ? 'single_master_image' : 'scene_video_render',
    status: 'PENDING',
    message: `Iniciando generación de imagen maestra 3D con ${modelName}...`,
    requestPayload: promptPayload,
  });

  const startTime = Date.now();

  try {
    const response = await fetch('/api/generate/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: characterSubject,
        frameworkId: framework.id,
        model: modelName,
        aspectRatio: '9:16',
        callType: isSingleMaster ? 'single_master_image' : 'scene_video_render',
      }),
    });

    const data = await response.json();
    const latencyMs = Date.now() - startTime;

    if (!response.ok || !data.imageUrl) {
      throw new Error(data.error || 'Error al generar la imagen maestra');
    }

    useLogStore.getState().addLog({
      frameworkId: framework.id,
      modelName: modelName,
      callType: isSingleMaster ? 'single_master_image' : 'scene_video_render',
      status: 'SUCCESS',
      message: data.isRealKeyConfigured
        ? `Imagen generada exitosamente en ${latencyMs}ms`
        : `Estructura validada en ${latencyMs}ms`,
      requestPayload: promptPayload,
      responsePayload: data,
      latencyMs,
    });

    return {
      imageUrl: data.imageUrl,
      payload: promptPayload,
      isRealKeyConfigured: data.isRealKeyConfigured,
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    useLogStore.getState().addLog({
      frameworkId: framework.id,
      modelName: modelName,
      callType: isSingleMaster ? 'single_master_image' : 'scene_video_render',
      status: 'ERROR',
      message: `Fallo en el servicio: ${error.message}`,
      requestPayload: promptPayload,
      latencyMs,
    });
    throw error;
  }
}

/**
 * Renderiza o anima una escena de video con Veo 3.1
 */
export async function renderSceneVideo(
  scene: Scene,
  frameworkId: string,
  masterImageUrl?: string
): Promise<{ videoUrl: string; latencyMs: number; isRealKeyConfigured: boolean }> {
  const modelName = 'veo-3.1-fast-generate-preview';
  const startTime = Date.now();

  const promptPayload = {
    model: modelName,
    scene_id: scene.id,
    scene_order: scene.order,
    video_control_prompt: scene.videoControlPrompt || scene.conceptOrReaction || scene.visualPrompt,
    duration_sec: scene.durationSec,
    has_image_conditioning: Boolean(masterImageUrl || scene.mediaUrl),
  };

  useLogStore.getState().addLog({
    frameworkId,
    modelName,
    callType: 'scene_video_render',
    status: 'PENDING',
    message: `Enviando escena #${scene.order} al motor de video (${scene.durationSec}s)...`,
    requestPayload: promptPayload,
  });

  try {
    const response = await fetch('/api/generate/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sceneId: scene.id,
        sceneOrder: scene.order,
        sceneTitle: scene.title,
        conceptVisual: scene.conceptOrReaction,
        visualPrompt: scene.visualPrompt,
        cameraMovement: scene.cameraMovement,
        asmrFx: scene.asmrFx,
        voiceoverText: scene.scriptText,
        videoControlPrompt: scene.videoControlPrompt || scene.conceptOrReaction || scene.visualPrompt,
        masterImageUrl: masterImageUrl || scene.mediaUrl,
        durationSec: scene.durationSec,
        frameworkId,
      }),
    });

    const data = await response.json();
    const latencyMs = Date.now() - startTime;

    useLogStore.getState().addLog({
      frameworkId,
      modelName,
      callType: 'scene_video_render',
      status: data.success ? 'SUCCESS' : 'ERROR',
      message: data.isRealKeyConfigured
        ? `Escena #${scene.order} renderizada en ${latencyMs}ms`
        : `Escena #${scene.order} estructurada`,
      requestPayload: promptPayload,
      responsePayload: data,
      latencyMs,
    });

    return {
      videoUrl: data.videoUrl || scene.mediaUrl,
      latencyMs,
      isRealKeyConfigured: data.isRealKeyConfigured,
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    useLogStore.getState().addLog({
      frameworkId,
      modelName,
      callType: 'scene_video_render',
      status: 'ERROR',
      message: `Error renderizando escena #${scene.order}: ${error.message}`,
      requestPayload: promptPayload,
      latencyMs,
    });
    throw error;
  }
}
