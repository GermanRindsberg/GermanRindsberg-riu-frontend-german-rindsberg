import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

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

    expect(text).toContain('Batman');
    expect(text).not.toContain('Thor');
  });

  /**
   * Prueba para verificar si el lapiz abre el dialogo del superheroe.
   */
  it('should open the selected hero in a dialog', async () => {
    const edit = fixture.nativeElement.querySelector('[aria-label="Editar"]') as HTMLButtonElement;
    edit.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.body.textContent).toContain('Spiderman');
    expect(document.body.textContent).toContain('Sentido aracnido');

    TestBed.inject(MatDialog).closeAll();
  });
});
