import { PokemonDetailSkeleton } from '@/components/ui/Skeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function PokemonLoading() {
  return (
    <div className="space-y-10">
      {/* Back link */}
      <Skeleton className="h-5 w-24 rounded" />

      {/* Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-80 rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-12 w-56 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <Skeleton className="h-24 rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        </div>
      </div>

      <PokemonDetailSkeleton />
    </div>
  );
}
