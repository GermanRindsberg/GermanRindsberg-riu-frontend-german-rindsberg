import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Publisher, SuperHero } from '../../../../core/models/super-hero.model';
import { SuperHeroService } from '../../services/super-hero.service';
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
   * Prueba para verificar si la editorial se elige entre Marvel, DC y Otro.
   */
  it('should offer Marvel, DC and Otro as publishers', () => {
    fixture.detectChanges();
    const options = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('select option'),
    ).map((option) => option.textContent?.trim());

    expect(options).toEqual(['Seleccionar', 'Marvel', 'DC', 'Otro']);
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
  });

  /**
   * Prueba para verificar si el boton guarda y los campos se pueden editar.
   */
  it('should show Guardar and keep the fields editable', () => {
    fixture.componentRef.setInput('hero', hero);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const name = element.querySelector('form input') as HTMLInputElement;
    const button = element.querySelector('.primary') as HTMLButtonElement;

    expect(name.readOnly).toBe(false);
    expect(button.textContent).toContain('Guardar');
  });

  /**
   * Prueba para verificar si Guardar actualiza el superheroe de la sesion.
   */
  it('should save the edited hero for the session', async () => {
    fixture.componentRef.setInput('hero', hero);
    await fixture.whenStable();
    fixture.detectChanges();

    const service = TestBed.inject(SuperHeroService);
    const update = vi.spyOn(service, 'update').mockReturnValue(of({ ...hero, name: 'Peter Parker' }));
    const button = (fixture.nativeElement as HTMLElement).querySelector('.primary') as HTMLButtonElement;

    component.form.controls.name.setValue('Peter Parker');
    button.click();

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ id: 1, name: 'Peter Parker' }));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  /**
   * Prueba para verificar si no se guarda un superheroe sin nombre.
   */
  it('should not save when the name is empty', () => {
    const service = TestBed.inject(SuperHeroService);
    const create = vi.spyOn(service, 'create');

    fixture.detectChanges();
    component.save();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;

    expect(create).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(text).toContain('El nombre es obligatorio.');
    expect(text).toContain('El poder es obligatorio.');
    expect(text).toContain('La editorial es obligatoria.');
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

describe('SuperHeroForm opened to create', () => {
  let component: SuperHeroForm;
  let fixture: ComponentFixture<SuperHeroForm>;
  const dialogRef = { close: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperHeroForm],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { creating: true } },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperHeroForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Prueba para verificar si el alta arranca editable y persiste el heroe nuevo.
   */
  it('should create the hero with the selected publisher', () => {
    const service = TestBed.inject(SuperHeroService);
    const create = vi.spyOn(service, 'create').mockReturnValue(
      of({
        id: 50,
        name: 'Nova',
        description: '',
        history: '',
        image: '',
        stats: { power: '', weakness: '' },
        publisher: Publisher.Dc,
      }),
    );
    const button = (fixture.nativeElement as HTMLElement).querySelector('.primary') as HTMLButtonElement;

    expect(button.textContent).toContain('Guardar');

    component.form.controls.name.setValue('Nova');
    component.form.controls.power.setValue('Energia');
    component.form.controls.publisher.setValue(Publisher.Dc);
    button.click();

    expect(create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Nova', publisher: Publisher.Dc }));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
