import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import type { Item } from '@/types/items';
import { CATEGORY_LABELS, POCKET_COLORS } from './constants';

interface Props {
  item: Item;
  onSelect: (item: Item) => void;
}

export function ItemCard({ item, onSelect }: Props) {
  const { displayName, sprite, cost, effect, category, pocket } = item;
  const categoryLabel = CATEGORY_LABELS[category] ?? category.replace(/-/g, ' ');
  const color = POCKET_COLORS[pocket] ?? 'text-slate-400 bg-slate-400/10';

  return (
    <button
      onClick={() => onSelect(item)}
      className="group w-full text-left rounded-2xl bg-[#1a1a2e] border border-[#2a2a4e] overflow-hidden
                 hover:border-[#4a4a7e] hover:shadow-lg hover:shadow-black/40 hover:-translate-y-1
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
      aria-label={`Ver detalles de ${displayName}`}
    >
      {/* Sprite area */}
      <div className="relative flex items-center justify-center h-28 bg-gradient-to-br from-[#1e1e3a] to-[#2a2a4e]">
        <ImageWithFallback
          src={sprite}
          alt={displayName}
          width={72}
          height={72}
          className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-200"
        />
      </div>

      {/* Info */}
      <div className="px-3 pb-3 pt-2.5">
        <p className="text-sm font-semibold text-white mb-1.5 line-clamp-1">{displayName}</p>

        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-2 ${color}`}>
          {categoryLabel}
        </span>

        {cost > 0 && (
          <p className="text-xs text-slate-500 mb-1.5" suppressHydrationWarning>
            <span className="text-yellow-500 font-medium">₽{cost.toLocaleString()}</span>
          </p>
        )}

        {effect && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{effect}</p>
        )}
      </div>
    </button>
  );
}
