# Actualización diaria de los datos de ejemplo

La API genera datos ficticios para la demostración. Las filas nuevas de `tickets` no proceden de ventas reales. La interfaz debe identificar los datos como ficticios antes de activar esta tarea.

## Ejecución

El Cron vive en el proyecto backend (`backend-node/vercel.json`) y llama por GET a `/api/internal/daily-demo-update` una vez al día con la expresión `0 6 * * *` en UTC, es decir, a las 08:00 en Madrid en verano y a las 07:00 en invierno (en Hobby Vercel puede invocarlo en cualquier momento de esa hora, hasta 59 minutos de variación). Vercel solo activa Cron Jobs en Production.

La ejecución genera **el día completo de hoy** (`Europe/Madrid`), con horas entre las 10:00 y las 20:29, antes de que abra la tienda. Las ventas con una hora que todavía no ha llegado no se ven: la vista `v_sales` solo incluye `sold_at <= NOW()`, y cada conexión de la API fija su zona horaria a Madrid (`SET time_zone` con el desfase de verano o invierno, calculado en `utils/timezone.js`, así que no hacen falta las tablas de zonas horarias de MySQL). Así, la web parece una tienda en directo: por la mañana solo salen las ventas de la mañana y las de la tarde van apareciendo solas según pasa el reloj, sin más ejecuciones. `v_sales` conserva sus cálculos de importe, coste y beneficio.

El generador diario es independiente de `npm run seed`. Usa una plantilla existente por producto desde `sale_lines`, incluyendo talla, precio y coste, y crea tickets y líneas adicionales. Las ventas se repiten determinísticamente para esa fecha. Las ediciones anuales solo se añaden si corresponden a un tipo repetitivo, aún no existe una edición con ese tipo y año, y su inicio es posterior al día procesado. Si las fechas guardadas de un tipo difieren de las fechas que define el tipo, se omiten nuevas ediciones de ese tipo para no duplicar una edición movida manualmente. No se cambian fechas de filas existentes ni ediciones ya iniciadas.

## Idempotencia y transacción

`demo_update_days.process_date` es clave primaria. La tarea inserta la fecha procesada, los tickets, sus líneas y las ediciones en una sola transacción InnoDB. Si dos invocaciones coinciden, la restricción única deja que una sola continúe; la otra revierte y responde `alreadyProcessed`. Cualquier error revierte también la marca del día junto a las ventas, por lo que se puede reintentar con seguridad.

## Configuración manual previa a activar el Cron

1. En Vercel, abre el proyecto backend `estadisticas-rafael-moda` y añade `CRON_SECRET` en **Settings → Environment Variables**, con un valor aleatorio de al menos 16 caracteres. Asígnalo a **Production** y también a **Preview** si quieres que la ruta protegida pueda comprobarse en despliegues Preview. No lo guardes en Git ni lo compartas en logs.
2. Aplica una vez, por este orden, `db/migrations/2026-10-22-demo-update-days.sql` y `db/migrations/2026-10-22-hide-future-sales.sql` (esta última reemplaza la vista `v_sales`) a la base prevista antes de desplegar una versión con la tarea. La primera crea solo la tabla de control y la segunda redefine la vista; ninguna borra ni resembra datos. Para producción, ejecútala manualmente en Aiven cuando se haya revisado y aprobado el cambio.
3. Después de revisar el código y la migración, despliega el backend. Vercel registra el Cron del despliegue Production. No hay Cron automático en Preview; Preview solo recibe la variable si se asigna ese ámbito.
4. Comprueba el resultado en los logs de la función Cron en Vercel. Las llamadas sin `Authorization: Bearer <CRON_SECRET>` reciben 401.

El plan Hobby admite hasta 100 Cron Jobs por proyecto, con un máximo de una ejecución al día y precisión horaria de ±59 minutos. Cron no tiene cargo separado, pero ejecuta una Vercel Function: cuentan las invocaciones, duración y demás límites de funciones del plan. Pro permite frecuencia por minuto y precisión por minuto; esta tarea no necesita esa frecuencia. Los Cron Jobs solo se ejecutan sobre Production.

Fuentes: [Cron Jobs](https://vercel.com/docs/cron-jobs), [gestionar y proteger Cron Jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs), [uso y precios de Cron Jobs](https://vercel.com/docs/cron-jobs/usage-and-pricing).