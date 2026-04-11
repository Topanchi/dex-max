'use client';

export type SortOption = 'number-asc' | 'number-desc' | 'name-asc' | 'name-desc';

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'number-asc',  label: 'Número ↑' },
  { value: 'number-desc', label: 'Número ↓' },
  { value: 'name-asc',    label: 'Nombre A–Z' },
  { value: 'name-desc',   label: 'Nombre Z–A' },
];

interface SortControlsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortControls({ value, onChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <label htmlFor="sort-select" className="text-xs text-slate-500 whitespace-nowrap hidden sm:block">
        Ordenar:
      </label>
      {/* text-[16px] evita zoom automático en iOS */}
      <select
        id="sort-select"
        value={value}
        onChange={e => onChange(e.target.value as SortOption)}
        className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl px-3 py-3 sm:py-2.5
                   text-[16px] sm:text-sm text-white
                   focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50
                   transition-colors touch-manipulation"
        aria-label="Ordenar Pokémon"
      >
        {OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
