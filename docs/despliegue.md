# Despliegue: lo que hay que configurar a mano

## Límite de intentos del login (regla del Firewall de Vercel)

`POST /api/users` es el login y no limita intentos. Un límite dentro de Express (`express-rate-limit`) no sirve en Vercel: cada petición puede caer en una instancia distinta y el contador en memoria no se comparte. Se limita antes de que la petición llegue a la función, con una regla del Firewall.

1. En Vercel, abre el proyecto **backend** y entra en **Firewall → Custom Rules → New Rule**.
2. Condición: **Request Path** *equals* `/api/users` **y** **Method** *equals* `POST`.
3. Acción: **Rate Limit**, ventana fija de 1 minuto, **5 peticiones** por **IP**. Al superarlo, **Deny** (429) durante 1 minuto.
4. Publica la regla (**Review Changes → Publish**).
5. Comprobación: enviar 6 `POST /api/users` seguidos con una contraseña mala; el sexto debe responder 429 sin llegar a la función.

Mientras no exista la regla, no hay protección contra fuerza bruta en producción.

Además, en producción el admin no debe usar el hash del seed: el correo y el hash de `db/generate_seed.js` están en el repositorio. Crea el admin con un hash nuevo (`npm run hash -- <contraseña larga>`) y no cargues el usuario del seed.

## La demo y la base de datos de producción

La base de datos de producción del portfolio contiene **solo datos inventados** (el seed y las filas que genera cada día `/api/internal/daily-demo-update`). No hay ventas, clientes ni gastos reales.

La demo y el admin comparten base de datos y firma de token (`JWT_SECRET`). Eso es aceptable mientras los datos sean ficticios. Si algún día se cargan datos reales, hay que separarlos antes: otra base de datos, o un `JWT_SECRET` distinto para el token de la demo.

El modo demo solo se activa con `DEMO_MODE=true` (el texto exacto). Ponlo únicamente en el entorno de Vercel que deba tenerlo; el `.env` local de desarrollo lo trae a `true` y no se copia a ciegas a producción. El token de la demo caduca a las 12 horas y el servidor rechaza con él cualquier petición que no sea GET, HEAD u OPTIONS.