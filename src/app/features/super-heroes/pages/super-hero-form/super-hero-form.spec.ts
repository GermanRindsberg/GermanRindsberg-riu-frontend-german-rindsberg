import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  const dialogRef = { close: vi.fn() };

  beforeEach(async () => {
    dialogRef.close.mockClear();

    await TestBed.configureTestingModule({
      imports: [SuperHeroForm],
      providers: [{ provide: MatDialogRef, useValue: dialogRef }],
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
    expect(component.form.controls.description.value).toBe('Trepa muros.');
    expect(component.form.controls.history.value).toBe('Mordido por una araña.');
    expect(component.form.controls.power.value).toBe('Telaraña');
    expect(component.form.controls.weakness.value).toBe('Su identidad');
    expect(component.form.controls.publisher.value).toBe(Publisher.Marvel);

    fixture.detectChanges();
    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('images/spiderman.png');
    expect(fixture.nativeElement.querySelector('.badge-marvel')).toBeTruthy();
  });

  /**
   * Prueba para verificar si sin imagen se muestra la imagen por defecto.
   */
  it('should show the default image when the hero has none', () => {
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(image.getAttribute('src')).toBe('images/default.png');
  });

  /**
   * Prueba para verificar si Cancelar y la X cierran el dialogo.
   */
  it('should close the dialog from Cancelar and the X', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const cancel = Array.from(element.querySelectorAll('button')).find((item) =>
      item.textContent?.includes('Cancelar'),
    ) as HTMLButtonElement;

    cancel.click();
    (element.querySelector('.close') as HTMLButtonElement).click();

    expect(dialogRef.close).toHaveBeenCalledTimes(2);
  });

  /**
   * Prueba para verificar si la imagen muestra el texto de ayuda.
   */
  it('should show a tooltip to change the image', () => {
    fixture.detectChanges();
    const portrait = fixture.nativeElement.querySelector('.portrait') as HTMLButtonElement;

    expect(portrait.getAttribute('mattooltip')).toBe('Click para cambiar imagen');
  });

  /**
   * Prueba para verificar si al hacer click en la imagen se abre el selector.
   */
  it('should open the file selector when the image is clicked', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    const open = vi.spyOn(input, 'click').mockImplementation(() => undefined);

    (fixture.nativeElement.querySelector('.portrait') as HTMLButtonElement).click();

    expect(open).toHaveBeenCalled();
  });

  /**
   * Prueba para verificar si no cambia nada cuando no se elige un archivo.
   */
  it('should keep the image when no file is selected', () => {
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [] });

    component.onImageSelected({ target: input } as unknown as Event);

    expect(component.form.controls.image.value).toBe('');
    expect(component.editing()).toBe(false);
  });

  /**
   * Prueba para verificar si Editar habilita los campos y el boton pasa a Guardar.
   */
  it('should enable the fields and show Guardar', () => {
    fixture.componentRef.setInput('hero', hero);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const name = element.querySelector('form input') as HTMLInputElement;
    const button = Array.from(element.querySelectorAll('button')).find((item) =>
      item.textContent?.includes('Editar'),
    ) as HTMLButtonElement;

    expect(name.readOnly).toBe(true);

    button.click();
    fixture.detectChanges();

    expect(name.readOnly).toBe(false);
    expect(button.textContent).toContain('Guardar');
  });

  /**
   * Prueba para verificar si al elegir un archivo se actualiza la imagen.
   */
  it('should preview the selected image', () => {
    const reader = {
      result: 'data:image/png;base64,aaa',
      onload: null as (() => void) | null,
      readAsDataURL() {
        this.onload?.();
      },
    };
    vi.spyOn(window, 'FileReader').mockImplementation(function () {
      return reader;
    } as unknown as () => FileReader);

    const input = document.createElement('input');
    const file = new File(['img'], 'hero.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', { value: [file] });

    component.onImageSelected({ target: input } as unknown as Event);

    expect(component.form.controls.image.value).toBe('data:image/png;base64,aaa');
    expect(component.editing()).toBe(true);
    vi.restoreAllMocks();
  });
});

describe('SuperHeroForm opened with a hero', () => {
  let component: SuperHeroForm;
  let fixture: ComponentFixture<SuperHeroForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperHeroForm],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: hero },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperHeroForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Prueba para verificar si el dialogo muestra el superheroe recibido.
   */
  it('should show the hero received by the dialog', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent;

    expect(component.form.controls.name.value).toBe('Spiderman');
    expect(component.form.controls.power.value).toBe('Telaraña');
    expect(text).toContain('Spiderman');
    expect(text).toContain('Marvel');
  });
});
