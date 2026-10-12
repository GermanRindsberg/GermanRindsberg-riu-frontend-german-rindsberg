# MINDATA Frontend Challenge

SPA en Angular 22 para la gestion de superheroes (CRUD). No hay backend: los datos viven en memoria dentro del servicio y se mantienen mientras dura la sesion. Al recargar la pagina vuelven al listado inicial.

## Que hace

- Lista paginada de superheroes, con orden por columnas.
- En pantallas chicas la tabla se reemplaza por tarjetas, con el mismo paginador.
- Buscador por nombre, editorial o poder. No distingue mayusculas y minusculas.
- Alta, edicion y baja. La baja pide confirmacion antes de borrar utilizando sweetalert2.
- El formulario es un mat-dialog. Nombre, poder y editorial son obligatorios, manejando esos errores de forma dinamica.
- Si un heroe no tiene imagen, se muestra `public/images/default.png`. La imagen se puede cambiar desde el dialogo.

## Particularidades

El nombre se escribe siempre en mayusculas. La directiva `appUppercase` (`src/app/features/super-heroes/directives/uppercase.ts`) escucha el input del nombre, pasa el texto a mayusculas y conserva la posicion del cursor.

Alta, edicion y baja pasan por `withLoading` en el servicio. Muestra el spinner, espera un tiempo simulado con `delay` de RxJS y lo oculta al terminar. El alta y la edicion esperan 800 ms. La baja espera 400 ms. El interceptor de loading hace lo mismo para peticiones HTTP; como no hay backend, el servicio llama al `LoadingService` directo. El spinner se dibuja sobre el dialogo con la API `popover` del navegador, porque el dialogo de Material queda en una capa que tapa un overlay comun.

La editorial se guarda como `Marvel`, `DC` u `Other`. En la pantalla, `Other` se muestra como Otro.

Cada heroe que sale del servicio es una copia. Si la pantalla modifica el objeto, el listado guardado no cambia hasta que se confirma el guardado.

La busqueda de la lista usa `search`, que mira nombre, editorial y poder. El servicio tambien expone `searchByName`, que filtra solo por nombre.

## Dependencias

- Angular 22, con componentes standalone, signals y formularios reactivos.
- Angular Material para la tabla, el paginador, el dialogo y el tooltip.
- Bootstrap 5 para la base de estilos.
- Font Awesome para los iconos de editar, borrar y cerrar.
- SweetAlert2 para confirmar el borrado.
- ngx-sonner muestra un aviso al crear, editar o eliminar un superheroe.
- RxJS para devolver los datos del servicio como observables.

Los tests corren con Vitest, que es el runner de `ng test`.

## Como ejecutarlo

```bash
npm install
npm start
```

La aplicacion queda en `http://localhost:4200/`.

Tests:

```bash
npx ng test --watch=false
```

Cobertura:

```bash
npx ng test --watch=false --coverage
```

## Docker

Hace falta Docker Desktop. En la raiz del proyecto:

```bash
docker build -t riu-frontend .
docker run -p 8080:80 riu-frontend
```

La primera orden compila la aplicacion dentro de una imagen de Node y deja solo los archivos estaticos en una imagen de nginx. La segunda publica esa imagen en `http://localhost:8080/`.
