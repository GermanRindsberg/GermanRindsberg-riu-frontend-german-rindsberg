import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Publisher, SuperHero } from '../../../../core/models/super-hero.model';
import { SuperHeroForm } from './super-hero-form';

/**
 * Superheroe de prueba.
 */
const hero: SuperHero = {
  id: 1,
  name: 'Spiderman',
  description: 'Trepa muros.',
  history: 'Mordido por una araña.',
  image: 'images/spiderman.png',
  stats: { power: 'Telaraña', weakness: 'Su identidad' },
  publisher: Publisher.Marvel,
};

describe('SuperHeroForm', () => {
  let component: SuperHeroForm;
  let fixture: ComponentFixture<SuperHeroForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperHeroForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperHeroForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  /**
   * Prueba para verificar si el componente se crea correctamente.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when the name is empty', () => {
    expect(component.form.controls.name.valid).toBe(false);
    expect(component.form.invalid).toBe(true);
  });

  /**
   * Prueba para verificar si el componente completa el formulario cuando se recibe un superheroe.
   */
  it('should fill the form when a hero is received', async () => {
    fixture.componentRef.setInput('hero', hero);
    await fixture.whenStable();

    expect(component.form.controls.name.value).toBe('Spiderman');
    expect(component.form.controls.power.value).toBe('Telaraña');
    expect(component.form.controls.publisher.value).toBe(Publisher.Marvel);
  });
});
