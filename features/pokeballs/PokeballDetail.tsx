'use client';

import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { GEN_COLORS } from '@/lib/pokemonGames';
import type { Pokeball } from '@/types/pokeballs';

interface Props {
  ball: Pokeball | null;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  'standard-balls': 'Estándar',
  'special-balls':  'Especial',
  'apricorn-balls': 'Apricorn',
  'safari-balls':   'Safari',
  'sport-balls':    'Sport',
  'dream-balls':    'Dream',
  'beast-balls':    'Beast',
};

interface SpritePanelProps {
  url: string;
  label: string;
  sourceHref: string;
  sourceLabel: string;
  note?: string;
}

function SpritePanel({ url, label, sourceHref, sourceLabel, note }: SpritePanelProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center w-32 h-32 rounded-xl bg-[#0f0f1a] border border-[#2a2a4e]">
        <ImageWithFallback
          src={url}
          alt={label}
          width={96}
          height={96}
          className="object-contain drop-shadow-lg"
        />
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-white">{label}</p>
        <a
          href={sourceHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          {sourceLabel} ↗
        </a>
        {note && <p className="text-[10px] text-slate-600 mt-0.5">{note}</p>}
      </div>
    </div>
  );
}

export function PokeballDetail({ ball, onClose }: Props) {
  if (!ball) return null;

  const categoryLabel = CATEGORY_LABELS[ball.category] ?? ball.category;

  return (
    <Modal isOpen={!!ball} onClose={onClose} title={ball.displayName}>
      <div className="px-4 sm:px-6 py-4 space-y-6">

        {/* ── Arte oficial ─────────────────────────────── */}
        {ball.artworkUrl && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Arte oficial · Sugimori
              </h3>
              <a
                href="https://archives.bulbagarden.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
              >
                Bulbagarden Archives ↗
              </a>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden bg-[#0f0f1a] border border-[#2a2a4e]"
                 style={{ paddingBottom: '56%' }}>
              <Image
                src={ball.artworkUrl}
                alt={`${ball.displayName} - Arte oficial Sugimori`}
                fill
                className="object-contain p-6"
              />
            </div>
            <p className="mt-1.5 text-[10px] text-slate-600 text-right">
              © The Pokémon Company / Ken Sugimori · vía Bulbagarden Archives · 694×694 px
            </p>
          </section>
        )}

        {/* ── Sprites ──────────────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Sprites de ícono
          </h3>
          <div className="flex gap-6 justify-center flex-wrap">
            <SpritePanel
              url={ball.sprite}
              label="Sprite oficial"
              sourceHref="https://github.com/PokeAPI/sprites"
              sourceLabel="PokeAPI/sprites"
              note="Bag item sprite · PNG 30 px"
            />
          </div>
          {!ball.artworkUrl && (
            <p className="mt-4 text-[11px] text-slate-600 text-center leading-relaxed">
              Sin arte Sugimori disponible para esta Pokéball — introducida en Legends: Arceus o posterior.
            </p>
          )}
        </section>

        {/* ── Metadata ─────────────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Información
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {ball.cost > 0 && (
              <div className="bg-[#0f0f1a] rounded-xl px-4 py-3" suppressHydrationWarning>
                <p className="text-[10px] text-slate-500 mb-1">Precio</p>
                <p className="text-sm font-semibold text-yellow-400">₽{ball.cost}</p>
              </div>
            )}
            {categoryLabel && (
              <div className="bg-[#0f0f1a] rounded-xl px-4 py-3">
                <p className="text-[10px] text-slate-500 mb-1">Categoría</p>
                <p className="text-sm font-semibold text-white">{categoryLabel}</p>
              </div>
            )}
          </div>

          {ball.description && (
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">{ball.description}</p>
          )}
          {ball.effect && (
            <p className="mt-2 text-xs text-slate-400 leading-relaxed border-l-2 border-[#2a2a4e] pl-3">
              {ball.effect}
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

          {ball.gameAppearances.length === 0 ? (
            <p className="text-sm text-slate-500 italic">Sin datos de apariciones en PokéAPI.</p>
          ) : (
            <ol className="relative border-l border-[#2a2a4e] ml-2 space-y-0">
              {ball.gameAppearances.map((entry, i) => {
                const colors = GEN_COLORS[entry.generation] ?? GEN_COLORS[1];
                return (
                  <li key={i} className="ml-4 pb-5 last:pb-0">
                    {/* dot */}
                    <span
                      className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-[#0f0f1a] ${colors.dot}`}
                    />
                    <div className="flex items-start gap-3">
                      {/* Year + gen badge */}
                      <div className="shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">{entry.year}</span>
                        <span
                          className={`ml-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${colors.text} ${colors.bg}`}
                        >
                          Gen {entry.generation}
                        </span>
                      </div>
                      {/* Game info */}
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
