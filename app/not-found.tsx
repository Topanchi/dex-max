import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="relative w-32 h-32 mb-8">
        {/* Missingno. placeholder */}
        <div className="w-32 h-32 rounded-full bg-[#1a1a2e] border-2 border-[#2a2a4e] flex items-center justify-center">
          <span className="text-4xl">?</span>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">Pokémon no encontrado</h1>
      <p className="text-slate-500 mb-8">
        El Pokémon que buscas no existe o no se pudo cargar.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors
                   focus:outline-none focus:ring-2 focus:ring-red-500/50"
      >
        Volver a la Pokédex
      </Link>
    </div>
  );
}
