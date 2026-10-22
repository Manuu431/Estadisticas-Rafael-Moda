import { describe, expect, it } from 'vitest';
import { paginate } from './paginate.js';

describe('paginate', () => {
    const rows = Array.from({ length: 16 }, (_, index) => index + 1);

    it('trocea por el tamaño dado y dice cuántas páginas hay', () => {
        expect(paginate(rows, 1, 7)).toEqual({ rows: [1, 2, 3, 4, 5, 6, 7], pages: 3, page: 1 });
        expect(paginate(rows, 3, 7)).toEqual({ rows: [15, 16], pages: 3, page: 3 });
        expect(paginate(rows, 2, 12).rows).toHaveLength(4);
    });

    it('una página fuera de rango se queda en la primera o en la última', () => {
        expect(paginate(rows, 9, 7).page).toBe(3);
        expect(paginate(rows, 0, 7).page).toBe(1);
    });

    it('con el tamaño de una página o menos hay una sola página, y sin filas también', () => {
        expect(paginate(rows.slice(0, 7), 1, 7).pages).toBe(1);
        expect(paginate([], 1, 7)).toEqual({ rows: [], pages: 1, page: 1 });
    });
});