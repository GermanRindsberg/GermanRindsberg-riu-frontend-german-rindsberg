import { Injectable } from '@angular/core';

import { SuperHero } from '../../../core/models/super-hero.model';
import { SUPER_HEROES } from './super-heroes.mock';

/**
 * Servicio para obtener los superheroes.
 */
@Injectable({
  providedIn: 'root',
})
export class SuperHeroService {
  private heroes: SuperHero[] = [...SUPER_HEROES];
}
