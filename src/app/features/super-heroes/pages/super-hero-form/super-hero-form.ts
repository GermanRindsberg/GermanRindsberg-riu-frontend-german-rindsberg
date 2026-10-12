import { Component, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Uppercase } from '../../directives/uppercase';
import { Publisher, SuperHero, publisherLabel } from '../../../../core/models/super-hero.model';
import { SuperHeroService } from '../../services/super-hero.service';

/**
 * Datos del dialogo. Sin heroe, el formulario se abre para crear.
 */
export interface HeroDialogData {
  creating?: boolean;
  hero?: SuperHero;
}

/**
 * Dialogo para ver un superheroe.
 */
@Component({
  selector: 'app-super-hero-form',
  imports: [ReactiveFormsModule, MatTooltipModule, Uppercase],
  templateUrl: './super-hero-form.html',
  styleUrl: './super-hero-form.css',
})
export class SuperHeroForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly superHeroService = inject(SuperHeroService);
  private readonly dialogData = inject<HeroDialogData | SuperHero | null>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private readonly dialogRef = inject(MatDialogRef<SuperHeroForm>, { optional: true });

  readonly hero = input<SuperHero>();
  readonly publisherLabel = publisherLabel;

  readonly publishers = [
    { value: Publisher.Marvel, label: 'Marvel' },
    { value: Publisher.Dc, label: 'DC' },
    { value: Publisher.Other, label: 'Otro' },
  ];

  private heroId: number | null = null;

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    history: [''],
    image: [''],
    power: ['', Validators.required],
    weakness: [''],
    publisher: ['', Validators.required],
  });

  constructor() {
    this.applyDialogData(this.dialogData);

    effect(() => {
      const hero = this.hero();

      if (!hero) {
        return;
      }

      this.fill(hero);
    });
  }

  /**
   * Cierra el dialogo.
   * @returns No retorna un valor.
   */
  close(): void {
    this.dialogRef?.close();
  }

  /**
   * Indica si hay que mostrar el error de un campo obligatorio.
   * @param name Nombre del campo.
   * @returns True cuando el campo es invalido y el usuario ya interactuo.
   */
  showError(name: 'name' | 'power' | 'publisher'): boolean {
    const control = this.form.controls[name];

    return control.invalid && control.touched;
  }

  /**
   * Guarda el superheroe en la sesion.
   * @returns No retorna un valor.
   */
  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const hero = {
      name: value.name,
      description: value.description,
      history: value.history,
      image: value.image,
      publisher: value.publisher as Publisher,
      stats: { power: value.power, weakness: value.weakness },
    };
    const request = this.heroId
      ? this.superHeroService.update({ ...hero, id: this.heroId })
      : this.superHeroService.create(hero);

    request.subscribe((saved) => {
      if (saved) {
        this.dialogRef?.close(true);
      }
    });
  }

  /**
   * Abre el selector para cambiar la imagen.
   * @returns No retorna un valor.
   */
  pickImage(): void {
    this.fileInput()?.nativeElement.click();
  }

  /**
   * Carga la imagen elegida y habilita la edicion.
   * @param event Evento del input de archivo.
   * @returns No retorna un valor.
   */
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.form.controls.image.setValue(String(reader.result));
    };

    reader.readAsDataURL(file);
  }

  /**
   * Devuelve la imagen del formulario, o la imagen por defecto.
   * @returns Ruta de la imagen.
   */
  imageOf(): string {
    return this.form.controls.image.value || 'images/default.png';
  }

  /**
   * Devuelve la clase de la etiqueta segun la editorial.
   * @param publisher Editorial del superheroe.
   * @returns Clase CSS de la etiqueta.
   */
  publisherClass(publisher: string): string {
    if (publisher === Publisher.Marvel) {
      return 'badge badge-marvel';
    }

    if (publisher === Publisher.Dc) {
      return 'badge badge-dc';
    }

    return 'badge badge-other';
  }

  /**
   * Prepara el formulario segun los datos del dialogo.
   * @param data Heroe a ver, o la marca de creacion.
   * @returns No retorna un valor.
   */
  private applyDialogData(data: HeroDialogData | SuperHero | null): void {
    if (!data) {
      return;
    }

    if ('creating' in data && data.creating) {
      return;
    }

    const hero = 'hero' in data && data.hero ? data.hero : (data as SuperHero);
    this.fill(hero);
  }

  private fill(hero: SuperHero): void {
    this.heroId = hero.id;
    this.form.patchValue({
      name: hero.name,
      description: hero.description,
      history: hero.history,
      image: hero.image,
      power: hero.stats.power,
      weakness: hero.stats.weakness,
      publisher: hero.publisher,
    });
  }
}
