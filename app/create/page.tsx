'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/generador-de-videos');
  }, [router]);

  return null;
}
