import { parseISO, format, subMonths, isSameMonth, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { SECTION_LABELS, getValueLabel } from '../config/labels.js';

export function getUniqueBrands(data) {
  const brandSet = new Set();
  data.forEach(sale => {
    if (sale.brand) {
      brandSet.add(sale.brand);
    }
  });
  return Array.from(brandSet);
}

export function groupSalesByMonth(data) {
    const monthlyTotals = {};
    
    data.forEach(sale => {
        const date = startOfMonth(parseISO(sale.sale_date));
        const key = format(date, "yyyy-MM");

        if (!monthlyTotals[key]) {
            monthlyTotals[key] = 0;
        }

        monthlyTotals[key] += sale.units;
    });

    const now = new Date();
    const result = [];

    for (let i = 11; i >= 0; i--) {
        const date = startOfMonth(subMonths(now, i));
        const key = format(date, "yyyy-MM");
        const label = format(date, "MMMM", { locale: es });

        result.push({
            month: label.charAt(0).toUpperCase() + label.slice(1),
            sales: monthlyTotals[key] || 0,
        });
    }

    return result;
}

export function groupSalesByMonthAndBrand(data) {
  const monthlyBrandTotals = {};

  data.forEach(sale => {
    const date = startOfMonth(parseISO(sale.sale_date));
    const key = format(date, "yyyy-MM");
    const brand = sale.brand;

    if (!monthlyBrandTotals[key]) {
      monthlyBrandTotals[key] = {};
    }

    if (!monthlyBrandTotals[key][brand]) {
      monthlyBrandTotals[key][brand] = 0;
    }

    monthlyBrandTotals[key][brand] += sale.units;
  });

  const now = new Date();
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const date = startOfMonth(subMonths(now, i));
    const key = format(date, "yyyy-MM");
    const label = format(date, "MMMM", { locale: es });
    const brands = monthlyBrandTotals[key] || {};

    result.push({
      month: label.charAt(0).toUpperCase() + label.slice(1),
      ...brands
    });
  }

  return result;
}

export function groupSalesByFieldForMonth(salesData, selectedMonth, field) {
    const result = {};

    for (const sale of salesData) {
        const saleDate = typeof sale.sale_date === 'string' ? parseISO(sale.sale_date) : new Date(sale.sale_date);

        if (isSameMonth(saleDate, selectedMonth)) {
            const key = getValueLabel(field, sale[field]) || 'Desconocido';
            result[key] = (result[key] || 0) + (sale.amount ?? sale.units ?? 0);
        }
    }

    return Object.entries(result).map(([name, value]) => ({ name, value }));
}

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

export function groupSales(sales, showBy, groupBy) {
    const grouped = {};

    sales.forEach(sale => {
        if (!sale.sale_date) return;

        const date = new Date(sale.sale_date);
        if (isNaN(date)) return;

        let timeKey;

        switch (showBy) {
            case "day":
                timeKey = date.toISOString().split("T")[0];
                break;
            case "month":
                timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case "year":
                timeKey = `${date.getFullYear()}`;
                break;
            case "all":
                timeKey = "Todo";
                break;
            default:
                timeKey = "Unknown";
        }

        const groupKey = getValueLabel(groupBy, sale[groupBy]) || "Sin categoría";

        if (!grouped[timeKey]) grouped[timeKey] = {};
        if (!grouped[timeKey][groupKey]) grouped[timeKey][groupKey] = 0;

        grouped[timeKey][groupKey] += sale.total || 1;
    });

    const result = Object.entries(grouped).map(([timeKey, values]) => ({
        [showBy]: timeKey,
        ...values,
    }));

    result.sort((a, b) => new Date(a[showBy]) - new Date(b[showBy]));

    return result;
}

export function groupExpenses(sales, showBy) {
    const grouped = {};

    sales.forEach(exp => {
        if (!exp.sale_date) return;

        const date = new Date(exp.sale_date);
        if (isNaN(date)) return;

        let timeKey;
        switch (showBy) {
            case "day":
                timeKey = date.toISOString().split("T")[0];
                break;
            case "month":
                timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case "year":
                timeKey = `${date.getFullYear()}`;
                break;
            case "all":
                timeKey = "Todo";
                break;
            default:
                timeKey = "Unknown";
        }

        if (!grouped[timeKey]) {
            grouped[timeKey] = {
                expenses: 0,
                revenue: 0,
            };
        }

        grouped[timeKey].expenses += Number(exp.cost || 0);
        grouped[timeKey].revenue += Number(exp.amount || 0);
    });

    const result = Object.entries(grouped).map(([timeKey, values]) => ({
        name: timeKey,
        expenses: values.expenses,
        revenue: values.revenue
    }));

    result.sort((a, b) => new Date(a.name) - new Date(b.name));

    return result;
}