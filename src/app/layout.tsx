import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
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
  themeColor: "#1B4332",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className="antialiased min-h-screen bg-v3"
      >
        <ClientProviders>
          {children}
          <BottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
