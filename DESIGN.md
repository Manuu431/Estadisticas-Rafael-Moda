# DESIGN.md — Rafael Moda · Estadísticas

Sistema de diseño de la app. Los tokens viven en `frontend-react/src/App.css` (`:root`, prefijo `--rm-`).
**Regla de oro:** nunca escribir un color, tamaño de letra, radio o sombra a mano; usar siempre un token `--rm-*`.
Si falta un token, se añade a `:root` primero y luego se usa.

## Carácter

Panel de gestión de una tienda de moda: cálido, editorial y tranquilo. Fondo crema, tarjetas blancas,
un único acento naranja. Titulares con serif elegante (Instrument Serif), datos e interfaz en sans (Figtree).
Densidad media: es una herramienta de trabajo, pero con aire. Nada de colores saturados ni degradados.

## Color

| Rol | Token | Valor |
|---|---|---|
| Fondo de la app | `--rm-cream` | #EFE6DA |
| Fondo login / zonas claras | `--rm-cream-light` | #FBF8F4 |
| Superficie (tarjetas, tablas) | `--rm-surface` | #FFFFFF |
| Superficie interior (caja dentro de una tarjeta) | `--rm-surface-soft` | #FBF7F2 |
| Tinte suave | `--rm-tint` | #F5EFE7 |
| Texto principal | `--rm-ink` | #221C17 |
| Texto secundario | `--rm-ink-2` | #675E56 |
| Texto terciario / notas | `--rm-ink-3` | #756D66 |
| Navegación | `--rm-nav` | #4A423B |
| Acento | `--rm-orange` | #DD6C10 |
| Acento en botones (contraste AA) | `--rm-orange-strong` / `-hover` | #B85A0D / #9C4C0B |
| Texto sobre tinte naranja | `--rm-orange-ink` | #8F4509 |
| Fondo seleccionado | `--rm-orange-tint` / `-soft` | #FBEBDD / #FDF3EA |
| Borde del botón abierto (Ventas) | `--rm-orange-line` | #F1CFB0 |
| Fila de la tabla de Ventas al pasar el cursor | `--rm-row-hover` | #FDFAF6 |
| Icono desactivado (paginación) | `--rm-icon-disabled` | #B9AEA3 |
| Pastilla Mujer, texto / Hombre, fondo | `--rm-pill-mujer-ink` / `--rm-pill-hombre` | #9A4A0A / #EDE8E3 |
| Positivo (ingresos, subidas) | `--rm-positive` + `-tint` | #1E6B45 / #E7F3EC |
| Negativo (gastos, bajadas) | `--rm-negative` + `-tint` | #A3261B / #FBE9E7 |
| Coste de la mercancía (serie) | `--rm-cost` | #5E534A |
| Sección Hombre (reparto mujer/hombre) | `--rm-section-hombre` | #4A413A |
| Barra sin datos (gráfica de barras) | `--rm-bar-empty` | #EFE7DE |
| Ranking, puestos 2 en adelante | `--rm-rank-soft` | #EDC9A8 |
| Periodo comparado (relleno) | `--rm-compare` | #CFC3B5 |
| Periodo comparado (línea fina) | `--rm-compare-line` | #B7ACA1 |
| Bordes | `--rm-line` · `-strong` · `-soft` · `-dashed` | |
| Fondo del control segmentado | `--rm-segs-bg` | #E4D9CA |
| Calendario: campaña, texto / hover | `--rm-event` · `--rm-event-ink` / `-hover` | #FBE3CF · #7A3A06 / #F8D2B1 |
| Calendario: campaña fuera del mes, barra / texto | `--rm-cal-event-out` / `--rm-cal-event-ink-out` | #FDF0E5 / #B69376 |
| Calendario móvil: barra / barra fuera del mes | `--rm-cal-bar` / `--rm-cal-bar-out` | #F2B786 / #F8DBC2 |
| Campañas y temporadas: línea bajo las pestañas | `--rm-tabs-line` | #E0D5C7 |
| Campañas y temporadas: fila abierta / borde de la caja de ediciones | `--rm-row-open` / `--rm-line-box` | #FFFDFA / #F0E8DE |
| Campañas y temporadas, móvil: borde de la tarjeta abierta | `--rm-orange-line-soft` | #F1D9C4 |
| Calendario: línea, fin de semana, día de fuera | `--rm-cal-line` · `--rm-cal-weekend` · `--rm-cal-out` | #F0E8DE · #FDFBF8 · #A89C90 |

- El naranja es el **único** acento: acción principal, elemento activo, foco. No usarlo para decorar.
- Botón relleno = `--rm-orange-strong` (el `--rm-orange` puro no da contraste suficiente con texto blanco).
- Positivo/negativo siempre con el token, nunca verde/rojo puros (`#008000`, `#ff0000`).
- Foco: `--rm-orange-focus` como anillo.

### Gráficas (Recharts)

Rejilla `#F2ECE5` (= `--rm-line-soft`), solo horizontal. Separador entre barras/porciones: `#FFFFFF`.

Serie categórica, en este orden: `#DD6C10, #1176A6, #5E8C2A, #4A3AA7, #1E9E86, #A3261B, #B3308A`;
el resto agrupado como "Otras" en `#8C8178`. Ahora mismo **ninguna pantalla la usa**: vivía en
`SERIES_COLORS` dentro de `pages/controlPanel/ControlPanelComponents.jsx` y se fue con la tarta de familias
de Inicio. Si vuelve a hacer falta una serie categórica, se recrea en un sitio compartido (`config/`) y no
se copia la paleta en cada pantalla.

**Comparación de dos series** (no categórica): la serie principal en `--rm-orange` y la de contraste
en `--rm-cost` (ingresos frente a coste, en Gastos) o `--rm-compare` (periodo A frente a B, en
Comparativa). Gastos se dibuja con `components/PairedBarChart.jsx` y Comparativa con
`pages/comparative/CompareChart.jsx`; los dos pasan los tokens como `var(--rm-*)` a Recharts, no escribir
hex en las gráficas de comparación. Los textos de los ejes de Comparativa se estilan por CSS
(`.compare-chart .recharts-cartesian-axis-tick-value`), porque `var()` no vale en un atributo SVG.

**Año contra año acumulado** (Inicio): área y línea del año en curso en `--rm-orange` (relleno al 8 %) y línea
del año anterior en `--rm-compare-line`, de 1,75 px y discontinua (`4 4`). `--rm-compare` es demasiado claro
para un trazo fino: se reserva para las barras rellenas. El último punto se marca con un círculo blanco de borde
naranja. Eje X con una marca por mes y eje Y con cinco niveles; la leyenda del encabezado usa `.panel-legend-line`
(sólida para el año en curso, `is-dashed` para el anterior). El recorrido va del 1 de enero **al día de hoy**,
no al último mes cerrado, para que coincida con el «Año» de la tarjeta de marcas; en enero se queda en el
31 de diciembre en vez de saltar al año nuevo (`yearChartRange`).

## Tipografía

- Interfaz y datos: `--rm-font` (Figtree 400/500/600/700).
- Titulares de página y cifras destacadas: `--rm-font-display` (Instrument Serif, peso 400, `line-height` ~1).
- Escala de texto: `--rm-text-2xs` 11 · `--rm-text-xs` 12 · `xs-plus` 12,5 · `sm` 13 · `sm-plus` 13,5 · `md` 14 · `md-plus` 14,5 · `lg` 15 · `base` 16 · `icon` 17 · `icon-plus` 18 · `lg-plus` 19 · `xl` 20 · `2xl` 22 px.
- Escala display: `--rm-display-2xs` 24 · `xs` 28 · `sm` 36 · `md` 40 · `lg` 42 · `xl` 46 · `2xl` 52 · `3xl` 58 px.
- Etiquetas / kickers: `--rm-text-xs`, 600, MAYÚSCULAS, `letter-spacing: 0.08em` (0.12em en login).
- Cifras en tablas: alinear a la derecha y usar `font-variant-numeric: tabular-nums`.
- Formato español, siempre desde `utils/format.js`: importes con separador de miles y dos decimales
  (`4.902,21 €`) y porcentajes con un decimal (`+9,9 %`, `76,0 %`). El `es-ES` de `toLocaleString` no agrupa
  los números de cuatro cifras, por eso los formateadores pasan `useGrouping: 'always'`.

## Forma, sombra y espacio

- Radios: `--rm-radius-xs` 6 · `--rm-radius-sm` 10 · `--rm-radius-btn` 11 · `--rm-radius` 12 · `--rm-radius-lg` 18 px (tarjetas = `lg`).
- Sombras: `--rm-shadow` (tarjetas en reposo), `--rm-shadow-raised` (elementos flotantes). Tonos marrones, nunca negro.
- Espaciado en múltiplos de 0.125rem (2 px); los habituales: 0.375, 0.5, 0.875, 1, 1.25, 1.5, 1.75 rem.
- Contenido principal: `padding: 2.25rem 2.75rem 2.75rem 1.25rem` (escritorio), `1.5rem 1rem 2rem` (<992px).

## Componentes

- **Tarjeta** (`.panel-card`): superficie blanca, borde `--rm-line`, radio `lg`, `--rm-shadow`, padding `1.625rem 1.75rem`.
  Título `.panel-card-title` (`text-lg`, 600). Separadores internos `.panel-divider`.
  Las tarjetas que comparten fila miden lo mismo de alto: la rejilla las estira (sin `align-items-start`),
  `.panel-card` lleva `h-100` y el contenido crece con `flex-grow-1`. El bloque de cierre (totales, barra de
  progreso, resumen) se baja con `mt-auto`, así que el espacio sobrante queda **encima** de él, no repartido.
  Por debajo de 992 px cada tarjeta ocupa su línea y mide lo que necesita.
- **Encabezado de página**: `.panel-kicker` (`text-sm`, `ink-2`) encima de `.panel-title` (serif `display-lg`).
- **Periodo de Ventas** (`.panel-period`): en lugar del kicker, el texto del periodo en `text-sm-plus` (13,5 px), 500, `ink-2`,
  a 6 px del titular (`.panel-heading`). El selector es un campo `.panel-field.is-labelled` de 12,25 rem con la palabra «Periodo»
  dentro (`.panel-field-label`, `text-sm`, `ink-2`), el desplegable en peso normal y `bi-chevron-down`. Con «Personalizado…»
  salen «Desde» y «Hasta» con el mismo campo, en una fila propia bajo la barra; si «Desde» es posterior a «Hasta» no se aplica y
  `.panel-note.text-negative` lo avisa. Los campos de fecha no se
  vuelven a escribir desde la app mientras se teclean (si no, el navegador borraría lo que está a medias): una fecha que no existe
  (31/06) se avisa en vivo («La fecha «Hasta» no es válida.») y no se aplica. En la hoja móvil, «Ver resultados» con el periodo
  incompleto o inválido no cierra la hoja ni descarta nada: dice qué falta («Elige las dos fechas del periodo.»).
- **Barra de filtros de Ventas**: una línea con 10 px de separación: buscador (`.panel-field-search`, 300 px, lupa de `text-icon`),
  Periodo (196 px) y Marca (200 px), los dos `.panel-field.is-labelled` con la etiqueta dentro y flecha de `text-base`;
  después Todo / Mujer / Hombre con `.panel-segs.is-plus` (`text-sm-plus`), un hueco y «Más filtros» (`.panel-btn.is-soft`: icono de
  deslizadores de `text-icon`, flecha de `text-base` que gira; abierto, `--rm-orange-tint`, borde `--rm-orange-line`, texto
  `--rm-orange-ink`). El buscador se aplica a los 300 ms; Periodo, Marca y sección, al momento; el panel, con «Aplicar».
- **Panel «Más filtros» de Ventas** (`.filters-panel.sales-panel`): tarjeta blanca de radio 16 px y padding 20 × 22 px, a 12 px de la barra,
  con 18 px entre la rejilla y los botones y la animación de bajada de 0,25 s. La rejilla (`.sales-panel-grid`) tiene 5 columnas iguales
  con 14 px de separación desde 1200 px y 3 por debajo (sin diseño de tablet, se reflúe): Familia, Talla y Color (desplegables
  `.panel-field.is-plain`, con «Todas» / «Todos» como primera opción) y Precio de venta (€) y Beneficio (€), cada uno con «Desde» y «Hasta»
  separados 6 px. La etiqueta (`.sales-panel-label`, `text-xs-plus`, 600, `--rm-nav`) va a 7 px del campo. Abajo a la derecha, a 8 px,
  «Limpiar filtros» y «Aplicar» con `.is-compact` (40 px, radio `--rm-radius-btn`, `text-md`). «Aplicar» manda los cinco filtros;
  «Limpiar filtros» vacía solo esos cinco y deja los de la barra. En móvil los mismos campos van en la hoja «Filtros», uno por línea.
- **Resumen de Ventas** (`.panel-summary`): a la derecha del titular, `text-md`, `ink-2`, `line-height` 1,5, alineado a la derecha, con
  las cifras en `<strong>` (`ink`, 600). Dos líneas: «X € vendidos · Y € de beneficio» y «N líneas de venta · N prendas» (singular
  con 1). Suma todas las líneas que cumplen los filtros, no solo la página visible. La cabecera alinea por abajo (`align-items-end`).
- **KPI**: etiqueta `.panel-label` + valor `.panel-stat` (`text-xl`, 600) o `.panel-display` (serif) para el principal;
  `.panel-display-hero` (`display-2xl`) para la cifra que manda en la tarjeta.
- **Comparativa bajo una cifra**: `DeltaPill` (pastilla positiva/negativa con flecha) seguida de la frase
  `vs. <periodo> · <importe>` en `.panel-note` (`text-sm`, `ink-2`). Sin dato con el que comparar, la pastilla
  se sustituye por «sin comparación».
- **Barras por periodo**: columna `.panel-bar-col` con `.panel-bar-slot` (4,75 rem de alto) y `.panel-bar` dentro;
  los tramos sin ventas usan `.panel-bar.is-empty`. Junto a cada barra naranja va la del mismo tramo del año
  anterior en `.panel-bar.is-compare` (`--rm-compare`), las dos a la misma escala (el pico de las dos series).
  La etiqueta va debajo en `.panel-bar-label`. La columna es un `<button>` para que el importe de
  `.panel-tooltip.panel-bar-tip` salga con el cursor, con el dedo y con el teclado; su `aria-label` lleva los dos
  años, así que no hace falta `role="img"` en el grupo.
- **Reparto mujer/hombre**: `.panel-split` (8 px, fondo `--rm-section-hombre`) con `.panel-split-fill` naranja al
  porcentaje de Mujer, y leyenda con `.panel-swatch.is-mujer` / `.is-hombre`.
- **Barra de progreso**: `.panel-track.is-thin` (6 px, fondo `--rm-line-soft`) con `.panel-fill` naranja, y encima
  la frase a la izquierda y el porcentaje a la derecha en `.panel-note`.
- **Ranking** (`.panel-rank`): rejilla de puesto · nombre · barra · importe · prendas. El primero lleva
  `.panel-fill` naranja y el resto `.panel-fill.is-soft` (`--rm-rank-soft`), todos proporcionales al primero.
  Por debajo de 992 px la fila se parte en dos líneas (puesto, nombre e importe arriba; barra y prendas debajo,
  sangradas). Encima va el destacado: `.panel-label.is-accent` («N.º 1», naranja) + nombre en
  `.panel-display-brand` (serif `display-md`, `display-sm` en móvil) y, a la derecha, el importe y
  «N prendas · X % de las ventas».
- **Beneficio y margen** (`.panel-profit`): alineados a la derecha en escritorio y a la izquierda por debajo de
  992 px, donde el bloque cae bajo la cifra principal.
- **Botones**: `.btn-brand` (relleno) para la acción principal (máx. uno por vista), `.btn-brand-outline` para la secundaria.
  Alto 50 px en formularios, 600, `text-lg`. Los botones se basan en Bootstrap vía variables `--bs-btn-*`, no se reescriben a mano.
- **Controles segmentados** (`.panel-segs`): para cambiar periodo/vista dentro de una tarjeta, o la sección
  (Todo / Mujer / Hombre) desde el encabezado de Inicio. Fondo `--rm-segs-bg`, pastilla activa blanca con
  `--rm-shadow-raised`. En móvil el del encabezado ocupa todo el ancho (`.panel-head-segs`).
- **Logo** (`.app-logo`): la versión horizontal (`assets/logo/logo-horizontal.svg`), 46 px de alto en la barra
  lateral y 34 px en la cabecera móvil.
- **Navegación**: barra lateral (≥992 px, 15.5rem de ancho) con grupos en mayúsculas; en móvil, `MobileHeader` + `MobileTabBar` + `BottomSheet`.
- **Tablas**: superficie blanca, cabecera en `text-xs` mayúsculas `ink-2`, filas separadas con `--rm-line-soft`.
- **Tabla de Ventas** (`SalesTable`, `.sales-row`): rejilla `96px minmax(0,2.2fr) minmax(0,1.5fr) 96px 64px 48px 108px 108px`
  con 16 px entre columnas, padding 0 24 px, filas de 58 px separadas con `--rm-line-soft` y texto de `text-md`; cabecera de 46 px
  en `--rm-cream-light`, `text-xs-plus`, 600, `ink-2`, sin mayúsculas y sin botones de orden (la venta más reciente va primero).
  Fecha («28 sep», o «28 sep. 2025» si no es del año en curso) y Prenda llevan una segunda línea (hora, color) en `.sales-sub`
  (`text-xs-plus`, `ink-3`) a 2 px. Uds., Importe y Beneficio, a la derecha con cifras tabulares; Importe en 600 y Beneficio en
  `--rm-positive` y 500, sin signo. La sección es una pastilla de 24 px (`.sales-pill`): Mujer `--rm-orange-tint` con
  `--rm-pill-mujer-ink`, Hombre `--rm-pill-hombre` con `--rm-section-hombre`. Al pasar el cursor, `--rm-row-hover`.
  Por debajo de 1200 px las filas no bajan de 59,5 rem y la tabla se desplaza dentro de su tarjeta (`.sales-scroll`).
- **Ventas en móvil** (<992 px, `.sales-page`): cabecera con el periodo en `text-sm` y «Ventas» en `display-sm`, a 4 px; el párrafo de
  resumen desaparece y lo sustituye `SalesSummaryCard` (`.sales-card`: tarjeta de radio `lg` con `--rm-shadow`, padding 16 px,
  dos columnas a 12 px). Cada columna lleva «Vendido» / «Beneficio» en `text-xs` `ink-3` y el importe en `lg-plus` 600
  (el beneficio, en `--rm-positive`); debajo, en toda la fila, «N líneas de venta · N prendas» en `text-xs-plus` `ink-2`.
  Los bloques van a 14 px y el contenido con padding 10 × 16 × 24 px: Ventas compensa con margen negativo el padding general de
  `.app-main` (24 × 16 × 32 px) en vez de cambiarlo para todas las pantallas. Buscador a ancho completo (`.panel-field.is-large`:
  48 px, radio 14, `text-lg`, lupa de `icon-plus`), después Todo / Mujer / Hombre (botones de 40 px y `text-md`) y «Filtros»
  (`.m-btn`, 48 px) a 10 px. Buscador y sección se aplican al momento; la hoja, al pulsar «Ver resultados».
- **Hoja «Filtros» de Ventas** (`.m-sheet.is-sales`, `SalesSheet`): título en `display-xs` y «Cerrar» sin relleno. Periodo a ancho
  completo (con «Desde» y «Hasta» si es «Personalizado…»), rejilla de 2 columnas a 10 px con Marca, Familia, Talla y Color, y Precio
  de venta (€) y Beneficio (€) con sus dos campos iguales. Etiqueta encima (`.sheet-label`, `text-sm`, 600, `--rm-nav`, a 6 px),
  campos de 48 px y radio 14, bloques a 14 px, sin flecha en los desplegables (como el artboard). «Limpiar» (`--rm-tint`) vacía
  toda la hoja (Periodo vuelve a «Este mes»), lo aplica y cierra; «Ver resultados» aplica y cierra.
- **Lista de ventas en móvil** (`SalesMobileList`, `.sales-day`, `.sales-item`): ventas agrupadas por día, la más reciente primero. Título del
  día en `text-md` 600 («Hoy, jueves 1», «Sábado 26», «Sábado 26 de julio» o «Sábado 26 de julio de 2025» según sea del mes, del año o
  de otro año) y, a la derecha, el total del día **completo** en `text-sm` `ink-2` (no cambia al ver más). Cada venta (`.sales-item`):
  mínimo 4,25 rem (68 px), padding 0 16 px y 12 px entre columnas; hora en 40 px (`xs-plus`, 600, `ink-3`), nombre en `md-plus` 600
  cortado con «…», debajo «Marca · Sección · T. X · N uds.» (las unidades solo si son más de una) en `xs-plus` `ink-3`, y a la derecha el
  importe en `md-plus` 600 y el beneficio con signo en `text-xs`, 600, `--rm-positive`. Sin paginación de flechas: 12 ventas y debajo un
  `.m-btn` a ancho completo «Ver más ventas (N)» con las que faltan, que añade 12 por pulsación y desaparece al llegar al final; al cambiar un
  filtro vuelve a las 12 primeras.
- **Estados de Ventas** (`SalesPlaceholder`, `.sales-state`): la cabecera de la tabla se queda y el cuerpo, de unas tres filas de alto
  (10,875 rem), centra el mensaje en `text-md` y `ink-2`. Cargando: `.spinner-border-sm` en `--rm-orange` (sin giro con
  `prefers-reduced-motion`) y «Cargando ventas…», y el resumen de la cabecera se sustituye por dos siluetas `.panel-skeleton`:
  un cero es un dato, así que no se enseña mientras carga. Sin resultados: «No hay ventas con estos filtros.» (o «Todavía no hay
  ventas hoy.» con Hoy y ningún otro filtro), resumen a cero y sin pie de paginación. Si falla la carga: el `CardError` de siempre
  («No se han podido cargar estos datos.» y «Reintentar») y el resumen en guiones. En móvil, el mismo mensaje en una tarjeta blanca.
- **Clientes en escritorio** (`.clients-page`, 24 px entre bloques): encabezado con `.panel-heading` y `.panel-period` («486 clientes
  registrados», singular con 1; es el total real de la tabla y no cambia al filtrar; mientras carga, una silueta `.clients-count-skeleton`)
  encima del titular. Una sola tarjeta `.data-card` lleva la barra de filtros, la tabla y el pie de paginación, a diferencia de Ventas, donde
  la barra va fuera. Barra (`.clients-filters`): padding 18 × 24 px, una línea con 10 px de separación; buscador que ocupa el espacio libre
  («Buscar por nombre o código postal»), Provincia de 200 px y Ciudad de 190 px (`.panel-field.is-labelled`, «Todas» primero). Sin «Más
  filtros» ni Todo / Mujer / Hombre. Al final de la barra, «Limpiar filtros» (`.panel-btn`, 42 px, con `bi-x-lg`), que no está en el
  artboard: solo sale cuando hay buscador, provincia o ciudad puestos y los vacía los tres. El buscador se aplica a los 300 ms; Provincia y Ciudad, al momento. Ciudad solo ofrece las ciudades de la
  provincia elegida; al elegir otra provincia la ciudad se vacía (al volver a «Todas» se conserva) y «Limpiar filtros» quita también
  el texto del buscador de la consulta sin esperar los 300 ms. La barra se queda montada al cruzar los 992 px, así que no se pierden
  los filtros ( es  en móvil).
  Tabla (`ClientsTable`, `.clients-row`): Nombre · Ciudad · Provincia · CP en la rejilla `minmax(0,1.8fr) minmax(0,1.4fr) minmax(0,1fr) 80px`
  con 16 px entre columnas y padding 0 24 px. Cabecera de 44 px en `--rm-cream-light`, `text-xs-plus`, 600, `ink-2`, sin mayúsculas y sin
  botones de orden (el orden alfabético lo da el SQL); filas de 52 px con borde superior `--rm-line-soft` y `text-md`. Nombre en 500, Ciudad
  normal, Provincia en `ink-2` y CP a la derecha en `ink-2` con cifras tabulares; el texto largo se corta con «…». Al pasar el cursor,
  `--rm-row-hover`. Cabe sin desplazamiento hasta 992 px, así que no lleva `.sales-scroll`.
  Estados (`ClientsPlaceholder`, `clientsState`; reutilizan `.sales-state*` de Ventas): la barra y la cabecera de la tabla se quedan y el
  cuerpo (10,875 rem) centra el mensaje. Cargando: spinner naranja y «Cargando clientes…», y el recuento de la cabecera de página es una
  silueta `.clients-count-skeleton`. Sin resultados: «No hay clientes con estos filtros.», sin pie, y la cabecera sigue con el total real.
  Error: el `CardError` de siempre («No se han podido cargar estos datos.» y «Reintentar»); un error gana a los datos antiguos. Si falla
  solo el recuento, la cabecera no lo enseña.
- **Clientes en móvil** (<992 px): la cabecera usa las reglas móviles de `.panel-heading` (recuento en `text-sm`, «Clientes» en
  `display-sm`, a 4 px). No hay enlace «‹ Más» (la app no tiene cabecera con flecha) ni hoja «Filtros»: la barra sale de la tarjeta y se
  apila en `.clients-mobile`, con bloques a 14 px. Buscador `.panel-field.is-large` (48 px, radio 14, padding 0 14 px, lupa de
  `icon-plus`, texto de `text-lg`, «Nombre o código postal»); debajo Provincia y Ciudad en `.clients-selects` (2 columnas a 10 px,
  `.is-large` con la palabra a `text-sm`, sin flecha). «Limpiar filtros» (no está en el artboard) sale solo con algún filtro puesto como
  `.m-btn` a ancho completo. Buscador a los 300 ms; desplegables, al momento. Como en Ventas, `.clients-page` compensa con margen negativo
  (−18 px arriba, −8 px abajo) el padding de `.app-main` para dejar el contenido en 6 × 16 × 24 px.
  Lista (`ClientsMobileList`, `.clients-list` a 14 px): tarjeta `.m-list` y una fila `.clients-item` por cliente, de 62 px como mínimo, con
  padding 0 16 px, 12 px entre columnas y borde `--rm-line-soft` salvo la primera. Avatar `.clients-avatar` de 38 px, `--rm-tint`, texto
  `--rm-nav` en `text-sm` 700, con las iniciales de las dos primeras palabras del nombre (una sola letra si hay una palabra). Nombre en
  `text-lg` 600 con «…» y debajo, en `text-sm` `ink-2`, «Ciudad (Provincia) · CP»: la provincia solo sale si no es Valencia y no se llama
  igual que la ciudad («Pego (Alicante) · 03780», «Oliva · 46780», «Madrid · 28014»). Sin paginación de flechas: 12 clientes y un `.m-btn`
  a ancho completo «Ver más clientes (N)» con los que faltan, que añade 12 por pulsación y desaparece al llegar al final; al cambiar un
  filtro vuelve a los 12 primeros. Cargando, sin resultados y error: los mensajes del escritorio, sin cabecera de tabla, en una tarjeta blanca.
- **Desplegable de campo** (`FieldDropdown`, `.panel-select`; en Clientes y en los periodos de Comparativa): sustituye al `<select>` nativo, cuya lista emergente
  la dibuja el navegador, no se puede estilar y solo se abre al pulsar sobre el propio `select`. Todo el campo (`.panel-select-toggle`, con la
  misma forma que `.panel-field.is-labelled`) es el botón: la palabra, el valor y la flecha abren la lista. Al abrir, borde y anillo
  naranjas y la flecha gira. Lista (`.panel-select-menu`): superficie blanca, borde `--rm-line`, radio `--rm-radius`, `--rm-shadow-raised`,
  padding 6 px, empieza donde empieza el campo y es al menos igual de ancha (el de Ciudad crece hacia la izquierda para no chocar con el borde
  de la tarjeta), con 13 rem de alto como máximo y barra de desplazamiento fina: cabe en la tarjeta incluso en el estado «sin resultados».
  Opciones de `text-md` con radio `--rm-radius-sm`; al pasar el cursor, `--rm-tint`; la elegida, `--rm-orange-tint`, `--rm-orange-ink` y
  600. Con `large` (móvil) las opciones miden 44 px y usan `text-lg`. Teclado: Enter o ↓ abren, flechas mueven, Enter elige, Escape cierra y
  el foco vuelve al campo. Nombre accesible «Provincia: Todas».
- **Comparativa** (`.compare-page`, 24 px entre bloques en escritorio, 14 px en móvil con el mismo margen negativo que Clientes). Encabezado
  `.panel-heading` con «Dos periodos, uno al lado del otro» en `.panel-period`. No lleva el enlace «‹ Más» del artboard móvil, igual que
  Clientes. Los datos salen de `/api/statistics/compare` (A y B: resumen, ventas por día; y el desglose por marca, familia, sección,
  talla y color, todas las filas ordenadas por A; el color sin definir sale como «Sin color»); los días, semanas, meses y años se agrupan
  en el navegador (`utils/compare.js`), así que cambiar Días/Semanas/Meses/Años o Marca/Familia/Sección/Talla/Color no pide nada al servidor.
  Barra de periodos (`.compare-controls`, tarjeta con la rejilla `auto · 1fr · vs. · 1fr`, 20 px): «Comparar» con Fechas / Campañas /
  Temporadas (`.panel-segs`) y dos campos con punto naranja (A) o `--rm-compare` (B) y su etiqueta encima. En Campañas y Temporadas el
  campo (`.compare-select`, 44 px) es un `FieldDropdown` sin palabra interior (`showLabel={false}`): enseña el nombre en 600 y, a la derecha,
  el rango («1 jul – 31 ago», también en móvil), y la lista es la de Clientes con el rango en `.panel-select-detail` (`text-sm`, `ink-2`) a la
  derecha de cada opción; la de B se abre hacia la izquierda (`alignEnd`). Solo salen las que ya han empezado. Por defecto A es la última que ya
  terminó (o la que está en curso) y B su edición anterior; al elegir otra A, B vuelve a su edición anterior. En Fechas, los campos
  Desde / Hasta de Ventas (`CustomDates`) con sus avisos; empieza en el último mes cerrado frente al mismo mes del año anterior.
  Mientras la tarjeta mide menos de 996 px (escritorio, container query `compare` sobre `.compare-page`; es el ancho en que
  dos campos Desde / Hasta ya no caben en fila por periodo), igual en las tres opciones, «Comparar» va en columna (Fechas / Campañas /
  Temporadas apiladas) y, en Fechas, las fechas también; en Campañas y Temporadas el campo único de cada periodo se centra en vertical, a la
  altura del botón del medio, y es más alto (mín. 3,75 rem): el nombre entero arriba (puede partirse en dos líneas) y el rango debajo. Los tres bloques se centran en vertical, las tres etiquetas («Comparar», «Periodo A», «Periodo B») quedan a la misma
  altura y «Desde» y «Hasta» se separan 30 px para que su columna mida lo mismo que la de «Comparar»; el «vs.» se centra en vertical
  respecto a los campos. Por debajo de 992 px manda el diseño de móvil, y por debajo de 576 px Desde y Hasta van en columna.
  KPI (`.compare-kpi`, 4 en fila desde 1307 px y 2 por debajo; de 1100 a 1306 px y de 576 a 991 px, con tarjetas anchas, la pastilla va arriba
  a la derecha y la nota «frente a…» (en móvil «2025: X») pasa a la derecha de la cifra, alineada a la derecha; de 992 a 1099 px caben justas
  y no se reparten, y por debajo de 576 px manda el diseño de móvil con la pastilla bajo la cifra): etiqueta en `text-md` 600 con `DeltaPill` a la derecha, cifra en serif
  `display-sm` y «frente a X en 2025» en `text-sm` `ink-2`. En móvil la pastilla baja bajo la cifra, la cifra es `display-xs` y la nota
  pasa a «2025: X». Ticket medio = ventas / tickets. El nombre corto del periodo B es el año si A y B son de años distintos; si no, el nombre.
  Gráfica y desglose (`.compare-main`, 7/5 desde 1368 px, apiladas por debajo (con menos, el nombre del desglose se quedaba en «E…»), tarjetas del mismo alto): la gráfica de barras
  (320 px, 260 en móvil) se baja con `mt-auto`. El control es Días / Semanas / Meses / Años. Días = una barra por día; Semanas = la
  primera desde el primer día del periodo y las demás desde el lunes; Meses = la primera desde el primer día y las demás desde el día 1;
  Años = la primera desde el primer día y las demás desde el 1 de enero (etiqueta «2026»); A y B se emparejan por posición. Etiquetas «6 jul» (móvil «6/7»); los meses llevan el año («ene 22») cuando A o B abarcan más de un año. El tooltip enseña, junto a cada punto de color, el rango exacto de esa barra en su periodo («3 ene – 7 ene 2026», con el año en los dos extremos si cruza de año), no el nombre del periodo. La
  leyenda va bajo el título en escritorio y a su derecha en móvil (solo el año). El desglose en escritorio es una tabla
  (`.compare-row`: nombre · A · B · Diferencia, filas de 47 px, importes redondeados con `formatEurosRound`, A en 600, B en `ink-2`); en
  móvil, una lista (`.compare-item`) con el nombre, «2025: X» debajo y, a la derecha, el importe de A con la pastilla. El control
  Marca / Familia / Sección / Talla / Color (`.is-breakdown`) va en su propia fila bajo el título, a ancho completo, porque cinco
  pestañas no caben junto a él (en la tarjeta estrecha las pestañas se reparten el ancho con 6 px de relleno). El desglose se pagina de 5 en 5 (`BREAKDOWN_PAGE_SIZE`) con el pie de `Pagination` sin extremos
  (`.compare-foot`, sin padding lateral, abajo del todo con `mt-auto`) y «Mostrando 1–5 de 9 marcas»; `.compare-body` reserva el alto
  de 5 filas (16,9375 rem en escritorio, 17,5 rem en móvil) para que las tarjetas no cambien de alto con Sección (2 filas) ni con
  la última página, y la gráfica no se queda con un hueco blanco enorme. Cambiar de pestaña o de periodo vuelve a la página 1. Cargando:
  siluetas por tarjeta; error: `CardError` en una tarjeta; sin dos periodos válidos: «Elige los dos periodos para compararlos.».
- **Gastos, cabecera y periodo** (`.expenses-page`, 24 px entre bloques; en móvil 14 px y el mismo margen negativo que Clientes). Los datos salen de
  `/api/statistics/expenses` (ingresos = `amount`, gastos = `cost`, beneficio = `profit` de `v_sales`, agrupados por mes o por año en el SQL).
  Cabecera `.expenses-head` (`align-items: flex-end`, `space-between`, 24 px, se parte en dos líneas): a la izquierda `.panel-heading` con
  «Lo que cuesta la ropa que vendes, frente a lo que ingresas» en `.panel-period`; a la derecha, a 12 px, el campo Periodo y el control
  segmentado (`.panel-segs.is-plus`). Periodo es un `FieldDropdown` (`.expenses-period`, 300 px) con el valor en 600; con «Años» el campo se
  bloquea (`disabled`) en «Todos los años · 2020 – 2026». Opciones: «Este año · 1 ene – 4 oct 2026», «Una campaña…», «Una temporada…»,
  «Fechas concretas…»; al elegir una de las tres últimas sale una fila propia bajo la cabecera (`.expenses-extra`): un `FieldDropdown`
  (`.expenses-pick`, 384 px, con el rango a la derecha de cada opción) con las campañas o temporadas que ya han empezado, o los campos
  Desde / Hasta de Ventas (`CustomDates`). Por defecto, la última que ya terminó. Todo se aplica al momento; si las fechas no valen no se
  pide nada y se sigue enseñando el último periodo válido con su texto. El rango se recorta a hoy (una campaña en curso no pinta meses futuros).
  El rango se escribe con `formatBucketRange` («1 ene – 4 oct 2026»), no con `formatShortRange`, que pone un punto tras el mes.
- **Calendario** (`.calendar-page`, 24 px entre bloques en escritorio, 14 px en móvil con el mismo margen negativo que Clientes, aquí de −14 px
  arriba y −8 px abajo). Rejilla propia de CSS (sin librería): la lógica (semanas empezando en lunes, tramos de cada campaña por semana con
  su carril, eventos del mes, próximas fechas) vive en `utils/calendar.js` con tests y los componentes solo pintan (`CalendarGrid`,
  `CalendarCompact`, `CalendarToolbar`). Los datos son los de `/campaigns` y `/seasons`; las fechas llegan como `YYYY-MM-DD` y se leen
  con `parseISO` (fecha local, no UTC).
  Escritorio: encabezado `.calendar-head-row` con el `.panel-heading` a la izquierda (el kicker lleva `line-height` 1 rem para clavar
  el alto del diseño) y, alineada por abajo, la barra `.calendar-toolbar` a 10 px: **Hoy · ‹ · Mes año · ›**. Los botones (`.calendar-btn`)
  miden 40 px, borde `--rm-line-strong`, radio `--rm-radius-btn`; «Hoy» con padding 0 14 px, `text-md` 600; las flechas son cuadradas.
  El mes va en serif `display-xs`, centrado en 12,5 rem fijos, con `aria-live="polite"`. Debajo, `.calendar-layout`: la tarjeta del mes
  ocupa el espacio libre y «Próximas fechas» (`.calendar-side`) mide 16,5 rem, con 24 px entre las dos, y no se estira. Por debajo de
  1200 px la lateral baja bajo el calendario a ancho completo (con menos, las siete columnas no caben).
  Tarjeta del mes (`.calendar-card`, `.data-card` sin padding): cabecera de 42 px con LUN…DOM en `text-xs` 600 mayúsculas, `ink-2`,
  `letter-spacing` 0,08em y 16 px a la izquierda; cada semana (`.calendar-week`) mide 140 px con borde superior `--rm-cal-line` (el
  primero hace de línea de la cabecera). Sale el número de semanas que pida el mes (4, 5 o 6). Cada semana son tres capas: las celdas
  (`.calendar-cell`, fondo `--rm-cal-weekend` el sábado y el domingo; el número va en una caja de 28 px a 8 px del borde, `text-sm` 500;
  hoy es un círculo `--rm-orange-strong` con el número blanco en 600; fuera del mes, `--rm-cal-out`), los eventos
  (`.calendar-events`, rejilla de 7 columnas y carriles de 24 px que empiezan a 41 px del borde de arriba) y, encima, las líneas
  verticales (`.calendar-lines`, 1 px `--rm-cal-line`), que **cruzan las barras**: así la barra se ve continua por debajo y la línea por
  encima, como en el diseño. Una campaña es un `.calendar-bar` de 24 px: fondo `--rm-event`, texto `--rm-event-ink` en `text-xs` 500 con 8 px de
  padding, el nombre una vez por semana al principio del tramo y **cortado con «…» al ancho de un solo día** aunque la barra siga. Solo se redondea
  (`--rm-radius-xs`) y se separa 6 px del borde donde la campaña empieza o termina de verdad (`.starts` / `.ends`); si sigue en la semana
  siguiente, la barra llega al borde de la tarjeta. La parte que cae fuera del mes se pinta con `--rm-cal-event-out` y su texto con
  `--rm-cal-event-ink-out` (un degradado duro por tramo, con las variables `--before`, `--after` y `--span`). Al pasar el cursor, `--rm-event-hover`.
  Un cambio de temporada (`.calendar-season`) no es una barra: punto de 6 px y «Empieza X» / «Termina X» en `text-2xs` 500 con `--rm-nav`
  (fuera del mes, `--rm-cal-out`), una celda de ancho, **cortado sin puntos suspensivos** (así sale en el diseño). Las campañas ocupan los
  carriles de arriba y los cambios de temporada rellenan los huecos. Todo lo que se pulsa es un `<button>` que llama a `openItem`, con foco
  `--rm-orange-strong` dentro del elemento. **Si no caben** (más de 4 carriles) se enseñan 3 y el cuarto lleva «+N más» por día
  (`.calendar-more`, `text-xs` 600, `ink-2`), que abre `.calendar-pop`: tarjeta de 15 rem con el día en `.panel-label` y un botón por evento;
  se cierra con Escape (el foco vuelve a «+N más»), con un clic fuera o al cambiar de mes.
  «Próximas fechas» (`.calendar-side`, padding 22 px): título `.panel-card-title` y 5 filas `.calendar-next` (botón, padding 16 px, borde superior
  `--rm-line-soft` también en la primera, radio `sm`): ficha `.calendar-chip` de 46 px (borde `--rm-line`, radio `sm`, día en `text-lg` 700 y mes
  en `text-2xs` 600 mayúsculas `ink-3`; la primera, `--rm-orange-tint` sin borde y texto `--rm-orange-ink`), a 12 px el nombre en `text-md` 500
  (hasta dos líneas) y «en 14 días» / «mañana» / «hoy» en `text-sm` `ink-2`. Regla: de cada campaña futura, su inicio; de la que está en curso, su
  final («Termina …»); de las temporadas, inicio y final. Debajo, una línea `--rm-line-soft` y la leyenda (`text-xs-plus`, `ink-2`): muestra de
  barra de 22 × 12 px en `--rm-event`, punto `--rm-nav` y «Pulsa una campaña para ver sus datos.».
  Móvil (<992 px): encabezado con las reglas móviles de `.panel-heading` y debajo **‹ · Mes año · › · Hoy** con botones de 44 px y el mes
  en el espacio libre. Tarjeta compacta (`.calendar-compact`, padding 12 × 5 px, radio `lg`): iniciales L M X J V S D en `text-xs` `ink-3`,
  semanas de 56 px, números de 32 px centrados en `text-md-plus` 500 (hoy, círculo naranja con el número blanco en 600), sin líneas, sin fondo de
  fin de semana y sin texto. La campaña es una barra de 5 px bajo el número (`--rm-cal-bar`, más clara fuera del mes con `--rm-cal-bar-out`;
  redondeada solo en el inicio y el final reales) y el cambio de temporada, un punto de 5 px `--rm-nav` más abajo. Pulsar un día no hace nada.
  Debajo, «En septiembre» (`.calendar-month-card`: título en minúscula, una fila por evento con barra de 14 × 6 px o punto de 10 px,
  nombre en `text-lg` 600 y «Campaña · 15 sep – 12 oct» / «Temporada · 1 sep» en `text-sm` `ink-2`; sin eventos, «No hay campañas ni cambios de
  temporada este mes.» en `.panel-muted`). Después el título «Próximas fechas» **fuera** de la tarjeta (`text-md` 600, 4 px de sangría) y una
  `.m-list` con las mismas 5 fechas (filas de 64 px, ficha de 44 px, nombre en una línea con «…», sin abreviar los nombres de temporada) y, por
  último, la leyenda en una fila (sin la frase «Pulsa…»).
  Estados: cargando, la rejilla se pinta sin eventos y «Próximas fechas» y «En <mes>» dibujan `.panel-skeleton`; con error, `CardError` en esas dos
  tarjetas (reintenta la petición que falló); sin fechas, «No hay fechas próximas.» en `.panel-muted`.
- **Campañas y temporadas** (`.planning-page`, 24 px entre bloques; en móvil 14 px y margen de −15 px arriba y −8 px abajo sobre `.app-main`).
  Una sola ruta, `/planificacion/campanas` o `/planificacion/temporadas`; las rutas viejas de «Tipos de…» redirigen a la pestaña que les toca.
  Cada **fila es un tipo** (`period_types`) y al desplegarla salen sus **ediciones** (`periods`); el navegador las agrupa por `period_type_id`
  con `/campaign_types` + `/campaigns` (o los de temporadas), sin endpoint nuevo. La lógica (orden por día del año, estado, «Última vez»,
  recuentos, textos de aviso) está en `utils/planning.js` con tests y los componentes solo pintan (`PlanningTable`, `PlanningCards`).
  Encabezado: kicker «Planificación del año» (con `line-height` 1 rem, como en el Calendario) y titular. **Pestañas** (`.planning-tabs`,
  `role="tablist"`): «Campañas» y «Temporadas» a 32 px, `text-md-plus`, 42 px de alto, activa en `ink` 600 con raya de 2 px `--rm-orange`, inactiva
  `ink-2` 500; la fila lleva una línea de 1 px `--rm-tabs-line` debajo, y la tarjeta queda 20 px más abajo. Cada pestaña lleva el **número de
  tipos** en `.planning-count` (pastilla de 16 px, `text-2xs` 600: `--rm-segs-bg` / `--rm-ink-2` inactiva, `--rm-orange-tint` / `--rm-orange-ink`
  activa); no se enseña hasta tener el dato y cuenta también los tipos que no se repiten.
  Tarjeta (`.planning-card`, `.data-card` con 14 px de padding abajo). **Barra superior** (`.planning-bar`, padding 20 × 24 px): el texto de
  introducción en `text-md` `ink-2` (máx. 32,5 rem, dos líneas) a la izquierda y, a 10 px, «Generar años pendientes» (`.panel-btn`, 42 px, `bi-arrow-clockwise`;
  mientras trabaja, desactivado y con `.spinner-border-sm` naranja) y «Nueva campaña / temporada» (`.btn-brand` a 42 px, radio `--rm-radius-btn`, `text-md`,
  `bi-plus-lg`; crea un tipo). El resultado de generar sale debajo del texto en `.panel-note` con `role="status"` («Se han creado 2 ediciones.»,
  «Se ha creado 1 edición.», «Ya estaba todo al día.») y se quita a los 6 s; nada de `alert()`.
  **Tabla** (`.planning-table`, dentro de `.sales-scroll`; no baja de 58 rem y por debajo se desplaza dentro de su tarjeta): rejilla
  `14px 350fr 240fr 190fr 133fr 70px` con 16 px entre columnas y padding 0 24 px (flecha · Nombre · Estado · Última vez · Ediciones · Acciones).
  Cabecera de 44 px en `--rm-cream-light`, `text-xs-plus` 600 `ink-2`, sin mayúsculas ni orden; «Acciones» a la derecha. **Fila de tipo** (`.planning-type`,
  borde superior `--rm-line-soft`; `.planning-row` de 68 px): flecha `bi-chevron-right` `ink-2` (desplegada, `bi-chevron-down` en `--rm-orange`),
  nombre en `text-lg` 500 y debajo el rango «7 ene → 28 feb» en `text-xs-plus` `ink-2`; **estado** en `.planning-pill` de 26 px (`text-xs-plus` 600:
  `--rm-tint` / `--rm-nav` para «Empieza en N días», «Empieza mañana», «Empieza hoy» y «Terminada»; la de «En curso · quedan N días» usa los colores
  y el punto de `.campaign-pill` / `.campaign-dot`); **última vez**: el beneficio (no el balance) de la última edición ya terminada, redondeado y con signo en 600
  (`+6.215 €`, `--rm-positive`; con pérdidas, «−» y `--rm-negative`) y «de beneficio en 2026» (o «2025-26» si cruza de año) debajo; sin ediciones terminadas,
  «—» y «sin ediciones terminadas»; **ediciones**: «7 campañas» (singular con 1) en `text-md` `ink-2`, cuenta todas las guardadas; **acciones**: lápiz y papelera
  (`.planning-icon-btn`, 32 px, sin borde, `ink-2`, `--rm-orange-strong` al pasar) que editan o eliminan el **tipo**. El estado sale de las ediciones guardadas más
  las que saldrían de las fechas del tipo para los años que aún no existen (así no depende de «Generar años pendientes»): una edición está en curso desde
  el día siguiente a su inicio hasta su fin y el día que empieza dice «Empieza hoy». Un tipo que no se repite y ya pasó queda «Terminada». El orden es el del
  día del año en que empieza el tipo (enero primero), no el de hoy. Pulsar la fila (salvo las acciones) la despliega; el botón que lleva el nombre
  (`.planning-toggle`) tiene `aria-expanded` y `aria-controls`. **Solo hay una fila abierta a la vez**, todas plegadas al entrar.
  **Ediciones desplegadas** (`.planning-open`, la fila se pone en `--rm-row-open`): caja `.planning-editions` en `--rm-cream-light` con borde `--rm-line-box` y radio
  `--rm-radius`, que empieza en la columna Nombre (54 px) y acaba a 24 px del borde, pegada a la fila y a la siguiente. Cabecera de 39 px (`text-xs` 600 `ink-2`) y
  filas de 47 px separadas por `--rm-line-box`, en `text-sm-plus`; rejilla `280fr 252fr 118px 118px 128px 44px`: Edición (500) · Fechas («7 ene – 28 feb 2026», `ink-2`) ·
  Gastos · Beneficio · Balance (a la derecha, cifras tabulares, balance en 600 con signo y `--rm-positive` / `--rm-negative`) · lápiz que edita **esa edición**
  (no hay papelera por edición). Un tipo sin ediciones dice «Sin ediciones. Pulsa «Generar años pendientes» para crearlas.» en `.panel-muted`.
  **Diálogos**: se sigue usando `ModalComponent` (deuda conocida más abajo). Para el tipo manda el campo `first_year` («Año de inicio»), que es la columna que existe;
  en una edición el nombre y el beneficio salen de solo lectura (el nombre se calcula y el beneficio viene de las ventas). Eliminar un tipo pregunta con
  `window.confirm` y avisa de cuántas ediciones se borran con él (la clave foránea es `ON DELETE CASCADE`).
  **Desde el Calendario**: `openItem` guarda la edición en `temporalItem`; al llegar se abre la pestaña, se despliega su tipo, se baja hasta la edición
  (`scrollIntoView`, sin animación con `prefers-reduced-motion`) y se marca 2,5 s con `--rm-orange-tint-soft`; después se borra `temporalItem`.
  **Móvil** (<992 px): las pestañas son un control segmentado (`.planning-segs` sobre `.panel-segs`, padding 3 px, botones de 44 px en `text-lg`) con el mismo
  recuento; debajo el texto de introducción en `text-sm-plus` `ink-2` **fuera** de cualquier tarjeta y «Nueva campaña» a ancho completo (`.btn-brand`, 50 px).
  Cada tipo es su tarjeta (`.planning-m-card`, radio `lg`, `--rm-shadow`, 12 px entre tarjetas; abierta, borde `--rm-orange-line-soft`). La cabecera es un botón
  (`.planning-m-head`, padding 15 × 16 px): nombre en `text-lg` 600, «7 ene → 28 feb · 7 campañas» en `text-sm` `ink-2`, y en una fila que se parte
  (`flex-wrap`) la pastilla (24 px, `text-xs`) y «Última: +6.215 € en 2026» en `text-sm`; a la derecha, `bi-chevron-right` / `bi-chevron-down` naranja centrada en vertical.
  Desplegada: cada edición en un bloque con línea `--rm-line-box` (nombre en `text-md` 600 con el lápiz de 44 px a la derecha, fechas en `text-sm` `ink-2` y tres columnas
  Gastos · Beneficio · Balance con la etiqueta en `text-xs` y el valor en `text-sm`) y, al final, «Editar» y «Eliminar» (`.planning-m-action`, 44 px, con borde) que actúan
  sobre el **tipo**. Como en el diseño, «Generar años pendientes» no sale arriba; por decisión añadida, va al final de la lista como `.m-btn` a ancho completo.
  **Estados**: cargando, la cabecera de la tabla se queda y el cuerpo dibuja filas de `.panel-skeleton` (en móvil, tarjetas); las pastillas del recuento no
  salen hasta tener el dato. Error: `CardError` («Reintentar» repite la petición que falló). Vacío: «Todavía no hay campañas.» / «Todavía no hay temporadas.» centrado en `.sales-state`.
- **Paginación** (`.data-foot`, común a Ventas, Clientes y Campañas y temporadas): pie con padding 14 × 24 px, borde superior
  `--rm-line-soft`, `text-sm-plus` y `ink-2`. A la izquierda «Mostrando 1–12 de 2.165 líneas», con separador de miles en todos
  los números. A la derecha, a 8 px: primera · anterior · «Página **1** de 181» (el número actual en `ink`, 600) · siguiente · última.
  Los botones (`.data-page`) son de 36 × 36 px, radio `sm`, borde `--rm-line-strong`, con `bi-chevron-double-left/right` en los
  extremos; desactivados, el icono pasa a `--rm-icon-disabled`. En la primera página, primera y anterior están desactivadas; en la
  última, siguiente y última. Los extremos solo salen en escritorio (`edges`). Ventas y Clientes paginan de 12 en 12; el resto, de 10 en 10.
- **Enlace de tarjeta** (`.panel-link`): «Ver todas» y similares, `text-sm` 600 en `--rm-orange-strong`, con
  `bi-chevron-right` detrás; al pasar el cursor, `--rm-orange-ink`.
- **Campaña en curso** (`.campaign-current`): caja `--rm-surface-soft` con borde `--rm-line-soft` y radio `--rm-radius`,
  dentro: pastilla `.campaign-pill` («En curso», con `.campaign-dot` naranja), nombre `.campaign-name` (`text-icon`, 600),
  fechas y día en `.panel-muted`, barra `.panel-track.is-thin` y los tres datos Gastos / Beneficio / Balance.
  El balance lleva signo y color: `.text-positive` o `.text-negative`. Con un filtro de sección activo, debajo
  va la nota de que las cifras son de esa sección y que los gastos se reparten según lo que vendió: el gasto de
  una campaña no es de Mujer ni de Hombre, así que se prorratea y hay que decirlo.
- **Botón de icono** (`.panel-icon-btn`): cuadrado de 2,75 rem (44 px, objetivo táctil mínimo), borde `--rm-line`,
  radio `sm`; para acciones sin texto como «Actualizar los datos» en el encabezado. Al pasar el cursor pasa a
  `--rm-orange-strong`.
- **Carga** (`.panel-skeleton`): siluetas grises (`--rm-line-soft`) que laten 1,4 s; cada tarjeta dibuja la suya con
  la forma de su contenido (`is-hero`, `is-stat`, `is-bars`, `is-chart`, `is-box` y los anchos `w-25`/`w-50`/`w-75`
  de Bootstrap). Nunca enseñar ceros mientras se carga: un cero es un dato y se lee como tal.
- **Error de carga**: dentro de la tarjeta afectada, «No se han podido cargar estos datos.» en `.panel-note` y un
  `.btn-brand-outline` «Reintentar». Falla solo la tarjeta que falla; las demás siguen con sus datos.
- **Iconos**: Bootstrap Icons, tamaño `--rm-text-icon`.

## Responsive

Puntos de corte de Bootstrap: 576 · 768 · 992 · 1200 px. Diseñar primero para escritorio (uso en tienda/oficina)
y comprobar siempre en móvil (375 px): sin scroll horizontal, objetivos táctiles ≥ 44 px.

**El corte entre los dos diseños del prototipo es 992 px**, y es el único: por debajo manda el diseño de móvil
(390 px del prototipo), de ahí para arriba el de escritorio (1440 px). No hay diseño de tablet, así que entre
992 y 1199 px se usa el de escritorio reflujado: barra lateral de 15.5rem y las rejillas de contenido (`col-xl-*`)
apiladas a ancho completo. El corte vive en cinco sitios y se mueven juntos: `useIsMobile` (991),
`flex-lg-row` en `Layout.jsx` y los tres `@media` de `App.css` (991.98 / 992).

## Movimiento

- Transiciones de 0.2s `ease` para color/fondo/borde; entradas con `cubic-bezier(0.2, 0.7, 0.2, 1)`.
- Respetar siempre `prefers-reduced-motion: reduce` (desactivar animaciones).

## Accesibilidad

- Contraste mínimo AA (4.5:1 texto normal). `ink-3` solo sobre superficie blanca (5.1:1); sobre `--rm-cream` no llega (4.1:1), usar `ink-2`. Nunca para datos clave.
- Foco visible en todo lo interactivo; no quitar `outline` sin sustituirlo.
- No comunicar positivo/negativo solo con color: añadir signo (+/−) o icono.

## Deuda conocida (migrar al sistema)

- `components/ModalComponent.jsx`: el diálogo de escritorio sigue con la cabecera `bg-primary`, el pie
  `bg-secondary-subtle` y los campos cuadrados de Bootstrap → migrar al diálogo del prototipo
  (`Campanas.dc.html`: radio 20px, título en serif, campos `rm-input`). Los `alert()` y `confirm()` del
  navegador caen con ello.
- Los mensajes de validación de Yup salen en inglés («name must be at most 30 characters»).
