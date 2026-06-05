import { RegionMapSection } from '@/features/region-map/RegionMapSection';

export const metadata = {
  title: 'Mapa de regiones | Dex Max',
  description: 'Explora las regiones del mundo Pokémon e identifica dónde encontrar cada Pokémon.',
};

export default function MapaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Mapa de regiones</h1>
        <p className="text-slate-500 text-sm">
          Selecciona una región y toca un punto del mapa para ver qué Pokémon habitan ahí
        </p>
      </div>
      <RegionMapSection />
    </div>
  );
}
