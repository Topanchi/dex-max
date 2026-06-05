'use client';

import { useEffect, useState, useCallback } from 'react';
import type { GameAppearance, EncounterLocation } from '@/types/pokemon';
import { REGION_CONFIGS, LOCATION_COORDS } from '@/lib/locationCoords';

interface Props {
  pokemonId: number;
  pokemonName: string;
  game: GameAppearance;
  onClose: () => void;
}

export function GameLocationModal({ pokemonId, pokemonName, game, onClose }: Props) {
  const [locations, setLocations] = useState<EncounterLocation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setLocations(null);
    setMapError(false);
    setActiveIdx(null);
    fetch(`/api/pokemon/${pokemonId}/encounters?version=${game.versionName}`)
      .then(r => r.json())
      .then(data => {
        setLocations(data.locations ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [pokemonId, game.versionName]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Pick the region from the first location that has one
  const region = locations?.find(l => l.region)?.region ?? '';
  const regionConfig = REGION_CONFIGS[region];

  const locationsWithCoords = (locations ?? []).map((loc, idx) => ({
    ...loc,
    idx,
    coords: LOCATION_COORDS[loc.locationSlug] ?? null,
  }));

  const showMap = !loading && !error && regionConfig && !mapError && (locations?.length ?? 0) > 0;
  const hasPins = locationsWithCoords.some(l => l.coords);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Localización de ${pokemonName} en ${game.titleEs}`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-700">
          {game.image && (
            <img
              src={game.image}
              alt={game.titleEs}
              width={96}
              height={72}
              className="object-contain rounded-lg flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400">Cómo obtener</p>
            <h3 className="text-sm font-bold text-white truncate">{game.titleEs}</h3>
            {regionConfig && (
              <p className="text-xs text-slate-500 mt-0.5">{regionConfig.nameEs}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map */}
        {showMap && (
          <div className="relative w-full bg-slate-900 overflow-hidden" style={{ height: 190 }}>
            <img
              src={regionConfig.image}
              alt={`Mapa de ${regionConfig.nameEs}`}
              className="w-full h-full object-contain"
              onError={() => setMapError(true)}
            />
            {hasPins && locationsWithCoords.filter(l => l.coords).map(loc => (
              <button
                key={`pin-${loc.idx}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{ left: `${loc.coords!.x}%`, top: `${loc.coords!.y}%` }}
                onMouseEnter={() => setActiveIdx(loc.idx)}
                onMouseLeave={() => setActiveIdx(null)}
                onClick={() => setActiveIdx(v => v === loc.idx ? null : loc.idx)}
                aria-label={loc.location}
              >
                {/* Pulse ring when active */}
                {activeIdx === loc.idx && (
                  <span className="absolute inset-0 -m-1 rounded-full bg-yellow-400/30 animate-ping" />
                )}
                <span className={`
                  block rounded-full border-[1.5px] border-white shadow transition-all duration-150
                  ${activeIdx === loc.idx
                    ? 'w-4 h-4 bg-yellow-400 shadow-yellow-400/60'
                    : 'w-2.5 h-2.5 bg-red-500 shadow-red-500/50 group-hover:w-3.5 group-hover:h-3.5 group-hover:bg-yellow-400'}
                `} />
                {/* Tooltip */}
                {activeIdx === loc.idx && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap
                                   bg-slate-900 text-white text-[10px] font-medium px-1.5 py-0.5 rounded
                                   pointer-events-none shadow">
                    {loc.location}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Location list */}
        <div className="p-4 max-h-56 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <p className="text-slate-400 text-sm text-center py-8">Error al cargar los datos</p>
          )}

          {!loading && !error && locations?.length === 0 && (
            <div className="text-center py-6 space-y-1">
              <p className="text-slate-300 text-sm font-medium">No aparece en estado salvaje</p>
              <p className="text-slate-500 text-xs">Obtenible por intercambio, evolución u otro método especial</p>
            </div>
          )}

          {!loading && !error && locations && locations.length > 0 && (
            <ul className="space-y-2">
              {locationsWithCoords.map(loc => (
                <li
                  key={`item-${loc.idx}`}
                  className={`rounded-xl px-3 py-2.5 transition-colors ${
                    loc.coords ? 'cursor-pointer' : 'cursor-default'
                  } ${activeIdx === loc.idx ? 'bg-slate-600/80' : 'bg-slate-700/50 hover:bg-slate-700'}`}
                  onMouseEnter={() => loc.coords && setActiveIdx(loc.idx)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                      loc.coords
                        ? activeIdx === loc.idx ? 'bg-yellow-400' : 'bg-red-500'
                        : 'bg-slate-500'
                    }`} />
                    <p className="text-white text-sm font-medium">{loc.location}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 pl-4">
                    {loc.methods.map((m, j) => (
                      <span key={j} className="text-slate-400 text-xs">
                        {m.method}
                        {' · '}
                        Nv.{m.minLevel === m.maxLevel ? ` ${m.minLevel}` : ` ${m.minLevel}–${m.maxLevel}`}
                        {m.chance > 0 && <span className="text-slate-500"> ({m.chance}%)</span>}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
