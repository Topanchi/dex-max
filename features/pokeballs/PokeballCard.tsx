import Image from 'next/image';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import type { Pokeball } from '@/types/pokeballs';

export type SpriteSource = 'pokeapi' | 'artwork';

interface Props {
  pokeball: Pokeball;
  source: SpriteSource;
  onSelect: (ball: Pokeball) => void;
}

export function PokeballCard({ pokeball, source, onSelect }: Props) {
  const { displayName, sprite, artworkUrl, cost, effect } = pokeball;

  const isArtwork = source === 'artwork' && !!artworkUrl;
  const spriteUrl = isArtwork ? artworkUrl : sprite;

  return (
    <button
      onClick={() => onSelect(pokeball)}
      className="group w-full text-left rounded-2xl bg-[#1a1a2e] border border-[#2a2a4e] overflow-hidden
                 hover:border-[#4a4a7e] hover:shadow-lg hover:shadow-black/40 hover:-translate-y-1
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
      aria-label={`Ver detalles de ${displayName}`}
    >
      {/* Art area */}
      <div className="relative flex items-center justify-center overflow-hidden h-36 bg-gradient-to-br from-[#1e1e3a] to-[#2a2a4e]">
        {isArtwork ? (
          <Image
            src={artworkUrl}
            alt={displayName}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
          />
        ) : (
          <ImageWithFallback
            src={spriteUrl}
            alt={displayName}
            width={80}
            height={80}
            className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-200"
          />
        )}

        {source === 'artwork' && !artworkUrl && (
          <span className="absolute bottom-2 right-2 text-[9px] text-slate-600 bg-[#0f0f1a]/80 px-1.5 py-0.5 rounded">
            sin arte
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pb-4 pt-3">
        <p className="text-sm font-semibold text-white mb-1">{displayName}</p>

        {cost > 0 && (
          <p className="text-xs text-slate-500 mb-2" suppressHydrationWarning>
            <span className="text-yellow-500 font-medium">₽{cost}</span>
          </p>
        )}

        {effect && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{effect}</p>
        )}
      </div>
    </button>
  );
}
