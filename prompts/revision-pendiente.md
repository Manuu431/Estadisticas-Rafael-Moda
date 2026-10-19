# Revisión pendiente: Calendario y Campañas y temporadas

Todo lo que hice en esta sesión y lo que tienes que revisar cuando estés en tu PC. Rama `refactor`.
Está ordenado para ir de arriba abajo: primero qué se cambió, luego qué probar, luego las decisiones que
tienes que poder defender y, al final, lo que queda abierto.

---

## 1. Commits (de más antiguo a más reciente)

| Commit | Qué hace |
|---|---|
| `371ace2` | Lógica del Calendario con tests (`utils/calendar.js`, `calendar.test.js`) |
| `82aea47` | Calendario con rejilla propia: escritorio, móvil, «Próximas fechas», estados, CSS y `DESIGN.md` |
| `798da9c` | Quita `react-big-calendar` de `package.json` y del lock |
| `e2eae05` | Lógica de Campañas y temporadas con tests (`utils/planning.js`, `planning.test.js`) |
| `63986e4` | Arregla el diálogo de tipos (`start_year` → `first_year`) |
| `47c452e` | Campañas y temporadas con el diseño nuevo, rutas, CSS y `DESIGN.md` |

Para verlos: `git log --oneline 2d4ae50..HEAD` y `git show <hash>`. En conjunto son 21 archivos, unas 2.850 líneas añadidas y 750 quitadas.

Sin commitear (son tuyos, no los toqué): `docs/diseno/campanasYTemporadas.png`, `docs/diseno/campanasYTemporadas-m.png`, `prompts/campanas-y-temporadas.md`.

---

## 2. Archivos nuevos, cambiados y borrados

**Nuevos**
- `utils/calendar.js` y `utils/calendar.test.js`
- `utils/planning.js` y `utils/planning.test.js`
- `pages/calendar/CalendarGrid.jsx`, `CalendarCompact.jsx`, `CalendarToolbar.jsx`
- `pages/planning/PlanningTable.jsx`, `PlanningCards.jsx`, `PlanningParts.jsx`

**Cambiados**
- `pages/calendar/Calendar.jsx` (reescrito)
- `pages/Planning.jsx` (reescrito)
- `pages/calendar/calendarEvents.js` (ahora solo contiene `openItem`)
- `App.jsx` (redirecciones de las rutas viejas)
- `components/ModalComponent.jsx` (único cambio en un componente compartido)
- `App.css` y `DESIGN.md`

**Borrados**
- `pages/calendar/EventCalendar.jsx`
- `pages/calendar/CustomToolBar.jsx`
- La dependencia `react-big-calendar`

---

## 3. Qué probar tú, con la base de datos real

Yo solo pude probar con datos simulados (Chrome headless con las respuestas de la API inventadas). Esto es lo que falta:

### Calendario (`/calendario`)
- [ ] Se ve bien con las campañas y temporadas reales, en 1440 px y en 390 px.
- [ ] Ir a septiembre de 2026 y comparar con `docs/diseno/calendario.png` y `calendario-m.png`.
- [ ] Pulsar una campaña o un cambio de temporada lleva a Campañas y temporadas, abre su tipo y marca la edición.
- [ ] Un mes con muchas campañas el mismo día: sale «+N más» y se abre la lista del día (Escape la cierra).
- [ ] «Hoy», ‹ y › funcionan; el círculo naranja sale en el día actual.
- [ ] Consola sin errores. Probar también ~1100 px y 375 px.

### Campañas y temporadas (`/planificacion/campanas` y `/temporadas`)
- [ ] Comparar con `docs/diseno/campanasYTemporadas.png` y `-m.png`.
- [ ] Desplegar un tipo: se pliega el que estaba abierto.
- [ ] **Nueva campaña / temporada**: se crea el tipo y aparecen sus ediciones (esto antes estaba roto, ver 5.1).
- [ ] **Editar un tipo**: el campo «Año de inicio» sale relleno y se guarda.
- [ ] **Editar una edición**: se guardan fechas y gastos; el nombre y el beneficio no se pueden cambiar.
- [ ] **Eliminar un tipo**: el aviso dice cuántas ediciones se borran y, al aceptar, se borran de verdad.
- [ ] **Generar años pendientes**: el botón se desactiva con spinner y sale el mensaje («Se han creado N ediciones.» / «Ya estaba todo al día.»), sin `alert()`.
- [ ] Las rutas viejas redirigen: `/planificacion/tipos-campanas`, `/planificacion/tipos-temporadas`, `/tipos-campañas`, `/tipos-temporadas`.
- [ ] Llegar desde el Calendario pulsando una edición concreta.
- [ ] En móvil, «Editar» y «Eliminar» de dentro de la tarjeta actúan sobre el tipo.
- [ ] Un tipo que no se repite («50 aniversario») sale en la lista y dice «Terminada» cuando ya pasó.
- [ ] Un tipo sin ediciones dice «Sin ediciones. Pulsa «Generar años pendientes» para crearlas.».
- [ ] Probar con el backend parado: sale el error de tarjeta con «Reintentar».

### General
- [ ] `npm test` en `frontend-react` (en mi último intento: 413 tests en verde).
- [ ] `npm run build` sin errores.
- [ ] Revisar a ojo que las demás pantallas (Inicio, Ventas, Clientes, Comparativa, Gastos) no han cambiado. Toqué `App.css` en varios sitios; los tokens nuevos solo se añaden, pero conviene mirar.

---

## 4. Decisiones que tienes que poder defender

### Calendario
1. **Rejilla propia en vez de `react-big-calendar`.** El diseño tiene barras que cruzan la semana, puntos de temporada y una versión móvil con barras finas. Forzarlo sobre `.rbc-*` costaba más que pintarlo, y así la lógica queda en funciones puras con tests.
2. **Tres capas por semana:** celdas (fondo y número), eventos (rejilla de 7 columnas con carriles de 24 px) y líneas verticales encima. Las líneas van **por encima** de las barras porque así lo muestra el diseño (la barra se ve continua por debajo).
3. **Carriles:** las campañas se reparten primero (la más larga primero) y los cambios de temporada rellenan huecos. Una campaña no cambia de carril dentro de la semana.
4. **«+N más»:** si una semana tiene más de 4 carriles, se enseñan 3 y el cuarto lleva «+N más» por día. Se abre una lista del día. No está en el diseño: lo propuse y lo aceptaste.
5. **Regla de «Próximas fechas»:** de cada campaña futura, solo su inicio; de la que está en curso, su final; de las temporadas, inicio y final.
6. **Fechas con `parseISO`:** el backend manda `YYYY-MM-DD` (`dateStrings: true`), y `parseISO` lo lee como fecha local. `new Date('2026-09-01')` se leería como UTC y podría salir un día menos.
7. **Fuera del mes:** la parte de la barra que cae fuera del mes se pinta más clara con un degradado duro (variables `--before`, `--after`, `--span`).
8. **Nombre de campaña cortado a un día:** el diseño corta «Presentación Oto…» al ancho de un día aunque la barra siga; lo copié con `cqw`.

### Campañas y temporadas
1. **Dos pestañas en vez de cuatro.** Cada fila es un **tipo** y se despliega en sus **ediciones**. No hace falta endpoint nuevo: el navegador agrupa por `period_type_id`.
2. **El estado no depende de «Generar años pendientes».** Se calcula con las ediciones guardadas más las que saldrían de las fechas del tipo para los años que aún no existen (misma lógica que `buildPeriodInserts` del backend). Si alguien cambia las fechas de una edición guardada, manda la guardada.
3. **«Empieza hoy».** El día que empieza una edición dice «Empieza hoy» y «En curso» arranca al día siguiente. El documento original decía a la vez «hoy entre su inicio y su fin» y «Empieza hoy»; las dos no caben, elegí esta.
4. **«Última vez»** usa el beneficio (no el balance) de la última edición ya terminada. La que termina hoy sigue en curso.
5. **Orden de las filas:** por el día del año en que empieza el tipo, no por «lo próximo a hoy». Es el del diseño.
6. **Una sola fila abierta a la vez**, todas plegadas al entrar.
7. **Fila clicable con botón dentro:** la fila entera responde al clic, pero el control accesible es el botón del nombre (`aria-expanded`, `aria-controls`), para no anidar botones dentro de botones.
8. **Llegada desde el Calendario:** `openItem` guarda la edición en `localStorage` (`temporalItem`); al llegar se abre el tipo, se baja hasta la edición y se marca 2,5 s. Luego se borra `temporalItem`.
9. **Diálogos:** reutilizo `ModalComponent` sin migrarlo (sigue como deuda en `DESIGN.md`). Eliminar un tipo usa `window.confirm` con el número de ediciones que se borran.
10. **«Generar años pendientes» en móvil:** el diseño no lo tiene, así que lo puse al final de la lista como botón a ancho completo. Es un añadido mío.

---

## 5. Cosas que conviene mirar con atención

### 5.1 El diálogo de tipos estaba roto
`ModalComponent` mandaba `start_year`, que no existe en `period_types` (la columna es `first_year`). Con eso:
- **Crear un tipo** fallaba (el backend exige `first_year`, `NOT NULL`).
- **Editar un tipo** enseñaba el año vacío y el formulario no dejaba guardar.

Lo arreglé en `63986e4` renombrando el campo en el diálogo (validación, etiqueta, valores iniciales y el cálculo de días del mes). Además, en las **ediciones** el nombre y el beneficio salen de solo lectura. Revisa el diff de ese commit: es el único componente compartido que toqué.

### 5.2 Colores y medidas sacados del diseño
Mido sobre las imágenes (píxeles), no a ojo. Por eso hay valores que difieren del documento:
- Las barras de campaña son `--rm-event` (#FBE3CF), **no** `--rm-orange-tint` como decía el documento.
- La cabecera de días del Calendario mide 42 px (el documento decía ~44).
- Los botones de la cabecera del Calendario miden 40 px.
- Las barras del móvil son de 5 px (el documento decía ~4).
- La leyenda de «Próximas fechas» usa 12,5 px.

### 5.3 Tokens nuevos (`:root` de `App.css`)
`--rm-text-2xs` (11 px), `--rm-radius-xs` (6 px), `--rm-cal-event-out`, `--rm-cal-event-ink-out`, `--rm-cal-bar`, `--rm-cal-bar-out`, `--rm-line-box` (alias de `--rm-cal-line`), `--rm-tabs-line`, `--rm-row-open`, `--rm-orange-line-soft`. Están documentados en `DESIGN.md`.

### 5.4 Ajustes locales que no son del sistema
- `.calendar-page .panel-kicker` y `.planning-page .panel-kicker` llevan `line-height: 1rem`. El encabezado compartido sale ~4 px más alto que en el prototipo; lo compensé solo en estas dos pantallas y no toqué `.panel-kicker`.
- La tabla de Campañas y temporadas no baja de 58 rem y, por debajo, se desplaza dentro de su tarjeta (como `.sales-scroll` en Ventas).

---

## 6. Diferencias con el diseño (para que no te sorprendan)

- **La fecha real no es la del diseño.** El diseño usa hoy = 28 sep 2026 y yo me adapto a la fecha real. Por eso «Próximas fechas», los estados («Empieza en N días») y «Última vez» no coinciden con la imagen. Septiembre de 2026 en el Calendario sí se compara bien.
- **Calendario, móvil:** el prototipo deja uniones más oscuras de 2 px entre las barras fuera del mes; parece un efecto de su implementación y no lo copié.
- **Calendario:** el texto de temporada se corta sin «…», como en la imagen.
- **Campañas y temporadas, móvil:** solo la cabecera de la tarjeta la despliega y pliega (dentro hay botones propios). El documento decía «toda la tarjeta».
- **Pastilla de «Última vez» sin ediciones terminadas:** «—» y «sin ediciones terminadas», que no están en el diseño.
- **Alturas en móvil:** hay diferencias de 1 o 2 px con la imagen.

---

## 7. Cosas que dejé sin hacer (decides tú)

- **Código muerto en componentes compartidos con Ventas:** ramas de campañas y temporadas en `Table.jsx`, `HeaderTable.jsx`, `componentsTable.jsx` y `Filters.jsx`, y las entradas `tables`, `filters` y `mobile` de `DATABASE_TABLES` para `campaigns`, `seasons`, `campaignTypes` y `seasonTypes`. Ya no se usan desde Campañas y temporadas. No los toqué porque son compartidos; se pueden limpiar en un cambio aparte.
- **Migrar `ModalComponent`** al diálogo del prototipo (radio 20 px, título en serif, campos `rm-input`). Sigue como deuda en `DESIGN.md`; también los `alert()` y `confirm()`.
- **Mensajes de validación de Yup** en inglés («name must be at most 30 characters»), también deuda conocida.
- **Dos avisos de lint** en `Calendar.jsx` (dependencia de `useMemo` con `today.getTime()`). En `Planning.jsx` ya lo dejé limpio.
- **Campo `repeats` al crear un tipo:** el diálogo no lo pide, así que los tipos nuevos siempre se repiten (valor por defecto 1). Los que no se repiten, como «50 aniversario», solo se pueden definir en la base de datos.
- **Solo comprobado con simulación**, no contra el backend real (ver sección 3).

---

## 8. Por si quieres repetir mis comprobaciones

- Tests de lógica: `cd frontend-react && npx vitest run src/utils/calendar.test.js src/utils/planning.test.js`
- Todo: `npx vitest run` y `npx vite build`
- Las capturas que usé están en la carpeta temporal de la sesión y no forman parte del repositorio.
