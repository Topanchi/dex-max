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
      className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-[#1a1a2e] border-2 border-[#2a2a4e]
                 hover:border-[#4a4a7e] hover:shadow-lg transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label={`Ver ${variant.displayName}`}
    >
      <div className="w-24 h-24 flex items-center justify-center">
        <ImageWithFallback
          src={variant.imageUrl}
          alt={variant.displayName}
          width={96}
          height={96}
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

  if (variants.length === 1) {
    return (
      <section aria-label="Formas y variantes">
        <h2 className="text-lg font-bold mb-4 text-white">Formas y variantes</h2>
        <div className="flex justify-center">
          <FormCard variant={variants[0]} />
        </div>
      </section>
    );
  }

  // Group by category
  const grouped = variants.reduce<Partial<Record<VariantCategory, PokemonVariant[]>>>(
    (acc, v) => {
      if (!acc[v.category]) acc[v.category] = [];
      acc[v.category]!.push(v);
      return acc;
    },
    {},
  );

  const hasMega = !!grouped['mega']?.length;
  const hasGmax = !!grouped['gigantamax']?.length;
  const showMegaGmaxRow = hasMega && hasGmax;

  // Categorías regionales "estrictas" (sin alternate)
  const STRICT_REGIONAL: VariantCategory[] = ['alolan', 'galarian', 'hisuian', 'paldean'];
  const ALL_REGIONAL: VariantCategory[] = [...STRICT_REGIONAL, 'alternate'];

  const hasStrictRegional = STRICT_REGIONAL.some(cat => grouped[cat]?.length);
  const hasRegional = ALL_REGIONAL.some(cat => grouped[cat]?.length);

  // Las formas alternativas van en fila propia DEBAJO cuando coexisten con formas
  // regionales estrictas (ej. Pikachu: gmax + alola + caps).
  // Si no hay regionales estrictas (ej. Eevee: gmax + alternate), van en la fila superior.
  const alternateInTopRow = !!grouped['alternate']?.length && !hasStrictRegional;
  const alternateBelow    = !!grouped['alternate']?.length && hasStrictRegional;

  const topRowRegional: VariantCategory[] = [
    ...(!showMegaGmaxRow && hasMega && hasRegional ? ['mega' as VariantCategory] : []),
    ...(!showMegaGmaxRow && hasGmax ? ['gigantamax' as VariantCategory] : []),
    ...STRICT_REGIONAL.filter(cat => grouped[cat]?.length),
    ...(alternateInTopRow ? ['alternate' as VariantCategory] : []),
  ];

  const showMegaAlone = !showMegaGmaxRow && hasMega && !hasRegional;

  // Otras categorías (ninguna actualmente, por extensibilidad)
  const otherGroups = CATEGORY_ORDER.filter(
    cat => grouped[cat]?.length &&
      cat !== 'mega' &&
      cat !== 'gigantamax' &&
      !ALL_REGIONAL.includes(cat),
  );

  return (
    <section aria-label="Formas y variantes">
      <h2 className="text-lg font-bold mb-4 text-white">Formas y variantes</h2>
      <div className="space-y-6">

        {/* Mega + Gigantamax: Megas en fila forzada a la izquierda, Gigantamax a la derecha */}
        {showMegaGmaxRow && (
          <div className="flex flex-wrap gap-6 items-start">
            {/* Mega: siempre horizontal, sin wrap */}
            <div className="flex-none">
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                {getCategoryLabel('mega')}
              </h3>
              <div className="flex gap-3">
                {grouped['mega']!.map(v => (
                  <FormCard key={v.id} variant={v} />
                ))}
              </div>
            </div>
            {/* Gigantamax: a la derecha de los Mega */}
            <div className="flex-none">
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                {getCategoryLabel('gigantamax')}
              </h3>
              <div className="flex gap-3">
                {grouped['gigantamax']!.map(v => (
                  <FormCard key={v.id} variant={v} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mega solo (sin Gigantamax ni formas regionales) */}
        {showMegaAlone && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              {getCategoryLabel('mega')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3">
              {grouped['mega']!.map(v => <FormCard key={v.id} variant={v} />)}
            </div>
          </div>
        )}

        {/* Fila superior: Gigantamax solo + regionales estrictos + (alternate si no hay regionales) */}
        {topRowRegional.length > 0 && (
          <div className="flex flex-wrap gap-6">
            {topRowRegional.map(cat => (
              <div key={cat} className="flex-none">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  {getCategoryLabel(cat)}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {grouped[cat]!.map(v => (
                    <FormCard key={v.id} variant={v} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fila inferior: formas alternativas cuando coexisten con regionales (ej. Pikachu) */}
        {alternateBelow && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              {getCategoryLabel('alternate')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {grouped['alternate']!.map(v => (
                <FormCard key={v.id} variant={v} />
              ))}
            </div>
          </div>
        )}

        {/* Resto (alternate, etc.) */}
        {otherGroups.map(category => (
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
