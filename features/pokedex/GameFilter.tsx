'use client';

import { GEN_COLORS, GAME_FILTERS } from '@/lib/pokemonGames';

interface GameFilterProps {
  selected: string | null;
  onChange: (key: string | null) => void;
}

export function GameFilter({ selected, onChange }: GameFilterProps) {
  return (
    <div className="mb-5">
      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">
        Filtrar por juego
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros de juego">
        {GAME_FILTERS.map(game => {
          const isSelected = selected === game.key;
          const colors = GEN_COLORS[game.generation] ?? GEN_COLORS[1];
          return (
            <button
              key={game.key}
              onClick={() => onChange(isSelected ? null : game.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 min-h-[32px] rounded-lg
                          text-[11px] font-semibold border transition-all touch-manipulation
                          focus:outline-none focus:ring-2 focus:ring-white/30
                          ${isSelected
                            ? `${colors.bg} border-white/20 ${colors.text}`
                            : 'bg-transparent text-slate-400 border-[#2a2a4e] hover:border-slate-400 hover:text-slate-200'
                          }`}
              aria-pressed={isSelected}
              aria-label={game.titleEs}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
              {game.shortEs}
            </button>
          );
        })}

        {selected !== null && (
          <button
            onClick={() => onChange(null)}
            className="px-2.5 py-1 min-h-[32px] rounded-lg text-[11px] font-medium
                       text-red-400 border border-red-500/30 hover:border-red-500/60
                       transition-colors touch-manipulation
                       focus:outline-none focus:ring-2 focus:ring-red-500/30"
            aria-label="Limpiar filtro de juego"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
