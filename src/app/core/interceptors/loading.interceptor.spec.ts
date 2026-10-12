import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LoadingInterceptor, LoadingService } from './loading.interceptor';

describe('LoadingInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  let loading: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
      ],
    });

    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
    loading = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    http.verify();
  });

  /**
   * Prueba para verificar si el loading se enciende durante la peticion y se apaga al terminar.
   */
  it('should show the loading while the request is in progress', () => {
    client.get('/heroes').subscribe();

    expect(loading.active()).toBe(1);

    http.expectOne('/heroes').flush([]);

    expect(loading.active()).toBe(0);
  });
});
