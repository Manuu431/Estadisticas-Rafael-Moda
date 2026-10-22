import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Sales from './Sales.jsx';

const screenSize = vi.hoisted(() => ({ mobile: false }));
const fetchState = vi.hoisted(() => ({ calls: [], result: null }));

vi.mock('../utils/useIsMobile.js', () => ({ useIsMobile: () => screenSize.mobile }));

vi.mock('../hooks/useFetch.js', () => ({
    useFetch: (url, params) => {
        if (url.endsWith('/options')) return { data: { brands: [], families: [], colors: [], sizes: [] }, settled: true, loading: false, error: null, refetch: () => {} };
        fetchState.calls.push(params);
        return fetchState.result;
    }
}));

const sale = (id) => ({ id, sold_at: `2026-10-${String(28 - id).padStart(2, '0')} 12:00:00`, sale_date: `2026-10-${String(28 - id).padStart(2, '0')}`, product: `Prenda ${id}`, color: 'Azul', brand: 'Lois', section: 'mujer', size: 'M', units: 1, amount: '10.00', profit: '4.00' });
const page = (summary = { lines: 30, units: 31, amount: 300, profit: 120 }) => ({ rows: Array.from({ length: 12 }, (_, index) => sale(index + 1)), summary, days: {} });
const ready = (data) => ({ data, settled: true, loading: false, error: null, refetch: () => {} });
const lastCall = () => fetchState.calls[fetchState.calls.length - 1];

describe('Sales', () => {
    beforeAll(() => {
        window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
    });

    beforeEach(() => {
        fetchState.calls = [];
        fetchState.result = ready(page());
        screenSize.mobile = false;
    });

    it('en escritorio pide solo la primera página y enseña el total del servidor', () => {
        render(<Sales title="Ventas" />);
        expect(lastCall()).toMatchObject({ limit: '12', offset: '0' });
        expect(screen.getByText(/Mostrando 1–12 de 30 líneas/)).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(13);
    });

    it('el resumen sale de los totales del servidor, no de las filas que se ven', () => {
        render(<Sales title="Ventas" />);
        expect(document.querySelector('.panel-summary')).toHaveTextContent('300,00 € vendidos');
        expect(document.querySelector('.panel-summary')).toHaveTextContent('120,00 € de beneficio');
    });

    it('pasar de página pide el desplazamiento que toca', () => {
        render(<Sales title="Ventas" />);
        fireEvent.click(screen.getByRole('button', { name: 'Página siguiente' }));
        expect(lastCall()).toMatchObject({ limit: '12', offset: '12' });
    });

    it('en móvil «Ver más» pide 12 más desde el principio', () => {
        screenSize.mobile = true;
        render(<Sales title="Ventas" />);
        expect(lastCall()).toMatchObject({ limit: '12', offset: '0' });
        fireEvent.click(screen.getByRole('button', { name: /Ver más ventas \(18\)/ }));
        expect(lastCall()).toMatchObject({ limit: '24', offset: '0' });
    });
});