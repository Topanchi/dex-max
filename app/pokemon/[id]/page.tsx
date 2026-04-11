import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPokemonDetail } from '@/services/pokeapi';
import { PokemonDetailView } from '@/features/pokemon-detail/PokemonDetailView';
import { normalizePokemonName, formatPokedexNumber } from '@/utils/normalize';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const pokemon = await fetchPokemonDetail(id);
    const name = normalizePokemonName(pokemon.name);
    const number = formatPokedexNumber(pokemon.id);
    return {
      title: `${name} ${number}`,
      description:
        pokemon.species.description ||
        `Pokédex de ${name}: tipos, estadísticas, formas y cartas TCG.`,
      openGraph: {
        images: pokemon.sprites.official ? [{ url: pokemon.sprites.official }] : [],
      },
    };
  } catch {
    return { title: 'Pokémon no encontrado' };
  }
}

export default async function PokemonPage({ params }: PageProps) {
  const { id } = await params;

  let pokemon;
  try {
    pokemon = await fetchPokemonDetail(id);
  } catch {
    notFound();
  }

  return <PokemonDetailView pokemon={pokemon} />;
}
