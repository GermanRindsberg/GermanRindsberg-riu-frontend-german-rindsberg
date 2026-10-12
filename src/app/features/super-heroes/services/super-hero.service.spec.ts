import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Publisher } from '../../../core/models/super-hero.model';
import { SUPER_HEROES } from './super-heroes.mock';
import { SuperHeroService } from './super-hero.service';

/**
 * Prueba para el servicio de superheroes.
 */

describe('SuperHeroService', () => {
  let service: SuperHeroService;
  /**
   * Configuracion de la prueba.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperHeroService);
  });

  /**
   * Prueba para verificar si el servicio se crea correctamente.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  /**
   * Prueba para verificar si el servicio devuelve todos los superheroes.
   */
  it('should return every hero', async () => {
    const heroes = await firstValueFrom(service.getAll());

    expect(heroes.length).toBe(SUPER_HEROES.length);
    expect(heroes.map((hero) => hero.name)).toContain('SPIDERMAN');
  });

  /**
   * Prueba para verificar si el servicio devuelve un superheroe por su id.
   */
  it('should return one hero by id', async () => {
    const hero = await firstValueFrom(service.getById(2));

    expect(hero?.name).toBe('SUPERMAN');
  });

  /**
   * Prueba para verificar si el servicio devuelve undefined cuando el id no existe.
   */
  it('should return undefined when the id does not exist', async () => {
    const hero = await firstValueFrom(service.getById(999));

    expect(hero).toBeUndefined();
  });

  /**
   * Prueba para verificar si el servicio encuentra superheroes cuyo nombre contiene el termino.
   */
  it('should find heroes whose name contains the term', async () => {
    const heroes = await firstValueFrom(service.searchByName('man'));
    const names = heroes.map((hero) => hero.name);

    expect(names).toContain('SPIDERMAN');
    expect(names).toContain('SUPERMAN');
    expect(names).toContain('BATMAN');
    expect(names).toContain('IRONMAN');
    expect(names).not.toContain('THOR');
  });

  /**
   * Prueba para verificar si el servicio busca por nombre, editorial o poder.
   */
  it('should find heroes by name, publisher or power', async () => {
    const byName = await firstValueFrom(service.search('spider'));
    const byPublisher = await firstValueFrom(service.search('DC'));
    const byPower = await firstValueFrom(service.search('anillo'));
    const all = await firstValueFrom(service.search(''));

    expect(byName.map((hero) => hero.name)).toEqual(['SPIDERMAN']);
    expect(byPublisher.map((hero) => hero.name)).toContain('BATMAN');
    expect(byPublisher.map((hero) => hero.name)).not.toContain('THOR');
    expect(byPower.map((hero) => hero.name)).toContain('LINTERNA VERDE');
    expect(all.length).toBe(SUPER_HEROES.length);
  });

  it('should ignore uppercase and lowercase when searching', async () => {
    const heroes = await firstValueFrom(service.searchByName('MAN'));

    expect(heroes.map((hero) => hero.name)).toContain('SUPERMAN');
  });
  
  /**
   * Prueba para verificar si el servicio crea un superheroe correctamente.
   */
  it('should create a hero', async () => {
    const created = await firstValueFrom(
      service.create({
        name: 'Flash',
        description: 'El hombre mas rapido.',
        history: 'Un rayo y quimicos le dieron supervelocidad.',
        image: '',
        stats: { power: 'Velocidad', weakness: 'El frio' },
        publisher: Publisher.Dc,
      }),
    );
    const heroes = await firstValueFrom(service.getAll());

    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe('Flash');
    expect(heroes.length).toBe(SUPER_HEROES.length + 1);
  });
  
  /**
   * Prueba para verificar si el servicio actualiza un superheroe correctamente.
   */
  it('should update a hero', async () => {
    await firstValueFrom(
      service.update({
        id: 1,
        name: 'Peter Parker',
        description: 'Trepa muros y lanza telarañas.',
        history: 'Mordido por una araña radiactiva.',
        image: 'images/spiderman.png',
        stats: { power: 'Sentido aracnido', weakness: 'Su identidad secreta' },
        publisher: Publisher.Marvel,
      }),
    );
    const hero = await firstValueFrom(service.getById(1));

    expect(hero?.name).toBe('Peter Parker');
  });

  /**
   * Prueba para verificar si el servicio elimina un superheroe correctamente.
   */
  it('should delete a hero', async () => {
    const before = await firstValueFrom(service.getAll());

    await firstValueFrom(service.delete(1));
    const hero = await firstValueFrom(service.getById(1));
    const heroes = await firstValueFrom(service.getAll());

    expect(hero).toBeUndefined();
    expect(heroes.length).toBe(before.length - 1);
  });

  /**
   * Prueba para verificar si actualizar un id inexistente no cambia el listado.
   */
  it('should return undefined when updating a missing hero', async () => {
    const before = await firstValueFrom(service.getAll());
    const updated = await firstValueFrom(
      service.update({
        id: 999,
        name: 'Nadie',
        description: '',
        history: '',
        image: '',
        stats: { power: '', weakness: '' },
        publisher: Publisher.Other,
      }),
    );

    expect(updated).toBeUndefined();
    expect((await firstValueFrom(service.getAll())).length).toBe(before.length);
  });

  /**
   * Prueba para verificar si el alta no comparte la referencia con quien lo pidio.
   */
  it('should keep the stored hero isolated from the created object', async () => {
    const created = await firstValueFrom(
      service.create({
        name: 'Nova',
        description: 'Centurion',
        history: 'Casco de Xandar.',
        image: '',
        stats: { power: 'Energia', weakness: 'El casco' },
        publisher: Publisher.Marvel,
      }),
    );

    created.name = 'Cambiado';
    created.stats.power = 'Nada';

    const stored = await firstValueFrom(service.getById(created.id));

    expect(stored?.name).toBe('Nova');
    expect(stored?.stats.power).toBe('Energia');
  });

  /**
   * Prueba para verificar si la busqueda ignora espacios alrededor del texto.
   */
  it('should trim the search term', async () => {
    const heroes = await firstValueFrom(service.search('  thor  '));

    expect(heroes.map((hero) => hero.name)).toEqual(['THOR']);
  });
});
