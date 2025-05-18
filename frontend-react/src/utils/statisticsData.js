import { parseISO, format, subMonths, isSameMonth, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

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

export function groupSalesByBrand(data) {
  const brandTotals = {};

  data.forEach(sale => {
    const brand = sale.brand;
    if (!brandTotals[brand]) {
      brandTotals[brand] = 0;
    }
    brandTotals[brand] += sale.units;
  });

  return Object.entries(brandTotals).map(([name, value]) => ({
    name,
    value
  }));
}

export function groupSalesByBrandForMonth(data, monthDate) {
  const brandTotals = {};

  data.forEach(sale => {
    const saleDate = parseISO(sale.sale_date);
    if (isSameMonth(saleDate, monthDate)) {
      const brand = sale.brand;
      if (!brandTotals[brand]) {
        brandTotals[brand] = 0;
      }
      brandTotals[brand] += sale.units;
    }
  });

  return Object.entries(brandTotals).map(([name, value]) => ({
    name,
    value
  }));
}

export function groupSalesByFieldForMonth(salesData, selectedMonth, field) {
    const result = {};

    for (const sale of salesData) {
        const saleDate = typeof sale.sale_date === 'string' ? parseISO(sale.sale_date) : new Date(sale.sale_date);

        if (isSameMonth(saleDate, selectedMonth)) {
            const key = sale[field] || 'Desconocido';
            result[key] = (result[key] || 0) + (sale.amount ?? sale.units ?? 0);
        }
    }

    return Object.entries(result).map(([name, value]) => ({ name, value }));
}