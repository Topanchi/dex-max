'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { TypeBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { getTypeGradient } from '@/utils/typeColors';
import { normalizePokemonName, formatPokedexNumber } from '@/utils/normalize';
import { getOfficialArtworkUrl } from '@/utils/sprites';

interface PokemonCardProps {
  id: number;
  name: string;
  types?: string[];
  imageUrl?: string | null;
}

export function PokemonCard({ id, name, types: preloadedTypes, imageUrl }: PokemonCardProps) {
  const [types, setTypes] = useState<string[] | null>(preloadedTypes ?? null);
  const [loadingTypes, setLoadingTypes] = useState(!preloadedTypes);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (preloadedTypes) return;

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        fetch(`/api/pokemon/${id}/types`)
          .then(r => r.json())
          .then(data => {
            setTypes(data.types ?? []);
            setLoadingTypes(false);
          })
          .catch(() => {
            setTypes([]);
            setLoadingTypes(false);
          });
      },
      { rootMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, preloadedTypes]);

  const displayName = normalizePokemonName(name);
  const number = formatPokedexNumber(id);
  const image = imageUrl ?? getOfficialArtworkUrl(id);
  const gradient = types ? getTypeGradient(types) : 'linear-gradient(135deg, #1a1a2e, #2a2a4e)';

  return (
    <Link
      ref={cardRef}
      href={`/pokemon/${id}`}
      className="group block rounded-2xl bg-[#1a1a2e] border border-[#2a2a4e] overflow-hidden
                 hover:border-[#4a4a7e] hover:shadow-lg hover:shadow-black/40 hover:-translate-y-1
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label={`Ver detalles de ${displayName}`}
    >
      {/* Card art background */}
      <div
        className="relative flex items-center justify-center p-4 pt-6 h-36"
        style={{ background: gradient }}
      >
        <ImageWithFallback
          src={image}
          alt={displayName}
          width={96}
          height={96}
          className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Card info */}
      <div className="px-3 pb-3 pt-2 text-center">
        <p className="text-[10px] text-slate-500 font-mono mb-0.5">{number}</p>
        <p className="text-sm font-semibold text-white capitalize mb-2 truncate">{displayName}</p>

        <div className="flex gap-1 justify-center flex-wrap min-h-[22px]">
          {loadingTypes ? (
            <>
              <Skeleton className="h-5 w-14 rounded-full" />
            </>
          ) : (
            types?.map(t => <TypeBadge key={t} type={t} size="sm" />)
          )}
        </div>
      </div>
    </Link>
  );
}
