'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/report', label: '리포트', icon: 'analytics' },
  { href: '/memo', label: '저널', icon: 'edit_note' },
  { href: '/tools', label: '더보기', icon: 'more_horiz' },
];

export default function BottomNav() {
  const pathname = usePathname() ?? '/';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav" aria-label="메인 내비게이션">
      <div className="max-w-md mx-auto flex items-center justify-around px-4 pb-[env(safe-area-inset-bottom)] pt-3 pb-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href)) ||
            (item.href === '/report' && (pathname.startsWith('/result') || pathname.startsWith('/survey'))) ||
            (item.href === '/tools' && (pathname === '/calculator' || pathname === '/compound'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-4 py-1.5 min-h-[44px] transition-all active:scale-90 duration-300 ease-out ${
                isActive
                  ? 'bg-primary text-white rounded-full'
                  : 'text-on-surface/40 hover:text-primary'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-bold text-[10px] tracking-wide mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
