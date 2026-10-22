import { describe, expect, it } from 'vitest';
import { dayTitle, groupByDay, remainingCount, saleMeta, sortLatestFirst } from './salesDays.js';

const sale = (id, soldAt, amount = '10.00', extra = {}) => ({ id, sold_at: soldAt, sale_date: soldAt.slice(0, 10), amount, ...extra });

describe('dayTitle', () => {
    it('hoy lleva «Hoy,» delante y el día de la semana en minúscula', () => {
        expect(dayTitle('2026-10-01', new Date(2026, 9, 1))).toBe('Hoy, jueves 1');
    });

    it('otro día del mes en curso va con mayúscula y sin mes', () => {
        expect(dayTitle('2026-09-26', new Date(2026, 8, 28))).toBe('Sábado 26');
    });

    it('un día de otro mes del año en curso lleva el mes', () => {
        expect(dayTitle('2025-07-26', new Date(2025, 9, 15))).toBe('Sábado 26 de julio');
    });

    it('un día de otro año lleva mes y año', () => {
        expect(dayTitle('2025-07-26', new Date(2026, 9, 1))).toBe('Sábado 26 de julio de 2025');
    });

    it('el mismo mes de otro año lleva año', () => {
        expect(dayTitle('2025-10-04', new Date(2026, 9, 15))).toBe('Sábado 4 de octubre de 2025');
    });

    it('ignora la hora de la fecha completa', () => {
        expect(dayTitle('2026-10-01 18:47:39', new Date(2026, 9, 1, 9, 0))).toBe('Hoy, jueves 1');
    });
});

describe('sortLatestFirst', () => {
    it('pone la venta más reciente primero sin tocar el array original', () => {
        const rows = [sale(1, '2026-10-01 10:00:00'), sale(3, '2026-10-02 09:00:00'), sale(2, '2026-10-01 18:47:39')];
        expect(sortLatestFirst(rows).map((row) => row.id)).toEqual([3, 2, 1]);
        expect(rows.map((row) => row.id)).toEqual([1, 3, 2]);
    });

    it('con la misma hora, la línea de id mayor primero', () => {
        const rows = [sale(1, '2026-10-01 18:47:39'), sale(2, '2026-10-01 18:47:39')];
        expect(sortLatestFirst(rows).map((row) => row.id)).toEqual([2, 1]);
    });
});

describe('groupByDay', () => {
    const rows = sortLatestFirst([
        sale(1, '2026-10-01 18:47:39', '70.74'),
        sale(2, '2026-10-01 17:00:00', '62.91'),
        sale(3, '2026-10-01 10:00:00', '83.53'),
        sale(4, '2026-09-30 20:15:00', '41.10'),
        sale(5, '2026-09-30 11:00:00', '55.22')
    ]);

    it('agrupa por día, en orden, y cuenta solo las líneas visibles', () => {
        const groups = groupByDay(rows, 4);
        expect(groups.map((group) => [group.date, group.items.map((item) => item.id)])).toEqual([
            ['2026-10-01', [1, 2, 3]],
            ['2026-09-30', [4]]
        ]);
    });

    it('la suma de cada día es la del día completo, aunque no se vea entero', () => {
        const groups = groupByDay(rows, 4);
        expect(groups[0].sumCents).toBe(21718);
        expect(groups[1].sumCents).toBe(9632);
    });

    it('al enseñar más, la suma del día no cambia', () => {
        const before = groupByDay(rows, 4).find((group) => group.date === '2026-09-30').sumCents;
        const after = groupByDay(rows, 5).find((group) => group.date === '2026-09-30').sumCents;
        expect(after).toBe(before);
    });

    it('con los totales del servidor usa esos y no los de las líneas que tiene', () => {
        const groups = groupByDay(rows.slice(0, 2), 2, { '2026-10-01': 217.18 });
        expect(groups[0].sumCents).toBe(21718);
    });

    it('no saca días de los que no se ve ninguna línea', () => {
        expect(groupByDay(rows, 3).map((group) => group.date)).toEqual(['2026-10-01']);
    });

    it('sin ventas no hay grupos', () => {
        expect(groupByDay([], 12)).toEqual([]);
    });
});

describe('remainingCount', () => {
    it('cuenta las líneas que faltan por enseñar', () => {
        expect(remainingCount(185, 12)).toBe(173);
        expect(remainingCount(185, 24)).toBe(161);
    });

    it('nunca baja de cero', () => {
        expect(remainingCount(5, 12)).toBe(0);
        expect(remainingCount(12, 12)).toBe(0);
        expect(remainingCount(0, 12)).toBe(0);
    });
});

describe('saleMeta', () => {
    it('une marca, sección y talla', () => {
        expect(saleMeta({ brand: 'Escorpión', section: 'hombre', size: 'L', units: 1 })).toBe('Escorpión · Hombre · T. L');
    });

    it('añade las unidades solo si son más de una', () => {
        expect(saleMeta({ brand: 'Lois', section: 'hombre', size: '44', units: 2 })).toBe('Lois · Hombre · T. 44 · 2 uds.');
    });

    it('se salta la talla si no hay', () => {
        expect(saleMeta({ brand: 'Lois', section: 'mujer', size: '', units: 1 })).toBe('Lois · Mujer');
    });
});