'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { TypeBadge } from '@/components/ui/Badge';
import { Badge } from '@/components/ui/Badge';
import { BaseStats } from './BaseStats';
import { EvolutionChainView } from './EvolutionChainView';
import { FormsSection } from './FormsSection';
import { TCGSection } from './TCGSection';
import { TCGPocketSection } from './TCGPocketSection';
import { MovesSection } from './MovesSection';
import {
  normalizePokemonName,
  formatPokedexNumber,
  formatHeight,
  formatWeight,
} from '@/utils/normalize';
import { getTypeGradient } from '@/utils/typeColors';
import { GEN_COLORS } from '@/lib/pokemonGames';
import type { PokemonDetail } from '@/types/pokemon';

const EEVEE_FAMILY = new Set([
  133, // Eevee
  134, // Vaporeon
  135, // Jolteon
  136, // Flareon
  197, // Espeon
  198, // Umbreon
  470, // Leafeon
  471, // Glaceon
  700, // Sylveon
]);

interface Props {
  pokemon: PokemonDetail;
}

export function PokemonDetailView({ pokemon }: Props) {
  const [spriteGallery, setSpriteGallery] = useState(false);
  const [gameLocations, setGameLocations] = useState(false);
  const [movesOpen, setMovesOpen] = useState(false);
  const isEeveeFamily = EEVEE_FAMILY.has(pokemon.id);

  const displayName = normalizePokemonName(pokemon.name);
  const number = formatPokedexNumber(pokemon.id);
  const gradient = getTypeGradient(pokemon.types);

  // Group generation sprites by generation number (already sorted ascending)
  const spriteGroups = pokemon.sprites.generationSprites.reduce<
    Map<number, { game: string; label: string; url: string }[]>
  >((acc, entry) => {
    if (!acc.has(entry.generation)) acc.set(entry.generation, []);
    acc.get(entry.generation)!.push({ game: entry.game, label: entry.label, url: entry.url });
    return acc;
  }, new Map());

  const hasSpriteGallery = spriteGroups.size > 0;

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white
                   transition-colors focus:outline-none focus:ring-2 focus:ring-white/30
                   rounded touch-manipulation"
        aria-label="Volver al listado"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Pokédex
      </Link>

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">

        {/* Artwork — Normal + Shiny side by side */}
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden
                     flex items-center justify-center gap-4 p-5 sm:p-8
                     min-h-56 sm:min-h-72"
          style={{ background: gradient }}
        >
          <div className="absolute inset-0 opacity-5" aria-hidden="true">
            <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9zdmc+')] bg-center bg-no-repeat bg-[length:300px]" />
          </div>

          {[
            { img: pokemon.sprites.official,      label: 'Normal', shiny: false },
            { img: pokemon.sprites.officialShiny,  label: 'Shiny',  shiny: true  },
          ].map(({ img, label, shiny }) => (
            <div key={label} className="relative z-10 flex flex-col items-center gap-1">
              <ImageWithFallback
                src={img}
                alt={`${displayName} ${label}`}
                width={200}
                height={200}
                className="object-contain drop-shadow-2xl
                           w-28 h-28 sm:w-44 sm:h-44 md:w-48 md:h-48"
                priority={!shiny}
              />
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full
                                ${shiny
                                  ? 'bg-yellow-400/20 text-yellow-300'
                                  : 'bg-white/10 text-white/70'}`}>
                {shiny ? '✦ Shiny' : '✧ Normal'}
              </span>
            </div>
          ))}
        </div>

        {/* Info panel */}
        <div className="space-y-4 sm:space-y-5">
          <div>
            <p className="text-sm text-slate-500 font-mono">{number}</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white capitalize leading-tight">
              {displayName}
            </h1>
            {pokemon.species.genus && (
              <p className="text-slate-400 text-sm mt-1">{pokemon.species.genus}</p>
            )}
          </div>

          {/* Status badges */}
          {(pokemon.species.isLegendary || pokemon.species.isMythical || pokemon.species.isBaby) && (
            <div className="flex flex-wrap gap-2">
              {pokemon.species.isLegendary && <Badge variant="legendary">Legendario</Badge>}
              {pokemon.species.isMythical && <Badge variant="mythical">Mítico</Badge>}
              {pokemon.species.isBaby && <Badge variant="baby">Bebé</Badge>}
            </div>
          )}

          {/* Types */}
          <div className="flex gap-2 flex-wrap" aria-label="Tipos">
            {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
          </div>

          {/* Description */}
          {pokemon.species.description && (
            <p className="text-sm text-slate-300 leading-relaxed bg-[#1a1a2e] rounded-xl p-3 sm:p-4 border border-[#2a2a4e]">
              {pokemon.species.description}
            </p>
          )}

          {/* Physical stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1a1a2e] rounded-xl p-3 border border-[#2a2a4e]">
              <p className="text-xs text-slate-500 mb-1">Altura</p>
              <p className="text-sm font-semibold text-white">{formatHeight(pokemon.height)}</p>
            </div>
            <div className="bg-[#1a1a2e] rounded-xl p-3 border border-[#2a2a4e]">
              <p className="text-xs text-slate-500 mb-1">Peso</p>
              <p className="text-sm font-semibold text-white">{formatWeight(pokemon.weight)}</p>
            </div>
          </div>

          {/* Abilities */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Habilidades</p>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map(a => (
                <span
                  key={a.name}
                  className={`px-3 py-1 rounded-full text-xs capitalize border
                    ${a.isHidden
                      ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                      : 'border-[#2a2a4e] bg-[#1a1a2e] text-slate-300'
                    }`}
                  title={a.isHidden ? 'Habilidad oculta' : undefined}
                >
                  {a.name.replace(/-/g, ' ')}
                  {a.isHidden && ' ✦'}
                </span>
              ))}
            </div>
          </div>

          {/* Cry audio */}
          {pokemon.cryUrl && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Grito</p>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio
                src={pokemon.cryUrl}
                controls
                className="w-full accent-red-500"
                style={{ height: '36px' }}
                aria-label={`Grito de ${displayName}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* ─── Stats + Evolution chain + Forms (gridded layout) ─────────────────── */}
      {(pokemon.evolutionChain || pokemon.variants.length > 0) && (
        isEeveeFamily ? (
          // Eevee family: cadena evolutiva a ancho completo, luego Stats + Formas en 2 columnas
          <div className="space-y-4 sm:space-y-6">
            {pokemon.evolutionChain && (
              <div className="py-2">
                <EvolutionChainView chain={pokemon.evolutionChain} currentId={pokemon.id} layout="tree" />
              </div>
            )}
            <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${pokemon.variants.length > 0 ? 'md:grid-cols-2' : ''}`}>
              <div className="bg-[#1a1a2e] rounded-xl sm:rounded-2xl border border-[#2a2a4e] p-4 sm:p-6">
                <BaseStats stats={pokemon.stats} />
              </div>
              {pokemon.variants.length > 0 && (
                <div className="bg-[#1a1a2e] rounded-xl sm:rounded-2xl border border-[#2a2a4e] p-4 sm:p-6">
                  <FormsSection variants={pokemon.variants} />
                </div>
              )}
            </div>
          </div>
        ) : (
          // Resto: Stats | Cadena evolutiva | Formas en la misma grilla
          // Formas recibe el doble de ancho (2fr) para que las tarjetas Mega quepan sin colapsar.
          // En tablet (md) ocupa las 2 columnas completas; a partir de lg tiene su propio carril 2fr.
          <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${
            pokemon.evolutionChain && pokemon.variants.length > 0
              ? 'md:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr]'
              : 'md:grid-cols-2'
          }`}>
            <div className="bg-[#1a1a2e] rounded-xl sm:rounded-2xl border border-[#2a2a4e] p-4 sm:p-6">
              <BaseStats stats={pokemon.stats} />
            </div>
            {pokemon.evolutionChain && (
              <div className="py-2">
                <EvolutionChainView chain={pokemon.evolutionChain} currentId={pokemon.id} />
              </div>
            )}
            {pokemon.variants.length > 0 && (
              <div className="bg-[#1a1a2e] rounded-xl sm:rounded-2xl border border-[#2a2a4e] p-4 sm:p-6
                              md:col-span-2 lg:col-span-1">
                <FormsSection variants={pokemon.variants} />
              </div>
            )}
          </div>
        )
      )}

      {/* ─── Sprite gallery ───────────────────────────────────────────────── */}
      {hasSpriteGallery && (
        <section aria-label="Galería de sprites">
          <button
            onClick={() => setSpriteGallery(v => !v)}
            className="flex items-center gap-2 w-full text-left mb-3 sm:mb-4
                       focus:outline-none focus:ring-2 focus:ring-white/30 rounded
                       touch-manipulation group"
            aria-expanded={spriteGallery}
          >
            <h2 className="text-base sm:text-lg font-bold text-white">Galería de sprites</h2>
            <svg
              className={`w-4 h-4 text-slate-400 group-hover:text-white transition-all flex-shrink-0
                          ${spriteGallery ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {spriteGallery && (
            <div className="space-y-6">
              {Array.from(spriteGroups.entries()).map(([gen, sprites]) => (
                <div key={gen}>
                  {/* Generation heading */}
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Generación {gen}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {sprites.map((s, i) => (
                      <div
                        key={`${s.game}-${s.label}-${i}`}
                        className="bg-[#1a1a2e] rounded-xl border border-[#2a2a4e] p-2
                                   flex flex-col items-center gap-1"
                      >
                        <ImageWithFallback
                          src={s.url}
                          alt={`${displayName} – ${s.game} – ${s.label}`}
                          width={64}
                          height={64}
                          className="object-contain"
                          unoptimized
                        />
                        <span className="text-[9px] text-slate-500 text-center leading-tight">
                          {s.game}
                        </span>
                        <span className="text-[9px] text-slate-600 text-center leading-tight">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}


      {/* ─── Game locations ───────────────────────────────────────────────── */}
      {pokemon.gameAppearances.length > 0 && (
        <section aria-label="Localización videojuegos">
          <button
            onClick={() => setGameLocations(v => !v)}
            className="flex items-center gap-2 w-full text-left mb-3 sm:mb-4
                       focus:outline-none focus:ring-2 focus:ring-white/30 rounded
                       touch-manipulation group"
            aria-expanded={gameLocations}
          >
            <h2 className="text-base sm:text-lg font-bold text-white">Disponibilidad videojuegos</h2>
            <svg
              className={`w-4 h-4 text-slate-400 group-hover:text-white transition-all flex-shrink-0
                          ${gameLocations ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {gameLocations && (
            <div className="flex flex-wrap gap-2">
              {pokemon.gameAppearances.map(game => {
                const colors = GEN_COLORS[game.generation] ?? GEN_COLORS[1];
                return (
                  <div
                    key={game.title}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                                border border-white/10 ${colors.bg} ${colors.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                    {game.title}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ─── Moves ───────────────────────────────────────────────────────── */}
      {pokemon.moves.length > 0 && (
        <section aria-label="Movimientos">
          <button
            onClick={() => setMovesOpen(v => !v)}
            className="flex items-center gap-2 w-full text-left mb-3 sm:mb-4
                       focus:outline-none focus:ring-2 focus:ring-white/30 rounded
                       touch-manipulation group"
            aria-expanded={movesOpen}
          >
            <h2 className="text-base sm:text-lg font-bold text-white">Movimientos</h2>
            <svg
              className={`w-4 h-4 text-slate-400 group-hover:text-white transition-all flex-shrink-0
                          ${movesOpen ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {movesOpen && <MovesSection moves={pokemon.moves} />}
        </section>
      )}

      {/* ─── TCG cards ────────────────────────────────────────────────────── */}
      <TCGSection pokemonName={pokemon.name} />

      {/* ─── TCG Pocket cards ─────────────────────────────────────────────── */}
      <TCGPocketSection pokemonName={pokemon.name} />
    </div>
  );
}
