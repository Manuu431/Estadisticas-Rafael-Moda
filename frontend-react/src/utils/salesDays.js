import { format, isSameDay, isSameMonth, isSameYear, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getValueLabel } from '../config/labels.js';
import { summarizeSales } from './statisticsData.js';

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export function dayTitle(value, today) {
    const date = parseISO(value.slice(0, 10));
    if (isSameDay(date, today)) return `Hoy, ${format(date, 'EEEE d', { locale: es })}`;
    if (!isSameYear(date, today)) return capitalize(format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }));
    if (!isSameMonth(date, today)) return capitalize(format(date, "EEEE d 'de' MMMM", { locale: es }));
    return capitalize(format(date, 'EEEE d', { locale: es }));
}

export const sortLatestFirst = (rows) =>
    [...rows].sort((a, b) => b.sold_at.localeCompare(a.sold_at) || b.id - a.id);

export function groupByDay(rows, visible) {
    const fullDays = new Map();
    rows.forEach((row) => {
        if (!fullDays.has(row.sale_date)) fullDays.set(row.sale_date, []);
        fullDays.get(row.sale_date).push(row);
    });
    const groups = [];
    rows.slice(0, visible).forEach((row) => {
        let group = groups.find((entry) => entry.date === row.sale_date);
        if (!group) {
            group = { date: row.sale_date, sumCents: summarizeSales(fullDays.get(row.sale_date)).amountCents, items: [] };
            groups.push(group);
        }
        group.items.push(row);
    });
    return groups;
}

export const remainingCount = (total, visible) => Math.max(0, total - visible);

export const saleMeta = (item) =>
    [item.brand, getValueLabel('section', item.section), item.size ? `T. ${item.size}` : '', item.units > 1 ? `${item.units} uds.` : '']
        .filter(Boolean)
        .join(' · ');