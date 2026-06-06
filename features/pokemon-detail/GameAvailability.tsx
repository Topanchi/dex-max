'use client';

import { useState } from 'react';
import { GAME_CATALOG, GEN_COLORS } from '@/lib/pokemonGames';

interface AvailabilityRow {
  gen: number;
  edition: string;
  titlesEs: string[];
  color: string;
  loc: string[];
}

interface Props {
  pokemonId: number;
  pokemonName: string;
}

// Game cover by Spanish pair-title (deduped from the catalog).
const COVER_BY_TITLE: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const meta of Object.values(GAME_CATALOG)) {
    if (meta.image && !map[meta.titleEs]) map[meta.titleEs] = meta.image;
  }
  return map;
})();

const img = (slug: string): string | undefined => GAME_CATALOG[slug]?.image;

// Cover for a single edition label (WikiDex splits pairs into one row per
// version, e.g. "Ultrasol" / "Ultraluna" → the Ultra Sol/Luna cover).
const COVER_BY_EDITION: Record<string, string | undefined> = {
  'Rojo': img('red'), 'Verde': img('red'), 'Azul': img('blue'), 'Amarillo': img('yellow'),
  'Oro': img('gold'), 'Plata': img('silver'), 'Cristal': img('crystal'),
  'Rubí': img('ruby'), 'Zafiro': img('sapphire'), 'Esmeralda': img('emerald'),
  'Rojo Fuego': img('firered'), 'Verde Hoja': img('leafgreen'),
  'Diamante': img('diamond'), 'Perla': img('pearl'), 'Platino': img('platinum'),
  'Oro HeartGold': img('heartgold'), 'Plata SoulSilver': img('soulsilver'),
  'Negro': img('black'), 'Blanco': img('white'), 'Negro 2': img('black-2'), 'Blanco 2': img('white-2'),
  'X': img('x'), 'Y': img('y'), 'Rubí Omega': img('omega-ruby'), 'Zafiro Alfa': img('alpha-sapphire'),
  'Sol': img('sun'), 'Luna': img('moon'), 'Ultrasol': img('ultra-sun'), 'Ultraluna': img('ultra-moon'),
  "Let's Go, Pikachu!": img('lets-go-pikachu'), "Let's Go, Eevee!": img('lets-go-eevee'),
  'Espada': img('sword'), 'Escudo': img('shield'),
  'Diamante Brillante': img('brilliant-diamond'), 'Perla Reluciente': img('shining-pearl'),
  'Leyendas: Arceus': img('legends-arceus'), 'Leyendas Pokémon: Arceus': img('legends-arceus'),
  'Escarlata': img('scarlet'), 'Púrpura': img('violet'),
  'La Máscara Turquesa': img('the-teal-mask'), 'Máscara Turquesa': img('the-teal-mask'),
  'El Disco Índigo': img('the-indigo-disk'), 'Disco Índigo': img('the-indigo-disk'),
  'Leyendas: Z-A': img('legends-za'), 'Leyendas Pokémon: Z-A': img('legends-za'),
  'Isla de la Armadura': img('isle-of-armor'),
  'La Corona Nívea': img('crown-tundra'), 'Corona Nívea': img('crown-tundra'),
};

function coverFor(row: AvailabilityRow): string | undefined {
  for (const t of row.titlesEs) if (COVER_BY_TITLE[t]) return COVER_BY_TITLE[t];
  for (const label of row.edition.split('/')) {
    const c = COVER_BY_EDITION[label.trim()];
    if (c) return c;
  }
  return undefined;
}

export function GameAvailability({ pokemonId, pokemonName }: Props) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<AvailabilityRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && rows === null && !loading) {
      setLoading(true);
      fetch(`/api/pokemon/${pokemonId}/availability?name=${encodeURIComponent(pokemonName)}`)
        .then(r => r.json())
        .then(d => setRows(d.rows ?? []))
        .catch(() => setRows([]))
        .finally(() => setLoading(false));
    }
  };

  // Group rows by generation, preserving order.
  const groups: { gen: number; rows: AvailabilityRow[] }[] = [];
  for (const row of rows ?? []) {
    let group = groups.find(g => g.gen === row.gen);
    if (!group) {
      group = { gen: row.gen, rows: [] };
      groups.push(group);
    }
    group.rows.push(row);
  }

  return (
    <section aria-label="Localización en videojuegos">
      <button
        onClick={toggle}
        className="flex items-center gap-2 w-full text-left mb-3 sm:mb-4
                   focus:outline-none focus:ring-2 focus:ring-white/30 rounded
                   touch-manipulation group"
        aria-expanded={open}
      >
        <h2 className="text-base sm:text-lg font-bold text-white">Localización en videojuegos</h2>
        <svg
          className={`w-4 h-4 text-slate-400 group-hover:text-white transition-all flex-shrink-0
                      ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && (
        <div className="bg-[#1a1a2e] rounded-xl sm:rounded-2xl border border-[#2a2a4e] overflow-hidden">
          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {!loading && rows !== null && rows.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-8">
              Sin datos de localización disponibles
            </p>
          )}

          {!loading && groups.map(({ gen, rows: genRows }) => {
            const genColor = GEN_COLORS[gen] ?? GEN_COLORS[1];
            return (
              <div key={gen}>
                <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 ${genColor.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${genColor.dot}`} />
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${genColor.text}`}>
                    Generación {gen}
                  </h3>
                </div>

                <ul className="divide-y divide-[#2a2a4e]">
                  {genRows.map((row, idx) => {
                    const cover = coverFor(row);
                    return (
                      <li key={`${row.edition}-${idx}`} className="flex items-start gap-3 px-3 sm:px-4 py-2.5">
                        {cover ? (
                          <img
                            src={cover}
                            alt={row.edition}
                            width={64}
                            height={48}
                            className="w-14 h-10 sm:w-16 sm:h-12 object-contain rounded flex-shrink-0"
                          />
                        ) : (
                          <span
                            className="w-14 sm:w-16 flex-shrink-0 rounded px-1 py-1 text-[10px] font-bold
                                       text-white text-center leading-tight flex items-center justify-center
                                       min-h-10 sm:min-h-12"
                            style={{ backgroundColor: row.color }}
                          >
                            {row.edition}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white leading-tight">{row.edition}</p>
                          <ul className="mt-0.5 space-y-0.5">
                            {row.loc.length > 0 ? row.loc.map((line, i) => {
                              const ci = line.indexOf(':');
                              const method = ci > 0 ? line.slice(0, ci) : '';
                              const text = ci > 0 ? line.slice(ci + 1).trim() : line;
                              return (
                                <li key={i} className="text-xs text-slate-300 leading-snug">
                                  {method && <span className="text-emerald-400 font-medium">{method}: </span>}
                                  {text}
                                </li>
                              );
                            }) : (
                              <li className="text-xs text-slate-500 italic">No disponible</li>
                            )}
                          </ul>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
