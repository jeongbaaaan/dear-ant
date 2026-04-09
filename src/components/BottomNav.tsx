'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/report', label: '리포트', icon: 'description' },
  { href: '/memo', label: '저널', icon: 'edit_note' },
  { href: '/calculator', label: '더보기', icon: 'more_horiz' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-border md:hidden z-50"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
              isActive(item.href)
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-quaternary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-[11px] font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
