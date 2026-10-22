# Estadísticas — Rafael Moda

Panel de estadísticas (ventas, gastos, clientes, planificación) para una tienda de ropa. Proyecto final de DAW, en refactor (rama `refactor`).

- `frontend-react/`: React 19 + Vite + React Bootstrap + Recharts. `npm run dev`
- `backend-node/`: Express 5 + MySQL (`mysql2`) + JWT + bcrypt. `npm run dev`. Esquema en `db/schema.sql` y datos de ejemplo en `db/seed.sql` (`npm run seed` los regenera hasta hoy).

Inicio no se baja las ventas: pide agregados ya calculados a `/api/statistics/{summary,daily,brands}`, que
reciben el rango (`from`, `to`, `comparedFrom`, `comparedTo`) y la sección opcional. Las fechas se calculan en el
navegador (`utils/dates.js`, con tests) y el SQL solo suma.

## Diseño

@DESIGN.md

Antes de cualquier cambio visual (CSS, componentes, gráficas, layout), lee DESIGN.md. Todo cambio visual debe seguirlo. Si un cambio necesita algo que DESIGN.md no cubre, proponlo y actualiza DESIGN.md en el mismo cambio.

## Forma de trabajar

- Antes de una funcionalidad nueva o un cambio grande: sesión de `grill-me` para cuestionar el plan.
- Lógica con cálculos (estadísticas, filtros, fechas): `tdd`.
- Cambios en login, JWT, consultas SQL o endpoints: pasar `/security-review` antes de hacer commit.
- Comprobar los cambios de UI en el navegador (Chrome DevTools MCP): consola sin errores, escritorio y móvil (375 px).
- Explica las decisiones: Manuel tiene que entender y poder defender cada cambio en una entrevista.
