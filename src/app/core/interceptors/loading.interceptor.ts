import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize } from 'rxjs';

/**
 * Estado del indicador de carga, compartido por el interceptor y el servicio.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly pending = signal(0);

  readonly active = this.pending.asReadonly();

  /**
   * Marca que empezo una operacion.
   * @returns No retorna un valor.
   */
  show(): void {
    this.pending.update((count) => count + 1);
  }

  /**
   * Marca que termino una operacion.
   * @returns No retorna un valor.
   */
  hide(): void {
    this.pending.update((count) => Math.max(0, count - 1));
  }
}

/**
 * Muestra el loading mientras hay una peticion HTTP en curso.
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly loading = inject(LoadingService);

  /**
   * Enciende el loading al salir la peticion y lo apaga al terminar.
   * @param request Peticion saliente.
   * @param next Siguiente manejador de la cadena.
   * @returns La peticion, con el loading asociado.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loading.show();

    return next.handle(request).pipe(finalize(() => this.loading.hide()));
  }
}
