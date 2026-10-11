import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperHeroList } from './super-hero-list';

describe('SuperHeroList', () => {
  let component: SuperHeroList;
  let fixture: ComponentFixture<SuperHeroList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperHeroList],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperHeroList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
