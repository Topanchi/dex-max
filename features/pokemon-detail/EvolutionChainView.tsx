import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { normalizePokemonName } from '@/utils/normalize';
import type { EvolutionNode, EvolutionTrigger } from '@/types/pokemon';

function getTriggerLabel(triggers: EvolutionTrigger[]): string {
  if (triggers.length === 0) return '';
  const t = triggers[0];
  if (t.trigger === 'level-up' && t.minLevel) return `Nivel ${t.minLevel}`;
  if (t.trigger === 'level-up' && t.happiness) return 'Felicidad';
  if (t.trigger === 'level-up') return 'Subir nivel';
  if (t.trigger === 'use-item' && t.item) return t.item.replace(/-/g, ' ');
  if (t.trigger === 'trade') return t.item ? `Intercambio\n${t.item}` : 'Intercambio';
  if (t.trigger === 'shed') return 'Evolución';
  return t.trigger.replace(/-/g, ' ');
}

/** Horizontal arrow + label shown between two Pokémon */
function Arrow({ triggers }: { triggers: EvolutionTrigger[] }) {
  const label = getTriggerLabel(triggers);
  return (
    <div className="flex flex-col items-center justify-center px-3 shrink-0 min-w-[60px]">
      <span className="text-[10px] text-slate-500 text-center leading-tight capitalize mb-1 max-w-[72px] whitespace-pre-line">
        {label}
      </span>
      <svg
        className="w-6 h-6 text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>
  );
}

/** Single Pokémon node card */
function NodeCard({ node, currentId }: { node: EvolutionNode; currentId: number }) {
  const isCurrent = node.id === currentId;
  const name = normalizePokemonName(node.name);

  return (
    <Link
      href={`/pokemon/${node.id}`}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-white/30 shrink-0
        ${isCurrent
          ? 'bg-[#2a2a4e] border-2 border-white/30 cursor-default pointer-events-none'
          : 'hover:bg-[#2a2a4e] border-2 border-transparent hover:border-[#3a3a6e] hover:-translate-y-0.5'
        }`}
      aria-current={isCurrent ? 'page' : undefined}
      aria-label={`Ver ${name}`}
    >
      <ImageWithFallback
        src={node.imageUrl}
        alt={name}
        width={96}
        height={96}
        className="object-contain"
      />
      <span className="text-xs font-medium text-slate-300 text-center leading-tight max-w-[90px]">
        {name}
      </span>
    </Link>
  );
}

/**
 * Renders one node and all its descendants horizontally.
 * For branching chains (e.g. Eevee), the branches stack vertically
 * but each branch continues flowing to the right.
 */
function ChainNode({
  node,
  currentId,
  triggers,
}: {
  node: EvolutionNode;
  currentId: number;
  triggers: EvolutionTrigger[];
}) {
  const hasTrigger = triggers.length > 0;
  const childCount = node.evolvesTo.length;

  return (
    <div className="flex items-center">
      {/* Arrow / trigger label before this node */}
      {hasTrigger && <Arrow triggers={triggers} />}

      {/* This Pokémon */}
      <NodeCard node={node} currentId={currentId} />

      {/* Children */}
      {childCount === 1 && (
        // Single child: keep flowing horizontally
        <ChainNode
          node={node.evolvesTo[0]}
          currentId={currentId}
          triggers={node.evolvesTo[0].evolutionDetails}
        />
      )}

      {childCount > 1 && (
        // Multiple children (branching): stack vertically, each row horizontal
        <div className="flex flex-col gap-2">
          {node.evolvesTo.map(child => (
            <ChainNode
              key={child.id}
              node={child}
              currentId={currentId}
              triggers={child.evolutionDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface EvolutionChainViewProps {
  chain: EvolutionNode;
  currentId: number;
}

export function EvolutionChainView({ chain, currentId }: EvolutionChainViewProps) {
  if (chain.evolvesTo.length === 0) return null;

  return (
    <section aria-label="Cadena evolutiva">
      <h2 className="text-lg font-bold mb-4 text-white">Cadena evolutiva</h2>
      <div className="bg-[#1a1a2e] rounded-2xl border border-[#2a2a4e] p-3 sm:p-4 overflow-x-auto w-fit max-w-full">
        <div className="flex items-center min-w-max">
          <ChainNode node={chain} currentId={currentId} triggers={[]} />
        </div>
      </div>
    </section>
  );
}
