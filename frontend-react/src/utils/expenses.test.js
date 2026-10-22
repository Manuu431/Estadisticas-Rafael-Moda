import { describe, expect, it } from 'vitest';
import { EMPTY_MESSAGE, GRAINS, LOW_MARGIN, TABLE_ROWS, axisLabel, chartPeak, chosenPeriod, datesNotice, expensesBuckets, expensesKpis, expensesState, expensesTable, expensesParams, expensesRange, periodCount, periodMenu, periodText, skeletonRows, startedPeriods, wholeRange, yAxisScale } from './expenses.js';

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

    it('Todo no tiene fechas: pide todo lo que haya', () => {
        expect(expensesRange('all', {}, today)).toEqual({ all: true });
    });
});

describe('wholeRange', () => {
    const range = { from: '2020-03-14', to: '2026-09-28' };

    it('en años empieza el 1 de enero del primer año', () => {
        expect(wholeRange(range, 'year')).toEqual({ from: '2020-01-01', to: '2026-09-28' });
    });

    it('en meses empieza el día 1 del primer mes', () => {
        expect(wholeRange(range, 'month')).toEqual({ from: '2020-03-01', to: '2026-09-28' });
    });

    it('en días y semanas se queda en la primera venta', () => {
        expect(wholeRange(range, 'day')).toEqual(range);
        expect(wholeRange(range, 'week')).toEqual(range);
    });
});

describe('GRAINS', () => {
    it('son días, semanas, meses y años, con su nombre en singular y el título de la tabla', () => {
        expect(GRAINS.map((grain) => [grain.value, grain.label, grain.noun, grain.table])).toEqual([
            ['day', 'Días', 'día', 'Día a día'],
            ['week', 'Semanas', 'semana', 'Semana a semana'],
            ['month', 'Meses', 'mes', 'Mes a mes'],
            ['year', 'Años', 'año', 'Año a año']
        ]);
    });

    it('la tabla enseña siete filas a la vez', () => {
        expect(TABLE_ROWS).toBe(7);
    });
});

describe('periodText', () => {
    it('Este año enseña el rango con el año al final', () => {
        expect(periodText('year', { from: '2026-01-01', to: '2026-09-28' })).toBe('Este año · 1 ene – 28 sep 2026');
    });

    it('una campaña lleva su nombre delante', () => {
        expect(periodText('campaign', { from: '2026-07-01', to: '2026-08-31' }, 'Rebajas de verano')).toBe('Rebajas de verano · 1 jul – 31 ago 2026');
    });

    it('Todo no lleva fechas', () => {
        expect(periodText('all', { all: true })).toBe('Todo, desde que hay datos');
    });

    it('las fechas concretas llevan «Fechas» delante', () => {
        expect(periodText('dates', { from: '2026-03-15', to: '2026-05-10' })).toBe('Fechas · 15 mar – 10 may 2026');
    });

    it('si cruza de año, los dos extremos llevan el año', () => {
        expect(periodText('dates', { from: '2025-12-20', to: '2026-01-10' })).toBe('Fechas · 20 dic 2025 – 10 ene 2026');
    });
});

describe('expensesParams', () => {
    const range = { from: '2026-01-01', to: '2026-09-28' };

    it('por meses y por años manda el rango', () => {
        expect(expensesParams('month', range)).toEqual({ by: 'month', from: '2026-01-01', to: '2026-09-28' });
        expect(expensesParams('year', range)).toEqual({ by: 'year', from: '2026-01-01', to: '2026-09-28' });
    });

    it('por días y por semanas pide los días: las semanas se agrupan en el navegador', () => {
        expect(expensesParams('day', range)).toEqual({ by: 'day', from: '2026-01-01', to: '2026-09-28' });
        expect(expensesParams('week', range)).toEqual({ by: 'day', from: '2026-01-01', to: '2026-09-28' });
    });

    it('con Todo no manda fechas', () => {
        expect(expensesParams('month', { all: true })).toEqual({ by: 'month' });
        expect(expensesParams('week', { all: true })).toEqual({ by: 'day' });
    });

    it('sin rango no pide nada', () => {
        expect(expensesParams('month', null)).toBeNull();
        expect(expensesParams('year', null)).toBeNull();
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
            { value: 'dates', label: 'Fechas concretas…' },
            { value: 'all', label: 'Todo, desde que hay datos' }
        ]);
    });

    it('la opción elegida enseña su propio texto y la primera vuelve a Este año', () => {
        const menu = periodMenu('campaign', 'Rebajas · 1 jul – 31 ago 2026', yearText);
        expect(menu.map((option) => option.label)).toEqual([yearText, 'Rebajas · 1 jul – 31 ago 2026', 'Una temporada…', 'Fechas concretas…', 'Todo, desde que hay datos']);
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
            profitShare: '48,4 %',
            loss: false
        });
    });

    it('con ingresos a 0 los porcentajes salen a 0,0 %', () => {
        expect(expensesKpis({ amount: 0, cost: 0, profit: 0 })).toEqual({
            amount: '0,00 €',
            cost: '0,00 €',
            profit: '0,00 €',
            costShare: '0,0 %',
            profitShare: '0,0 %',
            loss: false
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

    it('avisa de la pérdida solo si el beneficio es menor que cero', () => {
        expect(expensesKpis({ amount: 100, cost: 120, profit: -20 }).loss).toBe(true);
        expect(expensesKpis({ amount: 100, cost: 100, profit: 0 }).loss).toBe(false);
        expect(expensesKpis({ amount: 100, cost: 40, profit: 60 }).loss).toBe(false);
        expect(expensesKpis({ amount: 0, cost: 0, profit: 0 }).loss).toBe(false);
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

    it('con importes pequeños baja el paso para que las barras llenen la gráfica', () => {
        expect(yAxisScale(1200)).toEqual({ step: 500, top: 1500, ticks: [0, 500, 1000, 1500] });
        expect(yAxisScale(800)).toEqual({ step: 200, top: 800, ticks: [0, 200, 400, 600, 800] });
        expect(yAxisScale(4900).step).toBe(2000);
        expect(yAxisScale(60).step).toBe(100);
    });

    it('en días admite hasta seis tramos, para no dejar demasiado aire encima de las barras', () => {
        expect(yAxisScale(2300)).toEqual({ step: 1000, top: 3000, ticks: [0, 1000, 2000, 3000] });
        expect(yAxisScale(2300, 'day')).toEqual({ step: 500, top: 2500, ticks: [0, 500, 1000, 1500, 2000, 2500] });
        expect(yAxisScale(2300, 'week').top).toBe(3000);
        expect(yAxisScale(30120, 'month').top).toBe(40000);
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

    it('por debajo de mil no lleva «mil» y entre mil y diez mil admite decimales', () => {
        expect(axisLabel(500)).toBe('500');
        expect(axisLabel(1000)).toBe('1 mil');
        expect(axisLabel(1500)).toBe('1,5 mil');
        expect(axisLabel(2500)).toBe('2,5 mil');
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

    it('en años va del año del primer día al del último, sin pasar de ahí', () => {
        const data = { range: { from: '2023-02-03', to: '2025-05-01' }, rows: [row('2023', 100, 50), row('2025', 80, 30)] };
        const buckets = expensesBuckets('year', data, today);
        expect(buckets.map((bucket) => bucket.key)).toEqual(['2023', '2024', '2025']);
        expect(buckets.map((bucket) => bucket.label)).toEqual(['2023', '2024', '2025']);
        expect(buckets[1]).toMatchObject({ amount: 0, name: '2024' });
    });

    it('en días hay una barra por día, también los que no tienen ventas', () => {
        const data = { range: { from: '2026-09-28', to: '2026-10-01' }, rows: [row('2026-09-29', 100, 40)] };
        const buckets = expensesBuckets('day', data, today);
        expect(buckets.map((bucket) => bucket.key)).toEqual(['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01']);
        expect(buckets[1]).toMatchObject({ amount: 100, cost: 40, profit: 60, margin: 60 });
        expect(buckets[0]).toMatchObject({ amount: 0, margin: null });
    });

    it('en días, la etiqueta es «28 sep» y el nombre lleva el año', () => {
        const data = { range: { from: '2026-09-28', to: '2026-09-29' }, rows: [] };
        const buckets = expensesBuckets('day', data, today);
        expect(buckets.map((bucket) => bucket.label)).toEqual(['28 sep', '29 sep']);
        expect(buckets.map((bucket) => bucket.name)).toEqual(['28 sep 2026', '29 sep 2026']);
    });

    it('en semanas, la primera empieza el primer día y las demás el lunes, y suman sus días', () => {
        const data = {
            range: { from: '2026-09-23', to: '2026-10-07' },
            rows: [row('2026-09-23', 10, 4), row('2026-09-27', 20, 8), row('2026-09-28', 100, 40), row('2026-10-04', 1, 1), row('2026-10-05', 5, 2)]
        };
        const buckets = expensesBuckets('week', data, today);
        expect(buckets.map((bucket) => bucket.key)).toEqual(['2026-09-23', '2026-09-28', '2026-10-05']);
        expect(buckets[0]).toMatchObject({ amount: 30, cost: 12, profit: 18, name: '23 sep – 27 sep 2026' });
        expect(buckets[1]).toMatchObject({ amount: 101, cost: 41, name: '28 sep – 4 oct 2026' });
        expect(buckets[2]).toMatchObject({ amount: 5, cost: 2, name: '5 oct – 7 oct 2026' });
    });

    it('en semanas, la etiqueta es el día en que empieza', () => {
        const data = { range: { from: '2026-09-28', to: '2026-10-11' }, rows: [] };
        expect(expensesBuckets('week', data, today).map((bucket) => bucket.label)).toEqual(['28 sep', '5 oct']);
    });

    it('sin datos o sin ventas devuelve una lista vacía', () => {
        expect(expensesBuckets('month', null, today)).toEqual([]);
        expect(expensesBuckets('year', { range: null, rows: [] }, today)).toEqual([]);
        expect(expensesBuckets('day', { range: null, rows: [] }, today)).toEqual([]);
    });
});

describe('expensesTable', () => {
    const row = (key, amount, cost) => ({ key, amount, cost, profit: Math.round((amount - cost) * 100) / 100 });
    const table = (grain, range, rows) => expensesTable(grain, expensesBuckets(grain, { range, rows }, today), range);

    it('el margen bajo es el 42 %', () => {
        expect(LOW_MARGIN).toBe(42);
    });

    it('va del mes más reciente al más antiguo', () => {
        const result = table('month', { from: '2026-01-01', to: '2026-03-31' }, []);
        expect(result.rows.map((item) => item.key)).toEqual(['2026-03', '2026-02', '2026-01']);
    });

    it('redondea los importes y deja el % con un decimal', () => {
        const result = table('month', { from: '2026-01-01', to: '2026-01-31' }, [row('2026-01', 29740.4, 18140.2)]);
        expect(result.rows[0]).toMatchObject({ amount: '29.740 €', cost: '18.140 €', profit: '11.600 €', share: '39,0 %', low: true });
    });

    it('la pastilla sale por debajo del 42 %, y justo 42,0 % no la lleva', () => {
        const range = { from: '2026-01-01', to: '2026-03-31' };
        const result = table('month', range, [row('2026-01', 100, 58), row('2026-02', 100, 58.1), row('2026-03', 100, 57.9)]);
        const byKey = Object.fromEntries(result.rows.map((item) => [item.key, item]));
        expect(byKey['2026-01']).toMatchObject({ share: '42,0 %', low: false });
        expect(byKey['2026-02']).toMatchObject({ share: '41,9 %', low: true });
        expect(byKey['2026-03']).toMatchObject({ share: '42,1 %', low: false });
    });

    it('decide la pastilla con el mismo número que se lee', () => {
        const result = table('month', { from: '2026-01-01', to: '2026-01-31' }, [row('2026-01', 100, 58.04)]);
        expect(result.rows[0]).toMatchObject({ share: '42,0 %', low: false });
    });

    it('un mes con pérdidas lo marca, lleva pastilla y enseña el signo menos', () => {
        const result = table('month', { from: '2026-01-01', to: '2026-02-28' }, [row('2026-01', 100, 120), row('2026-02', 100, 50)]);
        expect(result.rows[1]).toMatchObject({ key: '2026-01', profit: '-20 €', share: '-20,0 %', low: true, loss: true });
        expect(result.rows[0].loss).toBe(false);
    });

    it('un mes sin ventas enseña 0 €, un guion y ninguna pastilla', () => {
        const result = table('month', { from: '2026-01-01', to: '2026-02-28' }, [row('2026-01', 100, 50)]);
        expect(result.rows[0]).toMatchObject({ key: '2026-02', amount: '0 €', cost: '0 €', profit: '0 €', share: '—', low: false });
    });

    it('marca el último mes y avisa cuando el periodo acaba antes de acabar el mes', () => {
        const result = table('month', { from: '2026-01-01', to: '2026-09-28' }, []);
        expect(result.rows[0].name).toBe('Septiembre*');
        expect(result.rows[1].name).toBe('Agosto');
        expect(result.note).toBe('* Septiembre, hasta el día 28.');
    });

    it('si el periodo cierra en el último día del mes y empieza el día 1, no hay asterisco ni nota', () => {
        const result = table('month', { from: '2026-01-01', to: '2026-08-31' }, []);
        expect(result.rows.some((item) => item.name.includes('*'))).toBe(false);
        expect(result.note).toBe('');
    });

    it('marca el primer mes cuando el periodo empieza a mitad', () => {
        const result = table('month', { from: '2026-03-15', to: '2026-05-31' }, []);
        expect(result.rows.map((item) => item.name)).toEqual(['Mayo', 'Abril', 'Marzo*']);
        expect(result.note).toBe('* Marzo, desde el día 15.');
    });

    it('marca el primero y el último, en orden cronológico en la nota', () => {
        const result = table('month', { from: '2026-03-15', to: '2026-05-10' }, []);
        expect(result.rows.map((item) => item.name)).toEqual(['Mayo*', 'Abril', 'Marzo*']);
        expect(result.note).toBe('* Marzo, desde el día 15. * Mayo, hasta el día 10.');
    });

    it('un periodo dentro de un solo mes dice del día X al Y', () => {
        const result = table('month', { from: '2026-09-05', to: '2026-09-20' }, []);
        expect(result.rows[0].name).toBe('Septiembre*');
        expect(result.note).toBe('* Septiembre, del día 5 al 20.');
    });

    it('si el periodo cruza de año, la nota nombra el mes con su año', () => {
        const result = table('month', { from: '2025-12-15', to: '2026-01-31' }, []);
        expect(result.note).toBe('* Diciembre 2025, desde el día 15.');
    });

    it('si el periodo cruza de año, las filas usan el nombre corto con año para caber en la columna', () => {
        const result = table('month', { from: '2025-11-01', to: '2026-01-31' }, []);
        expect(result.rows.map((item) => item.name)).toEqual(['Ene 26', 'Dic 25', 'Nov 25']);
        expect(table('month', { from: '2025-12-15', to: '2026-01-31' }, []).rows[1].name).toBe('Dic 25*');
    });

    it('en años marca el primero y el último cuando el periodo no los cubre enteros', () => {
        const result = table('year', { from: '2024-02-03', to: '2026-09-28' }, []);
        expect(result.rows.map((item) => item.name)).toEqual(['2026*', '2025', '2024*']);
        expect(result.note).toBe('* 2024, desde el 3 de febrero. * 2026, hasta el 28 de septiembre.');
    });

    it('en años, un periodo dentro de un solo año dice del día X al Y', () => {
        const result = table('year', { from: '2026-03-05', to: '2026-05-20' }, []);
        expect(result.rows[0].name).toBe('2026*');
        expect(result.note).toBe('* 2026, del 5 de marzo al 20 de mayo.');
    });

    it('en años, con años completos no hay asterisco ni nota', () => {
        const result = table('year', { from: '2025-01-01', to: '2026-12-31' }, []);
        expect(result.rows.map((item) => item.name)).toEqual(['2026', '2025']);
        expect(result.note).toBe('');
    });

    it('en días y semanas la fila lleva el nombre corto y no hay asteriscos', () => {
        expect(table('day', { from: '2026-09-27', to: '2026-09-28' }, []).rows.map((item) => item.name)).toEqual(['Lunes 28 sep', 'Domingo 27 sep']);
        const weeks = table('week', { from: '2026-09-23', to: '2026-10-07' }, []);
        expect(weeks.rows.map((item) => item.name)).toEqual(['5 – 7 oct', '28 sep – 4 oct', '23 – 27 sep']);
        expect(weeks.note).toBe('');
    });

    it('sin barras no hay filas ni nota', () => {
        expect(expensesTable('month', [], null)).toEqual({ rows: [], note: '' });
    });
});

describe('expensesState', () => {
    const sold = { totals: { amount: 100, cost: 40, profit: 60 }, rows: [{ key: '2026-01', amount: 100, cost: 40, profit: 60 }] };
    const none = { totals: { amount: 0, cost: 0, profit: 0 }, rows: [] };

    it('sin respuesta todavía y sin error, está cargando', () => {
        expect(expensesState({ data: null, error: null })).toEqual({ kind: 'loading' });
    });

    it('con ventas, está listo', () => {
        expect(expensesState({ data: sold, error: null })).toEqual({ kind: 'ready' });
    });

    it('sin ventas en el periodo, dice que no hay ventas', () => {
        expect(expensesState({ data: none, error: null })).toEqual({ kind: 'empty', message: EMPTY_MESSAGE });
        expect(EMPTY_MESSAGE).toBe('No hay ventas en este periodo.');
    });

    it('un error gana a los datos antiguos y a la carga', () => {
        expect(expensesState({ data: null, error: new Error('x') })).toEqual({ kind: 'error' });
        expect(expensesState({ data: sold, error: new Error('x') })).toEqual({ kind: 'error' });
        expect(expensesState({ data: none, error: new Error('x') })).toEqual({ kind: 'error' });
    });

    it('mientras carga la lista de campañas o temporadas, está cargando aunque haya datos', () => {
        expect(expensesState({ data: sold, error: null, listLoading: true })).toEqual({ kind: 'loading' });
    });

    it('si falla la lista de campañas o temporadas, es un error', () => {
        expect(expensesState({ data: sold, error: null, listError: new Error('x') })).toEqual({ kind: 'error' });
        expect(expensesState({ data: null, error: null, listError: new Error('x'), listLoading: true })).toEqual({ kind: 'error' });
    });
});

describe('datesNotice', () => {
    it('con fechas a medias pide las dos fechas', () => {
        expect(datesNotice('dates', custom('2026-03-15', ''))).toBe('Elige las dos fechas del periodo.');
        expect(datesNotice('dates', custom('', ''))).toBe('Elige las dos fechas del periodo.');
    });

    it('no repite los avisos que ya enseñan los campos de fecha', () => {
        expect(datesNotice('dates', custom('2026-05-10', '2026-03-15'))).toBeNull();
        expect(datesNotice('dates', { key: 'custom', from: '', to: '2026-03-15', bad: ['from'] })).toBeNull();
    });

    it('con fechas buenas, o con otro tipo de periodo, no hay aviso', () => {
        expect(datesNotice('dates', custom('2026-03-15', '2026-05-10'))).toBeNull();
        expect(datesNotice('year', custom('', ''))).toBeNull();
        expect(datesNotice('campaign', custom('', ''))).toBeNull();
    });
});
describe('periodCount', () => {
    it('cuenta las barras que saldrán en cada control', () => {
        const period = { from: '2026-09-20', to: '2026-10-04' };
        expect(periodCount('day', period)).toBe(15);
        expect(periodCount('week', period)).toBe(3);
        expect(periodCount('month', period)).toBe(2);
        expect(periodCount('year', period)).toBe(1);
    });

    it('con Todo o sin periodo no se sabe de antemano', () => {
        expect(periodCount('day', { all: true })).toBeNull();
        expect(periodCount('day', null)).toBeNull();
    });
});

describe('skeletonRows', () => {
    it('en meses dibuja una fila por mes del periodo, para que la silueta mida lo que medirá la tabla', () => {
        expect(skeletonRows('month', { from: '2026-05-01', to: '2026-10-04' })).toBe(6);
        expect(skeletonRows('month', { from: '2026-09-05', to: '2026-09-20' })).toBe(1);
        expect(skeletonRows('month', { from: '2025-11-10', to: '2026-02-01' })).toBe(4);
    });

    it('no pasa de siete filas con periodos largos, que es lo que enseña la tabla', () => {
        expect(skeletonRows('month', { from: '2021-01-01', to: '2026-10-04' })).toBe(7);
        expect(skeletonRows('day', { from: '2026-01-01', to: '2026-10-04' })).toBe(7);
        expect(skeletonRows('year', { from: '2018-01-01', to: '2026-10-04' })).toBe(7);
    });

    it('en años y semanas dibuja una por año o por semana del periodo', () => {
        expect(skeletonRows('year', { from: '2026-01-01', to: '2026-10-04' })).toBe(1);
        expect(skeletonRows('week', { from: '2026-09-28', to: '2026-10-04' })).toBe(1);
        expect(skeletonRows('week', { from: '2026-09-28', to: '2026-10-05' })).toBe(2);
    });

    it('con Todo o sin periodo dibuja siete', () => {
        expect(skeletonRows('month', { all: true })).toBe(7);
        expect(skeletonRows('month', null)).toBe(7);
    });
});