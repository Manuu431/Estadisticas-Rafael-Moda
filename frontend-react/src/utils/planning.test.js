import { describe, expect, it } from 'vitest';
import {
    buildRows,
    countLabel,
    deleteMessage,
    sortEditions,
    sortTypes,
    syncMessage,
    typeRange,
    typeStatus,
    lastResult,
    yearLabel,
} from './planning.js';

const type = (id, name, start_day, start_month, end_day, end_month, first_year = 2020, repeats = 1) => ({
    id, name, start_day, start_month, end_day, end_month, first_year, repeats,
});
const edition = (period_type_id, start_date, end_date, profits = 0, expenses = 0, id = Math.random()) => ({
    id, period_type_id, name: '', start_date, end_date, expenses, profits, balance: profits - expenses,
});

const winter = type(1, 'Rebajas de invierno', 7, 1, 28, 2);
const valentine = type(2, 'San Valentín', 1, 2, 14, 2);
const summer = type(5, 'Rebajas de verano', 1, 7, 31, 8);
const presentation = type(6, 'Presentación Otoño-Invierno', 15, 9, 12, 10, 2022);
const christmas = type(8, 'Navidad y Reyes', 5, 12, 6, 1);
const anniversary = type(9, '50 aniversario', 3, 5, 20, 5, 2026, 0);

const today = new Date(2026, 8, 28, 16, 45);

describe('sortTypes', () => {
    it('ordena por el día del año en que empieza el tipo', () => {
        const sorted = sortTypes([christmas, summer, winter, valentine, presentation]);
        expect(sorted.map((item) => item.name)).toEqual([
            'Rebajas de invierno', 'San Valentín', 'Rebajas de verano', 'Presentación Otoño-Invierno', 'Navidad y Reyes',
        ]);
    });

    it('desempata por día y luego por nombre, sin tocar el original', () => {
        const a = type(10, 'B', 1, 3, 2, 3);
        const b = type(11, 'A', 1, 3, 2, 3);
        const c = type(12, 'C', 2, 3, 3, 3);
        const input = [c, a, b];
        expect(sortTypes(input).map((item) => item.name)).toEqual(['A', 'B', 'C']);
        expect(input.map((item) => item.name)).toEqual(['C', 'B', 'A']);
    });
});

describe('typeRange', () => {
    it('escribe día y mes corto con flecha', () => {
        expect(typeRange(winter)).toBe('7 ene → 28 feb');
        expect(typeRange(christmas)).toBe('5 dic → 6 ene');
    });
});

describe('yearLabel', () => {
    it('usa un solo año o los dos si cruza de año', () => {
        expect(yearLabel('2026-01-07', '2026-02-28')).toBe('2026');
        expect(yearLabel('2025-12-05', '2026-01-06')).toBe('2025-26');
        expect(yearLabel('2099-12-05', '2100-01-06')).toBe('2099-00');
    });
});

describe('typeStatus', () => {
    it('cuenta los días hasta la próxima edición con las fechas del tipo si aún no está guardada', () => {
        expect(typeStatus(winter, [], today)).toEqual({ kind: 'upcoming', days: 101, label: 'Empieza en 101 días' });
    });

    it('con una edición en curso dice cuántos días quedan', () => {
        const editions = [edition(6, '2026-09-15', '2026-10-12')];
        expect(typeStatus(presentation, editions, today)).toEqual({ kind: 'current', days: 14, label: 'En curso · quedan 14 días' });
    });

    it('detecta una edición en curso aunque no esté guardada', () => {
        expect(typeStatus(presentation, [], today).kind).toBe('current');
    });

    it('una edición que cruza de año sigue en curso en enero', () => {
        const status = typeStatus(christmas, [], new Date(2027, 0, 3));
        expect(status).toEqual({ kind: 'current', days: 3, label: 'En curso · quedan 3 días' });
    });

    it('usa singular y expresiones propias para hoy y mañana', () => {
        expect(typeStatus(winter, [], new Date(2027, 0, 6)).label).toBe('Empieza mañana');
        expect(typeStatus(winter, [], new Date(2027, 0, 7)).label).toBe('Empieza hoy');
        expect(typeStatus(winter, [], new Date(2027, 0, 8)).label).toBe('En curso · quedan 51 días');
        expect(typeStatus(winter, [], new Date(2026, 0, 6)).label).toBe('Empieza mañana');
        expect(typeStatus(valentine, [], new Date(2026, 0, 31)).label).toBe('Empieza mañana');
        expect(typeStatus(presentation, [], new Date(2026, 8, 14)).label).toBe('Empieza mañana');
    });

    it('el día que empieza dice «Empieza hoy» y el último día avisa de que termina hoy', () => {
        const todayStart = new Date(2026, 8, 15);
        expect(typeStatus(presentation, [edition(6, '2026-09-15', '2026-10-12')], todayStart)).toEqual({ kind: 'upcoming', days: 0, label: 'Empieza hoy' });
        expect(typeStatus(presentation, [], new Date(2026, 8, 16)).label).toBe('En curso · quedan 26 días');
        expect(typeStatus(presentation, [], new Date(2026, 9, 12)).label).toBe('En curso · termina hoy');
        expect(typeStatus(presentation, [], new Date(2026, 9, 11)).label).toBe('En curso · queda 1 día');
    });

    it('prefiere las fechas guardadas de una edición si se han cambiado', () => {
        const edited = [edition(6, '2026-10-05', '2026-11-10')];
        expect(typeStatus(presentation, edited, today)).toEqual({ kind: 'upcoming', days: 7, label: 'Empieza en 7 días' });
    });

    it('un tipo que no se repite y ya pasó está terminado', () => {
        expect(typeStatus(anniversary, [edition(9, '2026-05-03', '2026-05-20')], today)).toEqual({ kind: 'finished', label: 'Terminada' });
        expect(typeStatus(anniversary, [], today).kind).toBe('finished');
    });

    it('un tipo que no se repite y aún no empezó cuenta como próximo', () => {
        expect(typeStatus(anniversary, [], new Date(2026, 3, 1)).label).toBe('Empieza en 32 días');
    });

    it('un tipo que empieza en un año futuro cuenta los días hasta su primer año', () => {
        const future = type(20, 'Nueva', 1, 1, 10, 1, 2028);
        expect(typeStatus(future, [], today).kind).toBe('upcoming');
    });
});

describe('lastResult', () => {
    const editions = [
        edition(1, '2026-01-07', '2026-02-28', 6215),
        edition(1, '2025-01-07', '2025-02-28', 5717.8),
        edition(1, '2027-01-07', '2027-02-28', 0),
    ];

    it('devuelve el beneficio de la última edición ya terminada y su año', () => {
        expect(lastResult(editions, today)).toEqual({ profit: 6215, year: '2026' });
    });

    it('la edición en curso no cuenta', () => {
        const withCurrent = [edition(6, '2026-09-15', '2026-10-12', 100), edition(6, '2025-09-15', '2025-10-12', 9870)];
        expect(lastResult(withCurrent, today)).toEqual({ profit: 9870, year: '2025' });
    });

    it('una edición que termina hoy todavía no está terminada', () => {
        expect(lastResult([edition(6, '2026-09-15', '2026-09-28', 1)], today)).toBeNull();
    });

    it('usa el año doble si la edición cruza de año', () => {
        expect(lastResult([edition(8, '2025-12-05', '2026-01-06', 8740)], today)).toEqual({ profit: 8740, year: '2025-26' });
    });

    it('sin ediciones terminadas devuelve null', () => {
        expect(lastResult([], today)).toBeNull();
        expect(lastResult([edition(1, '2027-01-07', '2027-02-28')], today)).toBeNull();
    });
});

describe('countLabel', () => {
    it('lleva singular y plural según el tipo de pestaña', () => {
        expect(countLabel(7, 'campaigns')).toBe('7 campañas');
        expect(countLabel(1, 'campaigns')).toBe('1 campaña');
        expect(countLabel(2, 'seasons')).toBe('2 temporadas');
        expect(countLabel(1, 'seasons')).toBe('1 temporada');
        expect(countLabel(0, 'campaigns')).toBe('0 campañas');
    });
});

describe('sortEditions', () => {
    it('ordena de la más reciente a la más antigua sin tocar el original', () => {
        const input = [edition(1, '2024-01-07', '2024-02-28'), edition(1, '2026-01-07', '2026-02-28'), edition(1, '2025-01-07', '2025-02-28')];
        expect(sortEditions(input).map((item) => item.start_date)).toEqual(['2026-01-07', '2025-01-07', '2024-01-07']);
        expect(input[0].start_date).toBe('2024-01-07');
    });
});

describe('syncMessage', () => {
    it('dice cuántas ediciones se han creado', () => {
        expect(syncMessage(2)).toBe('Se han creado 2 ediciones.');
        expect(syncMessage(1)).toBe('Se ha creado 1 edición.');
        expect(syncMessage(0)).toBe('Ya estaba todo al día.');
    });
});

describe('deleteMessage', () => {
    it('avisa de cuántas ediciones se borran con el tipo', () => {
        expect(deleteMessage('Black Friday', 7)).toBe('¿Eliminar «Black Friday»? Se borrarán también sus 7 ediciones.');
        expect(deleteMessage('Black Friday', 1)).toBe('¿Eliminar «Black Friday»? Se borrará también su única edición.');
        expect(deleteMessage('Black Friday', 0)).toBe('¿Eliminar «Black Friday»?');
    });
});

describe('buildRows', () => {
    const types = [christmas, winter, presentation];
    const editions = [
        edition(1, '2026-01-07', '2026-02-28', 6215, 380),
        edition(1, '2025-01-07', '2025-02-28', 5717.8, 360),
        edition(6, '2026-09-15', '2026-10-12', 100, 0),
        edition(6, '2025-09-15', '2025-10-12', 9870, 0),
        edition(8, '2025-12-05', '2026-01-06', 8740, 0),
    ];

    it('une cada tipo con su estado, su última vez, su recuento y sus ediciones', () => {
        const rows = buildRows(types, editions, today, 'campaigns');
        expect(rows.map((row) => row.type.name)).toEqual(['Rebajas de invierno', 'Presentación Otoño-Invierno', 'Navidad y Reyes']);
        expect(rows[0]).toMatchObject({
            range: '7 ene → 28 feb',
            status: { label: 'Empieza en 101 días' },
            last: { profit: 6215, year: '2026' },
            count: '2 campañas',
        });
        expect(rows[0].editions.map((item) => item.start_date)).toEqual(['2026-01-07', '2025-01-07']);
        expect(rows[1].status.kind).toBe('current');
        expect(rows[1].last).toEqual({ profit: 9870, year: '2025' });
        expect(rows[2].last.year).toBe('2025-26');
    });

    it('un tipo sin ediciones sale con recuento a cero y sin última vez', () => {
        const [row] = buildRows([winter], [], today, 'seasons');
        expect(row.count).toBe('0 temporadas');
        expect(row.last).toBeNull();
        expect(row.editions).toEqual([]);
    });
});
