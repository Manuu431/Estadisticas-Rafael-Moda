import { addDays, addMonths, differenceInCalendarDays, differenceInCalendarMonths, endOfMonth, format, isBefore, parseISO, startOfDay, startOfMonth, subYears } from 'date-fns';
import { apiDate, formatShortDay } from './dates.js';
import { previousEdition } from './campaigns.js';

export const COMPARE_MODES = [
    { value: 'dates', label: 'Fechas' },
    { value: 'campaigns', label: 'Campañas' },
    { value: 'seasons', label: 'Temporadas' }
];

export const COMPARE_BUCKETS = [
    { value: 'week', label: 'Semanas', noun: 'semana' },
    { value: 'month', label: 'Meses', noun: 'mes' }
];

export const COMPARE_GROUPS = [
    { value: 'brand', label: 'Marca' },
    { value: 'family', label: 'Familia' },
    { value: 'section', label: 'Sección' }
];

const SHORT_MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const mondayFirst = (date) => (date.getDay() + 6) % 7;

export function bucketStarts(from, to, kind) {
    const end = parseISO(to);
    const starts = [parseISO(from)];
    for (;;) {
        const last = starts[starts.length - 1];
        const next = kind === 'month' ? startOfMonth(addMonths(last, 1)) : addDays(last, 7 - mondayFirst(last));
        if (isBefore(end, next)) break;
        starts.push(next);
    }
    return starts.map(apiDate);
}

function bucketTotals({ from, to, days }, kind) {
    const start = parseISO(from);
    const totals = bucketStarts(from, to, kind).map(() => 0);
    days.forEach(({ date, total }) => {
        const moment = parseISO(date);
        const index = kind === 'month'
            ? differenceInCalendarMonths(moment, start)
            : Math.floor((differenceInCalendarDays(moment, start) + mondayFirst(start)) / 7);
        if (index >= 0 && index < totals.length) totals[index] += total;
    });
    return totals;
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

export function bucketLabel(start, kind, compact, firstStart = start) {
    const date = parseISO(start);
    if (kind === 'week') return compact ? `${date.getDate()}/${date.getMonth() + 1}` : formatShortDay(date);
    const month = SHORT_MONTHS[date.getMonth()];
    return date.getFullYear() === parseISO(firstStart).getFullYear() ? month : `${month} ${format(date, 'yy')}`;
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
