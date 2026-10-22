import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopBrands from './TopBrands.jsx';

const brands = {
    ranking: [
        { name: 'Paz Torras', total: 398, units: 3 },
        { name: 'Massana', total: 298, units: 2 },
        { name: 'Victorio & Lucchino', total: 289, units: 1 }
    ],
    total: 1461.8
};

const text = (container) => container.textContent.split(String.fromCharCode(160)).join(' ');

describe('TopBrands', () => {
    it('destaca la marca número uno con su importe y su peso en las ventas', () => {
        const { container } = render(<TopBrands brands={brands} />);
        expect(screen.getByText('N.º 1')).toBeInTheDocument();
        expect(screen.getAllByText('Paz Torras')).toHaveLength(2);
        expect(text(container)).toContain('3 prendas');
        expect(text(container)).toContain('27,2 % de las ventas');
    });

    it('lista el ranking en el orden que recibe', () => {
        render(<TopBrands brands={brands} />);
        const rows = screen.getAllByRole('listitem');
        expect(rows.map((row) => row.textContent)).toEqual([
            expect.stringContaining('Paz Torras'),
            expect.stringContaining('Massana'),
            expect.stringContaining('Victorio & Lucchino')
        ]);
    });

    it('cierra con el total del periodo', () => {
        const { container } = render(<TopBrands brands={brands} />);
        expect(text(container)).toContain('Total del periodo: 1.461,80');
    });

    it('sin ventas en el periodo lo dice en vez de enseñar una lista vacía', () => {
        render(<TopBrands brands={{ ranking: [], total: 0 }} />);
        expect(screen.getByText('Todavía no hay ventas en este periodo.')).toBeInTheDocument();
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    it('mientras no hay datos enseña el esqueleto', () => {
        const { container } = render(<TopBrands brands={null} />);
        expect(container.querySelectorAll('.panel-skeleton').length).toBeGreaterThan(0);
    });

    it('si falla la carga ofrece reintentar', () => {
        const onRetry = vi.fn();
        render(<TopBrands brands={null} error={new Error('boom')} onRetry={onRetry} />);
        screen.getByRole('button', { name: 'Reintentar' }).click();
        expect(onRetry).toHaveBeenCalledOnce();
    });
});