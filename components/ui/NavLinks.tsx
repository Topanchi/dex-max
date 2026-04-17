'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Pokédex' },
  { href: '/pokeballs', label: 'Pokéballs' },
  { href: '/items', label: 'Objetos' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 ml-4" aria-label="Navegación principal">
      {NAV_LINKS.map(link => {
        const isActive =
          link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
