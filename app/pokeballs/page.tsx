import { fetchPokeballs } from '@/services/pokeballs';
import { PokeballsClient } from '@/features/pokeballs/PokeballsClient';
import type { Metadata } from 'next';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Pokéballs',
  description: 'Todas las Pokéballs con sus efectos, costos y descripciones.',
};

export default async function PokeballsPage() {
  const pokeballs = await fetchPokeballs();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Pokéballs</h1>
        <p className="text-slate-500 text-sm">{pokeballs.length} Pokéballs disponibles</p>
      </div>
      <PokeballsClient pokeballs={pokeballs} />
    </div>
  );
}
