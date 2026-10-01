import { describe, expect, it } from 'vitest';
import { accumulate, fillDays, monthComparison } from './statisticsData.js';

const from = new Date(2026, 8, 25);
const to = new Date(2026, 9, 1);

describe('fillDays', () => {
    const rows = [
        { date: '2026-09-25', total: 150 },
        { date: '2026-09-28', total: 200 },
        { date: '2026-10-01', total: 100 }
    ];

    it('devuelve un punto por día del rango, en orden', () => {
        const days = fillDays(rows, from, to);
        expect(days).toHaveLength(7);
        expect(days[0].date).toEqual(new Date(2026, 8, 25));
        expect(days[6].date).toEqual(new Date(2026, 9, 1));
    });

    it('pone a cero los días sin ventas', () => {
        expect(fillDays(rows, from, to).map((day) => day.total)).toEqual([150, 0, 0, 200, 0, 0, 100]);
    });

    it('deja fuera lo que el servidor devuelva fuera del rango', () => {
        const days = fillDays([...rows, { date: '2026-10-02', total: 888 }], from, to);
        expect(days).toHaveLength(7);
        expect(days.some((day) => day.total === 888)).toBe(false);
    });

    it('sin ventas devuelve el rango entero a cero', () => {
        expect(fillDays([], from, to).map((day) => day.total)).toEqual([0, 0, 0, 0, 0, 0, 0]);
    });
});

describe('accumulate', () => {
    const actual = [
        { date: '2026-01-05', total: 100 },
        { date: '2026-02-10', total: 50 }
    ];
    const anterior = [
        { date: '2025-01-03', total: 20 },
        { date: '2025-02-20', total: 80 }
    ];
    const points = accumulate(actual, anterior, new Date(2026, 0, 1), new Date(2026, 1, 28));

    it('devuelve un punto por día del rango', () => {
        expect(points).toHaveLength(59);
        expect(points[0].date).toEqual(new Date(2026, 0, 1));
        expect(points[58].date).toEqual(new Date(2026, 1, 28));
    });

    it('arranca en cero y acumula cada serie por su fecha', () => {
        expect(points[0]).toMatchObject({ current: 0, previous: 0 });
        expect(points[4]).toMatchObject({ current: 100, previous: 20 });
    });

    it('acumula hasta el final del rango', () => {
        expect(points[58].current).toBe(150);
        expect(points[58].previous).toBe(100);
    });

    it('mantiene plana la serie anterior el 29 de febrero', () => {
        const dias = accumulate(
            [{ date: '2028-02-28', total: 70 }],
            [{ date: '2027-02-28', total: 10 }],
            new Date(2028, 1, 28),
            new Date(2028, 1, 29)
        );
        expect(dias.map((day) => day.previous)).toEqual([10, 10]);
        expect(dias.map((day) => day.current)).toEqual([70, 70]);
    });
});

describe('monthComparison', () => {
    it('marca el mes como superado y da la diferencia', () => {
        const result = monthComparison(20783.09, 20063.8);
        expect(result.beaten).toBe(true);
        expect(result.difference).toBe(719.29);
        expect(result.progress).toBe(100);
    });

    it('con el ejemplo del diseño, calcula lo que falta y el porcentaje', () => {
        const result = monthComparison(19284.6, 19653.4);
        expect(result.beaten).toBe(false);
        expect(result.difference).toBe(368.8);
        expect(result.progress).toBeCloseTo(98.1, 1);
        expect(result.delta).toBeCloseTo(-1.88, 2);
    });

    it('sin mes anterior con el que comparar, no hay porcentaje de variación', () => {
        const result = monthComparison(100, 0);
        expect(result.delta).toBe(null);
        expect(result.beaten).toBe(true);
        expect(result.progress).toBe(100);
    });

    it('con los dos meses a cero deja la barra vacía', () => {
        expect(monthComparison(0, 0).progress).toBe(0);
    });
});
