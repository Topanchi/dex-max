'use client';

import { useMemo, useState } from 'react';
import { ItemCard } from './ItemCard';
import { ItemDetail } from './ItemDetail';
import type { Item } from '@/types/items';
import { CATEGORY_LABELS, POCKET_COLORS, POCKET_LABELS } from './constants';

interface Props {
  items: Item[];
}

type FilterKey = 'all' | string;

export function ItemsClient({ items }: Props) {
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState<FilterKey>('all');
  const [selected, setSelected]   = useState<Item | null>(null);

  // Build sorted unique category list from actual data
  const categories = useMemo(() => {
    const seen = new Map<string, { category: string; pocket: string; count: number }>();
    for (const item of items) {
      if (!seen.has(item.category)) {
        seen.set(item.category, { category: item.category, pocket: item.pocket, count: 0 });
      }
      seen.get(item.category)!.count++;
    }
    return Array.from(seen.values()).sort((a, b) => {
      // Sort by pocket order first, then alphabetically
      const pocketOrder = ['medicine', 'held-items', 'berries', 'z-crystals'];
      const pa = pocketOrder.indexOf(a.pocket);
      const pb = pocketOrder.indexOf(b.pocket);
      if (pa !== pb) return pa - pb;
      return a.category.localeCompare(b.category);
    });
  }, [items]);

  const displayed = useMemo(() => {
    let result = items;
    if (filter !== 'all') {
      result = result.filter(i => i.category === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(i => i.displayName.toLowerCase().includes(q));
    }
    return result;
  }, [items, filter, search]);

  const totalLabel = search.trim()
    ? `${displayed.length} resultado${displayed.length !== 1 ? 's' : ''} para "${search}"`
    : filter !== 'all'
      ? `${displayed.length} objeto${displayed.length !== 1 ? 's' : ''}`
      : `${items.length} objetos · haz clic para ver detalles`;

  return (
    <>
      <div>
        {/* Search */}
        <div className="mb-4">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar objeto..."
            className="w-full sm:w-72 px-4 py-2 rounded-xl bg-[#1a1a2e] border border-[#2a2a4e]
                       text-white placeholder:text-slate-600 text-sm
                       focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#4a4a7e]
                       transition-colors"
            aria-label="Buscar objeto"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Filtrar por categoría">
          <CategoryButton
            label="Todos"
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            color=""
          />
          {categories.map(({ category, pocket }) => {
            const label = CATEGORY_LABELS[category] ?? category.replace(/-/g, ' ');
            const color = POCKET_COLORS[pocket] ?? '';
            return (
              <CategoryButton
                key={category}
                label={label}
                active={filter === category}
                onClick={() => setFilter(filter === category ? 'all' : category)}
                color={color}
              />
            );
          })}
        </div>

        {/* Pocket legend */}
        <div className="flex flex-wrap gap-3 mb-5">
          {(['medicine', 'held-items', 'berries', 'z-crystals', 'misc'] as const).map(pocket => (
            <span key={pocket} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`inline-block w-2 h-2 rounded-full ${POCKET_COLORS[pocket]?.split(' ')[1] ?? ''} opacity-60`} />
              {POCKET_LABELS[pocket]}
            </span>
          ))}
        </div>

        {/* Counter */}
        <p className="text-xs text-slate-500 mb-4">{totalLabel}</p>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayed.map(item => (
            <ItemCard key={item.id} item={item} onSelect={setSelected} />
          ))}
        </div>

        {displayed.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-lg">No se encontraron objetos</p>
            <p className="text-slate-600 text-sm mt-1">Prueba con otro nombre o categoría</p>
          </div>
        )}
      </div>

      <ItemDetail item={selected} onClose={() => setSelected(null)} />
    </>
  );
}

interface CategoryButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}

function CategoryButton({ label, active, onClick, color }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  focus:outline-none focus:ring-2 focus:ring-white/20 ${
        active
          ? `bg-white/15 text-white border border-white/20 scale-105`
          : 'bg-[#1a1a2e] text-slate-400 border border-[#2a2a4e] hover:text-white hover:border-[#4a4a7e]'
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
