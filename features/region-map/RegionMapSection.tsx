'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { REGION_CONFIGS } from '@/lib/locationCoords';
import { GALAR_DLC } from '@/lib/galarDlc';
import { normalizePokemonName } from '@/utils/normalize';

interface RegionLocation {
  slug: string;
  nameEs: string;
  x: number;
  y: number;
}

interface LocationPokemon {
  name: string;
  id: number;
  sprite: string | null;
  methods: string[];
}

interface LocationData {
  nameEs: string;
  pokemon: LocationPokemon[];
}

const REGIONS = [
  { id: 'kanto',         label: 'Kanto'              },
  { id: 'johto',         label: 'Johto'              },
  { id: 'hoenn',         label: 'Hoenn'              },
  { id: 'sinnoh',        label: 'Sinnoh'             },
  { id: 'unova',         label: 'Unova'              },
  { id: 'kalos',         label: 'Kalos'              },
  { id: 'alola',         label: 'Alola'              },
  { id: 'galar',         label: 'Galar'              },
  { id: 'isle-of-armor', label: 'Isla de la Armadura' },
  { id: 'crown-tundra',  label: 'Nieves de la Corona' },
  { id: 'hisui',         label: 'Hisui'              },
  { id: 'paldea',        label: 'Paldea'             },
  { id: 'kitakami',      label: 'Noroteo'            },
  { id: 'biodomo',       label: 'Biodomo'            },
] as const;

export function RegionMapSection() {
  const [region, setRegion]         = useState('kanto');
  const [locations, setLocations]   = useState<RegionLocation[]>([]);
  const [locLoading, setLocLoading] = useState(true);
  const [selected, setSelected]     = useState<RegionLocation | null>(null);
  const [locData, setLocData]       = useState<LocationData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const regionCache   = useRef(new Map<string, RegionLocation[]>());
  const locationCache = useRef(new Map<string, LocationData>());

  const config = REGION_CONFIGS[region];
  const imageOnly = config?.imageOnly ?? false;

  // Load region locations when region tab changes
  useEffect(() => {
    // DLC de Galar (Isla de la Armadura, Nieves de la Corona): dataset curado
    // estático, ya que la PokéAPI no tiene encuentros de generación 8.
    const dlc = GALAR_DLC[region];
    if (dlc) {
      setLocations(dlc.map(l => ({ slug: l.slug, nameEs: l.nameEs, x: l.x, y: l.y })));
      setSelected(null);
      setLocData(null);
      setLocLoading(false);
      return;
    }
    // Las zonas de los DLC de Paldea (Noroteo, Biodomo) solo se muestran como
    // mapa: la PokéAPI no expone ubicaciones ni encuentros para ellas.
    if (REGION_CONFIGS[region]?.imageOnly) {
      setLocations([]);
      setSelected(null);
      setLocData(null);
      setLocLoading(false);
      return;
    }
    const cached = regionCache.current.get(region);
    if (cached) {
      setLocations(cached);
      setLocLoading(false);
      return;
    }
    setLocLoading(true);
    setSelected(null);
    setLocData(null);
    fetch(`/api/region/${region}`)
      .then(r => r.json())
      .then(data => {
        const locs: RegionLocation[] = data.locations ?? [];
        regionCache.current.set(region, locs);
        setLocations(locs);
        setLocLoading(false);
      })
      .catch(() => { setLocations([]); setLocLoading(false); });
  }, [region]);

  // Load location Pokémon when pin is selected
  useEffect(() => {
    if (!selected) { setLocData(null); return; }
    const cached = locationCache.current.get(selected.slug);
    if (cached) { setLocData(cached); return; }

    // Curated Galar-DLC data: resolve the static Pokémon name list to sprites.
    const dlc = GALAR_DLC[region];
    const dlcLoc = dlc?.find(l => l.slug === selected.slug);
    if (dlcLoc) {
      setDataLoading(true);
      setLocData(null);
      fetch(`/api/pokemon-list?names=${dlcLoc.pokemon.join(',')}`)
        .then(r => r.json())
        .then(data => {
          const result: LocationData = {
            nameEs: dlcLoc.nameEs,
            pokemon: (data.pokemon ?? []).map((p: { name: string; id: number; sprite: string | null }) => ({
              name: p.name, id: p.id, sprite: p.sprite, methods: [],
            })),
          };
          locationCache.current.set(selected.slug, result);
          setLocData(result);
          setDataLoading(false);
        })
        .catch(() => setDataLoading(false));
      return;
    }

    setDataLoading(true);
    setLocData(null);
    fetch(`/api/location/${selected.slug}/pokemon`)
      .then(r => r.json())
      .then(data => {
        locationCache.current.set(selected.slug, data);
        setLocData(data);
        setDataLoading(false);
      })
      .catch(() => setDataLoading(false));
  }, [selected, region]);

  return (
    <section>
      {/* Region tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {REGIONS.map(r => (
          <button
            key={r.id}
            onClick={() => { setRegion(r.id); setSelected(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-manipulation
              ${region === r.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Map + panel */}
      <div className="flex flex-col sm:flex-row gap-3 items-start">

        {/* ── Map ─────────────────────────────────────────────────────── */}
        <div
          className="relative w-full sm:flex-1 min-w-0 bg-slate-900 rounded-2xl overflow-hidden"
          style={{ aspectRatio: config?.aspect ?? '1 / 1', maxWidth: 460, maxHeight: 620 }}
        >
          {config && (
            <img
              key={region}
              src={config.image}
              alt={`Mapa de ${config.nameEs}`}
              className="w-full h-full object-contain select-none pointer-events-none"
              draggable={false}
            />
          )}

          {/* Location pins */}
          {!locLoading && locations.map(loc => {
            const active = selected?.slug === loc.slug;
            return (
              <button
                key={loc.slug}
                onClick={() => setSelected(v => v?.slug === loc.slug ? null : loc)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                aria-label={loc.nameEs}
                title={loc.nameEs}
              >
                {active && (
                  <span className="absolute -inset-1.5 rounded-full bg-yellow-400/25 animate-ping" />
                )}
                <span className={`
                  block rounded-full border-[1.5px] border-white/80 shadow transition-all duration-150
                  ${active
                    ? 'w-4 h-4 bg-yellow-400 shadow-yellow-400/50'
                    : 'w-2.5 h-2.5 bg-blue-500 shadow-blue-500/40 group-hover:w-3.5 group-hover:h-3.5 group-hover:bg-yellow-300'}
                `} />
                {active && (
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-10
                                   whitespace-nowrap bg-slate-900/95 text-white text-[10px]
                                   font-medium px-2 py-0.5 rounded shadow pointer-events-none">
                    {loc.nameEs}
                  </span>
                )}
              </button>
            );
          })}

          {/* Loading overlay */}
          {locLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
              <div className="w-7 h-7 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
            </div>
          )}

          {/* Pin count hint */}
          {!locLoading && !selected && locations.length > 0 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none
                            bg-slate-900/75 backdrop-blur-sm text-slate-400 text-[11px]
                            px-3 py-1 rounded-full">
              {locations.length} ubicaciones — toca un punto
            </div>
          )}

          {/* Reference-only maps (real WikiDex art): no interactive pins yet */}
          {imageOnly && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none
                            bg-slate-900/75 backdrop-blur-sm text-slate-400 text-[11px]
                            px-3 py-1 rounded-full max-w-[90%] text-center">
              Mapa de referencia
            </div>
          )}

          {!imageOnly && !locLoading && locations.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-slate-600 text-sm">Sin datos disponibles para esta región</p>
            </div>
          )}
        </div>

        {/* ── Location panel ──────────────────────────────────────────── */}
        <div className={`
          w-full sm:w-60 sm:flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-200
          ${selected ? 'bg-slate-800' : 'hidden sm:flex sm:items-center sm:justify-center sm:bg-slate-900/40 sm:min-h-40'}
        `}>
          {selected ? (
            <>
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                <h3 className="text-sm font-bold text-white truncate pr-2 leading-tight">
                  {locData?.nameEs ?? selected.nameEs}
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-white flex-shrink-0 p-1 rounded transition-colors"
                  aria-label="Cerrar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Pokémon list */}
              <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
                {dataLoading && (
                  <div className="flex justify-center py-10">
                    <div className="w-5 h-5 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
                  </div>
                )}

                {!dataLoading && locData?.pokemon.length === 0 && (
                  <div className="text-center px-4 py-8 space-y-1">
                    <p className="text-slate-300 text-sm font-medium">Sin encuentros salvajes</p>
                    <p className="text-slate-600 text-xs">Solo obtenible por evolución o intercambio</p>
                  </div>
                )}

                {!dataLoading && locData && locData.pokemon.length > 0 && (
                  <ul className="p-2 space-y-0.5">
                    {locData.pokemon.map(p => (
                      <li key={p.name}>
                        <Link
                          href={`/pokemon/${p.id}`}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-xl
                                     hover:bg-slate-700/60 transition-colors group"
                        >
                          {p.sprite ? (
                            <img
                              src={p.sprite}
                              alt={p.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-contain flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-700/60 flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-xs font-semibold capitalize truncate
                                          group-hover:text-blue-300 transition-colors">
                              {normalizePokemonName(p.name)}
                            </p>
                            {p.methods.slice(0, 2).map((m, i) => (
                              <p key={i} className="text-slate-500 text-[10px] truncate">{m}</p>
                            ))}
                          </div>
                          <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400
                                          flex-shrink-0 transition-colors"
                               fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : imageOnly ? (
            <div className="text-center px-4 py-6 space-y-1.5">
              <p className="text-slate-300 text-xs font-semibold">{config?.nameEs}</p>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Mapa de referencia. El listado de Pokémon por ubicación no está
                disponible para esta zona todavía.
              </p>
            </div>
          ) : (
            <p className="text-slate-600 text-xs text-center px-4 py-6">
              Selecciona un punto del mapa
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
