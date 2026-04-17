'use client';

import { Modal } from '@/components/ui/Modal';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { GEN_COLORS } from '@/lib/pokemonGames';
import type { Item } from '@/types/items';
import { CATEGORY_LABELS, POCKET_COLORS, POCKET_LABELS } from './constants';

interface Props {
  item: Item | null;
  onClose: () => void;
}

export function ItemDetail({ item, onClose }: Props) {
  if (!item) return null;

  const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category.replace(/-/g, ' ');
  const pocketLabel = POCKET_LABELS[item.pocket] ?? item.pocket;
  const badgeColor = POCKET_COLORS[item.pocket] ?? 'text-slate-400 bg-slate-400/10';

  return (
    <Modal
      isOpen={!!item}
      onClose={onClose}
      title={item.nameEs ? `${item.displayName} / ${item.nameEs}` : item.displayName}
    >
      <div className="px-4 sm:px-6 py-4 space-y-6">

        {/* ── Sprite ───────────────────────────────────── */}
        <section className="flex justify-center">
          <div className="flex items-center justify-center w-40 h-40 rounded-2xl bg-gradient-to-br from-[#1e1e3a] to-[#2a2a4e] border border-[#2a2a4e]">
            <ImageWithFallback
              src={item.sprite}
              alt={item.displayName}
              width={112}
              height={112}
              className="object-contain drop-shadow-xl"
            />
          </div>
        </section>

        {/* ── Metadata ─────────────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Información
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0f0f1a] rounded-xl px-4 py-3">
              <p className="text-[10px] text-slate-500 mb-1">Categoría</p>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                {categoryLabel}
              </span>
            </div>
            <div className="bg-[#0f0f1a] rounded-xl px-4 py-3">
              <p className="text-[10px] text-slate-500 mb-1">Bolsillo</p>
              <p className="text-sm font-semibold text-white">{pocketLabel}</p>
            </div>
            {item.cost > 0 && (
              <div className="bg-[#0f0f1a] rounded-xl px-4 py-3" suppressHydrationWarning>
                <p className="text-[10px] text-slate-500 mb-1">Precio</p>
                <p className="text-sm font-semibold text-yellow-400">₽{item.cost}</p>
              </div>
            )}
          </div>

          {item.description && (
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">{item.description}</p>
          )}
          {item.effect && (
            <p className="mt-2 text-xs text-slate-400 leading-relaxed border-l-2 border-[#2a2a4e] pl-3">
              {item.effect}
            </p>
          )}
        </section>

        {/* ── Timeline ─────────────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Historial de apariciones
          </h3>
          <p className="text-[11px] text-slate-600 mb-4">
            Fuente: PokéAPI <code>game_indices</code>
          </p>

          {item.gameAppearances.length === 0 ? (
            <p className="text-sm text-slate-500 italic">Sin datos de apariciones en PokéAPI.</p>
          ) : (
            <ol className="relative border-l border-[#2a2a4e] ml-2 space-y-0">
              {item.gameAppearances.map((entry, i) => {
                const colors = GEN_COLORS[entry.generation] ?? GEN_COLORS[1];
                return (
                  <li key={i} className="ml-4 pb-5 last:pb-0">
                    <span
                      className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-[#0f0f1a] ${colors.dot}`}
                    />
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">{entry.year}</span>
                        <span
                          className={`ml-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${colors.text} ${colors.bg}`}
                        >
                          Gen {entry.generation}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white leading-tight">{entry.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{entry.region}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

      </div>
    </Modal>
  );
}
