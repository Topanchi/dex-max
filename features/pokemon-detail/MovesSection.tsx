'use client';

import { useState } from 'react';
import { GEN_COLORS } from '@/lib/pokemonGames';
import { getTypeColor, getTypeLabel } from '@/utils/typeColors';
import type { VersionGroupMoves } from '@/types/pokemon';


const CLASS_META: Record<string, { label: string; className: string }> = {
  physical: { label: 'Físico',   className: 'bg-orange-500/20 text-orange-300' },
  special:  { label: 'Especial', className: 'bg-blue-500/20 text-blue-300' },
  status:   { label: 'Estado',   className: 'bg-slate-500/20 text-slate-400' },
};

interface Props {
  moves: VersionGroupMoves[];
}

export function MovesSection({ moves }: Props) {
  const [selectedVg, setSelectedVg] = useState(moves[0]?.versionGroup ?? '');

  const selected = moves.find(m => m.versionGroup === selectedVg);

  if (moves.length === 0) {
    return <p className="text-sm text-slate-500">Sin datos de movimientos disponibles.</p>;
  }

  return (
    <div>
      {/* Game version selector */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {moves.map(m => {
          const colors = GEN_COLORS[m.generation] ?? GEN_COLORS[1];
          const isSelected = m.versionGroup === selectedVg;
          return (
            <button
              key={m.versionGroup}
              onClick={() => setSelectedVg(m.versionGroup)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border
                          ${isSelected
                            ? `${colors.bg} ${colors.text} border-current/20`
                            : 'bg-transparent border-[#2a2a4e] text-slate-500 hover:text-slate-300 hover:border-slate-600'
                          }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Level-up moves */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Movimientos por nivel
            </p>
            {selected.levelUp.length > 0 ? (
              <div className="bg-[#1a1a2e] rounded-xl border border-[#2a2a4e] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[340px]">
                    <thead>
                      <tr className="border-b border-[#2a2a4e]">
                        <th className="text-left px-3 py-2 text-slate-500 font-medium w-10">Nv.</th>
                        <th className="text-left px-3 py-2 text-slate-500 font-medium">Movimiento</th>
                        <th className="text-left px-3 py-2 text-slate-500 font-medium">Tipo</th>
                        <th className="text-left px-3 py-2 text-slate-500 font-medium">Clase</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.levelUp.map((move, i) => {
                        const typeColor = getTypeColor(move.type);
                        const cls = CLASS_META[move.damageClass] ?? CLASS_META.status;
                        return (
                          <tr
                            key={move.slug}
                            className={`border-b border-[#2a2a4e]/50 last:border-0
                                        ${i % 2 === 1 ? 'bg-white/[0.02]' : ''}`}
                          >
                            <td className="px-3 py-1.5 text-slate-400 font-mono text-center">
                              {move.level === 0 ? 'Evo.' : move.level}
                            </td>
                            <td className="px-3 py-1.5 text-slate-200">{move.displayName}</td>
                            <td className="px-3 py-1.5">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColor.bg} ${typeColor.text}`}>
                                {getTypeLabel(move.type)}
                              </span>
                            </td>
                            <td className="px-3 py-1.5">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${cls.className}`}>
                                {cls.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic">
                No aprende movimientos por nivel en este juego.
              </p>
            )}
          </div>

          {/* Machine moves */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Movimientos MT / DT / MMO
            </p>
            {selected.machine.length > 0 ? (
              <div className="bg-[#1a1a2e] rounded-xl border border-[#2a2a4e] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[280px]">
                    <thead>
                      <tr className="border-b border-[#2a2a4e]">
                        <th className="text-left px-3 py-2 text-slate-500 font-medium">Movimiento</th>
                        <th className="text-left px-3 py-2 text-slate-500 font-medium">Tipo</th>
                        <th className="text-left px-3 py-2 text-slate-500 font-medium">Clase</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.machine.map((move, i) => {
                        const typeColor = getTypeColor(move.type);
                        const cls = CLASS_META[move.damageClass] ?? CLASS_META.status;
                        return (
                          <tr
                            key={move.slug}
                            className={`border-b border-[#2a2a4e]/50 last:border-0
                                        ${i % 2 === 1 ? 'bg-white/[0.02]' : ''}`}
                          >
                            <td className="px-3 py-1.5 text-slate-200">{move.displayName}</td>
                            <td className="px-3 py-1.5">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColor.bg} ${typeColor.text}`}>
                                {getTypeLabel(move.type)}
                              </span>
                            </td>
                            <td className="px-3 py-1.5">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${cls.className}`}>
                                {cls.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic">
                No aprende movimientos por MT en este juego.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
