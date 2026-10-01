import { parseISO, startOfDay, eachDayOfInterval } from 'date-fns';
import { SECTION_LABELS } from '../config/labels.js';

const round = (value) => Math.round(value * 100) / 100;
const dayKey = (date) => `${date.getMonth()}-${date.getDate()}`;

const groupByDay = (rows) => {
    const totals = new Map();
    rows.forEach((row) => {
        const key = dayKey(startOfDay(parseISO(row.date)));
        totals.set(key, (totals.get(key) ?? 0) + Number(row.total));
    });
    return totals;
};

export function summarizeBySection(sales) {
    const empty = () => ({ sales: 0, units: 0, profitCents: 0 });
    const summary = { total: empty() };
    Object.keys(SECTION_LABELS).forEach(section => { summary[section] = empty(); });
    sales.forEach(sale => {
        const profitCents = Math.round(parseFloat(sale.profit || 0) * 100);
        [summary.total, summary[sale.section]].forEach(bucket => {
            if (!bucket) return;
            bucket.sales += 1;
            bucket.units += sale.units || 0;
            bucket.profitCents += profitCents;
        });
    });
    return summary;
}

export function fillDays(rows, from, to) {
    const days = eachDayOfInterval({ start: startOfDay(from), end: startOfDay(to) });
    const totals = new Map(rows.map((row) => [startOfDay(parseISO(row.date)).getTime(), Number(row.total)]));
    return days.map((date) => ({ date, total: round(totals.get(date.getTime()) ?? 0) }));
}

export function accumulate(rows, previousRows, from, to) {
    const days = eachDayOfInterval({ start: startOfDay(from), end: startOfDay(to) });
    const current = groupByDay(rows);
    const previous = groupByDay(previousRows);
    let totalCurrent = 0;
    let totalPrevious = 0;
    return days.map((date) => {
        totalCurrent += current.get(dayKey(date)) ?? 0;
        totalPrevious += previous.get(dayKey(date)) ?? 0;
        return { date, current: round(totalCurrent), previous: round(totalPrevious) };
    });
}

export function monthComparison(total, previousTotal) {
    const beaten = total >= previousTotal;
    const hasPrevious = previousTotal > 0;
    return {
        beaten,
        difference: round(Math.abs(total - previousTotal)),
        delta: hasPrevious ? (total / previousTotal - 1) * 100 : null,
        progress: hasPrevious ? Math.min(100, (total / previousTotal) * 100) : (total > 0 ? 100 : 0)
    };
}
