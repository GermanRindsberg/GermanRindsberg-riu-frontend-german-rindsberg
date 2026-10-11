import { Component, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/**
 * Buscador de superheroes por nombre.
 */
@Component({
  selector: 'app-hero-search',
  imports: [MatFormFieldModule, MatInputModule],
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
