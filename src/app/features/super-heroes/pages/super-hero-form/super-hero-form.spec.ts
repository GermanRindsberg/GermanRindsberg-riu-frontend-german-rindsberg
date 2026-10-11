import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperHeroForm } from './super-hero-form';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
