import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Dearbara - 소비 습관 코치',
  description: '충동적인 소비와 투자 순간을 카피바라 코치 바라가 귀엽게 멈춰주는 습관 앱',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#467d5c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="font-[var(--font-family-base)]">
        <ClientProviders>
          <div className="app-shell">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
          <BottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
