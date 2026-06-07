import type { PokemonStat } from '@/types/pokemon';

export interface CombatForm {
  name: string;
  stats: PokemonStat[];
}

interface Props {
  forms: CombatForm[];
}

// Gen 3+ stat formula. min = hindering nature, 0 EVs, 0 IVs;
// max = beneficial nature, 252 EVs, 31 IVs. HP ignores nature.
function calcStat(base: number, level: number, isHP: boolean, max: boolean): number {
  const iv = max ? 31 : 0;
  const ev = max ? 252 : 0;
  const common = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100);
  if (isHP) return common + level + 10;
  return Math.floor((common + 5) * (max ? 1.1 : 0.9));
}

export function CombatStats({ forms }: Props) {
  const valid = forms.filter(f => f.stats.length > 0);
  if (valid.length === 0) return null;
  const showSubtitles = valid.length > 1;

  return (
    <section aria-label="Características de combate">
      <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
        Características de combate
      </h2>

      <div
        className={
          showSubtitles
            ? 'grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-6 items-start'
            : 'max-w-2xl'
        }
      >
        {valid.map(form => {
          const total = form.stats.reduce((a, s) => a + s.value, 0);
          const totalEvs = form.stats.reduce((a, s) => a + s.effort, 0);

          return (
            <div key={form.name}>
              {showSubtitles && (
                <h3 className="text-sm font-semibold text-slate-300 mb-2">{form.name}</h3>
              )}
              <div className="bg-[#1a1a2e] rounded-xl border border-[#2a2a4e] overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-[#2a2a4e]">
                      <th className="text-left font-medium px-3 py-2">Estadística</th>
                      <th className="font-medium px-2 py-2">Base</th>
                      <th className="font-medium px-2 py-2 whitespace-nowrap">Nivel 50</th>
                      <th className="font-medium px-2 py-2 whitespace-nowrap">Nivel 100</th>
                      <th className="font-medium px-2 py-2">EVs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.stats.map(s => {
                      const isHP = s.name === 'HP';
                      return (
                        <tr key={s.name} className="border-b border-[#2a2a4e]/50">
                          <td className="text-left text-slate-300 px-3 py-1.5">{s.name}</td>
                          <td className="text-center font-semibold text-white px-2 py-1.5">{s.value}</td>
                          <td className="text-center text-slate-400 px-2 py-1.5 whitespace-nowrap">
                            {calcStat(s.value, 50, isHP, false)} – {calcStat(s.value, 50, isHP, true)}
                          </td>
                          <td className="text-center text-slate-400 px-2 py-1.5 whitespace-nowrap">
                            {calcStat(s.value, 100, isHP, false)} – {calcStat(s.value, 100, isHP, true)}
                          </td>
                          <td className="text-center text-slate-400 px-2 py-1.5">{s.effort}</td>
                        </tr>
                      );
                    })}
                    <tr className="font-bold text-white">
                      <td className="text-left px-3 py-2">Total</td>
                      <td className="text-center px-2 py-2">{total}</td>
                      <td colSpan={2} className="text-center text-slate-500 text-[10px] font-normal px-2 py-2">
                        Mín. – Máx.
                      </td>
                      <td className="text-center px-2 py-2">{totalEvs}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed max-w-2xl">
        <span className="font-medium">Mín.</span>: naturaleza desfavorable, 0 EVs y 0 IVs.{' '}
        <span className="font-medium">Máx.</span>: naturaleza favorable, 252 EVs y 31 IVs.
      </p>
    </section>
  );
}
