import { NextResponse } from 'next/server';
import { fetchAllPokemonNames } from '@/services/pokeapi';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const names = await fetchAllPokemonNames();
    return NextResponse.json(
      { names },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  } catch {
    return NextResponse.json({ error: 'Error al obtener nombres' }, { status: 500 });
  }
}
