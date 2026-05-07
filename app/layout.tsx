import type { Metadata } from 'next';
import './globals.css';
import AppHeader from '@/components/AppHeader';

export const metadata: Metadata = {
  title: '메디인증 문서센터',
  description: '의료기관 인증에 필요한 규정집·서식·체크리스트를 AI로 자동 생성',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <AppHeader />
        <main>{children}</main>
        <footer className="bg-gray-800 text-gray-400 text-sm py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="font-bold text-white mb-1">메디인증 문서센터</p>
            <p>의료기관 인증 지원 AI 문서 생성 서비스</p>
            <p className="mt-2 text-xs">
              본 서비스는 참고용 초안을 제공합니다. 공식 인증 기준은 반드시 의료기관평가인증원 공식 자료를 확인하세요.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
