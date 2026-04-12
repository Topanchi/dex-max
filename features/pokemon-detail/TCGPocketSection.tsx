'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { TCGCardSkeleton } from '@/components/ui/Skeleton';
import type { TCGPocketCard } from '@/types/tcg';

// ─── Card item ────────────────────────────────────────────────────────────────

interface CardItemProps {
  card: TCGPocketCard;
  onClick: (card: TCGPocketCard) => void;
}

function CardItem({ card, onClick }: CardItemProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={() => onClick(card)}
      className="group text-left rounded-xl bg-[#1a1a2e] border border-[#2a2a4e] p-2
                 hover:border-[#4a4a7e] hover:shadow-lg transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label={`Ver carta ${card.name} – ${card.set.name} #${card.localId}`}
    >
      <div className="relative aspect-[2.5/3.5] w-full rounded-lg overflow-hidden bg-[#2a2a4e] mb-2">
        {card.imageUrl && !imgError ? (
          <Image
            src={card.imageUrl}
            alt={`Carta TCG Pocket ${card.name}`}
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
      <p className="text-[10px] text-slate-500 truncate">{card.set.name}</p>
      <p className="text-[10px] text-slate-600">
        #{card.localId}
        {card.rarity && ` · ${card.rarity}`}
      </p>
    </button>
  );
}

// ─── Modal content ────────────────────────────────────────────────────────────

function CardModalContent({ card }: { card: TCGPocketCard }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="p-6 flex flex-col sm:flex-row gap-6">
      <div className="relative shrink-0 w-48 mx-auto sm:mx-0">
        <div className="relative aspect-[2.5/3.5] w-full rounded-xl overflow-hidden bg-[#2a2a4e]">
          {card.imageUrl && !imgError ? (
            <Image
              src={card.imageUrl}
              alt={`Carta TCG Pocket ${card.name}`}
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

      <div className="flex-1 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-white">{card.name}</h3>
          <p className="text-sm text-slate-400">{card.set.name} · #{card.localId}</p>
        </div>

        <dl className="space-y-2 text-sm">
          {card.rarity && (
            <div className="flex gap-2">
              <dt className="text-slate-500 w-24 shrink-0">Rareza</dt>
              <dd className="text-white">{card.rarity}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="text-slate-500 w-24 shrink-0">Categoría</dt>
            <dd className="text-white capitalize">{card.category}</dd>
          </div>
          {card.hp && (
            <div className="flex gap-2">
              <dt className="text-slate-500 w-24 shrink-0">PS</dt>
              <dd className="text-white">{card.hp}</dd>
            </div>
          )}
          {card.types && card.types.length > 0 && (
            <div className="flex gap-2">
              <dt className="text-slate-500 w-24 shrink-0">Tipo (TCG)</dt>
              <dd className="text-white capitalize">{card.types.join(', ')}</dd>
            </div>
          )}
          {card.illustrator && (
            <div className="flex gap-2">
              <dt className="text-slate-500 w-24 shrink-0">Ilustrador</dt>
              <dd className="text-white">{card.illustrator}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="text-slate-500 w-24 shrink-0">Set ID</dt>
            <dd className="text-slate-400 font-mono text-xs">{card.set.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface TCGPocketSectionProps {
  pokemonName: string;
}

export function TCGPocketSection({ pokemonName }: TCGPocketSectionProps) {
  const [cards, setCards]               = useState<TCGPocketCard[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [selectedCard, setSelectedCard] = useState<TCGPocketCard | null>(null);

  useEffect(() => {
    fetch(`/api/tcg-pocket?name=${encodeURIComponent(pokemonName)}`)
      .then(r => r.json())
      .then((data: { cards: TCGPocketCard[] }) => {
        setCards(data.cards ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [pokemonName]);

  return (
    <section aria-label="Cartas TCG Pocket">
      <h2 className="text-lg font-bold mb-4 text-white">Cartas TCG Pocket</h2>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-9 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <TCGCardSkeleton key={i} />)}
        </div>
      )}

      {error && (
        <p className="text-slate-500 text-sm py-4">
          No se pudieron cargar las cartas TCG Pocket.
        </p>
      )}

      {!loading && !error && cards.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center
                        bg-[#1a1a2e] rounded-xl border border-[#2a2a4e]">
          <span className="text-2xl" aria-hidden="true">📱</span>
          <p className="text-slate-400 text-sm font-medium">
            Este Pokémon no posee cartas asociadas al TCG Pocket.
          </p>
        </div>
      )}

      {!loading && cards.length > 0 && (
        <>
          <p className="text-xs text-slate-500 mb-3">
            {cards.length} carta{cards.length !== 1 ? 's' : ''} · Fuente: pokemon-tcg-pocket-database
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-9 gap-3">
            {cards.map(card => (
              <CardItem key={card.id} card={card} onClick={setSelectedCard} />
            ))}
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
