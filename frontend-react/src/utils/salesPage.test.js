import { describe, expect, it } from 'vitest';
import { PAGE_SIZE, salesRequest, salesSummary } from './salesPage.js';

describe('salesRequest', () => {
    const filters = { brand: 'Lois', sale_date_min: '2026-10-01', sale_date_max: '2026-10-22' };

    it('en escritorio pide la página que toca', () => {
        expect(salesRequest(filters, { isMobile: false, page: 1, count: 24 })).toEqual({ ...filters, limit: String(PAGE_SIZE), offset: '0' });
        expect(salesRequest(filters, { isMobile: false, page: 3, count: 24 })).toEqual({ ...filters, limit: String(PAGE_SIZE), offset: '24' });
    });

    it('en móvil pide siempre desde el principio tantas como se enseñan', () => {
        expect(salesRequest(filters, { isMobile: true, page: 3, count: 36 })).toEqual({ ...filters, limit: '36', offset: '0' });
    });
});

describe('salesSummary', () => {
    it('pasa los importes a céntimos', () => {
        expect(salesSummary({ lines: 2333, units: 2573, amount: 210677.55, profit: 98674.31 })).toEqual({ lines: 2333, units: 2573, amountCents: 21067755, profitCents: 9867431 });
    });

    it('sin datos todo vale cero', () => {
        expect(salesSummary(undefined)).toEqual({ lines: 0, units: 0, amountCents: 0, profitCents: 0 });
    });

    it('no pierde céntimos con decimales binarios', () => {
        expect(salesSummary({ lines: 1, units: 1, amount: 1.15, profit: 0.29 })).toMatchObject({ amountCents: 115, profitCents: 29 });
    });
});