import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEXUS',
  description: 'Plataforma de intermediação entre empresas e prestadores de serviços digitais em São Paulo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
