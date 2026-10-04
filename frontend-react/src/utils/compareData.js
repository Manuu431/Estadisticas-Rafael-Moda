import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export const filterByRange = (sales, start, end) =>
    sales.filter((sale) => {
        const date = sale.sale_date;
        if (!date) return false;
        if (start && date < start) return false;
        if (end && date > end) return false;
        return true;
    });

export const summarize = (sales) => {
    const tickets = new Set();
    let amount = 0;
    let cost = 0;
    let profit = 0;
    let units = 0;

    sales.forEach((sale) => {
        amount += Number(sale.amount || 0);
        cost += Number(sale.cost || 0);
        profit += Number(sale.profit || 0);
        units += Number(sale.units || 0);
        if (sale.ticket_id != null) tickets.add(sale.ticket_id);
    });

    return {
        amount,
        cost,
        profit,
        units,
        lines: sales.length,
        tickets: tickets.size,
        average: tickets.size > 0 ? amount / tickets.size : 0,
        margin: amount > 0 ? (profit / amount) * 100 : 0
    };
};

const bucketKey = (date, showBy) => {
    if (showBy === 'year') return date.slice(0, 4);
    if (showBy === 'month') return date.slice(0, 7);
    return date;
};

const bucketLabel = (key, showBy) => {
    if (showBy === 'year') return key;
    if (showBy === 'month') return capitalize(format(parseISO(`${key}-01`), 'LLL yy', { locale: es }));
    return format(parseISO(key), 'd MMM', { locale: es });
};

export const bucketSales = (sales, showBy) => {
    const buckets = new Map();

    sales.forEach((sale) => {
        if (!sale.sale_date) return;
        const key = bucketKey(sale.sale_date, showBy);
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(sale);
    });

    return [...buckets.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, rows]) => ({ key, label: bucketLabel(key, showBy), ...summarize(rows) }));
};
