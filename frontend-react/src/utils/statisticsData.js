import { parseISO, startOfDay, eachDayOfInterval } from 'date-fns';
import { round2 } from './format.js';

const dayKey = (date) => `${date.getMonth()}-${date.getDate()}`;

const groupByDay = (rows) => {
    const totals = new Map();
    rows.forEach((row) => {
        const key = dayKey(startOfDay(parseISO(row.date)));
        totals.set(key, (totals.get(key) ?? 0) + Number(row.total));
    });
    return totals;
};

const cents = (value) => Math.round(parseFloat(value || 0) * 100);

export function summarizeSales(sales) {
    return sales.reduce((total, sale) => ({
        lines: total.lines + 1,
        units: total.units + (sale.units || 0),
        amountCents: total.amountCents + cents(sale.amount),
        profitCents: total.profitCents + cents(sale.profit)
    }), { lines: 0, units: 0, amountCents: 0, profitCents: 0 });
}

export function fillDays(rows, from, to) {
    const days = eachDayOfInterval({ start: startOfDay(from), end: startOfDay(to) });
    const totals = new Map(rows.map((row) => [startOfDay(parseISO(row.date)).getTime(), Number(row.total)]));
    return days.map((date) => ({ date, total: round2(totals.get(date.getTime()) ?? 0) }));
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
        return { date, current: round2(totalCurrent), previous: round2(totalPrevious) };
    });
}

export function monthComparison(total, previousTotal) {
    const beaten = total >= previousTotal;
    const hasPrevious = previousTotal > 0;
    return {
        beaten,
        difference: round2(Math.abs(total - previousTotal)),
        delta: hasPrevious ? (total / previousTotal - 1) * 100 : null,
        progress: hasPrevious ? Math.min(100, (total / previousTotal) * 100) : (total > 0 ? 100 : 0)
    };
}