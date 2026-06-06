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

// DLC locations are folded into the base-game rows with a marker icon; we pull
// them into their own rows, inserted right after the base game(s) of that gen.
const DLCS = [
  { id: 'ioa',    marker: 'Solo en el DLC La isla de la armadura',  edition: 'Isla de la Armadura', after: ['Espada', 'Escudo'],     gen: 8, color: '#22c55e' },
  { id: 'ct',     marker: 'Solo en el DLC Las nieves de la corona', edition: 'La Corona Nívea',      after: ['Espada', 'Escudo'],     gen: 8, color: '#38bdf8' },
  { id: 'teal',   marker: 'Solo en el DLC La m[aá]scara turquesa',  edition: 'La Máscara Turquesa', after: ['Escarlata', 'Púrpura'], gen: 9, color: '#3fae93' },
  { id: 'indigo', marker: 'Solo en el DLC El disco [ií]ndigo',      edition: 'El Disco Índigo',      after: ['Escarlata', 'Púrpura'], gen: 9, color: '#4f46e5' },
];

// Cleans a decoded localización line of artifacts left by removing locations.
function cleanLine(html: string): string {
  return decode(html)
    .replace(/\s*,(\s*,)+/g, ',')        // collapse repeated commas
    .replace(/:\s*,\s*/g, ': ')          // "Método: , X" → "Método: X"
    .replace(/,?\s*y\s*([.;])/g, '$1')   // ", y ." → "."
    .replace(/,\s*([.;])/g, '$1')        // ", ." → "."
    .replace(/;\s*\./g, '.')             // "; ." → "."
    .replace(/\s*;\s*$/g, '.')           // trailing ";" → "."
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const isEmptyMethodLine = (l: string) => !l || /^[^:]+:\s*\.?$/.test(l);

function parseTable(html: string): AvailabilityRow[] {
  const start = html.indexOf('<table class="localizacion');
  if (start === -1) return [];
  const end = html.indexOf('</table>', start);
  const table = html.slice(start, end);
  const rows = table.split(/<tr[ >]/).slice(1);

  let currentGen = 0;
  const out: (AvailabilityRow & { drop?: boolean })[] = [];
  const dlcLocs: Record<string, Set<string>> = {};   // locations from mixed lines
  const dlcLines: Record<string, Set<string>> = {};  // whole lines that are fully DLC
  for (const d of DLCS) { dlcLocs[d.id] = new Set(); dlcLines[d.id] = new Set(); }

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

    // Classify each method line. A line is "DLC" if it has a DLC marker icon, or
    // (for SV) describes the Blueberry Academy registration. DLC locations are
    // pulled into the DLC rows; the base remainder stays. A base game row whose
    // every line is DLC (no native data) is dropped — e.g. a Pokémon obtainable
    // only via the DLC, so its base Espada/Escudo or Escarlata/Púrpura row goes.
    const isSV = labels.includes('Escarlata') || labels.includes('Púrpura');
    const baseLines: string[] = [];
    let lineCount = 0;
    let dlcLineCount = 0;

    for (const m of td[1].matchAll(/<li>([\s\S]*?)<\/li>/g)) {
      lineCount++;
      let liHtml = m[1];
      let isDlc = false;

      // Extract DLC-marked locations and strip them from the line.
      for (const d of DLCS) {
        const re = new RegExp(
          `<a href="\\/wiki\\/[^"]*"[^>]*>([^<]+)<\\/a>\\s*<span[^>]*>\\s*<a[^>]*title="${d.marker}"[\\s\\S]*?<\\/span>`,
          'g',
        );
        let found = false;
        let mm: RegExpExecArray | null;
        while ((mm = re.exec(liHtml)) !== null) { const n = decode(mm[1]); if (n) dlcLocs[d.id].add(n); found = true; }
        if (found) { isDlc = true; liHtml = liHtml.replace(re, ''); }
      }

      if (!isDlc && isSV && /Sala del Club de la Liga|aclimatar/i.test(liHtml)) {
        // Blueberry Academy registration → Indigo Disk content.
        isDlc = true;
        const bl = cleanLine(liHtml);
        if (!isEmptyMethodLine(bl)) dlcLines['indigo'].add(bl);
      } else {
        const bl = cleanLine(liHtml);
        if (!isEmptyMethodLine(bl)) baseLines.push(bl);
      }
      if (isDlc) dlcLineCount++;
    }
    const loc = baseLines;
    const allDlc = lineCount > 0 && dlcLineCount === lineCount;

    if (labels.length === 0 && loc.length === 0 && !allDlc) continue;

    const titlesEs = [...new Set(
      (titles.length ? titles : labels).map(normalizeTitle),
    )];

    // A base game whose entire content was donated to a DLC (no native data)
    // is flagged for removal — e.g. a Pokémon only obtainable via the DLC.
    out.push({
      gen: currentGen,
      edition: labels.join(' / '),
      titlesEs,
      color,
      loc,
      drop: allDlc,
    });
  }

  // Build one row per DLC that gathered content (moved whole lines and/or
  // extracted locations), grouped by the base game(s) they follow so they stay
  // in order, and spliced in right after those base rows.
  const groups = new Map<string, { after: string[]; rows: AvailabilityRow[] }>();
  for (const d of DLCS) {
    const lines = [...dlcLines[d.id]];
    if (dlcLocs[d.id].size > 0) lines.push(`Salvaje: ${[...dlcLocs[d.id]].join(', ')}.`);
    if (lines.length === 0) continue;

    const baseRow = out.find(r => d.after.includes(r.edition));
    const row: AvailabilityRow = {
      gen: baseRow?.gen ?? d.gen,
      edition: d.edition,
      titlesEs: [],
      color: d.color,
      loc: lines,
    };
    const key = d.after.join('|');
    if (!groups.has(key)) groups.set(key, { after: d.after, rows: [] });
    groups.get(key)!.rows.push(row);
  }
  for (const { after, rows: dlcRows } of groups.values()) {
    let idx = -1;
    out.forEach((r, i) => { if (after.includes(r.edition)) idx = i; });
    if (idx >= 0) out.splice(idx + 1, 0, ...dlcRows);
    else out.push(...dlcRows);
  }

  // Drop the donated-out base rows and strip the transient flag.
  return out
    .filter(r => !r.drop)
    .map(r => ({ gen: r.gen, edition: r.edition, titlesEs: r.titlesEs, color: r.color, loc: r.loc }));
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
