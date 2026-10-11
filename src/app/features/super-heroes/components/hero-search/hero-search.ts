import { Component, output } from '@angular/core';

/**
 * Buscador de superheroes por nombre.
 */
@Component({
  selector: 'app-hero-search',
  imports: [],
  templateUrl: './hero-search.html',
  styleUrl: './hero-search.css',
})
export class HeroSearch {
  readonly searchTerm = output<string>();

  /**
   * Emite el texto escrito en el buscador.
   * @param term Texto ingresado por el usuario.
   * @returns No retorna un valor.
   */
  onSearch(term: string): void {
    this.searchTerm.emit(term);
  }
}
