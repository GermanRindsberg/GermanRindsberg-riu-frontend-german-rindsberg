import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Publisher, SuperHero } from '../../../../core/models/super-hero.model';
import { HeroTable } from './hero-table';

const heroes: SuperHero[] = [
  {
    id: 1,
    name: 'Spiderman',
    description: 'Trepa muros.',
    history: 'Mordido por una araña.',
    image: '',
    stats: { power: 'Telaraña', weakness: 'Su identidad' },
    publisher: Publisher.Marvel,
  },
  {
    id: 2,
    name: 'Batman',
    description: 'Vigila Gotham.',
    history: 'Perdio a sus padres.',
    image: '',
    stats: { power: 'Dinero', weakness: 'No tiene poderes' },
    publisher: Publisher.Dc,
  },
];

describe('HeroTable', () => {
  let component: HeroTable;
  let fixture: ComponentFixture<HeroTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroTable],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  /**
   * Prueba para verificar si el componente muestra los superheroes recibidos.
   */
  it('should show the heroes it receives', async () => {
    fixture.componentRef.setInput('heroes', heroes);
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent;

    expect(text).toContain('Spiderman');
    expect(text).toContain('Batman');
  });


  /**
   * Prueba para verificar si el componente emite el id del superheroe borrado.
   */
  it('should emit the id when delete is clicked', async () => {
    const deletedIds: number[] = [];
    component.deleteHero.subscribe((id) => deletedIds.push(id));

    fixture.componentRef.setInput('heroes', heroes);
    await fixture.whenStable();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    button?.click();

    expect(deletedIds).toEqual([1]);
  });
});
