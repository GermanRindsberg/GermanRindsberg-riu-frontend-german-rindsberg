import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroTable } from './hero-table';

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
});
