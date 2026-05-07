'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, FileText } from 'lucide-react';

const navItems = [
  { href: '/hospitals', label: '병원 유형 선택' },
  { href: '/standards', label: '기준집 탐색' },
  { href: '/generate', label: '문서 생성' },
  { href: '/samples', label: '샘플 보기' },
  { href: '/pricing', label: '요금제' },
  { href: '/help', label: '도움말' },
];

export default function AppHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-black text-xl text-blue-700">
            <FileText className="w-6 h-6" />
            <span>메디인증</span>
            <span className="text-gray-400 font-normal text-sm hidden sm:inline">문서센터</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/generate"
              className="hidden sm:inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              문서 생성하기
            </Link>
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/generate"
              className="block mt-2 bg-blue-600 text-white text-center px-4 py-2 rounded-lg text-sm font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              문서 생성하기
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
