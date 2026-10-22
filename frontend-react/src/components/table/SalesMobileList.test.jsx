import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SalesMobileList from './SalesMobileList.jsx';

const text = (node) => node.textContent.split(String.fromCharCode(160)).join(' ');

const makeRows = (count, day = (index) => `2026-09-${String(28 - Math.floor(index / 10)).padStart(2, '0')}`) =>
    Array.from({ length: count }, (_, index) => {
        const date = day(index);
        return {
            id: count - index,
            sold_at: `${date} ${String(20 - (index % 10)).padStart(2, '0')}:15:00`,
            sale_date: date,
            product: `Prenda ${count - index}`,
            brand: 'Lois',
            section: index % 2 ? 'mujer' : 'hombre',
            size: 'M',
            units: 1,
            amount: '10.00',
            profit: '4.00'
        };
    });

const items = () => screen.getAllByRole('listitem');
const moreButton = () => screen.queryByRole('button', { name: /Ver más ventas/ });

describe('SalesMobileList', () => {
    it('enseña las filas que recibe y el botón con las que faltan', () => {
        render(<SalesMobileList rows={makeRows(12)} total={185} onMore={() => {}} />);
        expect(items()).toHaveLength(12);
        expect(moreButton()).toHaveTextContent('Ver más ventas (173)');
    });

    it('al pulsar el botón pide más', () => {
        const onMore = vi.fn();
        render(<SalesMobileList rows={makeRows(12)} total={30} onMore={onMore} />);
        fireEvent.click(moreButton());
        expect(onMore).toHaveBeenCalledTimes(1);
    });

    it('cuando no queda ninguna el botón desaparece', () => {
        render(<SalesMobileList rows={makeRows(30)} total={30} onMore={() => {}} />);
        expect(moreButton()).not.toBeInTheDocument();
    });

    it('con 12 o menos no hay botón', () => {
        render(<SalesMobileList rows={makeRows(12)} total={12} onMore={() => {}} />);
        expect(moreButton()).not.toBeInTheDocument();
    });

    it('agrupa los números grandes con separador de miles', () => {
        render(<SalesMobileList rows={makeRows(12)} total={1500} onMore={() => {}} />);
        expect(moreButton()).toHaveTextContent('Ver más ventas (1.488)');
    });

    it('la suma de cada día es la del día completo que manda el servidor', () => {
        const rows = makeRows(12, () => '2026-09-28');
        const { container } = render(<SalesMobileList rows={rows} total={25} days={{ '2026-09-28': 250 }} onMore={() => {}} />);
        expect(text(container.querySelector('.sales-day-sum'))).toBe('250,00 €');
    });

    it('cada venta enseña hora, nombre, detalle, importe y beneficio con signo', () => {
        const rows = [{ id: 1, sold_at: '2026-09-28 19:37:00', sale_date: '2026-09-28', product: 'Vaquero recto', brand: 'Lois', section: 'hombre', size: '44', units: 2, amount: '119.80', profit: '65.80' }];
        render(<SalesMobileList rows={rows} total={rows.length} onMore={() => {}} />);
        const item = items()[0];
        expect(text(item)).toContain('19:37');
        expect(text(item)).toContain('Vaquero recto');
        expect(text(item)).toContain('Lois · Hombre · T. 44 · 2 uds.');
        expect(text(item)).toContain('119,80 €');
        expect(text(item)).toContain('+65,80 €');
    });

    it('lleva el título de cada día', () => {
        const rows = makeRows(3, () => '2025-07-26');
        const { container } = render(<SalesMobileList rows={rows} total={rows.length} onMore={() => {}} />);
        expect(container.querySelector('.sales-day-title')).toHaveTextContent('Sábado 26 de julio de 2025');
    });
});