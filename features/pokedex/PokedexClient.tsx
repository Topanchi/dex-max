'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PokemonCard } from './PokemonCard';
import { SearchBar } from './SearchBar';
import { TypeFilter } from './TypeFilter';
import { GenerationFilter, GENERATIONS } from './GenerationFilter';
import { SortControls, type SortOption } from './SortControls';
import { PokemonCardSkeleton } from '@/components/ui/Skeleton';
import { getOfficialArtworkUrl } from '@/utils/sprites';
import type { PokemonBasic, PokemonListPageResult, PokemonNameEntry } from '@/types/pokemon';

interface Props {
  initialPage: PokemonListPageResult;
}

function sortPokemon(list: PokemonBasic[], sort: SortOption): PokemonBasic[] {
  return [...list].sort((a, b) => {
    switch (sort) {
      case 'number-asc':  return a.id - b.id;
      case 'number-desc': return b.id - a.id;
      case 'name-asc':    return a.name.localeCompare(b.name);
      case 'name-desc':   return b.name.localeCompare(a.name);
    }
  });
}

// Encodes active filters into a string key for change detection
function filterKey(type: string | null, generation: number | null): string {
  return `t:${type ?? ''}|g:${generation ?? ''}`;
}

export function PokedexClient({ initialPage }: Props) {
  const [allNames, setAllNames] = useState<PokemonNameEntry[]>([]);
  const [pokemon, setPokemon] = useState<PokemonBasic[]>(initialPage.pokemon);
  const [total, setTotal] = useState(initialPage.total);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('number-asc');

  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeFilterKey = useRef<string>(filterKey(null, null));

  // Fetch all names once for client-side search
  useEffect(() => {
    fetch('/api/pokemon/names')
      .then(r => r.json())
      .then((data: { names: PokemonNameEntry[] }) => setAllNames(data.names))
      .catch(() => {});
  }, []);

  const fetchPage = useCallback(
    async (pageNum: number, reset: boolean, type: string | null, generation: number | null) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(pageNum), limit: '20' });
        if (generation) params.set('generation', String(generation));
        else if (type) params.set('type', type);

        const res = await fetch(`/api/pokemon?${params}`);
        if (!res.ok) throw new Error('fetch failed');
        const data: PokemonListPageResult = await res.json();
        setPokemon(prev => reset ? data.pokemon : [...prev, ...data.pokemon]);
        setTotal(data.total);
        setHasMore(data.hasMore);
      } catch {
        // keep current state on error
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // When type or generation changes: generation and type are mutually exclusive
  const handleTypeChange = (types: string[]) => {
    const t = types[0] ?? null;
    setSelectedType(t);
    setSelectedGeneration(null); // clear generation
  };

  const handleGenerationChange = (id: number | null) => {
    setSelectedGeneration(id);
    setSelectedType(null); // clear type
  };

  // Re-fetch when any filter changes
  useEffect(() => {
    const key = filterKey(selectedType, selectedGeneration);
    if (key === activeFilterKey.current) return;
    activeFilterKey.current = key;
    setPage(0);
    fetchPage(0, true, selectedType, selectedGeneration);
  }, [selectedType, selectedGeneration, fetchPage]);

  // Infinite scroll sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !search) {
          const next = page + 1;
          setPage(next);
          fetchPage(next, false, selectedType, selectedGeneration);
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, page, search, selectedType, selectedGeneration, fetchPage]);

  // ─── Derived display list ─────────────────────────────────────────────────
  const displayList: PokemonBasic[] = (() => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return allNames
        .filter(n => n.name.toLowerCase().includes(q))
        .slice(0, 60)
        .map(n => ({
          id: n.id,
          name: n.name,
          types: undefined as unknown as string[],
          imageUrl: getOfficialArtworkUrl(n.id),
          shinyImageUrl: null,
        }));
    }
    return sortPokemon(pokemon, sortBy);
  })();

  const isSearchMode = search.trim().length > 0;

  // Active filter label for the counter
  const activeFilterLabel = (() => {
    if (selectedGeneration) {
      const gen = GENERATIONS.find(g => g.id === selectedGeneration);
      return gen ? `Gen ${gen.roman} – ${gen.region}` : null;
    }
    if (selectedType) return selectedType;
    return null;
  })();

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} />
        {!isSearchMode && <SortControls value={sortBy} onChange={setSortBy} />}
      </div>

      {!isSearchMode && (
        <>
          <GenerationFilter selected={selectedGeneration} onChange={handleGenerationChange} />
          <TypeFilter
            selected={selectedType ? [selectedType] : []}
            onChange={handleTypeChange}
          />
        </>
      )}

      {/* Counter */}
      <p className="text-xs text-slate-500 mb-4">
        {isSearchMode
          ? `${displayList.length} resultado${displayList.length !== 1 ? 's' : ''} para "${search}"`
          : activeFilterLabel
          ? `${total} Pokémon · ${activeFilterLabel}`
          : `${total} Pokémon`}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-4">
        {displayList.map(p => (
          <PokemonCard
            key={p.id}
            id={p.id}
            name={p.name}
            types={p.types?.length ? p.types : undefined}
            imageUrl={p.imageUrl}
          />
        ))}
        {loading && Array.from({ length: 20 }).map((_, i) => <PokemonCardSkeleton key={`sk-${i}`} />)}
      </div>

      {/* Empty state */}
      {!loading && displayList.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-400 text-lg">No se encontraron Pokémon</p>
          <p className="text-slate-600 text-sm mt-1">
            {isSearchMode ? 'Intenta con otro nombre' : 'Prueba con otro filtro'}
          </p>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-8" aria-hidden="true" />

      {!hasMore && !loading && !isSearchMode && pokemon.length > 0 && (
        <p className="text-center text-slate-600 text-sm mt-4 pb-4">
          Has visto todos los Pokémon ✓
        </p>
      )}
    </div>
  );
}
