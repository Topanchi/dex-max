interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-[#2a2a4e] ${className}`}
      aria-hidden="true"
    />
  );
}

export function PokemonCardSkeleton() {
  return (
    <div
      className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4e] p-4 flex flex-col gap-3"
      aria-label="Cargando Pokémon"
      aria-busy="true"
    >
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-4 w-16 mx-auto rounded" />
      <Skeleton className="h-5 w-24 mx-auto rounded" />
      <div className="flex gap-2 justify-center">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function PokemonDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-10 w-48 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function TCGCardSkeleton() {
  return (
    <div
      className="rounded-xl bg-[#1a1a2e] border border-[#2a2a4e] p-3 space-y-2"
      aria-busy="true"
    >
      <Skeleton className="h-40 rounded-lg" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
    </div>
  );
}
