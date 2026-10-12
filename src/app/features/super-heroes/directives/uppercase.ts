import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Convierte a mayusculas el texto de un input mientras se escribe.
 */
@Directive({
  selector: '[appUppercase]',
})
export class Uppercase {
  private readonly element = inject(ElementRef<HTMLInputElement>);
  private readonly control = inject(NgControl, { optional: true, self: true });

  /**
   * Pasa a mayusculas el valor del input y del control asociado.
   * @returns No retorna un valor.
   */
  @HostListener('input')
  onInput(): void {
    const input = this.element.nativeElement;
    const uppercased = input.value.toUpperCase();

    if (input.value === uppercased) {
      return;
    }

    const position = input.selectionStart;
    this.control?.control?.setValue(uppercased);
    input.setSelectionRange(position, position);
  }
}
