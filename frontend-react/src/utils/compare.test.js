import { describe, expect, it } from 'vitest';
import {
    bucketRanges,
    bucketStarts,
    formatBucketRange,
    bucketLabel,
    compareKpis,
    comparePeriodNames,
    compareState,
    defaultPair,
    deltaPercent,
    pairBuckets
} from './compare.js';

const day = (date, total) => ({ date, total });

describe('bucketStarts', () => {
    it('semanas: la primera empieza el primer día del periodo y las demás los lunes', () => {
        // 1 jul 2026 es miércoles
        expect(bucketStarts('2026-07-01', '2026-07-20', 'week')).toEqual(['2026-07-01', '2026-07-06', '2026-07-13', '2026-07-20']);
    });

    it('semanas: si el periodo empieza en lunes no hay una semana suelta delante', () => {
        expect(bucketStarts('2026-07-06', '2026-07-19', 'week')).toEqual(['2026-07-06', '2026-07-13']);
    });

    it('semanas: un periodo de un solo día tiene una semana', () => {
        expect(bucketStarts('2026-07-01', '2026-07-01', 'week')).toEqual(['2026-07-01']);
    });

    it('meses: el primero empieza el primer día del periodo y los demás el día 1', () => {
        expect(bucketStarts('2026-07-15', '2026-09-02', 'month')).toEqual(['2026-07-15', '2026-08-01', '2026-09-01']);
    });

    it('meses: cruza el cambio de año', () => {
        expect(bucketStarts('2026-12-05', '2027-01-06', 'month')).toEqual(['2026-12-05', '2027-01-01']);
    });
});

describe('bucketStarts por día y por año', () => {
    it('días: una barra por cada día del periodo', () => {
        expect(bucketStarts('2026-07-30', '2026-08-02', 'day')).toEqual(['2026-07-30', '2026-07-31', '2026-08-01', '2026-08-02']);
    });

    it('años: el primero empieza el primer día del periodo y los demás el 1 de enero', () => {
        expect(bucketStarts('2025-11-10', '2027-02-01', 'year')).toEqual(['2025-11-10', '2026-01-01', '2027-01-01']);
    });

    it('años: un periodo dentro de un solo año tiene una barra', () => {
        expect(bucketStarts('2026-07-01', '2026-08-31', 'year')).toEqual(['2026-07-01']);
    });
});

describe('bucketRanges', () => {
    it('semanas: cada rango acaba el día antes de la siguiente y el último, el último día del periodo', () => {
        expect(bucketRanges('2026-07-01', '2026-07-14', 'week')).toEqual([
            { from: '2026-07-01', to: '2026-07-05' },
            { from: '2026-07-06', to: '2026-07-12' },
            { from: '2026-07-13', to: '2026-07-14' }
        ]);
    });

    it('meses: el primero empieza en el primer día del periodo y el último acaba donde acaba', () => {
        expect(bucketRanges('2026-07-15', '2026-09-02', 'month')).toEqual([
            { from: '2026-07-15', to: '2026-07-31' },
            { from: '2026-08-01', to: '2026-08-31' },
            { from: '2026-09-01', to: '2026-09-02' }
        ]);
    });

    it('días y años', () => {
        expect(bucketRanges('2026-07-01', '2026-07-02', 'day')).toEqual([
            { from: '2026-07-01', to: '2026-07-01' },
            { from: '2026-07-02', to: '2026-07-02' }
        ]);
        expect(bucketRanges('2025-11-10', '2026-03-01', 'year')).toEqual([
            { from: '2025-11-10', to: '2025-12-31' },
            { from: '2026-01-01', to: '2026-03-01' }
        ]);
    });
});

describe('formatBucketRange', () => {
    it('rango dentro de un año: el año una sola vez al final', () => {
        expect(formatBucketRange({ from: '2026-01-03', to: '2026-01-07' })).toBe('3 ene – 7 ene 2026');
    });

    it('un solo día: la fecha con el año', () => {
        expect(formatBucketRange({ from: '2026-07-06', to: '2026-07-06' })).toBe('6 jul 2026');
    });

    it('rango que cruza de año: el año en los dos extremos', () => {
        expect(formatBucketRange({ from: '2025-12-28', to: '2026-01-03' })).toBe('28 dic 2025 – 3 ene 2026');
    });

    it('sin rango (esa barra no existe en este periodo): vacío', () => {
        expect(formatBucketRange(null)).toBe('');
    });
});

describe('pairBuckets', () => {
    const a = { from: '2026-07-01', to: '2026-07-14', days: [day('2026-07-01', 100), day('2026-07-03', 50), day('2026-07-07', 70)] };
    const b = { from: '2025-07-01', to: '2025-07-14', days: [day('2025-07-01', 40), day('2025-07-08', 90)] };

    it('suma cada día en su semana y empareja las semanas por posición', () => {
        // A (1 jul 2026 es miércoles): 1–5 | 6–12 | 13–14.   B (1 jul 2025 es martes): 1–6 | 7–13 | 14
        expect(pairBuckets(a, b, 'week')).toEqual([
            { start: '2026-07-01', a: 150, b: 40 },
            { start: '2026-07-06', a: 70, b: 90 },
            { start: '2026-07-13', a: 0, b: 0 }
        ]);
    });

    it('si B dura más que A, las barras que sobran salen con la fecha de B y A a 0', () => {
        const shortA = { from: '2026-07-01', to: '2026-07-05', days: [day('2026-07-02', 10)] };
        const longB = { from: '2025-07-01', to: '2025-07-20', days: [day('2025-07-15', 5)] };
        const rows = pairBuckets(shortA, longB, 'week');
        expect(rows).toHaveLength(3);
        expect(rows[0]).toEqual({ start: '2026-07-01', a: 10, b: 0 });
        expect(rows[2]).toEqual({ start: '2025-07-14', a: 0, b: 5 });
    });

    it('meses: junta los días de cada mes', () => {
        const pa = { from: '2026-07-01', to: '2026-08-31', days: [day('2026-07-10', 10), day('2026-07-20', 5), day('2026-08-02', 7)] };
        const pb = { from: '2025-07-01', to: '2025-08-31', days: [day('2025-08-30', 3)] };
        expect(pairBuckets(pa, pb, 'month')).toEqual([
            { start: '2026-07-01', a: 15, b: 0 },
            { start: '2026-08-01', a: 7, b: 3 }
        ]);
    });
});

describe('pairBuckets por día y por año', () => {
    it('días: empareja el día n de A con el día n de B', () => {
        const pa = { from: '2026-07-01', to: '2026-07-03', days: [day('2026-07-02', 10)] };
        const pb = { from: '2025-07-01', to: '2025-07-02', days: [day('2025-07-01', 4), day('2025-07-02', 6)] };
        expect(pairBuckets(pa, pb, 'day')).toEqual([
            { start: '2026-07-01', a: 0, b: 4 },
            { start: '2026-07-02', a: 10, b: 6 },
            { start: '2026-07-03', a: 0, b: 0 }
        ]);
    });

    it('años: junta los días de cada año natural', () => {
        const pa = { from: '2025-12-20', to: '2026-01-10', days: [day('2025-12-31', 5), day('2026-01-02', 7)] };
        const pb = { from: '2024-12-20', to: '2025-01-10', days: [day('2024-12-25', 1), day('2025-01-05', 2)] };
        expect(pairBuckets(pa, pb, 'year')).toEqual([
            { start: '2025-12-20', a: 5, b: 1 },
            { start: '2026-01-01', a: 7, b: 2 }
        ]);
    });
});

describe('bucketLabel', () => {
    it('día: como la semana, con el día y el mes', () => {
        expect(bucketLabel('2026-07-06', 'day', false)).toBe('6 jul');
        expect(bucketLabel('2026-07-06', 'day', true)).toBe('6/7');
    });

    it('año: el año con cuatro cifras', () => {
        expect(bucketLabel('2026-01-01', 'year', false)).toBe('2026');
    });

    it('semana en escritorio: día y mes abreviado', () => {
        expect(bucketLabel('2026-07-06', 'week', false)).toBe('6 jul');
    });

    it('semana en móvil: día/mes', () => {
        expect(bucketLabel('2026-07-06', 'week', true)).toBe('6/7');
    });

    it('mes: el mes abreviado, con el año cuando se pide', () => {
        expect(bucketLabel('2022-01-01', 'month', false, true)).toBe('ene 22');
        expect(bucketLabel('2026-08-01', 'month', false, false)).toBe('ago');
    });
});

describe('deltaPercent', () => {
    it('es la variación de A respecto a B', () => {
        expect(deltaPercent(110, 100)).toBeCloseTo(10);
        expect(deltaPercent(90, 100)).toBeCloseTo(-10);
    });

    it('sin nada con lo que comparar es null', () => {
        expect(deltaPercent(10, 0)).toBeNull();
    });
});

describe('compareKpis', () => {
    const summaryA = { total: 200, profit: 80, units: 10, tickets: 4 };
    const summaryB = { total: 100, profit: 40, units: 5, tickets: 0 };

    it('da ventas, beneficio, prendas y ticket medio de los dos periodos', () => {
        const [sales, profit, units, ticket] = compareKpis(summaryA, summaryB);
        expect(sales).toMatchObject({ key: 'sales', a: 200, b: 100, kind: 'money' });
        expect(profit).toMatchObject({ key: 'profit', a: 80, b: 40, kind: 'money' });
        expect(units).toMatchObject({ key: 'units', a: 10, b: 5, kind: 'number' });
        expect(ticket).toMatchObject({ key: 'ticket', a: 50, b: 0, kind: 'money' });
    });

    it('el ticket medio sin tickets es 0 y su variación queda sin comparación', () => {
        const ticket = compareKpis(summaryA, summaryB)[3];
        expect(ticket.delta).toBeNull();
    });
});

describe('comparePeriodNames', () => {
    const named = (name, from) => ({ name, from });

    it('si los años son distintos, B y las cabeceras van solo con el año', () => {
        expect(comparePeriodNames(named('Rebajas de verano 2026', '2026-07-01'), named('Rebajas de verano 2025', '2025-07-01'))).toEqual({
            legendA: 'Rebajas de verano 2026',
            legendB: '2025',
            shortA: '2026',
            shortB: '2025'
        });
    });

    it('si los dos son del mismo año, usa los nombres completos', () => {
        expect(comparePeriodNames(named('Black Friday 2026', '2026-11-27'), named('Presentación 2026', '2026-09-15'))).toEqual({
            legendA: 'Black Friday 2026',
            legendB: 'Presentación 2026',
            shortA: 'Black Friday 2026',
            shortB: 'Presentación 2026'
        });
    });
});

describe('defaultPair', () => {
    const today = new Date(2026, 9, 4);
    const campaign = (id, type, start, end) => ({ id, period_type_id: type, start_date: start, end_date: end, name: `c${id}` });
    const list = [
        campaign(36, 6, '2026-09-15', '2026-10-12'),
        campaign(32, 5, '2026-07-01', '2026-08-31'),
        campaign(21, 5, '2025-07-01', '2025-08-31'),
        campaign(50, 8, '2026-12-05', '2027-01-06')
    ];

    it('A es la última que ya terminó y B su edición anterior', () => {
        const { a, b } = defaultPair(list, today);
        expect(a.id).toBe(32);
        expect(b.id).toBe(21);
    });

    it('si no ha terminado ninguna, coge la que está en curso', () => {
        const { a } = defaultPair([list[0], list[3]], today);
        expect(a.id).toBe(36);
    });

    it('si solo hay futuras o ninguna, no hay pareja', () => {
        expect(defaultPair([list[3]], today)).toEqual({ a: null, b: null });
        expect(defaultPair([], today)).toEqual({ a: null, b: null });
    });

    it('sin edición anterior, B queda vacío', () => {
        expect(defaultPair([list[2]], today).b).toBeNull();
    });
});

describe('compareState', () => {
    it('sin los dos periodos válidos pide elegirlos', () => {
        expect(compareState({ ready: false, data: null, error: null })).toEqual({ kind: 'pick' });
    });

    it('mientras llega la lista de campañas, carga en vez de pedir elegir', () => {
        expect(compareState({ ready: false, data: null, error: null, listLoading: true })).toEqual({ kind: 'loading' });
    });

    it('si falla la lista de campañas, es un error', () => {
        expect(compareState({ ready: false, data: null, error: null, listError: new Error('x') })).toEqual({ kind: 'error' });
    });

    it('con los periodos y sin respuesta, carga', () => {
        expect(compareState({ ready: true, data: null, error: null })).toEqual({ kind: 'loading' });
    });

    it('un error gana a los datos antiguos', () => {
        expect(compareState({ ready: true, data: {}, error: new Error('x') })).toEqual({ kind: 'error' });
    });

    it('con respuesta, está listo', () => {
        expect(compareState({ ready: true, data: {}, error: null })).toEqual({ kind: 'ready' });
    });
});
