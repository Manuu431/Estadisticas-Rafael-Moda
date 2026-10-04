import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import SalesSummary from './SalesSummary.jsx';

const summary = { lines: 185, units: 197, amountCents: 1928460, profitCents: 991230 };
const text = (container) => container.textContent.split(String.fromCharCode(160)).join(' ');

describe('SalesSummary', () => {
    it('con datos, enseña los cuatro números', () => {
        const { container } = render(<SalesSummary kind="ready" summary={summary} />);
        expect(text(container)).toBe('19.284,60 € vendidos · 9.912,30 € de beneficio185 líneas de venta · 197 prendas');
    });

    it('sin ventas, enseña ceros porque son un dato', () => {
        const { container } = render(<SalesSummary kind="empty" summary={{ lines: 0, units: 0, amountCents: 0, profitCents: 0 }} />);
        expect(text(container)).toContain('0,00 € vendidos');
        expect(text(container)).toContain('0 líneas de venta · 0 prendas');
    });

    it('mientras carga no enseña ningún número, solo siluetas', () => {
        const { container } = render(<SalesSummary kind="loading" summary={summary} />);
        expect(container.textContent).toBe('');
        expect(container.querySelectorAll('.panel-skeleton')).toHaveLength(2);
    });

    it('si falla la carga, enseña guiones y no ceros', () => {
        const { container } = render(<SalesSummary kind="error" summary={{ lines: 0, units: 0, amountCents: 0, profitCents: 0 }} />);
        expect(text(container)).toBe('— vendidos · — de beneficio— líneas de venta · — prendas');
    });
});