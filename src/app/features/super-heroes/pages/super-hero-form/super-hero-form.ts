import { Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Publisher, SuperHero } from '../../../../core/models/super-hero.model';

/**
 * Dialogo para ver un superheroe.
 */
@Component({
  selector: 'app-super-hero-form',
  imports: [ReactiveFormsModule, MatTooltipModule],
  templateUrl: './super-hero-form.html',
  styleUrl: './super-hero-form.css',
})
export class SuperHeroForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogHero = inject<SuperHero | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly dialogRef = inject(MatDialogRef<SuperHeroForm>, { optional: true });

  readonly hero = input<SuperHero>();
  readonly editing = signal(false);

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    history: [''],
    image: [''],
    power: [''],
    weakness: [''],
    publisher: [Publisher.Marvel],
  });

  constructor() {
    if (this.dialogHero) {
      this.fill(this.dialogHero);
    }

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
   * Habilita la edicion del formulario.
   * @returns No retorna un valor.
   */
  edit(): void {
    this.editing.set(true);
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
      this.editing.set(true);
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
  publisherClass(publisher: Publisher): string {
    if (publisher === Publisher.Marvel) {
      return 'badge badge-marvel';
    }

    if (publisher === Publisher.Dc) {
      return 'badge badge-dc';
    }

    return 'badge badge-other';
  }

  /**
   * Completa el formulario con los datos del superheroe.
   * @param hero Superheroe seleccionado.
   * @returns No retorna un valor.
   */
  private fill(hero: SuperHero): void {
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
