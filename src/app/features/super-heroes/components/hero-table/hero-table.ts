import { Component, effect, input, output, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Publisher, SuperHero } from '../../../../core/models/super-hero.model';

/**
 * Componente para mostrar la tabla de superheroes.
 */
@Component({
  selector: 'app-hero-table',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './hero-table.html',
  styleUrl: './hero-table.css',
})
export class HeroTable {
  /**
   * Superheroes a mostrar.
   */       
  readonly heroes = input<SuperHero[]>([]);
  /**
   * Emite el id del superheroe editado.
   */
  readonly editHero = output<number>();
  /**
   * Emite el id del superheroe borrado.
   */
  readonly deleteHero = output<number>();

  /**
   * Columnas a mostrar en la tabla.
   */       
  readonly displayedColumns = ['hero', 'publisher', 'history', 'power', 'weakness', 'actions'];
  /**
   * Fuente de datos para la tabla.
   */
  readonly dataSource = new MatTableDataSource<SuperHero>([]);
  /**
   * Superheroes de la pagina actual, para las cards.
   */
  readonly pageHeroes = toSignal(this.dataSource.connect(), { initialValue: [] as SuperHero[] });

  /**
   * Paginator para la tabla.
   */
  private readonly paginator = viewChild(MatPaginator);
  /**
   * Sort para la tabla.
   */
  private readonly sort = viewChild(MatSort);

  /**
   * Constructor del componente.
   */
  constructor() {
    /**
     * Accesor para ordenar los datos de la tabla.
     */
    this.dataSource.sortingDataAccessor = (hero, column) => {
      if (column === 'hero') {
        return hero.name;
      }

      if (column === 'power') {
        return hero.stats.power;
      }
      /**
       * Accesor para ordenar los datos de la tabla por debilidad.
       */
      if (column === 'weakness') {
        return hero.stats.weakness;
      }
      /**
       * Accesor para ordenar los datos de la tabla por el valor de la columna.
       */
      const value = hero[column as keyof SuperHero];

      return typeof value === 'string' ? value : '';
    };

    /**
     * Efecto para actualizar la fuente de datos de la tabla.
     */
    effect(() => {
      this.dataSource.data = this.heroes();
      const paginator = this.paginator();
      this.dataSource.paginator = paginator ?? null;
      this.dataSource.sort = this.sort() ?? null;
      paginator?.firstPage();
    });
  }

  /**
   * Avisa que se quiere editar un superheroe.
   * @param id Identificador del superheroe.
   * @returns No retorna un valor.
   */
  onEdit(id: number): void {
    this.editHero.emit(id);
  }

  /**
   * Avisa que se quiere borrar un superheroe.
   * @param id Identificador del superheroe.
   * @returns No retorna un valor.
   */
  onDelete(id: number): void {
    this.deleteHero.emit(id);
  }

  /**
   * Devuelve la imagen del superheroe, o la imagen por defecto.
   * @param hero Superheroe a mostrar.
   * @returns Ruta de la imagen.
   */
  imageOf(hero: SuperHero): string {
    return hero.image || 'images/default.png';
  }

  /**
   * Devuelve la clase de la etiqueta segun la editorial.
   * @param publisher Editorial del superheroe.
   * @returns Clase CSS de la etiqueta.
   */
  publisherClass(publisher: Publisher): string {
    if (publisher === Publisher.Marvel) {
      return 'badge badge-marvel';
    }

    if (publisher === Publisher.Dc) {
      return 'badge badge-dc';
    }

    return 'badge badge-other';
  }
}
