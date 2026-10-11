import { Directive } from '@angular/core';

/**
 * Directiva para convertir el texto a mayusculas cuando se use en un input.
 */

@Directive({
  selector: '[appUppercase]',
})
export class Uppercase {}
