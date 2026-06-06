import { TypeBadge } from '@/components/ui/Badge';
import { ALL_TYPES } from '@/utils/typeColors';

// Attacking type → which defending types it hits for ×2 / ×0.5 / ×0 (Gen 6+).
const MATCHUPS: Record<string, { double: string[]; half: string[]; zero: string[] }> = {
  normal:   { double: [], half: ['rock', 'steel'], zero: ['ghost'] },
  fire:     { double: ['grass', 'ice', 'bug', 'steel'], half: ['fire', 'water', 'rock', 'dragon'], zero: [] },
  water:    { double: ['fire', 'ground', 'rock'], half: ['water', 'grass', 'dragon'], zero: [] },
  electric: { double: ['water', 'flying'], half: ['electric', 'grass', 'dragon'], zero: ['ground'] },
  grass:    { double: ['water', 'ground', 'rock'], half: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'], zero: [] },
  ice:      { double: ['grass', 'ground', 'flying', 'dragon'], half: ['fire', 'water', 'ice', 'steel'], zero: [] },
  fighting: { double: ['normal', 'ice', 'rock', 'dark', 'steel'], half: ['poison', 'flying', 'psychic', 'bug', 'fairy'], zero: ['ghost'] },
  poison:   { double: ['grass', 'fairy'], half: ['poison', 'ground', 'rock', 'ghost'], zero: ['steel'] },
  ground:   { double: ['fire', 'electric', 'poison', 'rock', 'steel'], half: ['grass', 'bug'], zero: ['flying'] },
  flying:   { double: ['grass', 'fighting', 'bug'], half: ['electric', 'rock', 'steel'], zero: [] },
  psychic:  { double: ['fighting', 'poison'], half: ['psychic', 'steel'], zero: ['dark'] },
  bug:      { double: ['grass', 'psychic', 'dark'], half: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'], zero: [] },
  rock:     { double: ['fire', 'ice', 'flying', 'bug'], half: ['fighting', 'ground', 'steel'], zero: [] },
  ghost:    { double: ['psychic', 'ghost'], half: ['dark'], zero: ['normal'] },
  dragon:   { double: ['dragon'], half: ['steel'], zero: ['fairy'] },
  dark:     { double: ['psychic', 'ghost'], half: ['fighting', 'dark', 'fairy'], zero: [] },
  steel:    { double: ['ice', 'rock', 'fairy'], half: ['fire', 'water', 'electric', 'steel'], zero: [] },
  fairy:    { double: ['fighting', 'dragon', 'dark'], half: ['fire', 'poison', 'steel'], zero: [] },
};

function multiplier(attacker: string, defenderTypes: string[]): number {
  const m = MATCHUPS[attacker];
  if (!m) return 1;
  return defenderTypes.reduce((acc, def) => {
    if (m.zero.includes(def)) return 0;
    if (m.double.includes(def)) return acc * 2;
    if (m.half.includes(def)) return acc * 0.5;
    return acc;
  }, 1);
}

const ROWS: { mult: number; label: string; mark: string; color: string }[] = [
  { mult: 4,    label: 'Superdébil a',      mark: '×4', color: 'bg-red-700' },
  { mult: 2,    label: 'Débil a',           mark: '×2', color: 'bg-orange-500' },
  { mult: 1,    label: 'Daño normal',       mark: '×1', color: 'bg-slate-600' },
  { mult: 0.5,  label: 'Resistente a',      mark: '×½', color: 'bg-green-600' },
  { mult: 0.25, label: 'Superresistente a', mark: '×¼', color: 'bg-emerald-600' },
  { mult: 0,    label: 'Inmune a',          mark: '×0', color: 'bg-slate-900' },
];

interface Props {
  types: string[];
}

export function TypeMatchups({ types }: Props) {
  // Group attacking types by the multiplier they deal to this Pokémon.
  const byMult = new Map<number, string[]>();
  for (const attacker of ALL_TYPES) {
    const mult = multiplier(attacker, types);
    if (!byMult.has(mult)) byMult.set(mult, []);
    byMult.get(mult)!.push(attacker);
  }

  return (
    <section aria-label="Debilidades y resistencias">
      <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
        Debilidades y resistencias
      </h2>

      <div className="bg-[#1a1a2e] rounded-xl sm:rounded-2xl border border-[#2a2a4e] overflow-hidden">
        {ROWS.map(row => {
          const list = byMult.get(row.mult) ?? [];
          return (
            <div
              key={row.mult}
              className="flex items-center gap-3 px-3 sm:px-4 py-2.5 border-b border-[#2a2a4e] last:border-b-0"
            >
              <div className="flex items-center gap-2 w-32 sm:w-40 flex-shrink-0">
                <span
                  className={`${row.color} text-white text-[11px] font-bold rounded-md
                              w-9 h-6 flex items-center justify-center flex-shrink-0`}
                >
                  {row.mark}
                </span>
                <span className="text-xs text-slate-400 leading-tight">{row.label}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 min-w-0">
                {list.length > 0 ? (
                  list.map(t => <TypeBadge key={t} type={t} size="sm" />)
                ) : (
                  <span className="text-slate-600 text-xs italic">Ninguno</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
