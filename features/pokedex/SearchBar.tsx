'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1 min-w-0">
      <label htmlFor="pokemon-search" className="sr-only">
        Buscar Pokémon por nombre
      </label>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        id="pokemon-search"
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar Pokémon..."
        /* text-[16px] evita que iOS haga zoom automático al enfocar el input */
        className="w-full bg-[#1a1a2e] border border-[#2a2a4e] rounded-xl pl-10 pr-10 py-3
                   text-[16px] sm:text-sm text-white placeholder-slate-500
                   focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50
                   transition-colors touch-manipulation"
        aria-label="Buscar Pokémon por nombre"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white
                     transition-colors p-1 touch-manipulation"
          aria-label="Limpiar búsqueda"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
