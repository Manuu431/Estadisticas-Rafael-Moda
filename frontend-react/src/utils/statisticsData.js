import { parseISO, format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export function groupSalesByMonth(data) {
    const monthlyTotals = {};

    data.forEach(sale => {
        const date = parseISO(sale.sale_date);
        const rawKey = format(date, "MMM", { locale: es });
        const key = rawKey.charAt(0).toUpperCase() + rawKey.slice(1);

        if (!monthlyTotals[key]) {
            monthlyTotals[key] = 0;
        }
        monthlyTotals[key] += sale.units;
    });

    const monthOrder = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const d = subMonths(now, i);
        const rawMonth = format(d, "MMM", { locale: es });
        const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
        monthOrder.push(month);
    }
    
    return monthOrder.map(month => ({
        month,
        sales: monthlyTotals[month] || 0,
    }));
}