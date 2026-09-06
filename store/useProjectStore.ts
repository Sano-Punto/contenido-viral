import { create } from 'zustand';
import { Project, Scene, SceneDuration, SubtitleStyleId, WizardStep, ViralFramework } from '@/types';
import { VIRAL_FRAMEWORKS } from '@/lib/frameworks/definitions';

export type SystemView = 'generator' | 'editor' | 'frameworks' | 'media-library' | 'render-queue' | 'ai-settings' | 'logs';

interface SystemState {
  // Navigation & Layout
  activeView: SystemView;
  setActiveView: (view: SystemView) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Creation Wizard
  currentStep: WizardStep;
  setStep: (step: WizardStep) => void;

  // Active Project
  project: Project;
  isLoading: boolean;
  generatingStep: string | null;

  // Frameworks registry
  frameworks: ViralFramework[];
  updateFramework: (id: string, updates: Partial<ViralFramework>) => void;
  addNewFramework: (newFw: ViralFramework) => void;

  // Actions
  selectFramework: (frameworkId: string) => void;
  setIdeaDetails: (details: { ideaPrompt: string; targetAudience?: string; tone?: string; scenesCount: number }) => void;
  setScenes: (scenes: Scene[]) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  updateSceneDuration: (sceneId: string, duration: SceneDuration) => void;
  setSubtitleStyle: (styleId: SubtitleStyleId) => void;
  setCaption: (caption: string) => void;
  setBgmTrack: (trackId?: string) => void;
  setBgmVolume: (volume: number) => void;
  setVoiceoverVolume: (volume: number) => void;
  setLoading: (loading: boolean, stepMessage?: string | null) => void;
  resetProject: () => void;
  loadSampleProject: () => void;
}

const defaultFramework = VIRAL_FRAMEWORKS[0];

const initialProject: Project = {
  id: 'proj-' + Math.random().toString(36).substring(2, 9),
  title: 'Nuevo Video Viral',
  frameworkId: defaultFramework.id,
  ideaPrompt: '',
  targetAudience: defaultFramework.targetAudience,
  tone: 'Enérgico y Revelador',
  scenesCount: 4,
  scenes: [],
  subtitleStyleId: defaultFramework.defaultSubtitleStyle,
  bgmTrackId: 'bgm-dark-phonk',
  bgmVolume: 0.25,
  voiceoverVolume: 1.0,
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useSystemStore = create<SystemState>((set, get) => ({
  activeView: 'generator',
  setActiveView: (view) => set({ activeView: view, isMobileMenuOpen: false }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),

  project: initialProject,
  isLoading: false,
  generatingStep: null,

  frameworks: VIRAL_FRAMEWORKS,
  updateFramework: (id, updates) =>
    set((state) => ({
      frameworks: state.frameworks.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  addNewFramework: (newFw) =>
    set((state) => ({
      frameworks: [newFw, ...state.frameworks],
    })),

  selectFramework: (frameworkId) => {
    const fw = get().frameworks.find((f) => f.id === frameworkId) || defaultFramework;
    set((state) => ({
      project: {
        ...state.project,
        frameworkId,
        targetAudience: fw.targetAudience,
        subtitleStyleId: fw.defaultSubtitleStyle,
        scenesCount: fw.recommendedScenes,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setIdeaDetails: (details) => {
    set((state) => ({
      project: {
        ...state.project,
        ...details,
        title: details.ideaPrompt.slice(0, 40) || 'Nuevo Video Viral',
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setScenes: (scenes) => {
    set((state) => ({
      project: {
        ...state.project,
        scenes,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  updateScene: (sceneId, updates) => {
    set((state) => ({
      project: {
        ...state.project,
        scenes: state.project.scenes.map((s) => (s.id === sceneId ? { ...s, ...updates } : s)),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  updateSceneDuration: (sceneId, duration) => {
    set((state) => ({
      project: {
        ...state.project,
        scenes: state.project.scenes.map((s) => (s.id === sceneId ? { ...s, durationSec: duration } : s)),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setSubtitleStyle: (styleId) => {
    set((state) => ({
      project: {
        ...state.project,
        subtitleStyleId: styleId,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setCaption: (caption) => {
    set((state) => ({
      project: {
        ...state.project,
        caption,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setBgmTrack: (trackId) => {
    set((state) => ({
      project: {
        ...state.project,
        bgmTrackId: trackId,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setBgmVolume: (volume) => {
    set((state) => ({
      project: {
        ...state.project,
        bgmVolume: volume,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setVoiceoverVolume: (volume) => {
    set((state) => ({
      project: {
        ...state.project,
        voiceoverVolume: volume,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setLoading: (loading, stepMessage = null) => {
    set({ isLoading: loading, generatingStep: stepMessage });
  },

  resetProject: () => {
    set({
      currentStep: 1,
      project: {
        ...initialProject,
        id: 'proj-' + Math.random().toString(36).substring(2, 9),
      },
      isLoading: false,
      generatingStep: null,
    });
  },

  loadSampleProject: () => {
    set({
      activeView: 'generator',
      currentStep: 1,
      isMobileMenuOpen: false,
      project: {
        ...initialProject,
        id: 'proj-' + Math.random().toString(36).substring(2, 9),
      },
    });
  },
}));

export const useProjectStore = useSystemStore;
