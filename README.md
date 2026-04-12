# Pokédex

Aplicación web completa para explorar todos los Pokémon con arte oficial, estadísticas, cadena evolutiva, formas y variantes, galería de sprites histórica por generación y cartas del juego de cartas coleccionables (TCG).

## Stack

| Tecnología | Versión |
|---|---|
| [Next.js](https://nextjs.org/) App Router | 15.1 |
| [React](https://react.dev/) | 19 |
| [TypeScript](https://www.typescriptlang.org/) | 5 |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 |

**APIs externas** (sin API key, públicas):
- [PokéAPI v2](https://pokeapi.co/) — datos de Pokémon (tipos, estadísticas, evoluciones, sprites)
- [Pokémon TCG API v2](https://api.pokemontcg.io/v2) — cartas TCG tradicional
- [pokemon-tcg-pocket-cards](https://github.com/chase-manning/pokemon-tcg-pocket-cards) — datos de TCG Pocket

---

## Instalación y ejecución

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # producción
```

No requiere variables de entorno.

---

## Funcionalidades

### Listado principal
- Listado paginado con **infinite scroll** (1 302+ Pokémon)
- **Búsqueda** por nombre en tiempo real (filtro local, sin requests extra)
- **Filtro por tipo** — 18 tipos con colores oficiales
- **Filtro por generación** — Gen I–IX con nombre de región (Kanto → Paldea)
- Filtros de tipo y generación son **mutuamente excluyentes**
- **Ordenación** por número, nombre o estadística total (asc/desc)

### Vista detalle
- Hero con arte oficial **Normal y Shiny** en paralelo
- Número de Pokédex, categoría de especie, descripción en español (fallback inglés)
- Badges: Legendario, Mítico, Bebé
- Tipos, habilidades (con indicador de habilidad oculta ✦), altura, peso
- Reproductor de **grito** (cry)
- **Estadísticas base** con barras de progreso por color
- **Cadena evolutiva** horizontal con condición de evolución entre nodos
- **Formas y variantes** agrupadas por categoría: Mega Evolución, Gigantamax, Alola, Galar, Hisui, Paldea y formas alternativas
- **Galería de sprites** por generación, ordenada de Gen I → Gen VIII, con sprites frontales, shiny y traseros por juego (Rojo/Azul, Oro, Rubí/Zafiro, etc.)
- **Cartas TCG** — todas las cartas en inglés del Pokémon

### Cartas TCG
- **TCG tradicional**: [Pokémon TCG API v2](https://api.pokemontcg.io/v2) — sin autenticación (límite 1000 req/día)
  - Paginación completa (`pageSize=250`) para obtener **todas las cartas**, sin límite
  - Incluye cartas con nombre base (`Charizard*`), variantes `M Nombre-EX` y `Mega Nombre`
  - Matching robusto: acepta sufijos especiales (☆ Star, ◇ Prism, ex, GX, V, VMAX…) sin falsos positivos (Mew no captura Mewtwo)
  - Ordenadas por fecha de set descendente (más recientes primero)
  - Modal con imagen ampliada, rareza, PS, tipos TCG e ilustrador
- **TCG Pocket**: [chase-manning/pokemon-tcg-pocket-cards](https://github.com/chase-manning/pokemon-tcg-pocket-cards) — datos completos de la app móvil
  - Cartas de todas las expansiones disponibles en TCG Pocket
  - Datos extraídos de Limitless TCG

---

## Arquitectura

```
app/
  layout.tsx                     # Root layout — header, footer
  page.tsx                       # Listado (Server Component, SSR)
  loading.tsx                    # Skeleton del listado
  not-found.tsx                  # Página 404
  pokemon/[id]/
    page.tsx                     # Detalle (Server Component, SSR)
    loading.tsx
  api/
    pokemon/route.ts             # GET /api/pokemon?offset&limit&type&generation
    pokemon/names/route.ts       # GET /api/pokemon/names — todos los nombres
    pokemon/[id]/types/route.ts  # GET /api/pokemon/:id/types
    tcg-cards/route.ts           # GET /api/tcg-cards?name=

features/
  pokedex/
    PokedexClient.tsx            # Estado: búsqueda, tipo, generación, sort, scroll
    PokemonCard.tsx              # Tarjeta con lazy-load de tipos
    SearchBar.tsx
    TypeFilter.tsx
    GenerationFilter.tsx         # Botones Gen I–IX con colores por región
    SortControls.tsx
  pokemon-detail/
    PokemonDetailView.tsx        # Vista completa (Client Component)
    BaseStats.tsx                # Barras de estadísticas
    EvolutionChainView.tsx       # Cadena evolutiva recursiva horizontal
    FormsSection.tsx             # Variantes agrupadas por categoría
    TCGSection.tsx               # Galería de cartas con modal (fetch en mount)

components/ui/
  Badge.tsx                      # Badges de tipo, estado y categoría
  ImageWithFallback.tsx          # Imagen con fallback a placeholder
  Modal.tsx                      # Bottom sheet (móvil) / modal centrado (desktop)
  Skeleton.tsx

services/
  pokeapi.ts                     # Integración PokéAPI: fetchers, mappers, caché 24h
  tcgdex.ts                      # Integración Pokémon TCG API v2: paginación completa, matching
  tcgpocket.ts                   # Integración TCG Pocket: datos de GitHub (chase-manning)

lib/
  fetcher.ts                     # fetch wrapper con revalidate y manejo de errores

types/
  pokemon.ts                     # Tipos raw de PokéAPI + modelos de aplicación
  tcg.ts                         # Tipos de la TCG API

utils/
  normalize.ts                   # Normalización de nombres, formas, búsqueda TCG
  typeColors.ts                  # Colores y gradientes por tipo
  sprites.ts                     # URLs predictibles de sprites por ID
```

---

## Decisiones técnicas

### Server vs Client Components
- **Home y detalle**: Server Components — el primer render llega con datos. El cliente solo gestiona estado interactivo.
- **`PokedexClient`**: Client Component — maneja búsqueda, filtros, sort e infinite scroll.
- **`TCGSection`**: Client Component — las cartas se fetchean en mount para no bloquear el SSR del detalle.
- **`PokemonCard`**: Client Component — los tipos se cargan lazily con `IntersectionObserver` en modo búsqueda.

### Caché
- PokéAPI: `revalidate: 86400` (24 h)
- TCG API: `revalidate: 86400` (24 h, subido de 1 h por las paginaciones múltiples)
- API routes propias: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

### Búsqueda
- Se descarga el listado completo de nombres (~1 302 entradas) una sola vez.
- Filtrado client-side — sin requests por cada keystroke.
- En modo búsqueda, los tipos de cada tarjeta se cargan lazily con `IntersectionObserver`.

### Cartas TCG — matching de nombres
El filtro post-API acepta un nombre si:
1. Es exactamente igual al buscado, **o**
2. Empieza por el nombre y el siguiente carácter **no es una letra**

Esto permite "Charizard☆", "Charizard-GX", "Charizard V" y rechaza correctamente "Mewtwo" cuando se busca "Mew".

### Responsive y accesibilidad
- Breakpoint personalizado `3xl: 1920px` para monitores 27" (max-width `1800px`)
- `font-size ≥ 16px` en inputs/selects para prevenir el zoom automático en iOS
- `touch-manipulation` en todos los elementos interactivos táctiles
- `aria-label`, `aria-expanded`, `aria-current`, `role="progressbar"` en toda la interfaz

---

## Mejoras futuras sugeridas

- [ ] `generateStaticParams` para pre-generar los primeros 151 Pokémon en build
- [ ] URL state para filtros (`?type=fire&gen=1`) — compartir enlaces con estado activo
- [ ] Comparador de Pokémon lado a lado
- [ ] Favoritos con `localStorage` o Supabase
- [ ] Soporte multi-tipo en el filtro
- [ ] Tests unitarios para servicios y mappers (funciones puras, fáciles de testear)
- [ ] Sección de movimientos en el detalle
- [ ] PWA con service worker para caché offline
