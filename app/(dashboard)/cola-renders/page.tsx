'use client';

import React from 'react';
import { RenderQueueView } from '@/components/views/RenderQueueView';

export default function ColaRendersPage() {
  return (
    <div className="w-full">
      <RenderQueueView />
    </div>
  );
}
