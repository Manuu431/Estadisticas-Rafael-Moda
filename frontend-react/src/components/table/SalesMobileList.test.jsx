import { describe, expect, it } from 'vitest';
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
    it('enseña las 12 primeras y el botón con las que faltan', () => {
        render(<SalesMobileList rows={makeRows(185)} />);
        expect(items()).toHaveLength(12);
        expect(moreButton()).toHaveTextContent('Ver más ventas (173)');
    });

    it('cada pulsación añade 12 más y el botón cuenta las que quedan', () => {
        render(<SalesMobileList rows={makeRows(30)} />);
        fireEvent.click(moreButton());
        expect(items()).toHaveLength(24);
        expect(moreButton()).toHaveTextContent('Ver más ventas (6)');
        fireEvent.click(moreButton());
        expect(items()).toHaveLength(30);
    });

    it('cuando no queda ninguna el botón desaparece', () => {
        render(<SalesMobileList rows={makeRows(30)} />);
        fireEvent.click(moreButton());
        fireEvent.click(moreButton());
        expect(moreButton()).not.toBeInTheDocument();
    });

    it('con 12 o menos no hay botón', () => {
        render(<SalesMobileList rows={makeRows(12)} />);
        expect(moreButton()).not.toBeInTheDocument();
    });

    it('agrupa los números grandes con separador de miles', () => {
        render(<SalesMobileList rows={makeRows(1500)} />);
        expect(moreButton()).toHaveTextContent('Ver más ventas (1.488)');
    });

    it('al cambiar las ventas (otro filtro) vuelve a empezar por las 12 primeras', () => {
        const { rerender } = render(<SalesMobileList rows={makeRows(40)} />);
        fireEvent.click(moreButton());
        expect(items()).toHaveLength(24);
        rerender(<SalesMobileList rows={makeRows(35)} />);
        expect(items()).toHaveLength(12);
        expect(moreButton()).toHaveTextContent('Ver más ventas (23)');
    });

    it('la suma de cada día es la del día completo y no cambia al ver más', () => {
        const rows = makeRows(25, () => '2026-09-28');
        const { container } = render(<SalesMobileList rows={rows} />);
        const sum = () => text(container.querySelector('.sales-day-sum'));
        expect(sum()).toBe('250,00 €');
        fireEvent.click(moreButton());
        expect(sum()).toBe('250,00 €');
    });

    it('cada venta enseña hora, nombre, detalle, importe y beneficio con signo', () => {
        const rows = [{ id: 1, sold_at: '2026-09-28 19:37:00', sale_date: '2026-09-28', product: 'Vaquero recto', brand: 'Lois', section: 'hombre', size: '44', units: 2, amount: '119.80', profit: '65.80' }];
        render(<SalesMobileList rows={rows} />);
        const item = items()[0];
        expect(text(item)).toContain('19:37');
        expect(text(item)).toContain('Vaquero recto');
        expect(text(item)).toContain('Lois · Hombre · T. 44 · 2 uds.');
        expect(text(item)).toContain('119,80 €');
        expect(text(item)).toContain('+65,80 €');
    });

    it('lleva el título de cada día', () => {
        const rows = makeRows(3, () => '2025-07-26');
        const { container } = render(<SalesMobileList rows={rows} />);
        expect(container.querySelector('.sales-day-title')).toHaveTextContent('Sábado 26 de julio de 2025');
    });
});