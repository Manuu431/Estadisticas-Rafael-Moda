# Rediseño de la pantalla Calendario

Rehaz la pantalla **Calendario** (`/calendario`) para que quede **igual** que los diseños del prototipo:

- Escritorio (artboard de 1440 px): `docs/diseno/calendario.png`
- Móvil (artboard de 390 px): `docs/diseno/calendario-m.png`

Abre las dos imágenes antes de empezar y vuelve a ellas cada vez que dudes. **Las imágenes mandan.** Las medidas
de este documento son aproximadas, sacadas a ojo del artboard: si una medida de aquí no cuadra con la imagen,
gana la imagen. Mide sobre ella; no te la inventes.

Después de esto yo te iré pidiendo cambios. En esta tarea solo hay que copiar el diseño tal cual.

---

## 1. Reglas (obligatorias)

1. **Lee `CLAUDE.md` y `DESIGN.md` antes de tocar nada** y síguelos. Sobre todo la regla de oro: ningún color,
   tamaño de letra, radio ni sombra a mano. Siempre un token `--rm-*`. Si falta uno (por ejemplo, el naranja
   de las barras del móvil), lo añades a `:root` en `App.css` con un nombre `--rm-cal-*` y luego lo usas.
2. **Copia, no reinterpretes.** No añadas elementos que no estén en la imagen ni quites los que sí están.
   No "mejores" el diseño por tu cuenta. Si algo te parece un error del diseño, me lo dices y esperas.
3. **Lo que la imagen no cubre** (estados de carga, error, mes sin eventos, muchos eventos el mismo día,
   teclado, foco) lo resuelves con los patrones que ya existen en DESIGN.md (`.panel-skeleton`, `CardError`,
   `.panel-muted`, anillo `--rm-orange-focus`…). Explícame qué has decidido.
4. **Textos en español, exactos** a los de la imagen: mayúsculas, tildes, «…» al cortar, «en 14 días».
   Fechas siempre con `date-fns` y el locale `es`, y la semana empieza en **lunes**.
5. **Un solo corte, en 992 px** (`useIsMobile`): por debajo, diseño de móvil; desde ahí, el de escritorio.
   Entre 992 y 1199 px, el de escritorio reflujado: sin scroll horizontal y con la tarjeta lateral debajo si no cabe.
6. **Lógica de fechas con TDD** (vitest, como `utils/dates.test.js`): las semanas del mes, los tramos de cada
   campaña por semana, los eventos del mes y las próximas fechas van en funciones puras con tests. El componente
   solo pinta.
7. **No toques otras pantallas** ni componentes compartidos sin avisar. Si necesitas cambiar algo compartido
   (`Layout`, `MobileHeader`, `MobileTabBar`, tokens comunes), dímelo primero.
8. **Comprueba en el navegador** (Chrome DevTools MCP) a 1440 px y a 390 px, comparando con la imagen al lado.
   Comprueba también a 375 px y a ~1100 px. La consola no puede tener errores. Para comparar, navega hasta
   septiembre de 2026, que es el mes del diseño.
9. **Actualiza `DESIGN.md`** en el mismo cambio con una entrada «Calendario» en Componentes, con el mismo nivel
   de detalle que las de Ventas, Clientes o Comparativa: clases, medidas, tokens y comportamiento.
10. **Accesibilidad:** todo lo que se pulsa es un `<button>` o un enlace, con `aria-label` cuando no tiene texto
    («Mes anterior», «Mes siguiente»), foco visible y objetivos táctiles de al menos 44 px en móvil. No
    comuniques nada solo con color: la leyenda explica la barra y el punto.
11. **Commits pequeños**, en inglés y con el estilo del historial (`rebuild the calendar grid from the design`).
    Explica cada decisión: tengo que entenderla y poder defenderla.

---

## 2. Qué hay ahora (punto de partida)

- `pages/calendar/Calendar.jsx`: la página, con la cabecera, «Próximas fechas», la leyenda y la tarjeta
  «En <mes>» del móvil.
- `pages/calendar/EventCalendar.jsx`: el mes, pintado con **react-big-calendar** y mucho CSS `.rbc-*` en `App.css`.
- `pages/calendar/CustomToolBar.jsx`: los botones Hoy, ‹, mes y ›.
- `pages/calendar/calendarEvents.js`: `getMonthEvents`, `getMilestones`, `buildEvents` y `openItem`, sin tests.
- Datos: `useFetch` de `DATABASE_TABLES.campaigns` y `DATABASE_TABLES.seasons`, con `name`, `start_date` y `end_date`.
- Tokens que ya existen para esto: `--rm-cal-line`, `--rm-cal-weekend` y `--rm-cal-out`.
- Pulsar una campaña o una temporada llama a `openItem`, que guarda el elemento y navega a Campañas y temporadas.
  Eso se mantiene.

**Recomendación: sustituir react-big-calendar por una rejilla propia** (CSS grid de 7 columnas), por estos motivos:

- El diseño tiene barras de campaña que cruzan la semana de borde a borde, puntos de temporada, la versión
  móvil con barras finas bajo los días y días de fuera del mes con los eventos apagados. Forzar todo eso sobre
  `.rbc-*` cuesta más que pintarlo.
- Con rejilla propia, la lógica (semanas, tramos, carriles) queda en funciones puras que se pueden testear.

Si sigues la recomendación, quita la dependencia y el CSS `.rbc-*` que deje de usarse. **Antes de empezar,
confírmame esta decisión** en la sesión de `grill-me`.

---

## 3. Escritorio (≥ 992 px), según `calendario.png`

### 3.1 Cabecera

- A la izquierda, el encabezado de siempre: `.panel-kicker` «Campañas y cambios de temporada» y, debajo,
  `.panel-title` «Calendario».
- A la derecha, alineada por abajo con el titular y en este orden: **Hoy · ‹ · Septiembre 2026 · ›**.
  - «Hoy»: botón blanco con borde `--rm-line`, radio `--rm-radius-btn`, unos 44 px de alto, `text-md` y 600.
  - ‹ y ›: botones cuadrados blancos de unos 40 px, con borde y `bi-chevron-left/right`.
  - El mes en serif (`--rm-font-display`, unos 28–30 px, mira la escala display), con la primera letra en
    mayúscula y un ancho mínimo fijo para que las flechas no salten al cambiar de mes. Va centrado entre las
    flechas y separado de ellas (unos 32 px a cada lado en la imagen).
- «Hoy» vuelve al mes actual. Las flechas cambian de mes y el título se anuncia con `aria-live="polite"`.

### 3.2 Distribución

- Dos columnas: el calendario ocupa el espacio libre y la tarjeta «Próximas fechas» tiene un ancho fijo (unos
  262 px). Hay unos 24–26 px entre las dos. La lateral **no se estira** a la altura del calendario: mide lo que
  mide su contenido y va arriba.

### 3.3 Tarjeta del mes

- Es la tarjeta de siempre (blanca, radio `lg`, `--rm-shadow`), **sin padding**: la rejilla llega a los bordes.
- **Cabecera de días:** LUN MAR MIÉ JUE VIE SÁB DOM en mayúsculas, `text-xs`, 600, `ink-2`, `letter-spacing`
  de kicker y alineados a la izquierda con unos 16 px de margen. Mide unos 44 px de alto, con una línea
  `--rm-cal-line` debajo y **sin** líneas verticales.
- **Celdas:** 7 columnas iguales, separadas por líneas `--rm-cal-line` (verticales entre días y horizontales
  entre semanas). Cada semana mide unos 140 px de alto. Sale el número de semanas que necesite el mes (5 en
  septiembre de 2026, a veces 6); no fuerces 6.
- **Número del día:** arriba a la izquierda, a unos 12–16 px, en `text-sm`, 500 y `ink`.
- **Fin de semana** (sábado y domingo): fondo `--rm-cal-weekend`.
- **Días de fuera del mes** (31 ago, 1–4 oct): número en `--rm-cal-out` y sus eventos apagados (ver abajo).
  Mira en la imagen el fondo de esas celdas y cópialo.
- **Hoy:** el número dentro de un círculo relleno naranja de unos 28 px (`--rm-orange-strong`), en blanco y 600.
- **Campañas:** barras de unos 24 px de alto que cruzan los días de borde a borde.
  - Fondo `--rm-orange-tint` y texto `--rm-orange-ink` en `text-xs-plus` 500/600, cortado con «…» y con unos
    8 px de padding.
  - El nombre sale **una vez por semana**, al principio del tramo de esa semana.
  - Las esquinas solo se redondean donde la campaña empieza o termina de verdad. Si sigue en la semana
    siguiente, el borde queda recto y la barra llega al borde de la tarjeta.
  - En los días de fuera del mes, la barra sigue, pero más clara (`--rm-orange-tint-soft` o lo que se vea en la
    imagen), y el texto, también más claro. Ejemplos: «Rebajas de vera…» el 31 de agosto y el tramo del 1 al
    4 de octubre.
- **Cambios de temporada:** no son barras. Son una línea de texto con un punto delante («● Empieza Otoño-I…»),
  en `text-xs`, 500 e `ink`, con el punto de unos 6 px en `--rm-nav`. Fuera del mes, punto y texto en
  `--rm-cal-out` («● Termina Primaver…»).
- **Orden y carriles:** cada evento ocupa un carril (una línea) dentro de la semana. Una campaña que cruza varios
  días mantiene el mismo carril en toda la semana. Las campañas van antes que los cambios de temporada.
- **Si no cabe todo** (no está en el diseño): como mucho los carriles que quepan en los 140 px y, después, un
  «+N más» en `text-xs` `ink-2` que despliega la lista de ese día. Propónmelo antes de hacerlo.
- **Pulsar** una campaña o un cambio de temporada llama a `openItem` (igual que ahora), con cursor de mano,
  hover algo más oscuro y foco visible.

### 3.4 Tarjeta «Próximas fechas»

- `.panel-card` con el título «Próximas fechas» (`.panel-card-title`).
- Lista de **5** fechas, cada fila separada de la anterior por una línea `--rm-line-soft` (la primera también
  la lleva por encima, mira la imagen):
  - A la izquierda, la «ficha» de fecha: cuadrado de unos 46 px, borde `--rm-line`, radio `--rm-radius-sm`; el
    día en `text-base`/`lg` y 700, y debajo el mes en MAYÚSCULAS («OCT»), `text-xs` y 600.
    - La **primera** (la más cercana) va en `--rm-orange-tint`, sin borde y con el texto en `--rm-orange-ink`.
  - A la derecha, el nombre en `text-md` y 500/600 (puede ocupar dos líneas, como «Termina Presentación
    Otoño-Invierno») y debajo «en 14 días» en `text-sm` `ink-2`. Con 0 días, «hoy», y con 1, «mañana».
- Debajo, una línea `--rm-line-soft` y la **leyenda**, en `text-sm` `ink-2`:
  - una muestra de barra (unos 20 × 10 px, `--rm-orange-tint`, radio pequeño) y «Campaña»;
  - un punto `--rm-nav` y «Cambio de temporada»;
  - «Pulsa una campaña para ver sus datos.».
- Cada fila es un botón que llama a `openItem`.

**Qué entra en «Próximas fechas» (sacado de la imagen, confírmalo conmigo):** el diseño enseña «Termina
Presentación Otoño-Invierno» (12 oct), «Black Friday» (27 nov), «Navidad y Reyes» (5 dic), «Rebajas de
invierno» (7 ene) y «Termina Otoño-Invierno» (28 feb). **No** sale «Termina Black Friday», aunque iría antes
del 5 de diciembre. Parece que la regla es esta:

- de cada campaña futura, solo el **inicio** (con su nombre);
- de la campaña **en curso**, su final («Termina …»);
- de las temporadas, el inicio y el final («Empieza …» / «Termina …»).

El código actual mete también el final de todas las campañas. Cambia a la regla del diseño, con tests, y
dime si te encaja.

---

## 4. Móvil (< 992 px), según `calendario-m.png`

La cabecera móvil (logo y avatar «RM») y la barra de pestañas de abajo, con «Calendario» activo, ya existen.
No las toques.

### 4.1 Encabezado y navegación del mes

- Kicker «Campañas y cambios de temporada» y «Calendario» con las reglas móviles de `.panel-heading`
  (`display-sm`).
- Debajo, una fila en este orden, **distinto del de escritorio**: **‹ · Septiembre 2026 · › · Hoy**.
  - ‹, › y «Hoy» son botones blancos de 44 px de alto, con borde y radio `--rm-radius-btn`.
  - El mes en serif, centrado, ocupa el espacio que sobra.

### 4.2 Tarjeta del mes (compacta)

- Tarjeta blanca, radio `lg`, con padding (unos 12 px).
- Iniciales de los días **L M X J V S D**, centradas, en `text-xs` y `ink-3`.
- Números centrados en `text-md` y 500; los de fuera del mes, en `--rm-cal-out`. Cada semana mide unos 56 px.
- **Sin** líneas de rejilla, **sin** fondo de fin de semana y **sin** texto de eventos.
- **Hoy:** círculo relleno naranja de unos 32 px, número en blanco y 600.
- **Campañas:** una barra fina (unos 4 px, radio 2 px) al pie de la semana, de borde a borde de los días que
  ocupa, más intensa que la de escritorio (mide el color en la imagen y crea un token `--rm-cal-bar` si no
  coincide con ninguno). Fuera del mes, en un tono más claro.
- **Cambios de temporada:** un punto de unos 5 px en `--rm-nav` bajo el número del día (el 1 de septiembre, por
  ejemplo).
- En la versión compacta, pulsar un día no hace nada (no hay acción en el diseño).

### 4.3 Tarjeta «En septiembre»

- `.panel-card` con el título «En <mes>» en minúscula («En septiembre»).
- Una fila por evento que toque el mes, ordenadas por fecha:
  - delante, la barra corta (campaña) o el punto (temporada), con los mismos colores que en la rejilla móvil;
  - el nombre en `text-lg`/`md` y 500/600 («Empieza Otoño-Invierno», «Presentación Otoño-Invierno»);
  - debajo, en `text-sm` `ink-2`: «Temporada · 1 sep» o «Campaña · 15 sep – 12 oct».
- Sin eventos: «No hay campañas ni cambios de temporada este mes.» en `.panel-muted`.

### 4.4 «Próximas fechas»

- El título «Próximas fechas» va **fuera** de la tarjeta, sobre el fondo crema, en `text-md` 600 (fíjate en la
  imagen).
- Debajo, una tarjeta tipo lista (`.m-list` o equivalente) con las mismas 5 fechas que en escritorio. Cada
  fila mide unos 64 px, separada por `--rm-line-soft`, con la ficha de fecha de unos 42 px (la primera, en
  naranja), el nombre en una sola línea cortado con «…» y «en N días» debajo.
- En el diseño pone «Termina Presentación O-I», abreviado. **No te inventes abreviaturas:** corta con «…» y
  pregúntame si quiero abreviar los nombres de temporada.

### 4.5 Leyenda

- Fuera de las tarjetas, en una sola fila y en `text-sm` `ink-2`: barra corta y «Campaña», y punto y «Cambio
  de temporada». En móvil no lleva la frase «Pulsa una campaña…».

### 4.6 Espaciado

- Unos 14 px entre bloques, como en Clientes, Comparativa y Gastos, con el mismo margen negativo sobre el
  padding de `.app-main` si hace falta para que coincida con la imagen.

---

## 5. Estados (no están en el diseño)

- **Cargando:** la rejilla se pinta (los días no dependen de los datos), pero sin eventos, y «Próximas fechas»
  y «En <mes>» muestran siluetas `.panel-skeleton`. Nunca enseñes «No hay fechas próximas» mientras carga.
- **Error:** `CardError` («No se han podido cargar estos datos.» y «Reintentar») en la tarjeta de «Próximas
  fechas» y en «En <mes>». La rejilla queda sin eventos.
- **Sin fechas próximas:** «No hay fechas próximas.» en `.panel-muted`.

---

## 6. Orden de trabajo sugerido

1. Sesión de `grill-me`: confirmar react-big-calendar frente a rejilla propia, la regla de «Próximas fechas»,
   el «+N más» y las abreviaturas.
2. `utils/calendar.js` + `utils/calendar.test.js` (TDD): semanas del mes empezando en lunes, tramos de cada
   campaña por semana con carriles e indicadores de inicio y fin reales, eventos del mes y próximas fechas.
3. Rejilla de escritorio y cabecera → comparar con `calendario.png`.
4. Tarjeta «Próximas fechas» y leyenda → comparar.
5. Versión móvil → comparar con `calendario-m.png` a 390 y 375 px.
6. Estados de carga, error y vacío.
7. Limpiar el CSS y la dependencia que sobren, y actualizar `DESIGN.md`.
8. Revisión final en el navegador (1440, ~1100, 390 y 375 px), consola limpia y `npm test` en verde.

Al terminar, dame una lista corta de lo que difiere del diseño (si algo difiere) y por qué.
