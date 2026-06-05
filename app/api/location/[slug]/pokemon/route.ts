import { NextResponse } from 'next/server';

interface RawLocation {
  areas: Array<{ name: string; url: string }>;
  names: Array<{ name: string; language: { name: string } }>;
}

interface RawEncounterDetail {
  method: { name: string };
  min_level: number;
  max_level: number;
}

interface RawLocationAreaData {
  pokemon_encounters: Array<{
    pokemon: { name: string; url: string };
    version_details: Array<{ encounter_details: RawEncounterDetail[] }>;
  }>;
}

interface RawPokemon {
  id: number;
  sprites: { front_default: string | null };
}

const METHOD_ES: Record<string, string> = {
  'walk':       'Hierba',
  'surf':       'Surf',
  'old-rod':    'Caña vieja',
  'good-rod':   'Buena caña',
  'super-rod':  'Supercaña',
  'rock-smash': 'Romperrocas',
  'headbutt':   'Cabezazo',
  'dark-grass': 'Hierba oscura',
  'gift':       'Regalo',
  'dive':       'Bucear',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const locRes = await fetch(`https://pokeapi.co/api/v2/location/${slug}`, {
      next: { revalidate: 86400 },
    });
    if (!locRes.ok) throw new Error('not found');
    const location: RawLocation = await locRes.json();

    const nameEs =
      location.names.find(n => n.language.name === 'es')?.name ??
      slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const areasData = await Promise.all(
      location.areas.map(area =>
        fetch(area.url, { next: { revalidate: 86400 } }).then(r =>
          r.json() as Promise<RawLocationAreaData>,
        ),
      ),
    );

    const pokemonMap = new Map<string, { url: string; methods: Set<string> }>();
    for (const area of areasData) {
      for (const enc of area.pokemon_encounters) {
        const methods = new Set<string>();
        for (const vd of enc.version_details) {
          for (const ed of vd.encounter_details) {
            const label = METHOD_ES[ed.method.name] ?? ed.method.name.replace(/-/g, ' ');
            const lvl =
              ed.min_level === ed.max_level
                ? `Nv. ${ed.min_level}`
                : `Nv. ${ed.min_level}–${ed.max_level}`;
            methods.add(`${label} · ${lvl}`);
          }
        }
        const existing = pokemonMap.get(enc.pokemon.name);
        if (existing) {
          methods.forEach(m => existing.methods.add(m));
        } else {
          pokemonMap.set(enc.pokemon.name, { url: enc.pokemon.url, methods });
        }
      }
    }

    const entries = Array.from(pokemonMap.entries()).slice(0, 30);
    const sprites = await Promise.all(
      entries.map(([, data]) =>
        fetch(data.url, { next: { revalidate: 86400 } })
          .then(r => r.json() as Promise<RawPokemon>)
          .catch(() => null),
      ),
    );

    const pokemon = entries
      .map(([name, data], i) => {
        const raw = sprites[i];
        if (!raw?.id) return null;
        return {
          name,
          id: raw.id,
          sprite: raw.sprites.front_default ?? null,
          methods: Array.from(data.methods).slice(0, 3),
        };
      })
      .filter(p => p !== null);

    return NextResponse.json(
      { nameEs, pokemon },
      { headers: { 'Cache-Control': 'public, s-maxage=86400' } },
    );
  } catch {
    return NextResponse.json({ nameEs: slug, pokemon: [] });
  }
}
