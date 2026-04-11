import { NextResponse } from 'next/server';
import { fetchRawPokemon } from '@/services/pokeapi';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const raw = await fetchRawPokemon(id);
    return NextResponse.json(
      { types: raw.types.map(t => t.type.name) },
      { headers: { 'Cache-Control': 'public, s-maxage=86400' } },
    );
  } catch {
    return NextResponse.json({ types: [] }, { status: 404 });
  }
}
