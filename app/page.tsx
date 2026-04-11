import { fetchPokemonPage } from '@/services/pokeapi';
import { PokedexClient } from '@/features/pokedex/PokedexClient';

export const revalidate = 86400;

export default async function Home() {
  // Server-side fetch of the first page — fast, cached, SEO-friendly
  const initialPage = await fetchPokemonPage(0, 20);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Todos los Pokémon</h1>
        <p className="text-slate-500 text-sm">
          {initialPage.total} Pokémon disponibles
        </p>
      </div>
      <PokedexClient initialPage={initialPage} />
    </div>
  );
}
