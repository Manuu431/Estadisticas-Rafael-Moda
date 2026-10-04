import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import SalesSummary, { SalesSummaryCard } from './SalesSummary.jsx';

const summary = { lines: 185, units: 197, amountCents: 1928460, profitCents: 991230 };
const zero = { lines: 0, units: 0, amountCents: 0, profitCents: 0 };
const text = (container) => container.textContent.split(String.fromCharCode(160)).join(' ');

describe('SalesSummary', () => {
    it('con datos, enseña los cuatro números', () => {
        const { container } = render(<SalesSummary kind="ready" summary={summary} />);
        expect(text(container)).toBe('19.284,60 € vendidos · 9.912,30 € de beneficio185 líneas de venta · 197 prendas');
    });

    it('sin ventas, enseña ceros porque son un dato', () => {
        const { container } = render(<SalesSummary kind="empty" summary={zero} />);
        expect(text(container)).toContain('0,00 € vendidos');
        expect(text(container)).toContain('0 líneas de venta · 0 prendas');
    });

    it('mientras carga no enseña ningún número, solo siluetas', () => {
        const { container } = render(<SalesSummary kind="loading" summary={summary} />);
        expect(container.textContent).toBe('');
        expect(container.querySelectorAll('.panel-skeleton')).toHaveLength(2);
    });

    it('si falla la carga, enseña guiones y no ceros', () => {
        const { container } = render(<SalesSummary kind="error" summary={zero} />);
        expect(text(container)).toBe('— vendidos · — de beneficio— líneas de venta · — prendas');
    });
});

describe('SalesSummaryCard (móvil)', () => {
    it('pone Vendido y Beneficio con sus importes, y debajo las líneas y las prendas', () => {
        const { container } = render(<SalesSummaryCard kind="ready" summary={summary} />);
        expect(text(container)).toBe('Vendido19.284,60 €Beneficio9.912,30 €185 líneas de venta · 197 prendas');
    });

    it('el beneficio va en verde', () => {
        const { container } = render(<SalesSummaryCard kind="ready" summary={summary} />);
        expect(container.querySelector('.sales-card-profit')).toHaveTextContent('9.912,30');
    });

    it('en singular dice «1 línea de venta · 1 prenda»', () => {
        const { container } = render(<SalesSummaryCard kind="ready" summary={{ lines: 1, units: 1, amountCents: 7900, profitCents: 4300 }} />);
        expect(text(container)).toContain('1 línea de venta · 1 prenda');
    });

    it('sin ventas muestra ceros', () => {
        const { container } = render(<SalesSummaryCard kind="empty" summary={zero} />);
        expect(text(container)).toContain('0,00 €');
        expect(text(container)).toContain('0 líneas de venta · 0 prendas');
    });

    it('mientras carga no muestra números, solo siluetas', () => {
        const { container } = render(<SalesSummaryCard kind="loading" summary={summary} />);
        expect(container.textContent).toBe('');
        expect(container.querySelectorAll('.panel-skeleton').length).toBeGreaterThan(0);
    });

    it('si falla la carga muestra guiones', () => {
        const { container } = render(<SalesSummaryCard kind="error" summary={zero} />);
        expect(text(container)).toBe('Vendido—Beneficio—— líneas de venta · — prendas');
    });
});