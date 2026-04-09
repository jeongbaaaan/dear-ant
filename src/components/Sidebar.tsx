'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/report', label: '리포트', icon: 'description' },
  { href: '/memo', label: '트레이딩 저널', icon: 'edit_note' },
];

const toolItems = [
  { href: '/calculator', label: '적금 vs 투자', icon: 'compare_arrows' },
  { href: '/compound', label: '복리 계산기', icon: 'trending_up' },
  { href: '/tools/simulator', label: '매매 시뮬레이터', icon: 'calculate' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 bottom-0 w-[var(--sidebar-width)] bg-surface border-r border-surface-border p-6 flex-col hidden md:flex z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-3 py-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-[10px] flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychiatry
          </span>
        </div>
        <span className="text-lg font-extrabold tracking-tight">
          Dear,<span className="text-primary">ANT</span>
        </span>
      </Link>

      {/* Menu Section */}
      <div className="mb-6">
        <div className="section-label px-3">Menu</div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 text-sm font-medium transition-all ${
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

      {/* Tools Section */}
      <div className="mb-6">
        <div className="section-label px-3">Tools</div>
        {toolItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 text-sm font-medium transition-all ${
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

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-surface-border px-3">
        <span className="text-xs text-on-surface-quaternary">Dear,ANT v1.0</span>
      </div>
    </nav>
  );
}
