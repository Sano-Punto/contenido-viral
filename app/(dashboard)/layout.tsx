import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { ContentWrapper } from '@/components/layout/ContentWrapper';

export const metadata: Metadata = {
  title: 'Viral Studios - Automatización de contenido viral',
  description: 'Plataforma interna de producción de video IA con frameworks virales y Remotion.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex w-full">
      <Sidebar />
      <ContentWrapper>
        <TopHeader />
        <main className="flex-1 px-4 sm:px-6 py-5 w-full">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </ContentWrapper>
    </div>
  );
}
