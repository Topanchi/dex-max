import { NextRequest, NextResponse } from 'next/server';
import { searchTCGCards, toTCGName } from '@/services/tcgdex';
import { normalizeTCGSearchName } from '@/utils/normalize';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name');
  if (!name) return NextResponse.json({ cards: [] });

  // 1. Strip form suffixes (mega, gmax, regional variants, etc.)
  const baseName = normalizeTCGSearchName(name);
  // 2. Convert to TCG card name format (handles Mr. Mime, Ho-Oh, etc.)
  const tcgName  = toTCGName(baseName);

  try {
    const cards = await searchTCGCards(tcgName);
    return NextResponse.json(
      { cards },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch {
    return NextResponse.json({ cards: [] });
  }
}
