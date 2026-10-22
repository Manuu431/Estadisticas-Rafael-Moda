import { describe, expect, it } from 'vitest';
import { DEFAULT_SALES_PERIOD, SALES_PERIODS, salesPeriodLabel, salesPeriodRange, customPeriodError, periodApplyError, setDateField, isDateFieldInvalid } from './salesPeriod.js';

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

describe('setDateField', () => {
    const custom = { key: 'custom', from: '', to: '' };

    it('guarda la fecha elegida', () => {
        expect(setDateField(custom, 'from', '2026-06-01', false)).toEqual({ key: 'custom', from: '2026-06-01', to: '', bad: [] });
    });

    it('si el navegador dice que lo escrito no es una fecha (31/06), deja el campo vacío y lo marca como no válido', () => {
        const result = setDateField({ ...custom, to: '2026-08-31' }, 'to', '', true);
        expect(result).toEqual({ key: 'custom', from: '', to: '', bad: ['to'] });
    });

    it('al corregir la fecha deja de estar marcada como no válida', () => {
        const bad = setDateField(custom, 'to', '', true);
        expect(setDateField(bad, 'to', '2026-06-30', false).bad).toEqual([]);
    });

    it('marcar un campo no toca la marca del otro', () => {
        const both = setDateField(setDateField(custom, 'from', '', true), 'to', '', true);
        expect(both.bad).toEqual(['from', 'to']);
        expect(setDateField(both, 'from', '2026-06-01', false).bad).toEqual(['to']);
    });

    it('vaciar a propósito un campo no es un error: queda incompleto', () => {
        expect(setDateField({ ...custom, to: '2026-08-31' }, 'to', '', false)).toEqual({ key: 'custom', from: '', to: '', bad: [] });
    });

    it('un año a medio escribir (0002, 0202) no cuenta como fecha todavía', () => {
        expect(setDateField(custom, 'from', '0002-06-01', false).from).toBe('');
        expect(setDateField(custom, 'from', '0202-06-01', false).from).toBe('');
        expect(setDateField(custom, 'from', '2026-06-01', false).from).toBe('2026-06-01');
    });
});

describe('customPeriodError con fechas no válidas', () => {
    it('avisa de la fecha «Hasta» que no existe', () => {
        expect(customPeriodError({ key: 'custom', from: '2026-06-01', to: '', bad: ['to'] })).toBe('La fecha «Hasta» no es válida.');
    });

    it('avisa de la fecha «Desde» que no existe', () => {
        expect(customPeriodError({ key: 'custom', from: '', to: '2026-06-30', bad: ['from'] })).toBe('La fecha «Desde» no es válida.');
    });

    it('avisa de las dos', () => {
        expect(customPeriodError({ key: 'custom', from: '', to: '', bad: ['from', 'to'] })).toBe('Las fechas no son válidas.');
    });

    it('sin fechas no válidas sigue como antes', () => {
        expect(customPeriodError({ key: 'custom', from: '2026-06-01', to: '', bad: [] })).toBeNull();
    });
});

describe('periodApplyError', () => {
    it('los periodos que no son Personalizado siempre se pueden aplicar', () => {
        expect(periodApplyError({ key: 'mes', from: '', to: '' })).toBeNull();
        expect(periodApplyError({ key: 'ano', from: '', to: '', bad: ['to'] })).toBeNull();
    });

    it('Personalizado con las dos fechas bien se puede aplicar', () => {
        expect(periodApplyError({ key: 'custom', from: '2026-06-01', to: '2026-06-30', bad: [] })).toBeNull();
        expect(periodApplyError({ key: 'custom', from: '2026-06-01', to: '2026-06-01' })).toBeNull();
    });

    it('con una fecha sin poner pide las dos', () => {
        expect(periodApplyError({ key: 'custom', from: '2026-06-01', to: '' })).toBe('Elige las dos fechas del periodo.');
        expect(periodApplyError({ key: 'custom', from: '', to: '' })).toBe('Elige las dos fechas del periodo.');
    });

    it('con una fecha que no existe lo dice, en vez de pedir que la elijas', () => {
        expect(periodApplyError({ key: 'custom', from: '2026-06-01', to: '', bad: ['to'] })).toBe('La fecha «Hasta» no es válida.');
    });

    it('con «Desde» posterior a «Hasta» lo dice', () => {
        expect(periodApplyError({ key: 'custom', from: '2026-06-30', to: '2026-06-01' })).toBe('«Desde» no puede ser posterior a «Hasta».');
    });
});

describe('isDateFieldInvalid', () => {
    it('marca solo el campo cuya fecha no existe', () => {
        const period = { key: 'custom', from: '2026-06-01', to: '', bad: ['to'] };
        expect(isDateFieldInvalid(period, 'to')).toBe(true);
        expect(isDateFieldInvalid(period, 'from')).toBe(false);
    });

    it('con «Desde» posterior a «Hasta» marca los dos', () => {
        const period = { key: 'custom', from: '2026-06-30', to: '2026-06-01' };
        expect(isDateFieldInvalid(period, 'from')).toBe(true);
        expect(isDateFieldInvalid(period, 'to')).toBe(true);
    });

    it('sin problema no marca ninguno', () => {
        const period = { key: 'custom', from: '2026-06-01', to: '2026-06-30', bad: [] };
        expect(isDateFieldInvalid(period, 'from')).toBe(false);
        expect(isDateFieldInvalid(period, 'to')).toBe(false);
    });
});