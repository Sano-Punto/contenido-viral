/**
 * Regenera una imagen individual para una escena utilizando la API real.
 * Elimina toda la mock data y arrays aleatorios de stock photos.
 */
export async function regenerateSceneVisual(prompt: string, frameworkId = 'super-alimentos'): Promise<string> {
  try {
    const response = await fetch('/api/generate/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        frameworkId,
        model: 'nano-banana-pro',
        aspectRatio: '9:16',
        callType: 'single_scene_regeneration',
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.imageUrl) {
      throw new Error(data.error || 'No se pudo generar la imagen');
    }

    return data.imageUrl;
  } catch (error) {
    console.error('Error en regenerateSceneVisual:', error);
    throw error;
  }
}
