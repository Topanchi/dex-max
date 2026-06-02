'use client';

import { useState } from 'react';
import { PokedexClient } from '@/features/pokedex/PokedexClient';
import { RegionMapSection } from '@/features/region-map/RegionMapSection';
import type { PokemonListPageResult } from '@/types/pokemon';

interface Props {
  initialPage: PokemonListPageResult;
}

export function HomeTabs({ initialPage }: Props) {
  const [tab, setTab] = useState<'pokedex' | 'mapa'>('pokedex');
  // Lazy-mount the map: only renders after the user first opens it,
  // then stays mounted so state/cache is preserved on tab switch.
  const [mapMounted, setMapMounted] = useState(false);

  const handleMapTab = () => {
    setMapMounted(true);
    setTab('mapa');
  };

  return (
    <div>
      {/* ── Tab bar ───────────────────────────────────────────────────── */}
      <div className="flex items-end gap-1 border-b border-slate-800 mb-8">
        <button
          onClick={() => setTab('pokedex')}
          className={`
            relative px-4 pb-3 pt-1 text-lg font-bold transition-colors focus:outline-none
            ${tab === 'pokedex' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}
          `}
        >
          Pokédex
          <span className="ml-1.5 text-xs font-normal text-slate-500">
            {initialPage.total}
          </span>
          {tab === 'pokedex' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
          )}
        </button>

        <button
          onClick={handleMapTab}
          className={`
            relative px-4 pb-3 pt-1 text-lg font-bold transition-colors focus:outline-none
            ${tab === 'mapa' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}
          `}
        >
          Mapa
          {tab === 'mapa' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
          )}
        </button>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className={tab === 'pokedex' ? '' : 'hidden'}>
        <PokedexClient initialPage={initialPage} />
      </div>

      {mapMounted && (
        <div className={tab === 'mapa' ? '' : 'hidden'}>
          <RegionMapSection />
        </div>
      )}
    </div>
  );
}
