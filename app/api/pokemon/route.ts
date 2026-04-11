import { NextRequest, NextResponse } from 'next/server';
import { fetchPokemonPage, fetchPokemonByType, fetchPokemonByGeneration } from '@/services/pokeapi';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page       = Math.max(0, parseInt(searchParams.get('page') ?? '0', 10));
  const limit      = Math.min(40, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
  const type       = searchParams.get('type');
  const generation = searchParams.get('generation');
  const offset     = page * limit;

  try {
    const data = generation
      ? await fetchPokemonByGeneration(parseInt(generation, 10), offset, limit)
      : type
      ? await fetchPokemonByType(type, offset, limit)
      : await fetchPokemonPage(offset, limit);

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return NextResponse.json({ error: 'Error al obtener Pokémon' }, { status: 500 });
  }
}
