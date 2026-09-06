'use client';

import React from 'react';
import { useSystemStore } from '@/store/useProjectStore';
import { WizardContainer } from '@/components/wizard/WizardContainer';
import { EditorStudio } from '@/components/editor/EditorStudio';
import { FrameworksView } from '@/components/views/FrameworksView';
import { RenderQueueView } from '@/components/views/RenderQueueView';
import { MediaLibraryView } from '@/components/views/MediaLibraryView';
import { AiSettingsView } from '@/components/views/AiSettingsView';
import { LogsView } from '@/components/logs/LogsView';
export default function SystemMainApp() {
  const { activeView } = useSystemStore();

  return (
    <div className="w-full">
      {activeView === 'generator' && <WizardContainer />}
      {activeView === 'editor' && <EditorStudio />}
      {activeView === 'frameworks' && <FrameworksView />}
      {activeView === 'render-queue' && <RenderQueueView />}
      {activeView === 'media-library' && <MediaLibraryView />}
      {activeView === 'ai-settings' && <AiSettingsView />}
      {activeView === 'logs' && <LogsView />}
    </div>
  );
}
