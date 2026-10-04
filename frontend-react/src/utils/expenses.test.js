import { describe, expect, it } from 'vitest';
import { axisLabel, chartPeak, chosenPeriod, expensesBuckets, expensesKpis, expensesParams, expensesRange, monthsLabel, periodMenu, periodText, startedPeriods, yAxisScale, yearsText } from './expenses.js';

const today = new Date(2026, 8, 28, 12, 30);
const custom = (from, to) => ({ key: 'custom', from, to, bad: [] });

describe('expensesRange', () => {
    it('Este año va del 1 de enero a hoy', () => {
        expect(expensesRange('year', {}, today)).toEqual({ from: '2026-01-01', to: '2026-09-28' });
    });

    it('una campaña terminada se queda con sus fechas', () => {
        const item = { start_date: '2026-07-01', end_date: '2026-08-31' };
        expect(expensesRange('campaign', { item }, today)).toEqual({ from: '2026-07-01', to: '2026-08-31' });
    });

    it('una campaña en curso se recorta a hoy', () => {
        const item = { start_date: '2026-09-01', end_date: '2026-10-15' };
        expect(expensesRange('season', { item }, today)).toEqual({ from: '2026-09-01', to: '2026-09-28' });
    });

    it('una campaña que no ha empezado no tiene rango', () => {
        const item = { start_date: '2026-10-01', end_date: '2026-10-15' };
        expect(expensesRange('campaign', { item }, today)).toBeNull();
    });

    it('sin campaña elegida no hay rango', () => {
        expect(expensesRange('campaign', { item: null }, today)).toBeNull();
    });

    it('con fechas concretas usa las dos fechas', () => {
        expect(expensesRange('dates', { dates: custom('2026-03-15', '2026-05-10') }, today)).toEqual({ from: '2026-03-15', to: '2026-05-10' });
    });

    it('las fechas a medias o al revés no tienen rango', () => {
        expect(expensesRange('dates', { dates: custom('2026-03-15', '') }, today)).toBeNull();
        expect(expensesRange('dates', { dates: custom('', '') }, today)).toBeNull();
        expect(expensesRange('dates', { dates: custom('2026-05-10', '2026-03-15') }, today)).toBeNull();
    });

    it('unas fechas que acaban en el futuro se recortan a hoy', () => {
        expect(expensesRange('dates', { dates: custom('2026-09-01', '2026-12-31') }, today)).toEqual({ from: '2026-09-01', to: '2026-09-28' });
    });

    it('unas fechas que empiezan en el futuro no tienen rango', () => {
        expect(expensesRange('dates', { dates: custom('2026-11-01', '2026-12-31') }, today)).toBeNull();
    });
});

describe('periodText', () => {
    it('Este año enseña el rango con el año al final', () => {
        expect(periodText('year', { from: '2026-01-01', to: '2026-09-28' })).toBe('Este año · 1 ene – 28 sep 2026');
    });

    it('una campaña lleva su nombre delante', () => {
        expect(periodText('campaign', { from: '2026-07-01', to: '2026-08-31' }, 'Rebajas de verano')).toBe('Rebajas de verano · 1 jul – 31 ago 2026');
    });

    it('las fechas concretas llevan «Fechas» delante', () => {
        expect(periodText('dates', { from: '2026-03-15', to: '2026-05-10' })).toBe('Fechas · 15 mar – 10 may 2026');
    });

    it('si cruza de año, los dos extremos llevan el año', () => {
        expect(periodText('dates', { from: '2025-12-20', to: '2026-01-10' })).toBe('Fechas · 20 dic 2025 – 10 ene 2026');
    });
});

describe('yearsText', () => {
    it('va del año de la primera venta al año en curso', () => {
        expect(yearsText({ from: '2020-01-01', to: '2026-10-01' }, today)).toBe('Todos los años · 2020 – 2026');
    });

    it('con un solo año no repite', () => {
        expect(yearsText({ from: '2026-02-03', to: '2026-09-01' }, today)).toBe('Todos los años · 2026');
    });

    it('sin datos todavía solo dice «Todos los años»', () => {
        expect(yearsText(null, today)).toBe('Todos los años');
    });
});

describe('monthsLabel', () => {
    it('lleva el año cuando el periodo cae dentro de uno solo', () => {
        expect(monthsLabel({ from: '2026-01-01', to: '2026-09-28' })).toBe('Meses de 2026');
    });

    it('se queda en «Meses» si cruza de año o aún no hay periodo', () => {
        expect(monthsLabel({ from: '2025-11-01', to: '2026-02-10' })).toBe('Meses');
        expect(monthsLabel(null)).toBe('Meses');
    });
});

describe('expensesParams', () => {
    const range = { from: '2026-01-01', to: '2026-09-28' };

    it('por meses manda el rango', () => {
        expect(expensesParams('month', range)).toEqual({ by: 'month', from: '2026-01-01', to: '2026-09-28' });
    });

    it('por años no manda fechas, aunque haya rango', () => {
        expect(expensesParams('year', range)).toEqual({ by: 'year' });
        expect(expensesParams('year', null)).toEqual({ by: 'year' });
    });

    it('por meses sin rango no pide nada', () => {
        expect(expensesParams('month', null)).toBeNull();
    });
});

describe('startedPeriods', () => {
    it('deja solo las que ya han empezado, hoy incluido', () => {
        const items = [
            { id: 1, start_date: '2026-09-28', end_date: '2026-10-05' },
            { id: 2, start_date: '2026-09-29', end_date: '2026-10-05' },
            { id: 3, start_date: '2026-01-01', end_date: '2026-02-01' }
        ];
        expect(startedPeriods(items, today).map((item) => item.id)).toEqual([1, 3]);
    });

    it('sin lista devuelve una lista vacía', () => {
        expect(startedPeriods(undefined, today)).toEqual([]);
    });
});

describe('chosenPeriod', () => {
    const items = [
        { id: 4, period_type_id: 1, start_date: '2026-09-01', end_date: '2026-10-15' },
        { id: 3, period_type_id: 2, start_date: '2026-07-01', end_date: '2026-08-31' },
        { id: 1, period_type_id: 2, start_date: '2025-07-01', end_date: '2025-08-31' }
    ];

    it('devuelve la que se ha elegido', () => {
        expect(chosenPeriod(items, '1', today).id).toBe(1);
    });

    it('por defecto es la última que ya terminó', () => {
        expect(chosenPeriod(items, '', today).id).toBe(3);
    });

    it('sin ninguna empezada no hay elección', () => {
        expect(chosenPeriod([], '', today)).toBeNull();
    });
});

describe('periodMenu', () => {
    const yearText = 'Este año · 1 ene – 28 sep 2026';

    it('con Este año elegido, la primera opción enseña el rango', () => {
        expect(periodMenu('year', yearText, yearText)).toEqual([
            { value: 'year', label: yearText },
            { value: 'campaign', label: 'Una campaña…' },
            { value: 'season', label: 'Una temporada…' },
            { value: 'dates', label: 'Fechas concretas…' }
        ]);
    });

    it('la opción elegida enseña su propio texto y la primera vuelve a Este año', () => {
        const menu = periodMenu('campaign', 'Rebajas · 1 jul – 31 ago 2026', yearText);
        expect(menu.map((option) => option.label)).toEqual([yearText, 'Rebajas · 1 jul – 31 ago 2026', 'Una temporada…', 'Fechas concretas…']);
    });

    it('si aún no hay texto, la opción elegida se queda con su invitación', () => {
        expect(periodMenu('season', null, yearText)[2].label).toBe('Una temporada…');
    });
});

describe('expensesKpis', () => {
    it('da los importes con dos decimales y los porcentajes con uno', () => {
        expect(expensesKpis({ amount: 201358.4, cost: 103805.5, profit: 97552.9 })).toEqual({
            amount: '201.358,40 €',
            cost: '103.805,50 €',
            profit: '97.552,90 €',
            costShare: '51,6 %',
            profitShare: '48,4 %'
        });
    });

    it('con ingresos a 0 los porcentajes salen a 0,0 %', () => {
        expect(expensesKpis({ amount: 0, cost: 0, profit: 0 })).toEqual({
            amount: '0,00 €',
            cost: '0,00 €',
            profit: '0,00 €',
            costShare: '0,0 %',
            profitShare: '0,0 %'
        });
    });

    it('usa los totales que le dan, no los recalcula', () => {
        const kpis = expensesKpis({ amount: 100, cost: 40, profit: 59.99 });
        expect(kpis.profit).toBe('59,99 €');
        expect(kpis.profitShare).toBe('60,0 %');
    });

    it('con pérdidas el beneficio y su porcentaje salen negativos', () => {
        const kpis = expensesKpis({ amount: 100, cost: 120, profit: -20 });
        expect(kpis.profit).toBe('-20,00 €');
        expect(kpis.profitShare).toBe('-20,0 %');
    });
});

describe('yAxisScale', () => {
    it('con el mayor ingreso de 30.120 el paso es 10.000 y el tope 40.000', () => {
        expect(yAxisScale(30120)).toEqual({ step: 10000, top: 40000, ticks: [0, 10000, 20000, 30000, 40000] });
    });

    it('con 251.470 el paso es 100.000 y el tope 300.000', () => {
        expect(yAxisScale(251470)).toEqual({ step: 100000, top: 300000, ticks: [0, 100000, 200000, 300000] });
    });

    it('elige el primer paso para el que el mayor cabe en cuatro tramos o menos', () => {
        expect(yAxisScale(20000).step).toBe(5000);
        expect(yAxisScale(20001).step).toBe(10000);
        expect(yAxisScale(40000).step).toBe(10000);
        expect(yAxisScale(40001).step).toBe(20000);
        expect(yAxisScale(100000).step).toBe(25000);
        expect(yAxisScale(200000).step).toBe(50000);
    });

    it('el tope es el múltiplo del paso por encima del mayor, y si coincide se queda', () => {
        expect(yAxisScale(40000).top).toBe(40000);
        expect(yAxisScale(41000).top).toBe(60000);
    });

    it('sigue con 200.000, 250.000 y 500.000 con importes grandes, sin llenar de marcas', () => {
        expect(yAxisScale(800000).step).toBe(200000);
        expect(yAxisScale(1000000).step).toBe(250000);
        expect(yAxisScale(2000000).step).toBe(500000);
        expect(yAxisScale(8000000).ticks.length).toBeLessThanOrEqual(6);
    });

    it('con todo a cero deja una escala mínima: 0 y el primer paso', () => {
        expect(yAxisScale(0)).toEqual({ step: 5000, top: 5000, ticks: [0, 5000] });
    });
});

describe('axisLabel', () => {
    it('escribe los miles con «mil» y el separador de miles', () => {
        expect(axisLabel(0)).toBe('0');
        expect(axisLabel(10000)).toBe('10 mil');
        expect(axisLabel(40000)).toBe('40 mil');
        expect(axisLabel(250000)).toBe('250 mil');
        expect(axisLabel(1500000)).toBe('1.500 mil');
    });
});

describe('chartPeak', () => {
    it('es el mayor de ingresos y gastos de todas las barras', () => {
        expect(chartPeak([{ amount: 100, cost: 40 }, { amount: 50, cost: 120 }])).toBe(120);
    });

    it('sin barras es 0', () => {
        expect(chartPeak([])).toBe(0);
    });
});

describe('expensesBuckets', () => {
    const row = (key, amount, cost) => ({ key, amount, cost, profit: amount - cost });

    it('rellena con ceros los meses sin ventas, seguidos y en orden', () => {
        const data = { range: { from: '2026-01-01', to: '2026-04-15' }, rows: [row('2026-01', 100, 40), row('2026-03', 200, 120)] };
        const buckets = expensesBuckets('month', data, today);
        expect(buckets.map((bucket) => bucket.key)).toEqual(['2026-01', '2026-02', '2026-03', '2026-04']);
        expect(buckets[1]).toMatchObject({ amount: 0, cost: 0, profit: 0, margin: null });
        expect(buckets[2]).toMatchObject({ amount: 200, cost: 120, profit: 80, margin: 40 });
    });

    it('en meses, las etiquetas son cortas y el nombre completo, con inicial mayúscula', () => {
        const data = { range: { from: '2026-08-01', to: '2026-09-28' }, rows: [] };
        const buckets = expensesBuckets('month', data, today);
        expect(buckets.map((bucket) => bucket.label)).toEqual(['Ago', 'Sep']);
        expect(buckets.map((bucket) => bucket.name)).toEqual(['Agosto', 'Septiembre']);
    });

    it('si el periodo cruza de año, la etiqueta y el nombre llevan el año', () => {
        const data = { range: { from: '2025-11-10', to: '2026-01-20' }, rows: [] };
        const buckets = expensesBuckets('month', data, today);
        expect(buckets.map((bucket) => bucket.label)).toEqual(['Nov 25', 'Dic 25', 'Ene 26']);
        expect(buckets.map((bucket) => bucket.name)).toEqual(['Noviembre 2025', 'Diciembre 2025', 'Enero 2026']);
    });

    it('un periodo de un solo mes da una sola barra', () => {
        const data = { range: { from: '2026-09-05', to: '2026-09-20' }, rows: [row('2026-09', 10, 5)] };
        expect(expensesBuckets('month', data, today)).toHaveLength(1);
    });

    it('en años va del año de la primera venta al año en curso, aunque no haya ventas este año', () => {
        const data = { range: { from: '2023-02-03', to: '2024-05-01' }, rows: [row('2023', 100, 50), row('2024', 80, 30)] };
        const buckets = expensesBuckets('year', data, today);
        expect(buckets.map((bucket) => bucket.key)).toEqual(['2023', '2024', '2025', '2026']);
        expect(buckets.map((bucket) => bucket.label)).toEqual(['2023', '2024', '2025', '2026']);
        expect(buckets[3]).toMatchObject({ amount: 0, name: '2026' });
    });

    it('sin datos o sin ventas devuelve una lista vacía', () => {
        expect(expensesBuckets('month', null, today)).toEqual([]);
        expect(expensesBuckets('year', { range: null, rows: [] }, today)).toEqual([]);
    });
});