import { differenceInCalendarDays, format, getDaysInMonth, parseISO, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { apiDate } from './dates.js';
import { bucketLabel, bucketRanges, bucketStarts, defaultPair, formatBucketRange } from './compare.js';
import { capitalize, formatEuros, formatEurosRound, formatNumber, formatShare, round2 } from './format.js';
import { customPeriodError, periodApplyError, salesPeriodRange } from './salesPeriod.js';

export const TABLE_ROWS = 7;

export const GRAINS = [
    { value: 'day', label: 'Días', noun: 'día', table: 'Día a día' },
    { value: 'week', label: 'Semanas', noun: 'semana', table: 'Semana a semana' },
    { value: 'month', label: 'Meses', noun: 'mes', table: 'Mes a mes' },
    { value: 'year', label: 'Años', noun: 'año', table: 'Año a año' }
];

const ALL_TEXT = 'Todo, desde que hay datos';
const PROMPTS = { campaign: 'Una campaña…', season: 'Una temporada…', dates: 'Fechas concretas…', all: ALL_TEXT };

const clip = (from, to, today) => {
    const last = apiDate(today);
    const end = to > last ? last : to;
    return from > end ? null : { from, to: end };
};

export function expensesRange(kind, { item, dates }, today) {
    if (kind === 'all') return { all: true };
    if (kind === 'year') return { from: `${today.getFullYear()}-01-01`, to: apiDate(today) };
    if (kind === 'dates') {
        const range = salesPeriodRange(dates, today);
        return range ? clip(apiDate(range.from), apiDate(range.to), today) : null;
    }
    return item ? clip(item.start_date, item.end_date, today) : null;
}

export function wholeRange(range, grain) {
    if (grain === 'year') return { ...range, from: `${range.from.slice(0, 4)}-01-01` };
    if (grain === 'month') return { ...range, from: `${range.from.slice(0, 7)}-01` };
    return range;
}

export function periodText(kind, range, name) {
    if (kind === 'all') return ALL_TEXT;
    const span = formatBucketRange(range);
    if (kind === 'year') return `Este año · ${span}`;
    if (kind === 'dates') return `Fechas · ${span}`;
    return `${name} · ${span}`;
}

export function expensesParams(grain, range) {
    const by = grain === 'week' ? 'day' : grain;
    if (range?.all) return { by };
    return range ? { by, from: range.from, to: range.to } : null;
}

export function startedPeriods(items, today) {
    const last = apiDate(startOfDay(today));
    return (items ?? []).filter((item) => item.start_date <= last);
}

export function chosenPeriod(started, pickId, today) {
    return started.find((item) => String(item.id) === pickId) ?? defaultPair(started, today).a;
}

export function periodMenu(kind, text, yearText) {
    const option = (value) => ({ value, label: kind === value && text ? text : PROMPTS[value] });
    return [{ value: 'year', label: kind === 'year' ? text : yearText }, option('campaign'), option('season'), option('dates'), option('all')];
}

export function expensesKpis({ amount, cost, profit }) {
    return {
        amount: formatEuros(amount),
        cost: formatEuros(cost),
        profit: formatEuros(profit),
        costShare: formatShare(cost, amount),
        profitShare: formatShare(profit, amount),
        loss: profit < 0
    };
}

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const SCALE_BASES = [1, 2, 2.5, 5];
const MIN_STEP = 100;
const EMPTY_SCALE = { step: 5000, top: 5000, ticks: [0, 5000] };
const MAX_INTERVALS = 4;
const GRAIN_INTERVALS = { day: 6 };

export function yAxisScale(peak, grain) {
    const maxIntervals = GRAIN_INTERVALS[grain] ?? MAX_INTERVALS;
    if (peak <= 0) return EMPTY_SCALE;
    let step = 0;
    for (let power = 1; step === 0; power++) {
        step = SCALE_BASES.map((base) => base * 10 ** power).find((size) => size >= MIN_STEP && peak / size <= maxIntervals) ?? 0;
    }
    const top = Math.max(step, Math.ceil(peak / step) * step);
    return { step, top, ticks: Array.from({ length: top / step + 1 }, (_, index) => index * step) };
}

export function axisLabel(value) {
    return value >= 1000 ? `${formatNumber(value / 1000)} mil` : formatNumber(value);
}

export const chartPeak = (buckets) => Math.max(0, ...buckets.flatMap((bucket) => [bucket.amount, bucket.cost]));

const bucket = (key, label, name, found, short = label) => {
    const amount = found?.amount ?? 0;
    const profit = found?.profit ?? 0;
    return { key, label, name, short, amount, cost: found?.cost ?? 0, profit, margin: amount > 0 ? (profit / amount) * 100 : null };
};

function monthKeys(from, to) {
    const keys = [];
    let year = Number(from.slice(0, 4));
    let month = Number(from.slice(5, 7));
    const last = to.slice(0, 7);
    for (;;) {
        const key = `${year}-${String(month).padStart(2, '0')}`;
        if (key > last) return keys;
        keys.push(key);
        year += month === 12 ? 1 : 0;
        month = month === 12 ? 1 : month + 1;
    }
}

const weekdayName = (date) => {
    return capitalize(format(parseISO(date), 'EEEE', { locale: es }));
};

function dayBuckets(grain, data) {
    const ranges = bucketRanges(data.range.from, data.range.to, grain);
    const found = new Map(data.rows.map((row) => [row.key, row]));
    return ranges.map((span) => {
        const label = bucketLabel(span.from, grain, false);
        const name = formatBucketRange(span);
        if (grain === 'day') return bucket(span.from, label, name, found.get(span.from), `${weekdayName(span.from)} ${label}`);
        const days = data.rows.filter((row) => row.key >= span.from && row.key <= span.to);
        const total = (field) => round2(days.reduce((sum, row) => sum + row[field], 0));
        const sameMonth = span.from.slice(0, 7) === span.to.slice(0, 7);
        const short = `${sameMonth ? Number(span.from.slice(8, 10)) : label} – ${bucketLabel(span.to, grain, false)}`;
        return bucket(span.from, label, name, { amount: total('amount'), cost: total('cost'), profit: total('profit') }, short);
    });
}

export function expensesBuckets(grain, data) {
    if (!data?.range) return [];
    if (grain === 'day' || grain === 'week') return dayBuckets(grain, data);
    const found = new Map(data.rows.map((row) => [row.key, row]));
    if (grain === 'year') {
        const first = Number(data.range.from.slice(0, 4));
        const last = Number(data.range.to.slice(0, 4));
        return Array.from({ length: last - first + 1 }, (_, index) => String(first + index)).map((key) => bucket(key, key, key, found.get(key)));
    }
    const spansYears = data.range.from.slice(0, 4) !== data.range.to.slice(0, 4);
    return monthKeys(data.range.from, data.range.to).map((key) => {
        const name = MONTH_NAMES[Number(key.slice(5, 7)) - 1];
        return spansYears
            ? bucket(key, `${name.slice(0, 3)} ${key.slice(2, 4)}`, `${name} ${key.slice(0, 4)}`, found.get(key))
            : bucket(key, name.slice(0, 3), name, found.get(key));
    });
}

export const LOW_MARGIN = 42;

const isLow = (margin) => margin !== null && Math.round(margin * 10) / 10 < LOW_MARGIN;

function monthCuts(range, buckets) {
    const [fromKey, toKey] = [range.from.slice(0, 7), range.to.slice(0, 7)];
    const startDay = Number(range.from.slice(8, 10));
    const endDay = Number(range.to.slice(8, 10));
    const cutStart = startDay > 1;
    const cutEnd = endDay < getDaysInMonth(new Date(Number(toKey.slice(0, 4)), Number(toKey.slice(5, 7)) - 1));
    const cuts = new Map();
    buckets.forEach((item) => {
        const first = item.key === fromKey && cutStart;
        const last = item.key === toKey && cutEnd;
        if (first && last) cuts.set(item.key, `del día ${startDay} al ${endDay}`);
        else if (first) cuts.set(item.key, `desde el día ${startDay}`);
        else if (last) cuts.set(item.key, `hasta el día ${endDay}`);
    });
    return cuts;
}

function yearCuts(range, buckets) {
    const [firstYear, lastYear] = [range.from.slice(0, 4), range.to.slice(0, 4)];
    const cutStart = range.from.slice(5) !== '01-01';
    const cutEnd = range.to.slice(5) !== '12-31';
    const dayMonth = (date) => `${Number(date.slice(8, 10))} de ${MONTH_NAMES[Number(date.slice(5, 7)) - 1].toLowerCase()}`;
    const cuts = new Map();
    buckets.forEach((item) => {
        const first = item.key === firstYear && cutStart;
        const last = item.key === lastYear && cutEnd;
        if (first && last) cuts.set(item.key, `del ${dayMonth(range.from)} al ${dayMonth(range.to)}`);
        else if (first) cuts.set(item.key, `desde el ${dayMonth(range.from)}`);
        else if (last) cuts.set(item.key, `hasta el ${dayMonth(range.to)}`);
    });
    return cuts;
}

const CUTS = { month: monthCuts, year: yearCuts };

export function expensesTable(grain, buckets, range) {
    if (buckets.length === 0) return { rows: [], note: '' };
    const cuts = CUTS[grain]?.(range, buckets) ?? new Map();
    const note = buckets.filter((item) => cuts.has(item.key)).map((item) => `* ${item.name}, ${cuts.get(item.key)}.`).join(' ');
    const spansYears = range.from.slice(0, 4) !== range.to.slice(0, 4);
    const rowName = (item) => {
        if (grain === 'day' || grain === 'week') return item.short;
        return grain === 'month' && spansYears ? item.label : item.name;
    };
    const rows = [...buckets].reverse().map((item) => ({
        key: item.key,
        name: rowName(item) + (cuts.has(item.key) ? '*' : ''),
        amount: formatEurosRound(item.amount),
        cost: formatEurosRound(item.cost),
        profit: formatEurosRound(item.profit),
        share: item.amount > 0 ? formatShare(item.profit, item.amount) : '—',
        low: isLow(item.margin),
        loss: item.profit < 0
    }));
    return { rows, note };
}

export const EMPTY_MESSAGE = 'No hay ventas en este periodo.';

export function expensesState({ data, error, listLoading = false, listError = null }) {
    if (error || listError) return { kind: 'error' };
    if (listLoading || data === null) return { kind: 'loading' };
    if (data.rows.length === 0) return { kind: 'empty', message: EMPTY_MESSAGE };
    return { kind: 'ready' };
}

export function datesNotice(kind, dates) {
    return kind === 'dates' && !customPeriodError(dates) ? periodApplyError(dates) : null;
}

const GRAIN_COUNTS = {
    day: ({ from, to }) => differenceInCalendarDays(parseISO(to), parseISO(from)) + 1,
    week: ({ from, to }) => bucketStarts(from, to, 'week').length,
    month: ({ from, to }) => monthKeys(from, to).length,
    year: ({ from, to }) => Number(to.slice(0, 4)) - Number(from.slice(0, 4)) + 1
};

export function periodCount(grain, period) {
    return period && !period.all ? GRAIN_COUNTS[grain](period) : null;
}

export function skeletonRows(grain, period) {
    return Math.min(TABLE_ROWS, periodCount(grain, period) ?? TABLE_ROWS);
}