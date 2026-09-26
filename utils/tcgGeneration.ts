import { getTCGEra } from './tcgClassification';

/**
 * Mapea el set de una carta del TCG a la Generación de juego (I-IX) con la
 * que se corresponde. Se apoya en `getTCGEra` (Base/Gym → Gen I, Neo/E-Card
 * → Gen II, EX → Gen III, Diamond & Pearl/Platinum/HeartGold & SoulSilver →
 * Gen IV, Black & White → Gen V, XY → Gen VI, Sun & Moon → Gen VII,
 * Sword & Shield → Gen VIII, Scarlet & Violet/Mega Evolution → Gen IX), ya
 * que no existe una "Generación X" en el Pokédex.
 */
export function getTCGGeneration(series: string, releaseDate: string): number {
  return Math.min(getTCGEra(series, releaseDate).id, 9);
}
