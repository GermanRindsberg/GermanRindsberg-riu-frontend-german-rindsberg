import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSearch } from './hero-search';

describe('HeroSearch', () => {
  let component: HeroSearch;
  let fixture: ComponentFixture<HeroSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  /**
   * Prueba para verificar si el componente emite el texto ingresado en el buscador.
   */
  it('should emit the text typed in the search', () => {
    const terms: string[] = [];
    component.searchTerm.subscribe((term) => terms.push(term));

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'man';
    input.dispatchEvent(new Event('input'));

    expect(terms).toEqual(['man']);
  });

  /**
   * Prueba para verificar si al borrar el texto el buscador emite un string vacio.
   */
  it('should emit an empty string when the search is cleared', () => {
    const terms: string[] = [];
    component.searchTerm.subscribe((term) => terms.push(term));

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'man';
    input.dispatchEvent(new Event('input'));
    input.value = '';
    input.dispatchEvent(new Event('input'));

    expect(terms).toEqual(['man', '']);
  });
});
