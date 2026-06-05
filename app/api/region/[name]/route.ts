import { NextResponse } from 'next/server';
import { LOCATION_COORDS } from '@/lib/locationCoords';

interface RawRegion {
  locations: Array<{ name: string; url: string }>;
}

interface RawLocation {
  names: Array<{ name: string; language: { name: string } }>;
}

async function fetchNameEs(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data: RawLocation = await res.json();
    return data.names.find(n => n.language.name === 'es')?.name ?? null;
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/region/${name}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error('region not found');
    const region: RawRegion = await res.json();

    const withCoords = region.locations.filter(loc => LOCATION_COORDS[loc.name]);

    const namesEs = await Promise.all(withCoords.map(loc => fetchNameEs(loc.url)));

    const locations = withCoords.map((loc, i) => ({
      slug: loc.name,
      nameEs:
        namesEs[i] ??
        loc.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      ...LOCATION_COORDS[loc.name],
    }));

    return NextResponse.json(
      { locations },
      { headers: { 'Cache-Control': 'public, s-maxage=86400' } },
    );
  } catch {
    return NextResponse.json({ locations: [] });
  }
}
