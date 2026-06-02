import { NextRequest, NextResponse } from 'next/server';
import { GAME_CATALOG } from '@/lib/pokemonGames';
import type { EncounterLocation } from '@/types/pokemon';

interface RawEncounterDetail {
  chance: number;
  min_level: number;
  max_level: number;
  method: { name: string };
}

interface RawVersionDetail {
  version: { name: string };
  encounter_details: RawEncounterDetail[];
}

interface RawLocationEncounter {
  location_area: { name: string; url: string };
  version_details: RawVersionDetail[];
}

interface RawLocationArea {
  names: Array<{ name: string; language: { name: string } }>;
  location: { name: string; url: string };
}

interface RawLocation {
  name: string;
  region: { name: string } | null;
  names: Array<{ name: string; language: { name: string } }>;
}

interface LocationData {
  nameEs: string | null;
  slug: string;
  region: string;
}

const METHOD_ES: Record<string, string> = {
  'walk':              'Hierba',
  'surf':              'Surf',
  'old-rod':           'Caña vieja',
  'good-rod':          'Buena caña',
  'super-rod':         'Supercaña',
  'rock-smash':        'Romperrocas',
  'headbutt':          'Cabezazo',
  'gift':              'Regalo',
  'trade':             'Intercambio',
  'only-one':          'Único',
  'pokeflute':         'Flauta',
  'dark-grass':        'Hierba oscura',
  'grass-spots':       'Hierba (manchas)',
  'cave-spots':        'Cueva (manchas)',
  'bridge-spots':      'Puente (manchas)',
  'super-rod-spots':   'Supercaña (manchas)',
  'fishing-spots':     'Pesca (manchas)',
  'surf-spots':        'Surf (manchas)',
  'slot2-honey-tree':  'Árbol de Miel',
  'run':               'Correr',
  'dive':              'Bucear',
  'waterfall':         'Cascada',
};

function formatLocation(slug: string): string {
  return slug
    .replace(/-area$/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function fetchLocationData(areaUrl: string): Promise<LocationData> {
  const empty: LocationData = { nameEs: null, slug: '', region: '' };
  try {
    const areaRes = await fetch(areaUrl, { next: { revalidate: 86400 } });
    if (!areaRes.ok) return empty;
    const areaData: RawLocationArea = await areaRes.json();
    const areaNameEs = areaData.names.find(n => n.language.name === 'es')?.name ?? null;

    const locRes = await fetch(areaData.location.url, { next: { revalidate: 86400 } });
    if (!locRes.ok) return { nameEs: areaNameEs, slug: areaData.location.name, region: '' };
    const locData: RawLocation = await locRes.json();

    return {
      nameEs: areaNameEs ?? locData.names.find(n => n.language.name === 'es')?.name ?? null,
      slug: locData.name,
      region: locData.region?.name ?? '',
    };
  } catch {
    return empty;
  }
}

function getVersionFamily(versionName: string): string[] {
  const title = GAME_CATALOG[versionName]?.title;
  if (!title) return [versionName];
  return Object.entries(GAME_CATALOG)
    .filter(([, meta]) => meta.title === title)
    .map(([key]) => key);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const version = request.nextUrl.searchParams.get('version');

  if (!version) {
    return NextResponse.json({ error: 'version param required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error('pokeapi error');

    const raw: RawLocationEncounter[] = await res.json();
    const versions = getVersionFamily(version);

    const filtered = raw.filter(loc =>
      loc.version_details.some(vd => versions.includes(vd.version.name)),
    );

    const locationData = await Promise.all(
      filtered.map(loc => fetchLocationData(loc.location_area.url)),
    );

    const locations: EncounterLocation[] = filtered.map((loc, i) => {
      const relevant = loc.version_details.filter(vd => versions.includes(vd.version.name));
      const methodMap = new Map<string, { minLevel: number; maxLevel: number; chance: number }>();

      for (const vd of relevant) {
        for (const enc of vd.encounter_details) {
          const key = enc.method.name;
          const existing = methodMap.get(key);
          if (existing) {
            existing.minLevel = Math.min(existing.minLevel, enc.min_level);
            existing.maxLevel = Math.max(existing.maxLevel, enc.max_level);
            existing.chance = Math.max(existing.chance, enc.chance);
          } else {
            methodMap.set(key, { minLevel: enc.min_level, maxLevel: enc.max_level, chance: enc.chance });
          }
        }
      }

      const data = locationData[i];
      return {
        location: data.nameEs ?? formatLocation(loc.location_area.name),
        locationSlug: data.slug,
        region: data.region,
        methods: Array.from(methodMap.entries()).map(([method, details]) => ({
          method: METHOD_ES[method] ?? method.replace(/-/g, ' '),
          minLevel: details.minLevel,
          maxLevel: details.maxLevel,
          chance: details.chance,
        })),
      };
    });

    return NextResponse.json(
      { locations },
      { headers: { 'Cache-Control': 'public, s-maxage=86400' } },
    );
  } catch {
    return NextResponse.json({ error: 'Failed to fetch encounter data' }, { status: 500 });
  }
}
