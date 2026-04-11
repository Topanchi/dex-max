import { PokemonCardSkeleton } from '@/components/ui/Skeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function HomeLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-9 w-64 rounded mb-2" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>

      {/* Search + sort skeleton */}
      <div className="flex gap-3 mb-5">
        <Skeleton className="h-10 w-full max-w-md rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Type filter skeleton */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Array.from({ length: 18 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-16 rounded-full" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
