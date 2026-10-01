import { describe, expect, it } from 'vitest';
import { formatCompactRange, formatDayTick, formatLongRange, formatShortDay, formatMonthTitle, formatMonthYear, formatMonthOfYear, formatShortRange, apiDate, yearChartRange, lastFinishedMonth, lastSevenDays, periodRange, periodSubtitle, shiftYear } from './dates.js';

describe('lastSevenDays', () => {
    it('devuelve los siete días que terminan hoy', () => {
        const { from, to } = lastSevenDays(new Date(2026, 9, 1));
        expect(from).toEqual(new Date(2026, 8, 25));
        expect(to).toEqual(new Date(2026, 9, 1));
    });

    it('cruza el cambio de mes y de año', () => {
        const { from, to } = lastSevenDays(new Date(2027, 0, 3));
        expect(from).toEqual(new Date(2026, 11, 28));
        expect(to).toEqual(new Date(2027, 0, 3));
    });

    it('ignora la hora del día que recibe', () => {
        const { from, to } = lastSevenDays(new Date(2026, 9, 1, 18, 47, 39));
        expect(from).toEqual(new Date(2026, 8, 25));
        expect(to).toEqual(new Date(2026, 9, 1));
    });
});

describe('shiftYear', () => {
    it('resta 364 días para caer en el mismo día de la semana', () => {
        const compared = shiftYear(new Date(2026, 9, 1));
        expect(compared).toEqual(new Date(2025, 9, 2));
        expect(compared.getDay()).toBe(new Date(2026, 9, 1).getDay());
    });

    it('mantiene el día de la semana también en año bisiesto', () => {
        const compared = shiftYear(new Date(2024, 2, 15));
        expect(compared).toEqual(new Date(2023, 2, 17));
        expect(compared.getDay()).toBe(new Date(2024, 2, 15).getDay());
    });
});

describe('formatLongRange', () => {
    it('escribe el rango con los meses completos', () => {
        expect(formatLongRange(new Date(2026, 8, 25), new Date(2026, 9, 1))).toBe('Del 25 de septiembre al 1 de octubre');
    });

    it('omite el mes del primer día cuando los dos caen en el mismo mes', () => {
        expect(formatLongRange(new Date(2026, 9, 5), new Date(2026, 9, 11))).toBe('Del 5 al 11 de octubre');
    });
});

describe('formatShortRange', () => {
    it('abrevia los meses y cierra con el año', () => {
        expect(formatShortRange(new Date(2025, 8, 26), new Date(2025, 9, 2))).toBe('26 sep – 2 oct. 2025');
    });

    it('escribe el año de cada extremo cuando el rango cambia de año', () => {
        expect(formatShortRange(new Date(2025, 11, 29), new Date(2026, 0, 4))).toBe('29 dic. 2025 – 4 ene. 2026');
    });
});

describe('formatDayTick', () => {
    it('abrevia el día de la semana y el número', () => {
        expect(formatDayTick(new Date(2026, 9, 1))).toBe('jue 1');
        expect(formatDayTick(new Date(2026, 8, 26))).toBe('sáb 26');
    });
});

describe('lastFinishedMonth', () => {
    it('devuelve el mes anterior completo', () => {
        const month = lastFinishedMonth(new Date(2026, 9, 1));
        expect(month.start).toEqual(new Date(2026, 8, 1));
        expect(month.end).toEqual(new Date(2026, 8, 30));
    });

    it('en enero se va a diciembre del año anterior', () => {
        const month = lastFinishedMonth(new Date(2027, 0, 15));
        expect(month.start).toEqual(new Date(2026, 11, 1));
        expect(month.end).toEqual(new Date(2026, 11, 31));
    });

    it('acierta con febrero de un año bisiesto', () => {
        expect(lastFinishedMonth(new Date(2028, 2, 10)).end).toEqual(new Date(2028, 1, 29));
    });
});

describe('formatMonthTitle', () => {
    it('devuelve el mes en mayúscula inicial', () => {
        expect(formatMonthTitle(new Date(2026, 8, 1))).toBe('Septiembre');
        expect(formatMonthTitle(new Date(2026, 11, 1))).toBe('Diciembre');
    });
});

describe('formatMonthYear', () => {
    it('devuelve el mes en minúscula con el año', () => {
        expect(formatMonthYear(new Date(2025, 8, 1))).toBe('septiembre 2025');
    });
});

describe('formatShortDay', () => {
    it('abrevia el mes sin el año', () => {
        expect(formatShortDay(new Date(2026, 8, 15))).toBe('15 sep');
        expect(formatShortDay(new Date(2026, 0, 1))).toBe('1 ene');
    });
});

describe('periodRange', () => {
    const today = new Date(2026, 9, 1);

    it('hoy empieza y acaba el mismo día', () => {
        expect(periodRange('hoy', today)).toEqual({ from: new Date(2026, 9, 1), to: new Date(2026, 9, 1) });
    });

    it('7d coge los últimos siete días contando hoy', () => {
        expect(periodRange('7d', today)).toEqual({ from: new Date(2026, 8, 25), to: new Date(2026, 9, 1) });
    });

    it('mes va del día 1 a hoy', () => {
        expect(periodRange('mes', today)).toEqual({ from: new Date(2026, 9, 1), to: new Date(2026, 9, 1) });
        expect(periodRange('mes', new Date(2026, 8, 17))).toEqual({ from: new Date(2026, 8, 1), to: new Date(2026, 8, 17) });
    });

    it('año va del 1 de enero a hoy', () => {
        expect(periodRange('ano', today)).toEqual({ from: new Date(2026, 0, 1), to: new Date(2026, 9, 1) });
    });
});

describe('periodSubtitle', () => {
    const today = new Date(2026, 9, 1);

    it('describe cada periodo como el diseño', () => {
        expect(periodSubtitle('hoy', periodRange('hoy', today))).toBe('Hoy, jueves 1 de octubre');
        expect(periodSubtitle('7d', periodRange('7d', today))).toBe('Del 25 de septiembre al 1 de octubre');
        expect(periodSubtitle('mes', periodRange('mes', today))).toBe('Octubre, hasta el día 1');
        expect(periodSubtitle('ano', periodRange('ano', today))).toBe('En 2026, hasta hoy');
    });

    it('con el mes empezado, dice hasta qué día llega', () => {
        expect(periodSubtitle('mes', periodRange('mes', new Date(2026, 8, 17)))).toBe('Septiembre, hasta el día 17');
    });
});

describe('formatCompactRange', () => {
    it('abrevia los dos extremos sin año, como en las campañas', () => {
        expect(formatCompactRange(new Date(2026, 8, 15), new Date(2026, 9, 12))).toBe('15 sep – 12 oct');
    });
});
describe('apiDate', () => {
    it('escribe la fecha como YYYY-MM-DD', () => {
        expect(apiDate(new Date(2026, 9, 2))).toBe('2026-10-02');
    });

    it('usa el día local, no el UTC, aunque sea de madrugada', () => {
        expect(apiDate(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01');
    });

    it('rellena con ceros el mes y el día', () => {
        expect(apiDate(new Date(2026, 0, 5))).toBe('2026-01-05');
    });
});

describe('yearChartRange', () => {
    it('va del 1 de enero a hoy cuando el mes cerrado es de este año', () => {
        const range = yearChartRange(lastFinishedMonth(new Date(2026, 9, 2)), new Date(2026, 9, 2));
        expect(range.from).toEqual(new Date(2026, 0, 1));
        expect(range.to).toEqual(new Date(2026, 9, 2));
    });

    it('en enero se queda en el 31 de diciembre, sin saltar al año nuevo', () => {
        const range = yearChartRange(lastFinishedMonth(new Date(2027, 0, 5)), new Date(2027, 0, 5));
        expect(range.from).toEqual(new Date(2026, 0, 1));
        expect(range.to).toEqual(new Date(2026, 11, 31));
    });
});

describe('formatMonthOfYear', () => {
    it('escribe el mes en minúscula con su año', () => {
        expect(formatMonthOfYear(new Date(2025, 8, 1))).toBe('septiembre de 2025');
    });

    it('sirve para un mes con tilde', () => {
        expect(formatMonthOfYear(new Date(2025, 11, 1))).toBe('diciembre de 2025');
    });
});
