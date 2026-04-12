import { NextRequest, NextResponse } from 'next/server';
import { searchTCGPocketCards } from '@/services/tcgpocket';
import { normalizeTCGSearchName } from '@/utils/normalize';
import { toTCGName } from '@/services/tcgdex';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name');
  if (!name) return NextResponse.json({ cards: [] });

  // Strip form suffixes, then convert to display name (handles Mr. Mime, Ho-Oh, etc.)
  const displayName = toTCGName(normalizeTCGSearchName(name));

  try {
    const cards = await searchTCGPocketCards(displayName);
    return NextResponse.json(
      { cards },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch {
    return NextResponse.json({ cards: [] });
  }
}
