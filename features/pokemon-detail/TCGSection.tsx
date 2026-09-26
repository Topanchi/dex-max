'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { TCGCardSkeleton } from '@/components/ui/Skeleton';
import { normalizeTCGSearchName } from '@/utils/normalize';
import { getTCGGeneration } from '@/utils/tcgGeneration';
import { GENERATIONS } from '@/features/pokedex/GenerationFilter';
import type { TCGCard } from '@/types/tcg';

interface CardItemProps {
  card: TCGCard;
  onClick: (card: TCGCard) => void;
}

const SET_TYPE_LABELS: Record<TCGCard['set']['type'], string> = {
  MAIN:    'Set principal',
  SPECIAL: 'Set especial',
  PROMO:   'Promo',
  OTHER:   'Otros',
};

function CardItem({ card, onClick }: CardItemProps) {
  const [imgError, setImgError] = useState(false);
  const cardNumber = card.set.printedTotal
    ? `${card.number}/${card.set.printedTotal}`
    : `#${card.number}`;

  return (
    <button
      onClick={() => onClick(card)}
      className="group text-left rounded-xl bg-[#1a1a2e] border border-[#2a2a4e] p-2 hover:border-[#4a4a7e]
                 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label={`Ver carta ${card.name} – ${card.set.name} ${cardNumber}`}
    >
      {/* Card image */}
      <div className="relative aspect-[2.5/3.5] w-full rounded-lg overflow-hidden bg-[#2a2a4e] mb-2">
        {card.imageUrl && !imgError ? (
          <Image
            src={card.imageUrl}
            alt={`Carta ${card.name}`}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 15vw"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-600 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      <p className="text-xs font-semibold text-white truncate">{card.name}</p>
      <p className="text-[10px] text-slate-500 truncate">
        {card.set.name}
        {card.set.code && ` (${card.set.code})`}
      </p>
      <p className="text-[10px] text-slate-600 truncate">
        {cardNumber}
        {card.variant && ` · ${card.variant}`}
      </p>
      {card.set.type !== 'MAIN' && (
        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold
                          bg-white/10 text-slate-400">
          {SET_TYPE_LABELS[card.set.type]}
        </span>
      )}
    </button>
  );
}

interface CardModalContentProps {
  card: TCGCard;
}

function CardModalContent({ card }: CardModalContentProps) {
  const [imgError, setImgError] = useState(false);
  const cardNumber = card.set.printedTotal
    ? `${card.number}/${card.set.printedTotal}`
    : `#${card.number}`;

  return (
    <div className="p-6 flex flex-col sm:flex-row gap-6">
      {/* Large image */}
      <div className="relative shrink-0 w-48 mx-auto sm:mx-0">
        <div className="relative aspect-[2.5/3.5] w-full rounded-xl overflow-hidden bg-[#2a2a4e]">
          {card.imageUrl && !imgError ? (
            <Image
              src={card.imageUrl}
              alt={`Carta ${card.name}`}
              fill
              className="object-contain"
              sizes="200px"
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              Sin imagen
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-white">{card.name}</h3>
          <p className="text-sm text-slate-400">
            {card.set.name}
            {card.set.code && ` (${card.set.code})`} · {cardNumber}
          </p>
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-slate-500 w-28 shrink-0">Era TCG</dt>
            <dd className="text-white">{card.era.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-500 w-28 shrink-0">Tipo de set</dt>
            <dd className="text-white">{SET_TYPE_LABELS[card.set.type]}</dd>
          </div>
          {card.rarity && (
            <div className="flex gap-2">
              <dt className="text-slate-500 w-28 shrink-0">Rareza</dt>
              <dd className="text-white">{card.rarity}</dd>
            </div>
          )}
          {card.variant && (
            <div className="flex gap-2">
              <dt className="text-slate-500 w-28 shrink-0">Variante</dt>
              <dd className="text-white">{card.variant}</dd>
            </div>
          )}
          {card.availableVariants.length > 0 && (
            <div className="flex gap-2">
              <dt className="text-slate-500 w-28 shrink-0">Impresiones</dt>
              <dd className="text-white">{card.availableVariants.join(', ')}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="text-slate-500 w-28 shrink-0">Categoría</dt>
            <dd className="text-white capitalize">{card.category}</dd>
          </div>
          {card.hp && (
            <div className="flex gap-2">
              <dt className="text-slate-500 w-28 shrink-0">PS</dt>
              <dd className="text-white">{card.hp}</dd>
            </div>
          )}
          {card.types && card.types.length > 0 && (
            <div className="flex gap-2">
              <dt className="text-slate-500 w-28 shrink-0">Tipos (TCG)</dt>
              <dd className="text-white capitalize">{card.types.join(', ')}</dd>
            </div>
          )}
          {card.illustrator && (
            <div className="flex gap-2">
              <dt className="text-slate-500 w-28 shrink-0">Ilustrador</dt>
              <dd className="text-white">{card.illustrator}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="text-slate-500 w-28 shrink-0">Set ID</dt>
            <dd className="text-slate-400 font-mono text-xs">{card.set.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

interface TCGSectionProps {
  pokemonName: string;
}

export function TCGSection({ pokemonName }: TCGSectionProps) {
  const [cards, setCards] = useState<TCGCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TCGCard | null>(null);

  const groupedByGeneration = useMemo(() => {
    const groups = new Map<number, TCGCard[]>();
    for (const card of cards) {
      const gen = getTCGGeneration(card.set.series, card.set.releaseDate);
      if (!groups.has(gen)) groups.set(gen, []);
      groups.get(gen)!.push(card);
    }
    return [...groups.entries()].sort((a, b) => a[0] - b[0]);
  }, [cards]);

  useEffect(() => {
    const searchName = normalizeTCGSearchName(pokemonName);
    fetch(`/api/tcg-cards?name=${encodeURIComponent(searchName)}`)
      .then(r => r.json())
      .then((data: { cards: TCGCard[] }) => {
        setCards(data.cards ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [pokemonName]);

  return (
    <section aria-label="Cartas TCG">
      <h2 className="text-lg font-bold mb-4 text-white">Cartas TCG</h2>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-9 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <TCGCardSkeleton key={i} />)}
        </div>
      )}

      {error && (
        <p className="text-slate-500 text-sm py-4">
          No se pudieron cargar las cartas TCG.
        </p>
      )}

      {!loading && !error && cards.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center
                        bg-[#1a1a2e] rounded-xl border border-[#2a2a4e]">
          <span className="text-2xl" aria-hidden="true">🃏</span>
          <p className="text-slate-400 text-sm font-medium">
            Este Pokémon no posee cartas asociadas al TCG.
          </p>
        </div>
      )}

      {!loading && cards.length > 0 && (
        <>
          <p className="text-xs text-slate-500 mb-4">
            {cards.length} carta{cards.length !== 1 ? 's' : ''} · Fuente: Pokémon TCG API
          </p>
          <div className="space-y-6">
            {groupedByGeneration.map(([genId, genCards]) => {
              const gen = GENERATIONS.find(g => g.id === genId);
              return (
                <div key={genId}>
                  <h3 className="text-sm font-bold mb-3 flex items-baseline gap-2">
                    <span style={{ color: gen?.color }}>
                      Generación {gen?.roman ?? genId}
                    </span>
                    {gen && <span className="text-xs font-normal text-slate-500">{gen.region}</span>}
                    <span className="text-xs font-normal text-slate-600">
                      ({genCards.length})
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-9 gap-3">
                    {genCards.map(card => (
                      <CardItem key={card.id} card={card} onClick={setSelectedCard} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <Modal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.name}
      >
        {selectedCard && <CardModalContent card={selectedCard} />}
      </Modal>
    </section>
  );
}
