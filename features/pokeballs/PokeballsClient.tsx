'use client';

import { useState } from 'react';
import { PokeballCard, type SpriteSource } from './PokeballCard';
import { PokeballDetail } from './PokeballDetail';
import type { Pokeball } from '@/types/pokeballs';

interface Props {
  pokeballs: Pokeball[];
}

const SOURCES: { key: SpriteSource; label: string; description: string }[] = [
  { key: 'pokeapi',  label: 'Ícono',         description: 'PokeAPI/sprites · bag item PNG 30 px' },
  { key: 'artwork',  label: 'Arte Sugimori', description: 'Bulbagarden Archives · arte oficial 694×694 px' },
];

export function PokeballsClient({ pokeballs }: Props) {
  const [search, setSearch]       = useState('');
  const [source, setSource]       = useState<SpriteSource>('pokeapi');
  const [selected, setSelected]   = useState<Pokeball | null>(null);

  const displayed = search.trim()
    ? pokeballs.filter(b =>
        b.displayName.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : pokeballs;

  return (
    <>
      <div>
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          {/* Search */}
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar Pokéball..."
            className="w-full sm:w-64 px-4 py-2 rounded-xl bg-[#1a1a2e] border border-[#2a2a4e]
                       text-white placeholder:text-slate-600 text-sm
                       focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#4a4a7e]
                       transition-colors"
            aria-label="Buscar Pokéball"
          />

          {/* Sprite source buttons */}
          <div
            className="flex gap-1.5"
            role="group"
            aria-label="Fuente de sprites"
          >
            {SOURCES.map(s => (
              <button
                key={s.key}
                onClick={() => setSource(s.key)}
                title={s.description}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                            focus:outline-none focus:ring-2 focus:ring-white/20 ${
                  source === s.key
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'bg-[#1a1a2e] text-slate-400 border border-[#2a2a4e] hover:text-white hover:border-[#4a4a7e]'
                }`}
                aria-pressed={source === s.key}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <p className="text-xs text-slate-500 mb-4">
          {search.trim()
            ? `${displayed.length} resultado${displayed.length !== 1 ? 's' : ''} para "${search}"`
            : `${pokeballs.length} Pokéballs · haz clic para ver el historial`}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayed.map(b => (
            <PokeballCard
              key={`${b.id}-${source}`}
              pokeball={b}
              source={source}
              onSelect={setSelected}
            />
          ))}
        </div>

        {displayed.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-lg">No se encontraron Pokéballs</p>
            <p className="text-slate-600 text-sm mt-1">Intenta con otro nombre</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <PokeballDetail ball={selected} onClose={() => setSelected(null)} />
    </>
  );
}
