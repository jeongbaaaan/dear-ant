'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/report', label: '카드', icon: 'auto_awesome' },
  { href: '/memo', label: '바라로그', icon: 'edit_note' },
];

const toolItems = [
  { href: '/calculator', label: '5,000원의 미래', icon: 'savings' },
  { href: '/compound', label: '복리 계산기', icon: 'trending_up' },
  { href: '/tools/simulator', label: '시뮬레이터', icon: 'calculate' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 bottom-0 w-[var(--sidebar-width)] bg-surface border-r border-surface-border p-6 flex-col hidden md:flex z-40">
      <Link href="/" className="flex items-center gap-2.5 px-3 py-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-[12px] flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            spa
          </span>
        </div>
        <span className="text-lg font-extrabold tracking-tight">
          Dear<span className="text-primary">bara</span>
        </span>
      </Link>

      <div className="mb-6">
        <div className="section-label px-3">Menu</div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[14px] mb-0.5 text-sm font-bold transition-all ${
              isActive(item.href)
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-secondary hover:bg-background'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mb-6">
        <div className="section-label px-3">Tools</div>
        {toolItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[14px] mb-0.5 text-sm font-bold transition-all ${
              isActive(item.href)
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-secondary hover:bg-background'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-surface-border px-3">
        <span className="text-xs text-on-surface-quaternary">Dearbara v1.0</span>
      </div>
    </nav>
  );
}
