import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { SuperHero } from '../../../../core/models/super-hero.model';
import { HeroSearch } from '../../components/hero-search/hero-search';
import { HeroTable } from '../../components/hero-table/hero-table';
import { HeroDialogData, SuperHeroForm } from '../super-hero-form/super-hero-form';
import { SuperHeroService } from '../../services/super-hero.service';

/**
 * Pagina para listar los superheroes, buscar, filtrar y eliminar.
 */
@Component({
  selector: 'app-super-hero-list',
  imports: [HeroSearch, HeroTable],
  templateUrl: './super-hero-list.html',
  styleUrl: './super-hero-list.css',
})
export class SuperHeroList implements OnInit {
  private readonly superHeroService = inject(SuperHeroService);
  private readonly dialog = inject(MatDialog);

  readonly heroes = signal<SuperHero[]>([]);

  private term = '';

  ngOnInit(): void {
    this.load('');
  }

  /**
   * Filtra el listado por nombre, editorial o poder.
   * @param term Texto ingresado en el buscador.
   * @returns No retorna un valor.
   */
  onSearch(term: string): void {
    this.term = term;
    this.load(term);
  }

  /**
   * Abre el formulario vacio para crear un superheroe.
   * @returns No retorna un valor.
   */
  onCreate(): void {
    this.openDialog({ creating: true });
  }

  /**
   * Abre el formulario para ver el superheroe elegido.
   * @param id Identificador del superheroe.
   * @returns No retorna un valor.
   */
  onEdit(id: number): void {
    const hero = this.heroes().find((item) => item.id === id);

    if (!hero) {
      return;
    }

    this.openDialog({ hero });
  }

  /**
   * Pide confirmacion y elimina el superheroe de la sesion.
   * @param id Identificador del superheroe.
   * @returns No retorna un valor.
   */
  onDelete(id: number): void {
    const hero = this.heroes().find((item) => item.id === id);

    Swal.fire({
      title: 'Eliminar superheroe',
      text: hero ? `Se va a eliminar a ${hero.name}.` : 'Se va a eliminar el superheroe.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.superHeroService.delete(id).subscribe(() => this.load(this.term));
    });
  }

  /**
   * Abre el dialogo y recarga el listado si se guardo algo.
   * @param data Heroe a ver, o la marca de creacion.
   * @returns No retorna un valor.
   */
  private openDialog(data: HeroDialogData): void {
    this.dialog
      .open(SuperHeroForm, {
        data,
        width: '760px',
        maxWidth: 'calc(100vw - 24px)',
        maxHeight: '92vh',
        autoFocus: false,
        disableClose: true,
        panelClass: 'hero-dialog',
      })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) {
          this.load(this.term);
        }
      });
  }

  /**
   * Pide al servicio los superheroes que coinciden con el texto.
   * @param term Texto a buscar.
   * @returns No retorna un valor.
   */
  private load(term: string): void {
    this.superHeroService.search(term).subscribe((heroes) => this.heroes.set(heroes));
  }
}
