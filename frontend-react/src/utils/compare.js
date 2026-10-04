import { addDays, addMonths, addYears, differenceInCalendarDays, differenceInCalendarMonths, differenceInCalendarYears, endOfMonth, format, isBefore, parseISO, startOfDay, startOfMonth, startOfYear, subYears } from 'date-fns';
import { apiDate, formatShortDay } from './dates.js';
import { previousEdition } from './campaigns.js';

export const COMPARE_MODES = [
    { value: 'dates', label: 'Fechas' },
    { value: 'campaigns', label: 'Campañas' },
    { value: 'seasons', label: 'Temporadas' }
];

export const COMPARE_BUCKETS = [
    { value: 'day', label: 'Días', noun: 'día' },
    { value: 'week', label: 'Semanas', noun: 'semana' },
    { value: 'month', label: 'Meses', noun: 'mes' },
    { value: 'year', label: 'Años', noun: 'año' }
];

export const BREAKDOWN_PAGE_SIZE = 5;

export const COMPARE_GROUPS = [
    { value: 'brand', label: 'Marca', plural: 'marcas' },
    { value: 'family', label: 'Familia', plural: 'familias' },
    { value: 'section', label: 'Sección', plural: 'secciones' },
    { value: 'size', label: 'Talla', plural: 'tallas' },
    { value: 'color', label: 'Color', plural: 'colores' }
];

const SHORT_MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const mondayFirst = (date) => (date.getDay() + 6) % 7;

const NEXT_START = {
    day: (last) => addDays(last, 1),
    week: (last) => addDays(last, 7 - mondayFirst(last)),
    month: (last) => startOfMonth(addMonths(last, 1)),
    year: (last) => startOfYear(addYears(last, 1))
};

const BUCKET_INDEX = {
    day: (moment, start) => differenceInCalendarDays(moment, start),
    week: (moment, start) => Math.floor((differenceInCalendarDays(moment, start) + mondayFirst(start)) / 7),
    month: (moment, start) => differenceInCalendarMonths(moment, start),
    year: (moment, start) => differenceInCalendarYears(moment, start)
};

export function bucketStarts(from, to, kind) {
    const end = parseISO(to);
    const starts = [parseISO(from)];
    for (;;) {
        const next = NEXT_START[kind](starts[starts.length - 1]);
        if (isBefore(end, next)) break;
        starts.push(next);
    }
    return starts.map(apiDate);
}

function bucketTotals({ from, to, days }, kind) {
    const start = parseISO(from);
    const totals = bucketStarts(from, to, kind).map(() => 0);
    days.forEach(({ date, total }) => {
        const index = BUCKET_INDEX[kind](parseISO(date), start);
        if (index >= 0 && index < totals.length) totals[index] += total;
    });
    return totals;
}

export function bucketRanges(from, to, kind) {
    const starts = bucketStarts(from, to, kind);
    return starts.map((start, index) => ({
        from: start,
        to: index + 1 < starts.length ? apiDate(addDays(parseISO(starts[index + 1]), -1)) : to
    }));
}

export function formatBucketRange(range) {
    if (!range) return '';
    const from = parseISO(range.from);
    const to = parseISO(range.to);
    const day = (date) => `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
    if (range.from === range.to) return `${day(from)} ${to.getFullYear()}`;
    if (from.getFullYear() === to.getFullYear()) return `${day(from)} – ${day(to)} ${to.getFullYear()}`;
    return `${day(from)} ${from.getFullYear()} – ${day(to)} ${to.getFullYear()}`;
}

export function pairBuckets(a, b, kind) {
    const startsA = bucketStarts(a.from, a.to, kind);
    const startsB = bucketStarts(b.from, b.to, kind);
    const totalsA = bucketTotals(a, kind);
    const totalsB = bucketTotals(b, kind);
    const length = Math.max(startsA.length, startsB.length);
    return Array.from({ length }, (_, index) => ({
        start: startsA[index] ?? startsB[index],
        a: totalsA[index] ?? 0,
        b: totalsB[index] ?? 0
    }));
}

export function bucketLabel(start, kind, compact, showYear = false) {
    const date = parseISO(start);
    if (kind === 'year') return String(date.getFullYear());
    if (kind === 'week' || kind === 'day') return compact ? `${date.getDate()}/${date.getMonth() + 1}` : formatShortDay(date);
    const month = SHORT_MONTHS[date.getMonth()];
    return showYear ? `${month} ${format(date, 'yy')}` : month;
}

export const deltaPercent = (a, b) => (b > 0 ? (a / b - 1) * 100 : null);

export function compareKpis(a, b) {
    const ticket = (summary) => (summary.tickets > 0 ? summary.total / summary.tickets : 0);
    const kpi = (key, label, kind, valueA, valueB) => ({ key, label, kind, a: valueA, b: valueB, delta: deltaPercent(valueA, valueB) });
    return [
        kpi('sales', 'Ventas', 'money', a.total, b.total),
        kpi('profit', 'Beneficio', 'money', a.profit, b.profit),
        kpi('units', 'Prendas vendidas', 'number', a.units, b.units),
        kpi('ticket', 'Ticket medio', 'money', ticket(a), ticket(b))
    ];
}

export function comparePeriodNames(a, b) {
    const yearA = a.from.slice(0, 4);
    const yearB = b.from.slice(0, 4);
    if (yearA === yearB) return { legendA: a.name, legendB: b.name, shortA: a.name, shortB: b.name };
    return { legendA: a.name, legendB: yearB, shortA: yearA, shortB: yearB };
}

export function defaultPair(periods, today) {
    const now = startOfDay(today);
    const started = periods.filter((period) => !isBefore(now, parseISO(period.start_date)));
    const latest = (list) => [...list].sort((x, y) => y.start_date.localeCompare(x.start_date))[0] ?? null;
    const finished = started.filter((period) => isBefore(parseISO(period.end_date), now));
    const a = latest(finished) ?? latest(started);
    return { a, b: a ? previousEdition(periods, a) : null };
}

export function defaultDates(today) {
    const lastMonth = startOfMonth(addMonths(startOfDay(today), -1));
    const lastEnd = endOfMonth(lastMonth);
    return {
        a: { key: 'custom', from: apiDate(lastMonth), to: apiDate(lastEnd) },
        b: { key: 'custom', from: apiDate(subYears(lastMonth, 1)), to: apiDate(endOfMonth(subYears(lastMonth, 1))) }
    };
}

export function compareState({ ready, data, error, listLoading = false, listError = null }) {
    if (listError) return { kind: 'error' };
    if (!ready) return { kind: listLoading ? 'loading' : 'pick' };
    if (error) return { kind: 'error' };
    if (data === null) return { kind: 'loading' };
    return { kind: 'ready' };
}
