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
Comparativa). Se dibujan con `components/PairedBarChart.jsx`, que pasa los tokens como `var(--rm-*)`
a Recharts; no escribir hex en las gráficas de comparación.

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
- Escala de texto: `--rm-text-xs` 12 · `sm` 13 · `md` 14 · `lg` 15 · `base` 16 · `icon` 17 · `xl` 20 · `2xl` 22 px.
- Escala display: `--rm-display-2xs` 24 · `xs` 28 · `sm` 36 · `md` 40 · `lg` 42 · `xl` 46 · `2xl` 52 · `3xl` 58 px.
- Etiquetas / kickers: `--rm-text-xs`, 600, MAYÚSCULAS, `letter-spacing: 0.08em` (0.12em en login).
- Cifras en tablas: alinear a la derecha y usar `font-variant-numeric: tabular-nums`.
- Formato español, siempre desde `utils/format.js`: importes con separador de miles y dos decimales
  (`4.902,21 €`) y porcentajes con un decimal (`+9,9 %`, `76,0 %`). El `es-ES` de `toLocaleString` no agrupa
  los números de cuatro cifras, por eso los formateadores pasan `useGrouping: 'always'`.

## Forma, sombra y espacio

- Radios: `--rm-radius-sm` 10 · `--rm-radius` 12 · `--rm-radius-lg` 18 px (tarjetas = `lg`).
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
