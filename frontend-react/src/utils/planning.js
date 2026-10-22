import { differenceInCalendarDays, format, parseISO, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

const day = (value) => startOfDay(parseISO(value));
const shortDate = (date) => format(date, 'd MMM', { locale: es });

const NOUNS = {
    campaigns: ['campaña', 'campañas'],
    seasons: ['temporada', 'temporadas'],
};

const crossesYear = (type) => type.end_month < type.start_month || (type.end_month === type.start_month && type.end_day < type.start_day);

const buildDate = (year, month, dayOfMonth) => new Date(year, month - 1, Math.min(dayOfMonth, new Date(year, month, 0).getDate()));

export function sortTypes(types) {
    return [...types].sort((a, b) => a.start_month - b.start_month || a.start_day - b.start_day || a.name.localeCompare(b.name, 'es'));
}

export function typeRange(type) {
    const start = new Date(2000, type.start_month - 1, type.start_day);
    const end = new Date(2000, type.end_month - 1, type.end_day);
    return `${shortDate(start)} → ${shortDate(end)}`;
}

// «2026», o «2025-26» si la edición cruza de año.
export function yearLabel(startDate, endDate) {
    const startYear = Number(startDate.slice(0, 4));
    const endYear = Number(endDate.slice(0, 4));
    return endYear > startYear ? `${startYear}-${String(endYear % 100).padStart(2, '0')}` : String(startYear);
}

// «7 ene – 28 feb 2026»; si cruza de año, el año va en los dos extremos.
export function editionDates(startDate, endDate) {
    const start = day(startDate);
    const end = day(endDate);
    const sameYear = start.getFullYear() === end.getFullYear();
    const short = (date, withYear) => format(date, withYear ? 'd MMM yyyy' : 'd MMM', { locale: es });
    return `${short(start, !sameYear)} – ${short(end, true)}`;
}

export function sortEditions(editions) {
    return [...editions].sort((a, b) => b.start_date.localeCompare(a.start_date));
}

// Las ediciones guardadas del tipo más las que saldrían de sus fechas (como hace el backend al generar años)
// para los años que aún no existen. Así el estado no depende de que ya se hayan generado, y si alguien ha
// cambiado las fechas de una edición guardada, manda la guardada.
function occurrences(type, editions, today) {
    const savedYears = new Set(editions.map((edition) => day(edition.start_date).getFullYear()));
    const saved = editions.filter((edition) => !edition.skipped).map((edition) => ({ start: day(edition.start_date), end: day(edition.end_date) }));
    const year = today.getFullYear();
    const first = type.repeats ? Math.max(type.first_year, year - 1) : type.first_year;
    const limit = type.last_year ? Math.min(type.last_year, year + 1) : year + 1;
    const last = type.repeats ? Math.max(first, limit) : type.first_year;
    const crosses = crossesYear(type);

    const computed = [];
    for (let y = first; y <= last; y += 1) {
        if (savedYears.has(y) || (type.last_year && y > type.last_year)) continue;
        computed.push({
            start: buildDate(y, type.start_month, type.start_day),
            end: buildDate(crosses ? y + 1 : y, type.end_month, type.end_day),
        });
    }
    return [...saved, ...computed];
}

const plural = (count, one, many) => (count === 1 ? one : many);

export function typeStatus(type, editions, today) {
    const now = startOfDay(today);
    const all = occurrences(type, editions, now);

    const current = all.filter((item) => item.start < now && item.end >= now).sort((a, b) => a.start - b.start)[0];
    if (current) {
        const days = differenceInCalendarDays(current.end, now);
        const left = days === 0 ? 'termina hoy' : `${plural(days, 'queda', 'quedan')} ${days} ${plural(days, 'día', 'días')}`;
        return { kind: 'current', days, label: `En curso · ${left}` };
    }

    const next = all.filter((item) => item.start >= now).sort((a, b) => a.start - b.start)[0];
    if (next) {
        const days = differenceInCalendarDays(next.start, now);
        const label = days === 0 ? 'Empieza hoy' : days === 1 ? 'Empieza mañana' : `Empieza en ${days} días`;
        return { kind: 'upcoming', days, label };
    }

    return { kind: 'finished', label: 'Terminada' };
}

// El beneficio (no el balance) de la última edición ya terminada. La que termina hoy sigue en curso.
export function lastResult(editions, today) {
    const now = startOfDay(today);
    const finished = editions.filter((edition) => !edition.skipped && day(edition.end_date) < now).sort((a, b) => b.end_date.localeCompare(a.end_date));
    if (finished.length === 0) return null;
    const [last] = finished;
    return { profit: Number(last.profits), year: yearLabel(last.start_date, last.end_date) };
}

// Una edición que ya empezó (o terminó) no se puede mover; solo se corrigen sus gastos.
export function isStarted(edition, today) {
    return day(edition.start_date) <= startOfDay(today);
}

export function countLabel(count, kind) {
    const [one, many] = NOUNS[kind];
    return `${count} ${count === 1 ? one : many}`;
}

export function syncMessage(created) {
    if (created === 0) return 'Ya estaba todo al día.';
    return created === 1 ? 'Se ha creado 1 edición.' : `Se han creado ${created} ediciones.`;
}

export function deleteMessage(name, editions) {
    const base = `¿Eliminar «${name}»?`;
    if (editions === 0) return base;
    return editions === 1 ? `${base} Se borrará también su única edición.` : `${base} Se borrarán también sus ${editions} ediciones.`;
}

export function buildRows(types, editions, today, kind) {
    return sortTypes(types).map((type) => {
        const own = editions.filter((edition) => edition.period_type_id === type.id);
        return {
            type,
            range: typeRange(type),
            status: typeStatus(type, own, today),
            last: lastResult(own, today),
            count: countLabel(own.filter((edition) => !edition.skipped).length, kind),
            editions: sortEditions(own),
        };
    });
}
