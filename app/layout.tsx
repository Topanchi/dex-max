import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { NavLinks } from '@/components/ui/NavLinks';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Pokédex',
    template: '%s | Pokédex',
  },
  description:
    'Pokédex completa con arte oficial, formas, variantes y cartas TCG de todos los Pokémon.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-[#0f0f1a] text-white min-h-screen`}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0f0f1a]/90 backdrop-blur-md border-b border-[#2a2a4e]">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 xl:px-10 3xl:px-12 py-3 flex items-center gap-3">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none flex-shrink-0"
              aria-label="Ir al inicio"
            >
              <div
                className="w-8 h-8 rounded-full bg-red-500 border-2 border-white relative overflow-hidden
                           group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-900
                               -translate-x-1/2 -translate-y-1/2 z-10" />
                <div className="absolute bottom-0 left-0 right-0 top-1/2 bg-white" />
              </div>
            </Link>

            {/* Nav tabs */}
            <NavLinks />
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-[1800px] mx-auto px-4 sm:px-6 xl:px-10 3xl:px-12 py-5 sm:py-8">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[#2a2a4e] mt-16 py-6">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 xl:px-10 3xl:px-12 text-center text-xs text-slate-600">
            <p>
              Datos: <a href="https://pokeapi.co" className="hover:text-slate-400 transition-colors" target="_blank" rel="noopener noreferrer">PokéAPI</a>
              {' · '}
              Cartas: <a href="https://pokemontcg.io" className="hover:text-slate-400 transition-colors" target="_blank" rel="noopener noreferrer">Pokémon TCG API</a>
            </p>
            <p className="mt-1">
              Pokémon y todos los nombres relacionados son marcas de Nintendo / Game Freak.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
