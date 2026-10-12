import { Injectable, inject } from '@angular/core';
import { Observable, delay, finalize, of } from 'rxjs';

import { LoadingService } from '../../../core/interceptors/loading.interceptor';
import { SuperHero, publisherLabel } from '../../../core/models/super-hero.model';
import { SUPER_HEROES } from './super-heroes.mock';

/** 
 * Servicio para obtener los superheroes.
 */
@Injectable({
  providedIn: 'root',
})
export class SuperHeroService {
  private readonly loading = inject(LoadingService);
  private heroes: SuperHero[] = SUPER_HEROES.map((hero) => this.copy(hero));

  /**
   * Devuelve todos los superheroes.
   * @returns Listado de superheroes.
   */
  getAll(): Observable<SuperHero[]> {
    return of(this.heroes.map((hero) => this.copy(hero)));
  }

  /**
   * Busca un superheroe por id.
   * @param id Identificador del superheroe.
   * @returns El superheroe, o undefined si no existe.
   */
  getById(id: number): Observable<SuperHero | undefined> {
    const hero = this.heroes.find((item) => item.id === id);

    return of(hero ? this.copy(hero) : undefined);
  }

  /**
   * Busca superheroes cuyo nombre contiene el texto.
   * @param term Texto a buscar dentro del nombre.
   * @returns Superheroes que coinciden, normalizando para no distinguir mayusculas/minusculas.
   */
  searchByName(term: string): Observable<SuperHero[]> {
    const normalizedTerm = term.trim().toLowerCase();
    const matches = this.heroes.filter((hero) =>
      hero.name.toLowerCase().includes(normalizedTerm),
    );

    return of(matches.map((hero) => this.copy(hero)));
  }

  /**
   * Busca superheroes por nombre, editorial o poder.
   * @param term Texto a buscar.
   * @returns Superheroes que coinciden. Si el texto esta vacio, devuelve todos.
   */
  search(term: string): Observable<SuperHero[]> {
    const normalizedTerm = term.trim().toLowerCase();

    if (!normalizedTerm) {
      return this.getAll();
    }

    const matches = this.heroes.filter((hero) =>
      [hero.name, publisherLabel(hero.publisher), hero.stats.power].some((value) =>
        value.toLowerCase().includes(normalizedTerm),
      ),
    );

    return of(matches.map((hero) => this.copy(hero)));
  }

  /**
   * Registra un superheroe nuevo.
   * @param hero Datos del superheroe, sin id.
   * @returns El superheroe creado, con su id.
   */
  create(hero: Omit<SuperHero, 'id'>): Observable<SuperHero> {
    const nextId = this.heroes.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
    const created = this.copy({ ...hero, id: nextId });

    this.heroes = [...this.heroes, created];

    return this.withLoading(of(this.copy(created)), 800);
  }

  /**
   * Modifica un superheroe existente.
   * @param hero Superheroe con el id a modificar.
   * @returns El superheroe actualizado, o undefined si el id no existe.
   */
  update(hero: SuperHero): Observable<SuperHero | undefined> {
    const index = this.heroes.findIndex((item) => item.id === hero.id);

    if (index < 0) {
      return this.withLoading(of(undefined), 800);
    }

    this.heroes[index] = this.copy(hero);

    return this.withLoading(of(this.copy(hero)), 800);
  }

  /**
   * Elimina un superheroe.
   * @param id Identificador del superheroe.
   * @returns No retorna un valor.
   */
  delete(id: number): Observable<void> {
    this.heroes = this.heroes.filter((hero) => hero.id !== id);

    return this.withLoading(of(undefined));
  }

  /**
   * Muestra el loading mientras dura una alta, edicion o baja.
   * @param source Operacion a ejecutar.
   * @param responseTime Tiempo simulado de respuesta, en milisegundos.
   * @returns La misma operacion, con el loading asociado.
   */
  private withLoading<T>(source: Observable<T>, responseTime = 400): Observable<T> {
    this.loading.show();

    return source.pipe(
      delay(responseTime),
      finalize(() => this.loading.hide()),
    );
  }

  /**
   * Copia un superheroe para no compartir la misma referencia.
   * @param hero Superheroe a copiar.
   * @returns Una copia del superheroe.
   */
  private copy(hero: SuperHero): SuperHero {
    return {
      ...hero,
      stats: { ...hero.stats },
    };
  }
}
