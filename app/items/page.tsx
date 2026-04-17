import { fetchItems } from '@/services/items';
import { ItemsClient } from '@/features/items/ItemsClient';
import type { Metadata } from 'next';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Objetos',
  description: 'Todos los objetos del juego: medicinas, objetos retenidos, bayas y Z-Cristales.',
};

export default async function ItemsPage() {
  const items = await fetchItems();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Objetos</h1>
        <p className="text-slate-500 text-sm">{items.length} objetos disponibles</p>
      </div>
      <ItemsClient items={items} />
    </div>
  );
}
