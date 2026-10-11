import { Component, input, output } from '@angular/core';

import { SuperHero } from '../../../../core/models/super-hero.model';

/**
 * Componente para mostrar la tabla de superheroes.
 */
@Component({
  selector: 'app-hero-table',
  imports: [],
  templateUrl: './hero-table.html',
  styleUrl: './hero-table.css',
})
export class HeroTable {
  readonly heroes = input<SuperHero[]>([]);
  readonly deleteHero = output<number>();

  /**
   * Avisa que se quiere borrar un superheroe.
   * @param id Identificador del superheroe.
   * @returns No retorna un valor.
   */
  onDelete(id: number): void {
    this.deleteHero.emit(id);
  }
}
