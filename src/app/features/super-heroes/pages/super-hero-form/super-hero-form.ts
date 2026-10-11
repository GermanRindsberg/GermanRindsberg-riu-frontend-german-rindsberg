import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Publisher, SuperHero } from '../../../../core/models/super-hero.model';

/**
 * Pagina para crear/editar un superheroe.
 */
@Component({
  selector: 'app-super-hero-form',
  imports: [ReactiveFormsModule],
  templateUrl: './super-hero-form.html',
  styleUrl: './super-hero-form.css',
})
export class SuperHeroForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly hero = input<SuperHero>();

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
    effect(() => {
      const hero = this.hero();

      if (!hero) {
        return;
      }

      this.form.patchValue({
        name: hero.name,
        description: hero.description,
        history: hero.history,
        image: hero.image,
        power: hero.stats.power,
        weakness: hero.stats.weakness,
        publisher: hero.publisher,
      });
    });
  }
}
