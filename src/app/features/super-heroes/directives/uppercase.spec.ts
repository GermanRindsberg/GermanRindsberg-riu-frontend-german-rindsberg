import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Uppercase } from './uppercase';

/**
 * Host para probar la directiva sobre un input real.
 */
@Component({
  imports: [ReactiveFormsModule, Uppercase],
  template: `<input appUppercase [formControl]="name" />`,
})
class UppercaseHost {
  readonly name = new FormControl('');
}

describe('Uppercase', () => {
  let fixture: ComponentFixture<UppercaseHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UppercaseHost],
    }).compileComponents();

    fixture = TestBed.createComponent(UppercaseHost);
    fixture.detectChanges();
  });

  /**
   * Prueba para verificar si el nombre escrito pasa a mayusculas.
   */
  it('should uppercase the typed name', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = 'flash';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('FLASH');
    expect(fixture.componentInstance.name.value).toBe('FLASH');
  });
});
