'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EditorStudio } from '@/components/editor/EditorStudio';

export default function EstudioRemotionRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/estudio-viral');
  }, [router]);

  return (
    <div className="w-full">
      <EditorStudio />
    </div>
  );
}
