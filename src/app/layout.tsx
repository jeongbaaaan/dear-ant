import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Dear,ANT - 당신만을 위한 투자 리포트",
  description: "감정 분석 · 바이오리듬 · 투자 성향을 분석하여 오늘의 투자 판단 리포트를 제공합니다",
  keywords: ["투자", "개미투자자", "투자성향", "바이오리듬", "리포트", "트레이딩저널"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#006b1b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-surface text-on-surface">
        <ClientProviders>
          {children}
          <BottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
