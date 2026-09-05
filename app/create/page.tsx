'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSystemStore } from '@/store/useProjectStore';

export default function CreatePageRedirect() {
  const router = useRouter();
  const { setActiveView } = useSystemStore();

  useEffect(() => {
    setActiveView('generator');
    router.replace('/');
  }, [router, setActiveView]);

  return null;
}
