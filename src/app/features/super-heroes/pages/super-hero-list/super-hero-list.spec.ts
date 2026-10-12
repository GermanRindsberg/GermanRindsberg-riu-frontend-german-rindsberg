import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

import { SuperHeroService } from '../../services/super-hero.service';
import { SuperHeroList } from './super-hero-list';

describe('SuperHeroList', () => {
  let component: SuperHeroList;
  let fixture: ComponentFixture<SuperHeroList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperHeroList],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperHeroList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  /**
   * Prueba para verificar si el componente muestra el buscador y la tabla.
   */
  it('should show the search and the table', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-hero-search')).toBeTruthy();
    expect(element.querySelector('app-hero-table')).toBeTruthy();
  });

  /**
   * Prueba para verificar si el buscador filtra la tabla.
   */
  it('should filter the table from the search', async () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'dc';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent;

    expect(text).toContain('BATMAN');
    expect(text).not.toContain('THOR');
  });

  /**
   * Prueba para verificar si el lapiz abre el dialogo del superheroe.
   */
  it('should open the selected hero in a dialog', async () => {
    const edit = fixture.nativeElement.querySelector('[aria-label="Editar"]') as HTMLButtonElement;
    edit.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.body.textContent).toContain('SPIDERMAN');
    expect(document.body.textContent).toContain('Sentido aracnido');

    TestBed.inject(MatDialog).closeAll();
  });

  /**
   * Prueba para verificar si cancelar la confirmacion no elimina al superheroe.
   */
  it('should keep the hero when the delete is cancelled', async () => {
    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: false } as Awaited<ReturnType<typeof Swal.fire>>);
    const service = TestBed.inject(SuperHeroService);
    const remove = vi.spyOn(service, 'delete');

    (fixture.nativeElement.querySelector('[aria-label="Borrar"]') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(remove).not.toHaveBeenCalled();
    expect((await firstValueFrom(service.getAll())).some((item) => item.name === 'SPIDERMAN')).toBe(true);
  });

  /**
   * Prueba para verificar si se puede crear, editar y borrar un superheroe en la sesion.
   */
  it('should create, edit and delete a hero during the session', async () => {
    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true } as Awaited<ReturnType<typeof Swal.fire>>);
    const notice = vi.spyOn(toast, 'success').mockImplementation(() => 1);
    const element = () => fixture.nativeElement as HTMLElement;

    (element().querySelector('.create') as HTMLButtonElement).click();
    fixture.detectChanges();

    const fields = document.querySelectorAll('app-super-hero-form form input');
    const name = fields[0] as HTMLInputElement;
    const power = fields[2] as HTMLInputElement;
    const publisher = document.querySelector('app-super-hero-form select') as HTMLSelectElement;
    name.value = 'Flash';
    name.dispatchEvent(new Event('input'));
    power.value = 'Velocidad';
    power.dispatchEvent(new Event('input'));
    publisher.value = 'DC';
    publisher.dispatchEvent(new Event('change'));
    (document.querySelector('app-super-hero-form .primary') as HTMLButtonElement).click();
    await new Promise((resolve) => setTimeout(resolve, 900));
    fixture.detectChanges();

    const service = TestBed.inject(SuperHeroService);
    expect((await firstValueFrom(service.getAll())).some((item) => item.name === 'FLASH')).toBe(true);
    expect(notice).toHaveBeenCalledWith('Superheroe creado.');

    const search = element().querySelector('input') as HTMLInputElement;
    search.value = 'flash';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    const row = element().querySelector('.mat-mdc-row, .hero-card') as HTMLElement;
    (row.querySelector('[aria-label="Editar"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    const editName = document.querySelector('app-super-hero-form form input') as HTMLInputElement;
    editName.value = 'Barry Allen';
    editName.dispatchEvent(new Event('input'));
    (document.querySelector('app-super-hero-form .primary') as HTMLButtonElement).click();
    await new Promise((resolve) => setTimeout(resolve, 900));
    fixture.detectChanges();

    expect((await firstValueFrom(service.getAll())).some((item) => item.name === 'BARRY ALLEN')).toBe(true);
    expect(notice).toHaveBeenCalledWith('Superheroe actualizado.');

    search.value = 'barry';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    const edited = element().querySelector('.mat-mdc-row, .hero-card') as HTMLElement;
    (edited.querySelector('[aria-label="Borrar"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, 900));
    expect((await firstValueFrom(service.getAll())).some((item) => item.name === 'BARRY ALLEN')).toBe(false);
    expect(notice).toHaveBeenCalledWith('Superheroe eliminado.');
  });
});
