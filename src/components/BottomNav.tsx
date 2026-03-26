'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/',
    label: '홈',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#1B4332' : 'none'} stroke={active ? '#1B4332' : '#74C69D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" stroke={active ? '#D8F3DC' : '#74C69D'} />
      </svg>
    ),
  },
  {
    href: '/survey',
    label: '리포트',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1B4332' : '#74C69D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: '/history',
    label: '히스토리',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1B4332' : '#74C69D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    href: '/memo',
    label: '저널',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1B4332' : '#74C69D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: '/tools',
    label: '더보기',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1B4332' : '#74C69D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="1.5" fill={active ? '#1B4332' : '#74C69D'} />
        <circle cx="12" cy="12" r="1.5" fill={active ? '#1B4332' : '#74C69D'} />
        <circle cx="12" cy="19" r="1.5" fill={active ? '#1B4332' : '#74C69D'} />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const hideOn = ['/result'];
  if (hideOn.some(p => pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" aria-label="메인 내비게이션">
      <div className="bg-white border-t border-green-200">
        <div className="max-w-md mx-auto flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href)) ||
              (item.href === '/tools' && (pathname === '/calculator' || pathname === '/compound'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 py-2.5 px-3"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon(isActive)}
                <span className={`text-[10px] ${isActive ? 'text-green-900 font-semibold' : 'text-green-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
