import { describe, expect, it } from 'vitest';
import { DEFAULT_SALES_PERIOD, SALES_PERIODS, salesPeriodLabel, salesPeriodRange, customPeriodError } from './salesPeriod.js';

const today = new Date(2026, 9, 15, 18, 47);
const firstOfMonth = new Date(2026, 9, 1, 9, 30);

describe('SALES_PERIODS', () => {
    it('lista las opciones de menor a mayor periodo, con «Personalizado…» la última', () => {
        expect(SALES_PERIODS.map((period) => period.label)).toEqual(['Hoy', 'Últimos 7 días', 'Este mes', 'Este año', 'Personalizado…']);
    });

    it('el periodo por defecto es «Este mes» y está en la lista', () => {
        expect(DEFAULT_SALES_PERIOD.key).toBe('mes');
        expect(SALES_PERIODS.map((period) => period.value)).toContain(DEFAULT_SALES_PERIOD.key);
    });
});

describe('salesPeriodRange', () => {
    it('Este mes va del día 1 a hoy', () => {
        expect(salesPeriodRange({ key: 'mes' }, today)).toEqual({ from: new Date(2026, 9, 1), to: new Date(2026, 9, 15) });
    });

    it('Hoy es solo hoy', () => {
        expect(salesPeriodRange({ key: 'hoy' }, today)).toEqual({ from: new Date(2026, 9, 15), to: new Date(2026, 9, 15) });
    });

    it('Últimos 7 días son hoy y los seis anteriores', () => {
        expect(salesPeriodRange({ key: '7d' }, firstOfMonth)).toEqual({ from: new Date(2026, 8, 25), to: new Date(2026, 9, 1) });
    });

    it('Este año va del 1 de enero a hoy', () => {
        expect(salesPeriodRange({ key: 'ano' }, today)).toEqual({ from: new Date(2026, 0, 1), to: new Date(2026, 9, 15) });
    });

    it('Personalizado usa las dos fechas', () => {
        expect(salesPeriodRange({ key: 'custom', from: '2025-03-03', to: '2025-04-10' }, today)).toEqual({ from: new Date(2025, 2, 3), to: new Date(2025, 3, 10) });
    });

    it('Personalizado admite un solo día', () => {
        expect(salesPeriodRange({ key: 'custom', from: '2025-03-03', to: '2025-03-03' }, today)).toEqual({ from: new Date(2025, 2, 3), to: new Date(2025, 2, 3) });
    });

    it('Personalizado no se aplica con una fecha vacía', () => {
        expect(salesPeriodRange({ key: 'custom', from: '2025-03-03', to: '' }, today)).toBeNull();
        expect(salesPeriodRange({ key: 'custom', from: '', to: '2025-04-10' }, today)).toBeNull();
        expect(salesPeriodRange({ key: 'custom', from: '', to: '' }, today)).toBeNull();
    });

    it('Personalizado no se aplica si «Desde» es posterior a «Hasta»', () => {
        expect(salesPeriodRange({ key: 'custom', from: '2025-04-10', to: '2025-03-03' }, today)).toBeNull();
    });
});

describe('customPeriodError', () => {
    it('avisa solo cuando «Desde» es posterior a «Hasta»', () => {
        expect(customPeriodError({ key: 'custom', from: '2025-04-10', to: '2025-03-03' })).toBe('«Desde» no puede ser posterior a «Hasta».');
    });

    it('no avisa con fechas ordenadas, iguales o incompletas', () => {
        expect(customPeriodError({ key: 'custom', from: '2025-03-03', to: '2025-04-10' })).toBeNull();
        expect(customPeriodError({ key: 'custom', from: '2025-03-03', to: '2025-03-03' })).toBeNull();
        expect(customPeriodError({ key: 'custom', from: '2025-03-03', to: '' })).toBeNull();
    });

    it('no avisa en los periodos que no son Personalizado', () => {
        expect(customPeriodError({ key: 'mes', from: '2025-04-10', to: '2025-03-03' })).toBeNull();
    });
});

describe('salesPeriodLabel', () => {
    const label = (key, from, to) => salesPeriodLabel(key, { from, to });

    it('Este mes lleva el mes, el año y los días', () => {
        expect(label('mes', new Date(2026, 9, 1), new Date(2026, 9, 15))).toBe('Octubre de 2026 · del 1 al 15');
    });

    it('Este mes el día 1 dice «día 1»', () => {
        expect(label('mes', new Date(2026, 9, 1), new Date(2026, 9, 1))).toBe('Octubre de 2026 · día 1');
    });

    it('Hoy escribe el día de la semana con mayúscula', () => {
        expect(label('hoy', new Date(2026, 9, 1), new Date(2026, 9, 1))).toBe('Jueves 1 de octubre de 2026');
    });

    it('Últimos 7 días cruza el cambio de mes', () => {
        expect(label('7d', new Date(2026, 8, 25), new Date(2026, 9, 1))).toBe('Del 25 de septiembre al 1 de octubre');
    });

    it('Este año va del 1 de enero a hoy', () => {
        expect(label('ano', new Date(2026, 0, 1), new Date(2026, 9, 1))).toBe('2026 · del 1 de enero al 1 de octubre');
    });

    it('Este año el 1 de enero dice solo el día', () => {
        expect(label('ano', new Date(2026, 0, 1), new Date(2026, 0, 1))).toBe('2026 · 1 de enero');
    });

    it('Personalizado dentro de un año pone el año al final', () => {
        expect(label('custom', new Date(2025, 2, 3), new Date(2025, 3, 10))).toBe('Del 3 de marzo al 10 de abril de 2025');
    });

    it('Personalizado dentro de un mes no repite el mes', () => {
        expect(label('custom', new Date(2025, 2, 3), new Date(2025, 2, 10))).toBe('Del 3 al 10 de marzo de 2025');
    });

    it('Personalizado entre años pone los dos años', () => {
        expect(label('custom', new Date(2025, 11, 28), new Date(2026, 0, 3))).toBe('Del 28 de diciembre de 2025 al 3 de enero de 2026');
    });

    it('Personalizado de un solo día', () => {
        expect(label('custom', new Date(2025, 2, 3), new Date(2025, 2, 3))).toBe('3 de marzo de 2025');
    });
});