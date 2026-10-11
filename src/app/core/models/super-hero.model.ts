/**
 * Modelo de superhéroe.
 */
export interface SuperHero {
  id: number;
  name: string;
  description: string;
  history: string;
  image: string;
  stats: Stats;
  publisher: Publisher;
}

/**
 * Modelo de stats de superhéroe.
 */
export interface Stats {
  power: string;
  weakness: string;
}

/**
 * Modelo de publisher de superhéroe.
 */
export enum Publisher {
  Marvel = 'Marvel',
  Dc = 'DC',
  Other = 'Other',
}