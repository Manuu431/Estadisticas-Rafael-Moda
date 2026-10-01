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
| Periodo comparado (serie) | `--rm-compare` | #CFC3B5 |
| Bordes | `--rm-line` · `-strong` · `-soft` · `-dashed` | |

- El naranja es el **único** acento: acción principal, elemento activo, foco. No usarlo para decorar.
- Botón relleno = `--rm-orange-strong` (el `--rm-orange` puro no da contraste suficiente con texto blanco).
- Positivo/negativo siempre con el token, nunca verde/rojo puros (`#008000`, `#ff0000`).
- Foco: `--rm-orange-focus` como anillo.

### Gráficas (Recharts)

Serie categórica, en este orden: `#DD6C10, #1176A6, #5E8C2A, #4A3AA7, #1E9E86, #A3261B, #B3308A`;
el resto agrupado como "Otras" en `#8C8178`. Rejilla `#F2ECE5` (= `--rm-line-soft`), solo horizontal.
Separador entre barras/porciones: `#FFFFFF`. Fuente única de verdad: `SERIES_COLORS` en
`pages/controlPanel/ControlPanelComponents.jsx` — reutilizarla, no crear paletas nuevas.

**Comparación de dos series** (no categórica): la serie principal en `--rm-orange` y la de contraste
en `--rm-cost` (ingresos frente a coste, en Gastos) o `--rm-compare` (periodo A frente a B, en
Comparativa). Se dibujan con `components/PairedBarChart.jsx`, que pasa los tokens como `var(--rm-*)`
a Recharts; no escribir hex en las gráficas de comparación.

## Tipografía

- Interfaz y datos: `--rm-font` (Figtree 400/500/600/700).
- Titulares de página y cifras destacadas: `--rm-font-display` (Instrument Serif, peso 400, `line-height` ~1).
- Escala de texto: `--rm-text-xs` 12 · `sm` 13 · `md` 14 · `lg` 15 · `base` 16 · `icon` 17 · `xl` 20 px.
- Escala display: `--rm-display-2xs` 24 · `xs` 28 · `sm` 36 · `md` 40 · `lg` 46 · `xl` 52 px.
- Etiquetas / kickers: `--rm-text-xs`, 600, MAYÚSCULAS, `letter-spacing: 0.08em` (0.12em en login).
- Cifras en tablas: alinear a la derecha y usar `font-variant-numeric: tabular-nums`.

## Forma, sombra y espacio

- Radios: `--rm-radius-sm` 10 · `--rm-radius` 12 · `--rm-radius-lg` 18 px (tarjetas = `lg`).
- Sombras: `--rm-shadow` (tarjetas en reposo), `--rm-shadow-raised` (elementos flotantes). Tonos marrones, nunca negro.
- Espaciado en múltiplos de 0.125rem (2 px); los habituales: 0.375, 0.5, 0.875, 1, 1.25, 1.5, 1.75 rem.
- Contenido principal: `padding: 2.25rem 2.75rem 2.75rem 1.25rem` (escritorio), `1.5rem 1rem 2rem` (<992px).

## Componentes

- **Tarjeta** (`.panel-card`): superficie blanca, borde `--rm-line`, radio `lg`, `--rm-shadow`, padding `1.625rem 1.75rem`.
  Título `.panel-card-title` (`text-lg`, 600). Separadores internos `.panel-divider`.
- **Encabezado de página**: `.panel-kicker` (`text-sm`, `ink-2`) encima de `.panel-title` (serif `display-lg`).
- **KPI**: etiqueta `.panel-label` + valor `.panel-stat` (`text-xl`, 600) o `.panel-display` (serif) para el principal.
- **Botones**: `.btn-brand` (relleno) para la acción principal (máx. uno por vista), `.btn-brand-outline` para la secundaria.
  Alto 50 px en formularios, 600, `text-lg`. Los botones se basan en Bootstrap vía variables `--bs-btn-*`, no se reescriben a mano.
- **Controles segmentados** (`.panel-segs`): para cambiar periodo/vista dentro de una tarjeta.
- **Navegación**: barra lateral (≥992 px, 15.5rem de ancho) con grupos en mayúsculas; en móvil, `MobileHeader` + `MobileTabBar` + `BottomSheet`.
- **Tablas**: superficie blanca, cabecera en `text-xs` mayúsculas `ink-2`, filas separadas con `--rm-line-soft`.
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
