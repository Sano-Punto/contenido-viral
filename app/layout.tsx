import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Viral Studios - Auth',
  description: 'Plataforma interna de producción de video IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white min-h-screen font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
