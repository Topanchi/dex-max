import { NextRequest, NextResponse } from 'next/server';

// Reads the "Localización" table from the Pokémon's WikiDex page and returns it
// as structured rows. WikiDex has the full per-game availability (wild, starter,
// trade, event, evolution, etc.) that PokéAPI's encounter data lacks.

export interface AvailabilityRow {
  gen: number;
  edition: string;     // display label, e.g. "Rojo", "Oro / Plata"
  titlesEs: string[];  // normalized game titles for matching covers
  color: string;       // game colour from WikiDex, e.g. "#ff0000"
  loc: string[];       // localización lines, e.g. ["Salvaje: Ruta 2.", "Evento: …"]
}

// WikiDex page title for a PokéAPI species slug (mostly the capitalized name).
function wikidexName(slug: string): string {
  const special: Record<string, string> = {
    'mr-mime': 'Mr. Mime',
    'mr-rime': 'Mr. Rime',
    'mime-jr': 'Mime Jr.',
    'type-null': 'Type: Null',
    farfetchd: "Farfetch'd",
    sirfetchd: "Sirfetch'd",
    'nidoran-f': 'Nidoran hembra',
    'nidoran-m': 'Nidoran macho',
    'ho-oh': 'Ho-Oh',
    'porygon-z': 'Porygon-Z',
    'jangmo-o': 'Jangmo-o',
    'hakamo-o': 'Hakamo-o',
    'kommo-o': 'Kommo-o',
  };
  if (special[slug]) return special[slug];
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function decode(s: string): string {
  return s
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#160;|&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú').replace(/&ntilde;/g, 'ñ')
    .replace(/\s*\((?:ver|véase)(?:\s+más)?\s+abajo\)/gi, '') // dangling WikiDex anchors
    .replace(/\s+\./g, '.')
    .replace(/\s+/g, ' ')
    .trim();
}

// "Pokémon Rojo y Pokémon Azul" → "Rojo / Azul"; "Pokémon Cristal" → "Cristal".
function normalizeTitle(t: string): string {
  return t
    .replace(/Pok[ée]mon\s+/g, '')
    .replace(/\s+y\s+/g, ' / ')
    .trim();
}

function parseTable(html: string): AvailabilityRow[] {
  const start = html.indexOf('<table class="localizacion');
  if (start === -1) return [];
  const end = html.indexOf('</table>', start);
  const table = html.slice(start, end);
  const rows = table.split(/<tr[ >]/).slice(1);

  let currentGen = 0;
  const out: AvailabilityRow[] = [];
  // SV DLC locations are folded into the Escarlata/Púrpura rows with a marker
  // icon; we pull them out into their own rows.
  const tealAll = new Set<string>();
  const indigoAll = new Set<string>();

  for (const r of rows) {
    if (/>Gen\.</.test(r)) continue; // header row

    const genMatch = r.match(/rowspan="\d+"[^>]*>\s*<span[^>]*>\s*<a[^>]*>\s*<img alt="(\d+)"/);
    if (genMatch) currentGen = Number(genMatch[1]);

    const td = r.match(/<td[^>]*class="[^"]*tfx-fw[^"]*"[^>]*>([\s\S]*?)<\/td>/);
    if (!td) continue; // not a game row

    // Edition labels: links inside the "enlacesblancos" header cell.
    const edTh = r.match(/<th[^>]*enlacesblancos[^>]*>([\s\S]*?)<\/th>/);
    const titles: string[] = [];
    let labels: string[] = [];
    if (edTh) {
      for (const a of edTh[1].matchAll(/<a[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
        titles.push(decode(a[1]));
        labels.push(decode(a[2]));
      }
    }
    // Fallback: game icon alt text.
    if (labels.length === 0) {
      const alts = [...r.matchAll(/<img alt="([^"]+)"/g)].map(m => m[1]).filter(a => !/^\d+$/.test(a));
      labels = alts.slice(0, 2);
    }
    labels = [...new Set(labels)];

    // Colour from the edition cell (not the row, which may start with the
    // generation-icon header that uses a neutral background).
    const colorMatch = (edTh?.[1] ?? r).match(/background-color:\s*(#[0-9a-fA-F]{3,6})/);
    const color = colorMatch ? colorMatch[1] : '#64748b';

    // Pull out DLC-only locations (each tagged with a small marker icon) and
    // remove them from the base list.
    let tdHtml = td[1];
    const grabDlc = (markerSrc: string, bucket: Set<string>) => {
      const re = new RegExp(
        `<a href="\\/wiki\\/[^"]*"[^>]*>([^<]*)<\\/a>\\s*<span[^>]*>\\s*<a[^>]*title="${markerSrc}"[\\s\\S]*?<\\/span>`,
        'g',
      );
      tdHtml = tdHtml.replace(re, (_m, name) => {
        const n = decode(name);
        if (n) bucket.add(n);
        return '';
      });
    };
    grabDlc('Solo en el DLC La m[aá]scara turquesa', tealAll);
    grabDlc('Solo en el DLC El disco [ií]ndigo', indigoAll);

    const loc = [...tdHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)]
      .map(m =>
        decode(m[1])
          .replace(/\s*,(\s*,)+/g, ',')        // collapse repeated commas
          .replace(/:\s*,\s*/g, ': ')          // "Método: , X" → "Método: X"
          .replace(/,?\s*y\s*([.;])/g, '$1')   // ", y ." → "."
          .replace(/,\s*([.;])/g, '$1')        // ", ." → "."
          .replace(/;\s*\./g, '.')             // "; ." → "."
          .replace(/\s*;\s*$/g, '.')           // trailing ";" → "."
          .replace(/\s{2,}/g, ' ')
          .trim(),
      )
      .filter(l => l && !/^[^:]+:\s*\.?$/.test(l)); // drop empty "Método: ."

    if (labels.length === 0 && loc.length === 0) continue;

    const titlesEs = [...new Set(
      (titles.length ? titles : labels).map(normalizeTitle),
    )];

    out.push({
      gen: currentGen,
      edition: labels.join(' / '),
      titlesEs,
      color,
      loc,
    });
  }

  // Dedicated rows for the SV DLC, inserted right after the Escarlata/Púrpura
  // rows they were extracted from.
  const dlcRows: AvailabilityRow[] = [];
  if (tealAll.size > 0) {
    dlcRows.push({
      gen: 9, edition: 'La Máscara Turquesa', titlesEs: [], color: '#3fae93',
      loc: [`Salvaje: ${[...tealAll].join(', ')}.`],
    });
  }
  if (indigoAll.size > 0) {
    dlcRows.push({
      gen: 9, edition: 'El Disco Índigo', titlesEs: [], color: '#4f46e5',
      loc: [`Salvaje: ${[...indigoAll].join(', ')}.`],
    });
  }
  if (dlcRows.length > 0) {
    let after = -1;
    out.forEach((row, i) => {
      if (row.edition === 'Escarlata' || row.edition === 'Púrpura') after = i;
    });
    if (after >= 0) out.splice(after + 1, 0, ...dlcRows);
    else out.push(...dlcRows);
  }

  return out;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await params; // id unused; name carries the WikiDex page
  const slug = request.nextUrl.searchParams.get('name');
  if (!slug) return NextResponse.json({ rows: [] });

  const page = wikidexName(slug);

  try {
    const res = await fetch(
      `https://www.wikidex.net/wiki/${encodeURIComponent(page)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 604800 } },
    );
    if (!res.ok) throw new Error('wikidex not found');
    const html = await res.text();
    const rows = parseTable(html);

    return NextResponse.json(
      { rows },
      { headers: { 'Cache-Control': 'public, s-maxage=604800' } },
    );
  } catch {
    return NextResponse.json({ rows: [] });
  }
}
