import { Component } from '@angular/core';

import { HeroSearch } from '../../components/hero-search/hero-search';
import { HeroTable } from '../../components/hero-table/hero-table';

/**
 * Pagina para listar los superheroes, buscar, filtrar y eliminar.
 */
@Component({
  selector: 'app-super-hero-list',
  imports: [HeroSearch, HeroTable],
  templateUrl: './super-hero-list.html',
  styleUrl: './super-hero-list.css',
})
export class SuperHeroList {}
