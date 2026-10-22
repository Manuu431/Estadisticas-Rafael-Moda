import { describe, expect, it } from 'vitest';
import { salesState, EMPTY_MESSAGE, TODAY_MESSAGE } from './salesState.js';

const mes = { key: 'mes', from: '', to: '' };
const hoy = { key: 'hoy', from: '', to: '' };
const sale = { id: 1 };

describe('salesState', () => {
    it('sin respuesta todavía y sin error, está cargando', () => {
        expect(salesState({ data: null, error: null, period: mes, filters: {} })).toEqual({ kind: 'loading' });
    });

    it('sin respuesta y con error, es un error de carga y no una carga eterna', () => {
        expect(salesState({ data: null, error: new Error('x'), period: mes, filters: {} })).toEqual({ kind: 'error' });
    });

    it('con ventas, está listo', () => {
        expect(salesState({ data: [sale], error: null, period: mes, filters: {} })).toEqual({ kind: 'ready' });
    });

    it('si falla una recarga con filtros nuevos no enseña las ventas antiguas como si fueran el resultado', () => {
        expect(salesState({ data: [sale], error: new Error('x'), period: mes, filters: { brand: 'Lois' } })).toEqual({ kind: 'error' });
        expect(salesState({ data: [], error: new Error('x'), period: mes, filters: {} })).toEqual({ kind: 'error' });
    });

    it('sin ventas, dice que no hay ventas con estos filtros', () => {
        expect(salesState({ data: [], error: null, period: mes, filters: {} })).toEqual({ kind: 'empty', message: EMPTY_MESSAGE });
        expect(EMPTY_MESSAGE).toBe('No hay ventas con estos filtros.');
    });

    it('hoy, sin otros filtros y sin ventas, dice que todavía no hay ventas hoy', () => {
        expect(salesState({ data: [], error: null, period: hoy, filters: {} })).toEqual({ kind: 'empty', message: TODAY_MESSAGE });
        expect(TODAY_MESSAGE).toBe('Todavía no hay ventas hoy.');
    });

    it('hoy con algún otro filtro puesto, vuelve al mensaje normal', () => {
        for (const filters of [{ search: 'lois' }, { brand: 'Lois' }, { section: 'mujer' }, { family: 'Abrigos' }, { profit_min: '0' }]) {
            expect(salesState({ data: [], error: null, period: hoy, filters })).toEqual({ kind: 'empty', message: EMPTY_MESSAGE });
        }
    });

    it('otro periodo sin ventas usa el mensaje normal', () => {
        expect(salesState({ data: [], error: null, period: { key: '7d', from: '', to: '' }, filters: {} }).message).toBe(EMPTY_MESSAGE);
    });
});

describe('salesState mientras llegan otros filtros', () => {
    it('con los datos del filtro anterior todavía en pantalla, está cargando', () => {
        expect(salesState({ data: [{ id: 1 }], settled: false, error: null, period: mes, filters: {} }).kind).toBe('loading');
    });
});