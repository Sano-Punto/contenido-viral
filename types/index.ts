export type SceneDuration = 6 | 7 | 8 | 10;

export interface ViralFramework {
  id: string;
  name: string;
  badge: string;
  description: string;
  niche: string;          // Para qué nichos funciona
  targetAudience: string; // Qué audiencia atrae
  icon: string;
  category: string;
  viralScore: number;
  recommendedScenes: number;
  allowedDurations: SceneDuration[];
  defaultSubtitleStyle: SubtitleStyleId;
  defaultBgmGenre: string;
  requiresSpokenScript: boolean; // Si requiere guion hablado o es conceptual/visual directo
  defaultSceneDuration?: SceneDuration; // Duración fija por defecto
}

export interface SubtitleWord {
  text: string;
  start: number; // in seconds
  end: number;   // in seconds
  highlight?: boolean;
}

export type SubtitleStyleId = 'hormozi' | 'neon-glow' | 'bold-yellow' | 'minimal-clean' | 'cyberpunk';

export interface SubtitleStylePreset {
  id: SubtitleStyleId;
  name: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  highlightColor: string;
  backgroundColor?: string;
  textShadow?: string;
  uppercase: boolean;
  boxStyle?: boolean;
}

export interface Scene {
  id: string;
  order: number;
  role: 'hook' | 'body' | 'climax' | 'cta';
  title: string;
  scriptText: string;
  visualPrompt: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  durationSec: SceneDuration;
  audioVoiceUrl?: string;
  words: SubtitleWord[];
  isGenerating?: boolean;
  subjectOrItem?: string;      // Ej: "Arándanos silvestres"
  conceptOrReaction?: string;  // Ej: "Cerebro absorbiendo antioxidantes y encendiendo sinapsis 3D"
  cameraMovement?: string;
  asmrFx?: string;
  videoControlPrompt?: string;
}

export interface BgmTrack {
  id: string;
  title: string;
  genre: string;
  url: string;
  durationSec: number;
}

export interface Project {
  id: string;
  title: string;
  frameworkId: string;
  ideaPrompt: string;
  targetAudience: string;
  tone: string;
  scenesCount: number;
  scenes: Scene[];
  caption?: string;
  subtitleStyleId: SubtitleStyleId;
  bgmTrackId?: string;
  bgmVolume: number; // 0.0 to 1.0
  voiceoverVolume: number; // 0.0 to 1.0
  status: 'draft' | 'scripting' | 'storyboarding' | 'ready' | 'rendering' | 'exported';
  generatedVideoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5;
