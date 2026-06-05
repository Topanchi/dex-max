import { NextRequest, NextResponse } from 'next/server';

interface RawPokemon {
  id: number;
  sprites: { front_default: string | null };
}

// Resolves a comma-separated list of PokéAPI Pokémon names into id + sprite.
// Used by the curated Galar-DLC location dataset, since PokéAPI has no
// encounter data for those areas.
export async function GET(request: NextRequest) {
  const namesParam = request.nextUrl.searchParams.get('names');
  if (!namesParam) {
    return NextResponse.json({ pokemon: [] });
  }

  const normalize = (n: string) =>
    n
      .trim()
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents (flabébé→flabebe)
      .replace(/♀/g, '-f')
      .replace(/♂/g, '-m')
      .replace(/['.]/g, '')
      .replace(/\s+/g, '-')
      // Hisui form fixes (WikiDex uses "-hisuian", PokéAPI uses "-hisui").
      .replace(/hisuian/g, 'hisui')
      // Shellos/Gastrodon have no API form variants.
      .replace(/-(east|west)$/, '')
      // Basculin white-striped (Hisui) full slug.
      .replace(/^basculin-white$/, 'basculin-white-striped')
      // Paldean forms ("X de paldea").
      .replace(/^tauros-de-paldea$/, 'tauros-paldea-combat-breed')
      .replace(/-de-paldea$/, '-paldea')
      // Galarian forms ("X de galar" / "X-of-galar").
      .replace(/-(de|of)-galar$/, '-galar');

  const names = Array.from(
    new Set(namesParam.split(',').map(normalize).filter(Boolean)),
  );

  const results = await Promise.all(
    names.map(name =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
        next: { revalidate: 86400 },
      })
        .then(r => (r.ok ? (r.json() as Promise<RawPokemon>) : null))
        .catch(() => null),
    ),
  );

  const pokemon = names
    .map((name, i) => {
      const raw = results[i];
      if (!raw?.id) return null;
      return { name, id: raw.id, sprite: raw.sprites.front_default ?? null };
    })
    .filter((p): p is { name: string; id: number; sprite: string | null } => p !== null);

  return NextResponse.json(
    { pokemon },
    { headers: { 'Cache-Control': 'public, s-maxage=86400' } },
  );
}
