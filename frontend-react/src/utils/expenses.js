import { startOfDay } from 'date-fns';
import { apiDate } from './dates.js';
import { defaultPair, formatBucketRange } from './compare.js';
import { formatEuros, formatShare } from './format.js';
import { salesPeriodRange } from './salesPeriod.js';

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
        profitShare: formatShare(profit, amount)
    };
}