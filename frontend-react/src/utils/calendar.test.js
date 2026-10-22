import { describe, expect, it } from 'vitest';
import { dayEvents, daysLabel, limitLanes, monthEvents, monthWeeks, outsideRange, upcomingDates, weekLayout } from './calendar.js';

const campaign = (name, start_date, end_date) => ({ name, start_date, end_date });
const season = (name, start_date, end_date) => ({ name, start_date, end_date });

const campaigns = [
    campaign('Rebajas de verano', '2026-07-01', '2026-08-31'),
    campaign('Presentación Otoño-Invierno', '2026-09-15', '2026-10-12'),
    campaign('Black Friday', '2026-11-27', '2026-11-30'),
    campaign('Navidad y Reyes', '2026-12-05', '2026-12-31'),
    campaign('Rebajas de invierno', '2027-01-07', '2027-02-28'),
];
const seasons = [
    season('Primavera-Verano', '2026-03-01', '2026-08-31'),
    season('Otoño-Invierno', '2026-09-01', '2027-02-28'),
];

describe('monthWeeks', () => {
    it('devuelve las semanas completas del mes empezando en lunes', () => {
        const weeks = monthWeeks(new Date(2026, 8, 1));
        expect(weeks).toHaveLength(5);
        expect(weeks[0][0]).toEqual(new Date(2026, 7, 31));
        expect(weeks[0][6]).toEqual(new Date(2026, 8, 6));
        expect(weeks[4][6]).toEqual(new Date(2026, 9, 4));
        weeks.forEach((week) => expect(week).toHaveLength(7));
    });

    it('sale con 6 semanas cuando el mes lo necesita', () => {
        expect(monthWeeks(new Date(2026, 7, 1))).toHaveLength(6);
    });

    it('sale con 4 semanas si febrero empieza en lunes y no es bisiesto', () => {
        expect(monthWeeks(new Date(2027, 1, 1))).toHaveLength(4);
    });

    it('acepta cualquier día del mes', () => {
        expect(monthWeeks(new Date(2026, 8, 17))[0][0]).toEqual(new Date(2026, 7, 31));
    });
});

describe('weekLayout', () => {
    const weeks = monthWeeks(new Date(2026, 8, 1));

    it('coloca un cambio de temporada en su columna', () => {
        const { events } = weekLayout(weeks[0], campaigns, seasons);
        const start = events.find((event) => event.label === 'Empieza Otoño-Invierno');
        expect(start).toMatchObject({ type: 'season', startCol: 1, endCol: 1, isStart: true });
    });

    it('pone «Termina» en el último día de la temporada y fuera del mes también', () => {
        const { events } = weekLayout(weeks[0], campaigns, seasons);
        const end = events.find((event) => event.label === 'Termina Primavera-Verano');
        expect(end).toMatchObject({ startCol: 0, endCol: 0, isStart: false });
    });

    it('recorta la campaña al tramo de la semana y marca si empieza o termina de verdad', () => {
        const [, second, third] = weeks.map((week) => weekLayout(week, campaigns, seasons).events.filter((e) => e.type === 'campaign'));
        expect(second).toEqual([]);
        expect(third[0]).toMatchObject({ label: 'Presentación Otoño-Invierno', startCol: 1, endCol: 6, startsHere: true, endsHere: false });
        const fourth = weekLayout(weeks[3], campaigns, seasons).events.find((e) => e.type === 'campaign');
        expect(fourth).toMatchObject({ startCol: 0, endCol: 6, startsHere: false, endsHere: false });
    });

    it('la campaña ocupa toda la última semana del mes si termina en octubre', () => {
        const last = weekLayout(weeks[4], campaigns, seasons).events.find((e) => e.type === 'campaign');
        expect(last).toMatchObject({ startCol: 0, endCol: 6, startsHere: false, endsHere: false });
    });

    it('marca endsHere cuando la campaña termina dentro de la semana', () => {
        const [first] = weekLayout(weeks[0], campaigns, seasons).events.filter((e) => e.type === 'campaign');
        expect(first).toMatchObject({ label: 'Rebajas de verano', startCol: 0, endCol: 0, startsHere: false, endsHere: true });
    });

    it('ignora lo que no toca la semana', () => {
        const { events } = weekLayout(weeks[1], campaigns, seasons);
        expect(events).toEqual([]);
    });

    it('conserva el elemento original para abrirlo', () => {
        const { events } = weekLayout(weeks[2], campaigns, seasons);
        expect(events[0].original).toBe(campaigns[1]);
    });

    it('mantiene el carril de una campaña y pone las campañas antes que las temporadas', () => {
        const overlapping = [campaign('A', '2026-09-01', '2026-09-06'), campaign('B', '2026-09-01', '2026-09-03')];
        const { events } = weekLayout(weeks[0], overlapping, seasons);
        const byLabel = Object.fromEntries(events.map((event) => [event.label, event.lane]));
        expect(byLabel.A).toBe(0);
        expect(byLabel.B).toBe(1);
        expect(byLabel['Empieza Otoño-Invierno']).toBe(2);
    });

    it('reutiliza un carril libre cuando no hay solape', () => {
        const apart = [campaign('A', '2026-09-01', '2026-09-02'), campaign('B', '2026-09-04', '2026-09-05')];
        const { events } = weekLayout(weeks[0], apart, []);
        expect(events.map((event) => event.lane)).toEqual([0, 0]);
    });

    it('un cambio de temporada cabe en el carril de arriba si ese día está libre', () => {
        const early = [campaign('A', '2026-09-03', '2026-09-06')];
        const { events } = weekLayout(weeks[0], early, seasons);
        const start = events.find((event) => event.label === 'Empieza Otoño-Invierno');
        expect(start.lane).toBe(0);
    });

    it('cuenta los carriles que ocupa la semana', () => {
        const overlapping = [campaign('A', '2026-09-01', '2026-09-06'), campaign('B', '2026-09-01', '2026-09-03')];
        expect(weekLayout(weeks[0], overlapping, seasons).laneCount).toBe(3);
        expect(weekLayout(weeks[1], overlapping, seasons).laneCount).toBe(0);
    });
});

describe('limitLanes', () => {
    const overlapping = [
        campaign('A', '2026-09-01', '2026-09-06'),
        campaign('B', '2026-09-02', '2026-09-03'),
        campaign('C', '2026-09-02', '2026-09-04'),
        campaign('D', '2026-09-03', '2026-09-03'),
    ];
    const week = monthWeeks(new Date(2026, 8, 1))[0];
    const layout = weekLayout(week, overlapping, []);

    it('no recorta nada si todo cabe', () => {
        const limited = limitLanes(layout, 4);
        expect(limited.events).toHaveLength(4);
        expect(limited.more).toEqual([]);
    });

    it('deja un carril libre para «+N más» y cuenta lo oculto por día', () => {
        const limited = limitLanes(layout, 3);
        expect(limited.events.map((event) => event.label)).toEqual(['A', 'C']);
        expect(limited.more).toEqual([
            { col: 2, count: 1 },
            { col: 3, count: 2 },
        ]);
    });

    it('no pone «+N más» en los días sin nada oculto', () => {
        const limited = limitLanes(layout, 3);
        expect(limited.more.find((item) => item.col === 0)).toBeUndefined();
    });
});

describe('dayEvents', () => {
    it('devuelve lo que cae en ese día, campañas primero', () => {
        const overlapping = [campaign('A', '2026-09-01', '2026-09-06'), campaign('B', '2026-09-03', '2026-09-03')];
        const events = dayEvents(new Date(2026, 8, 3), overlapping, seasons);
        expect(events.map((event) => event.label)).toEqual(['A', 'B']);
    });

    it('incluye el cambio de temporada de ese día y nada más', () => {
        const events = dayEvents(new Date(2026, 8, 1), [], seasons);
        expect(events.map((event) => event.label)).toEqual(['Empieza Otoño-Invierno']);
        expect(dayEvents(new Date(2026, 8, 2), [], seasons)).toEqual([]);
    });
});

describe('monthEvents', () => {
    it('lista campañas y cambios de temporada que tocan el mes, por fecha', () => {
        const events = monthEvents(campaigns, seasons, new Date(2026, 8, 1));
        expect(events.map((event) => [event.name, event.kind, event.when])).toEqual([
            ['Empieza Otoño-Invierno', 'Temporada', '1 sep'],
            ['Presentación Otoño-Invierno', 'Campaña', '15 sep – 12 oct'],
        ]);
        expect(events.map((event) => event.type)).toEqual(['season', 'campaign']);
    });

    it('incluye una campaña que empezó en un mes anterior y sigue en este', () => {
        const events = monthEvents(campaigns, seasons, new Date(2026, 9, 1));
        expect(events.map((event) => event.name)).toEqual(['Presentación Otoño-Invierno']);
    });

    it('devuelve vacío si no hay nada', () => {
        expect(monthEvents([], [], new Date(2026, 5, 1))).toEqual([]);
        expect(monthEvents(campaigns, seasons, new Date(2026, 9, 1)).some((event) => event.type === 'season')).toBe(false);
    });

    it('conserva el original para abrirlo', () => {
        const [event] = monthEvents(campaigns, [], new Date(2026, 10, 1));
        expect(event.original).toBe(campaigns[2]);
    });
});

describe('upcomingDates', () => {
    const today = new Date(2026, 8, 28, 15, 30);

    it('sigue la regla del diseño: fin de la campaña en curso, inicio de las futuras y los dos extremos de las temporadas', () => {
        const dates = upcomingDates(campaigns, seasons, today);
        expect(dates.map((item) => [item.label, item.date])).toEqual([
            ['Termina Presentación Otoño-Invierno', new Date(2026, 9, 12)],
            ['Black Friday', new Date(2026, 10, 27)],
            ['Navidad y Reyes', new Date(2026, 11, 5)],
            ['Rebajas de invierno', new Date(2027, 0, 7)],
            ['Termina Otoño-Invierno', new Date(2027, 1, 28)],
        ]);
    });

    it('no incluye el final de las campañas futuras ni lo que ya pasó', () => {
        const labels = upcomingDates(campaigns, seasons, today, 20).map((item) => item.label);
        expect(labels).not.toContain('Termina Black Friday');
        expect(labels).not.toContain('Empieza Otoño-Invierno');
        expect(labels).not.toContain('Termina Rebajas de verano');
    });

    it('una fecha de hoy cuenta como próxima', () => {
        const dates = upcomingDates(campaigns, seasons, new Date(2026, 9, 12));
        expect(dates[0]).toMatchObject({ label: 'Termina Presentación Otoño-Invierno', type: 'campaign' });
    });

    it('una campaña que empieza hoy cuenta con su inicio, no con su final', () => {
        const dates = upcomingDates(campaigns, seasons, new Date(2026, 10, 27));
        expect(dates[0]).toMatchObject({ label: 'Black Friday', date: new Date(2026, 10, 27) });
    });

    it('respeta el límite', () => {
        expect(upcomingDates(campaigns, seasons, today, 2)).toHaveLength(2);
    });

    it('conserva el original para abrirlo', () => {
        expect(upcomingDates(campaigns, seasons, today)[0].original).toBe(campaigns[1]);
    });

    it('devuelve vacío sin datos', () => {
        expect(upcomingDates([], [], today)).toEqual([]);
    });
});

describe('daysLabel', () => {
    it('dice hoy, mañana o en N días', () => {
        expect(daysLabel(0)).toBe('hoy');
        expect(daysLabel(1)).toBe('mañana');
        expect(daysLabel(14)).toBe('en 14 días');
    });
});

describe('outsideRange', () => {
    const [first, , , , last] = monthWeeks(new Date(2026, 8, 1));

    it('cuenta los días de fuera del mes al principio del tramo', () => {
        expect(outsideRange(first, new Date(2026, 8, 1), 0, 6)).toEqual({ before: 1, after: 0 });
    });

    it('cuenta los días de fuera del mes al final del tramo', () => {
        expect(outsideRange(last, new Date(2026, 8, 1), 0, 6)).toEqual({ before: 0, after: 4 });
    });

    it('solo mira las columnas del tramo', () => {
        expect(outsideRange(first, new Date(2026, 8, 1), 1, 6)).toEqual({ before: 0, after: 0 });
        expect(outsideRange(last, new Date(2026, 8, 1), 0, 2)).toEqual({ before: 0, after: 0 });
    });

    it('un tramo entero fuera del mes cuenta como «antes»', () => {
        expect(outsideRange(first, new Date(2026, 8, 1), 0, 0)).toEqual({ before: 1, after: 0 });
        expect(outsideRange(last, new Date(2026, 8, 1), 3, 5)).toEqual({ before: 3, after: 0 });
    });
});