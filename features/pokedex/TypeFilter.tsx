'use client';

import { ALL_TYPES, getTypeColor, getTypeLabel } from '@/utils/typeColors';

interface TypeFilterProps {
  selected: string[];
  onChange: (types: string[]) => void;
}

export function TypeFilter({ selected, onChange }: TypeFilterProps) {
  const toggle = (type: string) => {
    if (selected.includes(type)) {
      onChange(selected.filter(t => t !== type));
    } else {
      onChange([type]);
    }
  };

  return (
    <div className="mb-5">
      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">
        Filtrar por tipo
      </p>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filtros de tipo"
      >
        {ALL_TYPES.map(type => {
          const { bg, text } = getTypeColor(type);
          const isSelected = selected.includes(type);
          return (
            <button
              key={type}
              onClick={() => toggle(type)}
              className={`px-3 py-1.5 min-h-[36px] rounded-full text-xs font-semibold
                          transition-all border-2 touch-manipulation
                          focus:outline-none focus:ring-2 focus:ring-white/30
                          ${bg} ${text}
                          ${isSelected
                            ? 'border-white/50 scale-105 opacity-100'
                            : 'border-transparent opacity-50 hover:opacity-80'
                          }`}
              aria-pressed={isSelected}
              aria-label={`Tipo ${getTypeLabel(type)}`}
            >
              {getTypeLabel(type)}
            </button>
          );
        })}
        {selected.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="px-3 py-1.5 min-h-[36px] rounded-full text-xs font-medium
                       text-red-400 border-2 border-red-500/30 hover:border-red-500/60
                       transition-colors touch-manipulation
                       focus:outline-none focus:ring-2 focus:ring-red-500/30"
            aria-label="Limpiar filtro de tipo"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
