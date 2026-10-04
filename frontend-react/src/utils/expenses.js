import { getDaysInMonth, startOfDay } from 'date-fns';
import { apiDate } from './dates.js';
import { defaultPair, formatBucketRange } from './compare.js';
import { formatEuros, formatEurosRound, formatNumber, formatShare } from './format.js';
import { customPeriodError, periodApplyError, salesPeriodRange } from './salesPeriod.js';

const PROMPTS = { campaign: 'Una campaña…', season: 'Una temporada…', dates: 'Fechas concretas…' };

const clip = (from, to, today) => {
    const last = apiDate(today);
    const end = to > last ? last : to;
    return from > end ? null : { from, to: end };
};

export function expensesRange(kind, { item, dates }, today) {
    if (kind === 'year') return { from: `${today.getFullYear()}-01-01`, to: apiDate(today) };
    if (kind === 'dates') {
        const range = salesPeriodRange(dates, today);
        return range ? clip(apiDate(range.from), apiDate(range.to), today) : null;
    }
    return item ? clip(item.start_date, item.end_date, today) : null;
}

export function periodText(kind, range, name) {
    const span = formatBucketRange(range);
    if (kind === 'year') return `Este año · ${span}`;
    if (kind === 'dates') return `Fechas · ${span}`;
    return `${name} · ${span}`;
}

export function yearsText(range, today) {
    if (!range) return 'Todos los años';
    const first = Number(range.from.slice(0, 4));
    const last = today.getFullYear();
    return first >= last ? `Todos los años · ${last}` : `Todos los años · ${first} – ${last}`;
}

export function monthsLabel(range) {
    return range && range.from.slice(0, 4) === range.to.slice(0, 4) ? `Meses de ${range.to.slice(0, 4)}` : 'Meses';
}

export function expensesParams(grain, range) {
    if (grain === 'year') return { by: 'year' };
    return range ? { by: 'month', from: range.from, to: range.to } : null;
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
    return [{ value: 'year', label: kind === 'year' ? text : yearText }, option('campaign'), option('season'), option('dates')];
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
const MIN_STEP = 5000;
const MAX_INTERVALS = 4;

export function yAxisScale(peak) {
    let step = 0;
    for (let power = 3; step === 0; power++) {
        step = SCALE_BASES.map((base) => base * 10 ** power).find((size) => size >= MIN_STEP && peak / size <= MAX_INTERVALS) ?? 0;
    }
    const top = Math.max(step, Math.ceil(peak / step) * step);
    return { step, top, ticks: Array.from({ length: top / step + 1 }, (_, index) => index * step) };
}

export function axisLabel(value) {
    return value >= 1000 ? `${formatNumber(Math.round(value / 1000))} mil` : formatNumber(value);
}

export const chartPeak = (buckets) => Math.max(0, ...buckets.flatMap((bucket) => [bucket.amount, bucket.cost]));

const bucket = (key, label, name, found) => {
    const amount = found?.amount ?? 0;
    const profit = found?.profit ?? 0;
    return { key, label, name, amount, cost: found?.cost ?? 0, profit, margin: amount > 0 ? (profit / amount) * 100 : null };
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

export function expensesBuckets(grain, data, today) {
    if (!data?.range) return [];
    const found = new Map(data.rows.map((row) => [row.key, row]));
    if (grain === 'year') {
        const first = Number(data.range.from.slice(0, 4));
        const last = Math.max(Number(data.range.to.slice(0, 4)), today.getFullYear());
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

function yearCuts(buckets, today) {
    const cuts = new Map();
    const open = today.getMonth() < 11 || today.getDate() < 31;
    const current = String(today.getFullYear());
    if (open && buckets.some((item) => item.key === current)) {
        cuts.set(current, `hasta el ${today.getDate()} de ${MONTH_NAMES[today.getMonth()].toLowerCase()}`);
    }
    return cuts;
}

export function expensesTable(grain, buckets, range, today) {
    if (buckets.length === 0) return { rows: [], note: '' };
    const cuts = grain === 'year' ? yearCuts(buckets, today) : monthCuts(range, buckets);
    const note = buckets.filter((item) => cuts.has(item.key)).map((item) => `* ${item.name}, ${cuts.get(item.key)}.`).join(' ');
    const short = grain === 'month' && range.from.slice(0, 4) !== range.to.slice(0, 4);
    const rows = [...buckets].reverse().map((item) => ({
        key: item.key,
        name: (short ? item.label : item.name) + (cuts.has(item.key) ? '*' : ''),
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

const SKELETON_MAX_ROWS = 12;
const SKELETON_YEARS = 7;
const SKELETON_DEFAULT_ROWS = 9;

export function skeletonRows(grain, period) {
    if (grain === 'year') return SKELETON_YEARS;
    return period ? Math.min(SKELETON_MAX_ROWS, monthKeys(period.from, period.to).length) : SKELETON_DEFAULT_ROWS;
}