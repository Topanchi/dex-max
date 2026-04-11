import type { PokemonStat } from '@/types/pokemon';

const STAT_MAX = 255;

const STAT_COLORS: Record<string, string> = {
  HP: 'bg-red-500',
  Ataque: 'bg-orange-500',
  Defensa: 'bg-yellow-500',
  'Ataque Esp.': 'bg-blue-500',
  'Defensa Esp.': 'bg-green-500',
  Velocidad: 'bg-pink-500',
};

interface BaseStatsProps {
  stats: PokemonStat[];
}

export function BaseStats({ stats }: BaseStatsProps) {
  const total = stats.reduce((sum, s) => sum + s.value, 0);

  return (
    <section aria-label="Estadísticas base">
      <h2 className="text-lg font-bold mb-4 text-white">Estadísticas base</h2>
      <div className="space-y-3">
        {stats.map(stat => {
          const pct = Math.min(100, (stat.value / STAT_MAX) * 100);
          const barColor = STAT_COLORS[stat.name] ?? 'bg-slate-500';

          return (
            <div key={stat.name} className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs text-slate-400 w-20 sm:w-24 text-right shrink-0 leading-tight">
                {stat.name}
              </span>
              <span className="text-sm font-mono text-white w-8 shrink-0 text-right">
                {stat.value}
              </span>
              <div
                className="flex-1 h-2 rounded-full bg-[#2a2a4e] overflow-hidden"
                role="progressbar"
                aria-valuenow={stat.value}
                aria-valuemin={0}
                aria-valuemax={STAT_MAX}
                aria-label={`${stat.name}: ${stat.value}`}
              >
                <div
                  className={`h-full rounded-full ${barColor} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div className="flex items-center gap-2 sm:gap-3 pt-2 border-t border-[#2a2a4e] mt-2">
          <span className="text-xs text-slate-400 w-20 sm:w-24 text-right shrink-0 font-semibold">
            Total
          </span>
          <span className="text-sm font-mono font-bold text-white w-8 shrink-0 text-right">
            {total}
          </span>
          <div className="flex-1" />
        </div>
      </div>
    </section>
  );
}
