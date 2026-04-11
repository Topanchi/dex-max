'use client';

export interface Generation {
  id: number;
  roman: string;
  region: string;
  color: string;
}

export const GENERATIONS: Generation[] = [
  { id: 1, roman: 'I',    region: 'Kanto',   color: '#E8554E' },
  { id: 2, roman: 'II',   region: 'Johto',   color: '#F5A623' },
  { id: 3, roman: 'III',  region: 'Hoenn',   color: '#4CAF50' },
  { id: 4, roman: 'IV',   region: 'Sinnoh',  color: '#5B9BD5' },
  { id: 5, roman: 'V',    region: 'Teselia', color: '#9B59B6' },
  { id: 6, roman: 'VI',   region: 'Kalos',   color: '#E91E8C' },
  { id: 7, roman: 'VII',  region: 'Alola',   color: '#FF9800' },
  { id: 8, roman: 'VIII', region: 'Galar',   color: '#00BCD4' },
  { id: 9, roman: 'IX',   region: 'Paldea',  color: '#8BC34A' },
];

interface GenerationFilterProps {
  selected: number | null;
  onChange: (id: number | null) => void;
}

export function GenerationFilter({ selected, onChange }: GenerationFilterProps) {
  return (
    <div className="mb-5">
      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">
        Filtrar por generación
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros de generación">
        {GENERATIONS.map(gen => {
          const isSelected = selected === gen.id;
          return (
            <button
              key={gen.id}
              onClick={() => onChange(isSelected ? null : gen.id)}
              className={`flex flex-col items-center px-3 py-1.5 min-h-[44px] rounded-xl
                          text-xs font-semibold border-2 transition-all touch-manipulation
                          focus:outline-none focus:ring-2 focus:ring-white/30
                          ${isSelected
                            ? 'border-white/40 scale-105 text-white'
                            : 'bg-transparent text-slate-400 border-[#2a2a4e] hover:border-slate-400 hover:text-slate-200'
                          }`}
              style={isSelected ? { backgroundColor: gen.color + '33', borderColor: gen.color + '99' } : undefined}
              aria-pressed={isSelected}
              aria-label={`Generación ${gen.roman} – ${gen.region}`}
            >
              <span
                className="leading-none font-bold text-[11px]"
                style={isSelected ? { color: gen.color } : undefined}
              >
                Gen {gen.roman}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight mt-0.5">
                {gen.region}
              </span>
            </button>
          );
        })}

        {selected !== null && (
          <button
            onClick={() => onChange(null)}
            className="px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-medium
                       text-red-400 border-2 border-red-500/30 hover:border-red-500/60
                       transition-colors touch-manipulation
                       focus:outline-none focus:ring-2 focus:ring-red-500/30"
            aria-label="Limpiar filtro de generación"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
