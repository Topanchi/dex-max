import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { TypeBadge } from '@/components/ui/Badge';
import { getCategoryLabel } from '@/utils/normalize';
import type { PokemonVariant, VariantCategory } from '@/types/pokemon';

const CATEGORY_ORDER: VariantCategory[] = [
  'mega',
  'gigantamax',
  'alolan',
  'galarian',
  'hisuian',
  'paldean',
  'alternate',
];

interface FormCardProps {
  variant: PokemonVariant;
}

function FormCard({ variant }: FormCardProps) {
  return (
    <Link
      href={`/pokemon/${variant.id}`}
      className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1a1a2e] border-2 border-[#2a2a4e]
                 hover:border-[#4a4a7e] hover:shadow-lg transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label={`Ver ${variant.displayName}`}
    >
      <div className="relative w-28 h-28 flex items-center justify-center">
        <ImageWithFallback
          src={variant.imageUrl}
          alt={variant.displayName}
          width={112}
          height={112}
          className="object-contain group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <p className="text-sm font-medium text-white text-center leading-tight">
        {variant.displayName}
      </p>
      <div className="flex gap-1 flex-wrap justify-center">
        {variant.types.map(t => (
          <TypeBadge key={t} type={t} size="sm" />
        ))}
      </div>
    </Link>
  );
}

interface FormsSectionProps {
  variants: PokemonVariant[];
}

export function FormsSection({ variants }: FormsSectionProps) {
  if (variants.length === 0) return null;

  // Group by category
  const grouped = variants.reduce<Partial<Record<VariantCategory, PokemonVariant[]>>>(
    (acc, v) => {
      if (!acc[v.category]) acc[v.category] = [];
      acc[v.category]!.push(v);
      return acc;
    },
    {},
  );

  const orderedGroups = CATEGORY_ORDER.filter(cat => grouped[cat]?.length);

  // Mega y Gigantamax se muestran en la misma fila, lado a lado
  const hasMega = !!grouped['mega']?.length;
  const hasGmax = !!grouped['gigantamax']?.length;
  const showMegaGmaxRow = hasMega && hasGmax;

  // Categorías que van en su propia fila — mega y gigantamax siempre se
  // gestionan en los bloques dedicados de arriba, nunca aquí.
  const soloGroups = orderedGroups.filter(
    cat => cat !== 'mega' && cat !== 'gigantamax',
  );

  return (
    <section aria-label="Formas y variantes">
      <h2 className="text-lg font-bold mb-4 text-white">Formas y variantes</h2>
      <div className="space-y-6">

        {/* Mega + Gigantamax en la misma fila horizontal */}
        {showMegaGmaxRow && (
          <div className="flex flex-col sm:flex-row gap-6">
            {(['mega', 'gigantamax'] as VariantCategory[]).map(cat => (
              <div key={cat} className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  {getCategoryLabel(cat)}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {grouped[cat]!.map(v => (
                    <FormCard key={v.id} variant={v} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Si solo existe uno de los dos, renderizarlo solo */}
        {!showMegaGmaxRow && hasMega && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              {getCategoryLabel('mega')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3">
              {grouped['mega']!.map(v => <FormCard key={v.id} variant={v} />)}
            </div>
          </div>
        )}
        {!showMegaGmaxRow && hasGmax && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              {getCategoryLabel('gigantamax')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3">
              {grouped['gigantamax']!.map(v => <FormCard key={v.id} variant={v} />)}
            </div>
          </div>
        )}

        {/* Resto de categorías */}
        {soloGroups.map(category => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              {getCategoryLabel(category)}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3">
              {grouped[category]!.map(v => (
                <FormCard key={v.id} variant={v} />
              ))}
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
