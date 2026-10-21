# Rediseño de la pantalla Campañas y temporadas

Rehaz la pantalla **Campañas y temporadas** (`/planificacion/:tab`, `pages/Planning.jsx`) para que quede **igual**
que los diseños del prototipo:

- Escritorio (artboard de 1440 px): `docs/diseno/campanasYTemporadas.png`
- Móvil (artboard de 390 px): `docs/diseno/campanasYTemporadas-m.png`

Abre las dos imágenes antes de empezar y vuelve a ellas cada vez que dudes. **Las imágenes mandan.** Las medidas
de este documento son aproximadas, sacadas a ojo del artboard: si alguna no cuadra con la imagen, gana la imagen.
Mide sobre ella; no te la inventes.

Después de esto yo te iré pidiendo cambios. En esta tarea solo hay que copiar el diseño tal cual.

---

## 1. Reglas (obligatorias)

1. **Lee `CLAUDE.md` y `DESIGN.md` antes de tocar nada** y síguelos. Sobre todo la regla de oro: ningún color,
   tamaño de letra, radio ni sombra a mano. Siempre un token `--rm-*`. Si falta uno, lo añades a `:root` en
   `App.css` y luego lo usas.
2. **Copia, no reinterpretes.** No añadas elementos que no estén en la imagen ni quites los que sí están, y no
   "mejores" el diseño por tu cuenta. Si algo te parece un error del diseño, me lo dices y esperas.
3. **Lo que la imagen no cubre** (carga, error, lista vacía, diálogos de crear/editar/eliminar, teclado, foco) lo
   resuelves con los patrones que ya existen en DESIGN.md (`.panel-skeleton`, `CardError`, `.sales-state`, anillo
   `--rm-orange-focus`…). Explícame qué has decidido.
4. **Textos en español, exactos** a los de la imagen: «Empieza en 101 días», «En curso · quedan 14 días», «de
   beneficio en 2026», «7 campañas», «Última:». Usa la flecha «→» en el rango del tipo y la raya «–» en el de la
   edición. Cifras siempre desde `utils/format.js`.
5. **Un solo corte, en 992 px** (`useIsMobile`): por debajo, diseño de móvil; desde ahí, el de escritorio. Entre
   992 y 1199 px, el de escritorio reflujado, sin scroll horizontal en la página. Si la tabla no cabe, se desplaza
   dentro de su tarjeta, como `.sales-scroll`.
6. **Lógica con TDD** (vitest): agrupar las ediciones por tipo, ordenar, calcular el estado («Empieza en» / «En
   curso»), la «Última vez», el recuento y el texto del año («2025-26») van en funciones puras con tests
   (`utils/planning.js` + `utils/planning.test.js`). El componente solo pinta.
7. **No toques otras pantallas** ni componentes compartidos sin avisar. `Table.jsx`, `Filters.jsx` y
   `ModalComponent.jsx` puede que los use alguien más: compruébalo antes de cambiarlos o borrarlos, y dímelo.
8. **Cambios en endpoints o SQL**, si hicieran falta, pasan `/security-review` antes del commit. En principio
   **no hacen falta** (ver punto 2).
9. **Comprueba en el navegador** (Chrome DevTools MCP) a 1440 px y a 390 px, comparando con la imagen al lado.
   Comprueba también a 375 px y a ~1100 px. La consola no puede tener errores.
10. **Actualiza `DESIGN.md`** en el mismo cambio con una entrada «Campañas y temporadas» en Componentes, con el
    mismo nivel de detalle que Ventas, Clientes o Comparativa: clases, medidas, tokens y comportamiento.
11. **Accesibilidad:** la fila que se despliega es un `<button>` con `aria-expanded` y `aria-controls`. Los
    botones de icono llevan `aria-label` («Editar Rebajas de invierno», «Eliminar Rebajas de invierno»,
    «Editar Rebajas de invierno 2026»). Las pestañas son un `tablist` real. Foco visible, y objetivos táctiles de
    al menos 44 px en móvil. El balance lleva signo (+/−), no solo color.
12. **Commits pequeños**, en inglés y con el estilo del historial (`rebuild the campaigns list from the design`).
    Explica cada decisión: tengo que entenderla y poder defenderla.

---

## 2. Qué hay ahora y de dónde salen los datos

- `pages/Planning.jsx`: **cuatro** pestañas (Campañas, Temporadas, Tipos de campaña, Tipos de temporada), cada una
  con `Filters` + `Table` genéricos y el diálogo `ModalComponent`.
- **API (no hay que cambiarla):**
  - `GET /api/campaign_types` y `GET /api/season_types` → los **tipos** (`period_types`): `id`, `name`,
    `start_day`, `start_month`, `end_day`, `end_month`, `first_year`, `repeats` y `editions` (el recuento).
  - `GET /api/campaigns` y `GET /api/seasons` → las **ediciones** (`periods`): `id`, `period_type_id`, `name`
    («Rebajas de invierno 2026»), `type_name`, `start_date`, `end_date`, `expenses`, `profits` (beneficio de
    las ventas dentro de las fechas) y `balance` (= `profits − expenses`).
  - `POST /api/campaign_types/sync` (y el de temporadas) → crea las ediciones que falten. Es lo que hace
    **«Generar años pendientes»**.
  - El CRUD de tipos y ediciones ya existe (`POST`, `PUT /:id` y `DELETE /:id`).
- Con esas dos llamadas por pestaña, el navegador agrupa las ediciones bajo su tipo (`period_type_id`). No hace
  falta un endpoint nuevo.

**Cambio de estructura que pide el diseño:** pasa de cuatro pestañas a **dos** (Campañas y Temporadas). Cada fila
es un **tipo**, y al desplegarla salen sus **ediciones**. Las pestañas «Tipos de…» desaparecen. Que las rutas
viejas (`/planificacion/tipos-campanas`, `/planificacion/tipos-temporadas`, `/tipos-campañas`, `/tipos-temporadas`)
redirijan a la pestaña nueva que les corresponde.

---

## 3. Reglas de los datos (sacadas del diseño, confírmalas conmigo)

En el diseño, «hoy» es el 28 de septiembre de 2026. En la app, usa la fecha real.

- **Orden de las filas:** por fecha de inicio dentro del año (mes y día de inicio del tipo): Rebajas de invierno
  (7 ene), San Valentín (1 feb), Comuniones (15 abr), Día de la Madre (20 abr), Rebajas de verano (1 jul),
  Presentación Otoño-Invierno (15 sep), Black Friday (27 nov) y Navidad y Reyes (5 dic).
- **Nombre y rango del tipo:** «7 ene → 28 feb» (día y mes corto, sin año, con «→»).
- **Estado** (pastilla):
  - Si hay una edición en curso (hoy entre su inicio y su fin): «En curso · quedan N días».
  - Si no, la próxima edición que empieza: «Empieza en N días». Si es mañana, «Empieza mañana»; si es hoy,
    «Empieza hoy».
  - Si no tiene próxima edición (por ejemplo, un tipo que no se repite y ya pasó): «Terminada». No está en el
    diseño, así que propónmelo.
  - Los días cuentan desde hoy, sin horas (`differenceInCalendarDays`). Rebajas de invierno 2027 empieza el 7 de
    enero, y desde el 28 de septiembre son 101 días. Si esa edición todavía no existe en la base de datos, el
    estado se calcula con las fechas del tipo (mira `utils/dates.js` del backend: `buildPeriodInserts`), no
    con las ediciones guardadas.
- **«Última vez»:** el **beneficio** (`profits`, no el balance) de la **última edición ya terminada**,
  redondeado y con signo («+6.215 €», `formatEurosRound`, en `--rm-positive` y 600). Debajo, «de beneficio en
  2026». El año es el de la edición, y si cruza de año, «2025-26» (Navidad y Reyes). La edición en curso no
  cuenta: en Presentación Otoño-Invierno pone 2025. Si no hay ninguna terminada: «—» y «sin ediciones
  terminadas». Esto último no está en el diseño, propónmelo.
- **Ediciones:** «7 campañas» o «2 temporadas», con singular si es 1. Cuenta **todas** las ediciones guardadas,
  también las futuras.
- **Ediciones desplegadas:** de la más reciente a la más antigua. Nombre «Rebajas de invierno 2026», fechas «7 ene
  – 28 feb 2026», Gastos y Beneficio con dos decimales («380,00 €», «6.215,00 €») y Balance con signo y color
  («+5.835,00 €» en `--rm-positive`, o en `--rm-negative` con «−»).
- **Recuento de las pestañas:** número de **tipos** (Campañas 8 · Temporadas 2).
- **Ojo:** en la base de datos hay **9** tipos de campaña. El noveno es «50 aniversario», que no se repite
  (`repeats = 0`), y el diseño enseña 8. Pregúntame si los que no se repiten salen en la lista igual o aparte.

---

## 4. Escritorio (≥ 992 px), según `campanasYTemporadas.png`

### 4.1 Encabezado

- `.panel-kicker` «Planificación del año» y, debajo, `.panel-title` «Campañas y temporadas».

### 4.2 Pestañas (subrayado, no segmentado)

- «Campañas» y «Temporadas», cada una con su recuento en una pastilla pequeña («8», «2»).
- Activa: texto `ink`, 600, con una raya naranja de 2 px debajo (`--rm-orange`) y la pastilla en
  `--rm-orange-tint` / `--rm-orange-ink`.
- Inactiva: texto `ink-2`, 500, con la pastilla en un gris cálido (`--rm-segs-bg` o `--rm-tint`, según la imagen).
- Toda la fila lleva una línea `--rm-line` a lo ancho por debajo, y la raya activa queda encima de esa línea.
- Unos 32 px entre pestañas. Cambiar de pestaña cambia la URL (`/planificacion/campanas`, `/planificacion/temporadas`).

### 4.3 Tarjeta

Es una sola tarjeta blanca (radio `lg`, `--rm-shadow`, sin padding general) con:

**Barra superior** (padding de unos 20 × 24 px):
- A la izquierda, el texto de introducción en `text-md` e `ink-2`, con un ancho máximo de unos 520 px (en la
  imagen ocupa dos líneas):
  - Campañas: «Cada campaña se repite todos los años. Despliega una para ver sus ediciones y apuntar lo que
    gastaste y lo que ganó.»
  - Temporadas: no está en el diseño. Propón el equivalente («Cada temporada se repite todos los años…»).
- A la derecha, a 10 px uno de otro:
  - «Generar años pendientes»: botón blanco (`.panel-btn`, unos 42 px, borde `--rm-line`) con
    `bi-arrow-clockwise`. Llama al `sync` del tipo y recarga.
  - «Nueva campaña» / «Nueva temporada»: `.btn-brand` compacto (unos 42 px, radio `--rm-radius-btn`, `text-md`,
    600) con `bi-plus-lg`. Crea un **tipo**.

**Cabecera de la tabla:** fondo `--rm-cream-light`, unos 44 px de alto y `text-xs-plus`, 600 e `ink-2`, sin
mayúsculas y sin botones de orden, como en Ventas y Clientes. Columnas: (hueco de la flecha) · Nombre · Estado ·
Última vez · Ediciones · Acciones. «Acciones» va alineada a la derecha. Mide en la imagen el ancho de cada
columna y hazlo con una rejilla CSS, como `.sales-row`.

**Fila de tipo** (unos 69 px, borde superior `--rm-line-soft` y padding lateral de 24 px):
- Flecha `bi-chevron-right` en `ink-2`. Desplegada, `bi-chevron-down` en `--rm-orange`. Respeta
  `prefers-reduced-motion` si la animas.
- Nombre en `text-md-plus`/`lg` y 500/600, en `ink`, y debajo el rango («7 ene → 28 feb») en `text-sm` e `ink-2`.
- Estado:
  - «Empieza en…»: pastilla de unos 24 px, fondo `--rm-tint`, texto `--rm-nav`/`ink-2`, `text-xs-plus` y 500/600.
  - «En curso…»: la pastilla `.campaign-pill` de Inicio (`--rm-orange-tint`, `--rm-orange-ink`, punto naranja
    `.campaign-dot`). Reutilízala; no crees otra igual.
- Última vez: «+6.215 €» en `--rm-positive` y 600, y debajo «de beneficio en 2026» en `text-sm` e `ink-2`.
- Ediciones: «7 campañas» en `text-md` e `ink-2`.
- Acciones: lápiz (`bi-pencil`) y papelera (`bi-trash3`), botones de icono sin borde en `ink-2`, que en hover
  pasan a `--rm-orange-strong`. Editan o eliminan el **tipo**.
- Pulsar la fila (salvo los botones de acción) la despliega o la pliega.

**Ediciones desplegadas** (debajo de la fila, dentro de la misma tarjeta):
- Caja `--rm-surface-soft` con borde `--rm-line-soft` y radio `--rm-radius`, sangrada para que empiece en la
  columna Nombre (no en la flecha) y termine a 24 px del borde derecho, con unos 24 px de margen por debajo.
- Cabecera interna: Edición · Fechas · Gastos · Beneficio · Balance · (lápiz), en `text-xs-plus`, 600 e `ink-2`,
  con Gastos, Beneficio y Balance alineados a la derecha.
- Filas de unos 47 px separadas por `--rm-line-soft`, en `text-md`. Fechas en `ink-2`, importes con
  `tabular-nums` y Balance en 600 con color y signo.
- Lápiz al final de cada fila: edita esa **edición** (las fechas y los gastos; el beneficio viene de las ventas y
  no se edita). El diseño no tiene papelera por edición: no la pongas.
- **Cuántas abiertas a la vez:** en el diseño solo hay una. Por defecto, todas plegadas y una sola abierta a la
  vez. Confírmamelo en `grill-me`.

**Sin filtros ni paginación:** el diseño no tiene barra de filtros ni pie de paginación (son 8 tipos). Quita
`Filters` y la paginación de esta pantalla.

---

## 5. Móvil (< 992 px), según `campanasYTemporadas-m.png`

La cabecera móvil (logo y «RM») y la barra de pestañas de abajo ya existen. No las toques.

### 5.1 Encabezado, pestañas y acción

- Kicker y título con las reglas móviles de `.panel-heading` (`display-sm`; en la imagen, el título ocupa una
  línea).
- Pestañas como **control segmentado** a ancho completo (`.panel-segs`, botones de 44 px), no subrayadas:
  «Campañas 8» / «Temporadas 2». La activa va en blanco con `--rm-shadow-raised`. Las pastillas del recuento
  siguen los mismos colores que en escritorio.
- Texto de introducción en `text-md` e `ink-2`, **fuera** de cualquier tarjeta.
- «Nueva campaña» a ancho completo: `.btn-brand` de unos 48 px con `bi-plus-lg`.
- **En móvil no sale «Generar años pendientes».** Pregúntame si lo quiero (por ejemplo, en «Más» o bajo la lista).
- Unos 14 px entre bloques, con el mismo margen negativo de `.app-main` que Clientes y Comparativa si hace falta.

### 5.2 Lista: una tarjeta por tipo

- Cada tipo es su propia tarjeta blanca (radio `lg`, `--rm-shadow`, padding de unos 16 px), a unos 12 px de la
  siguiente.
- Nombre en `text-lg` y 600; debajo, «7 ene → 28 feb · 7 campañas» en `text-sm` e `ink-2`.
- Debajo, en una fila que puede partirse en dos líneas (`flex-wrap`, como en Presentación Otoño-Invierno): la
  pastilla de estado y «Última: **+6.215 €** en 2026» en `text-sm` e `ink-2`, con la cifra en `--rm-positive` y
  600.
- A la derecha, `bi-chevron-right` centrada en vertical. Desplegada, `bi-chevron-down` en `--rm-orange`, arriba a
  la derecha.
- Toda la tarjeta (salvo los botones de dentro) despliega y pliega.

### 5.3 Tarjeta desplegada

- Bajo la cabecera, una línea `--rm-line-soft`, y cada edición en un bloque separado del siguiente por otra línea
  `--rm-line-soft`:
  - Nombre («Rebajas de invierno 2026») en `text-md` y 600, con el lápiz a la derecha (botón de 44 px).
  - Fechas («7 ene – 28 feb 2026») en `text-sm` e `ink-2`.
  - Tres columnas iguales, Gastos · Beneficio · Balance: la etiqueta en `text-xs` e `ink-2` y el valor en
    `text-sm`/`md`, con el balance en 600, color y signo.
- Al final, «Editar» y «Eliminar», botones con borde (`.panel-btn` o `.m-btn`, unos 44 px, con `bi-pencil` y
  `bi-trash3`), alineados a la izquierda y a 8 px uno de otro. Editan y eliminan el **tipo**. En móvil van aquí
  en lugar de los iconos de la fila.

---

## 6. Diálogos y acciones (no están en el diseño)

- **Crear y editar** (tipo o edición): `ModalComponent` sigue con el estilo viejo de Bootstrap. Está como deuda
  en DESIGN.md (migrarlo al diálogo del prototipo: radio 20 px, título en serif, campos `rm-input`). **No lo
  migres en esta tarea**: pregúntame si lo hacemos ahora o en otra.
- **Eliminar un tipo** borra también sus ediciones. Comprueba en `db/v2/schema.sql` si la clave foránea tiene
  `ON DELETE CASCADE` y avísame si no. Hasta que migremos el diálogo, la confirmación puede seguir como está, pero
  el texto tiene que decir cuántas ediciones se borran.
- **«Generar años pendientes»:** mientras trabaja, el botón queda desactivado con un spinner pequeño. Al terminar,
  recarga y dice cuántas ediciones ha creado («Se han creado 2 ediciones.» o «Ya estaba todo al día.») con un
  aviso discreto en `.panel-note`, no con `alert()`.
- **Desde el Calendario:** ahora `openItem` guarda la edición en `localStorage` (`temporalItem`) y navega aquí.
  En la pantalla nueva, al llegar así, se abre la pestaña que toca, se **despliega su tipo**, se hace scroll hasta
  él y la edición se marca un momento (`--rm-row-hover` o `--rm-orange-tint-soft`). Después se borra
  `temporalItem`.

---

## 7. Estados

- **Cargando:** la cabecera de la tabla se queda y el cuerpo enseña siluetas `.panel-skeleton` con forma de fila.
  En móvil, siluetas con forma de tarjeta. Las pastillas del recuento de las pestañas no se enseñan hasta tener el
  dato.
- **Error:** `CardError` («No se han podido cargar estos datos.» y «Reintentar») dentro de la tarjeta.
- **Vacío:** «Todavía no hay campañas.» / «Todavía no hay temporadas.» centrado (`.sales-state`), con «Nueva
  campaña» visible arriba.
- **Tipo sin ediciones:** al desplegarlo, «Sin ediciones. Pulsa «Generar años pendientes» para crearlas.» en
  `.panel-muted`.

---

## 8. Orden de trabajo sugerido

1. Sesión de `grill-me`: dos pestañas en vez de cuatro, los tipos que no se repiten, «Terminada», una sola fila
   abierta, «Generar años pendientes» en móvil, el texto de Temporadas y si el diálogo se migra ahora.
2. `utils/planning.js` + tests (TDD): agrupar y ordenar, estado y días, «Última vez» y su año, recuentos y
   singulares, y el orden de las ediciones.
3. Pestañas y estructura de la página, con las redirecciones de las rutas viejas.
4. Tabla de escritorio y fila de tipo → comparar con `campanasYTemporadas.png`.
5. Ediciones desplegadas → comparar.
6. Versión móvil → comparar con `campanasYTemporadas-m.png` a 390 y 375 px.
7. Acciones (crear, editar, eliminar, generar), la llegada desde el Calendario y los estados.
8. Limpiar lo que sobre (los `DATABASE_TABLES.*.tables` y `filters` sin uso, CSS de `.planning-tab` viejo…) sin
   romper otras pantallas, y actualizar `DESIGN.md`.
9. Revisión final en el navegador (1440, ~1100, 390 y 375 px), consola limpia y `npm test` en verde.

Al terminar, dame una lista corta de lo que difiere del diseño (si algo difiere) y por qué.
