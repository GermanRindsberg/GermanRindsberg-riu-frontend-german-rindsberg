import { Publisher, SuperHero } from '../../../core/models/super-hero.model';

/**
 * Superheroes iniciales del servicio.
 */
export const SUPER_HEROES: SuperHero[] = [
  {
    id: 1,
    name: 'Spiderman',
    description: 'Trepa muros y lanza telarañas.',
    image: 'images/spiderman.png',
    stats: { power: 'Sentido aracnido', weakness: 'Su identidad secreta' },
    publisher: Publisher.Marvel,
  },
  {
    id: 2,
    name: 'Superman',
    description: 'Viene de Krypton y protege Metropolis.',
    image: 'images/superman.svg',
    stats: { power: 'Super fuerza', weakness: 'Kryptonita' },
    publisher: Publisher.Dc,
  },
  {
    id: 3,
    name: 'Batman',
    description: 'Vigila Gotham sin superpoderes pero tecnologia.',
    image: 'images/batman.png',
    stats: { power: 'Dinero', weakness: 'No tiene poderes' },
    publisher: Publisher.Dc,
  },
  {
    id: 4,
    name: 'Wonder Woman',
    description: 'Guerrera amazona.',
    image: 'images/mujermaravilla.png',
    stats: { power: 'Combate', weakness: 'Perder las pulseras' },
    publisher: Publisher.Dc,
  },
  {
    id: 5,
    name: 'Ironman',
    description: 'Tony Stark y su armadura.',
    image: 'images/ironman.jpg',
    stats: { power: 'Armadura', weakness: 'El reactor' },
    publisher: Publisher.Marvel,
  },
  {
    id: 6,
    name: 'Thor',
    description: 'Dios del trueno.',
    image: 'images/thor.png',
    stats: { power: 'Ser un dios', weakness: 'Perder el martillo' },
    publisher: Publisher.Marvel,
  },
  {
    id: 11,
    name: 'Linterna Verde',
    description: 'El anillo hace lo que imagina.',
    image: 'images/linterna.svg',
    stats: { power: 'El anillo', weakness: 'El color amarillo' },
    publisher: Publisher.Dc,
  },
  {
    id: 7,
    name: 'Deadpool',
    description: 'Mercenario que se regenera.',
    image: 'images/deadpool.png',
    stats: { power: 'Regeneracion', weakness: 'No se calla' },
    publisher: Publisher.Marvel,
  },
  {
    id: 8,
    name: 'Wolverine',
    description: 'Mutante con garras de adamantium.',
    image: 'images/wolverine.png',
    stats: { power: 'Regeneracion', weakness: 'Un iman' },
    publisher: Publisher.Marvel,
  },
];
