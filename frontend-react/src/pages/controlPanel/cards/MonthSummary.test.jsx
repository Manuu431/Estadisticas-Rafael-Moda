import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonthSummary from './MonthSummary.jsx';

const month = { start: new Date(2026, 8, 1), end: new Date(2026, 8, 30) };
const chart = { from: new Date(2026, 0, 1), to: new Date(2026, 9, 2) };

const summary = {
    summary: { total: 20783.09, units: 300, tickets: 150, mujer: 15000, hombre: 5783.09, profit: 10489.15 },
    compared: { total: 20063.8, units: 290, tickets: 140, mujer: 14000, hombre: 6063.8, profit: 10000 }
};

const daily = {
    days: [{ date: '2026-01-05', total: 100 }],
    comparedDays: [{ date: '2025-01-05', total: 80 }]
};

const renderCard = (props) => render(<MonthSummary summary={summary} daily={daily} month={month} chart={chart} {...props} />);

const text = (container) => container.textContent.split(String.fromCharCode(160)).join(' ');

describe('MonthSummary', () => {
    it('enseña el total del mes, el beneficio y el margen', () => {
        const { container } = renderCard();
        expect(screen.getByText('20.783,09 €')).toBeInTheDocument();
        expect(screen.getByText('10.489,15 €')).toBeInTheDocument();
        expect(text(container)).toContain('Margen 50,5 %');
    });

    it('compara con el mismo mes del año anterior', () => {
        const { container } = renderCard();
        expect(screen.getByText('+3,6 %')).toBeInTheDocument();
        expect(text(container)).toContain('vs. septiembre 2025');
    });

    it('cuando se supera el mes anterior lo dice con el mes y el año', () => {
        const { container } = renderCard();
        expect(text(container)).toContain('Se ha superado septiembre de 2025 por 719,29');
    });

    it('cuando no se ha superado dice en cuánto cerró y cuánto falta', () => {
        const { container } = renderCard({
            summary: { ...summary, summary: { ...summary.summary, total: 19284.6 }, compared: { ...summary.compared, total: 19653.4 } }
        });
        expect(text(container)).toContain('Septiembre de 2025 cerró en 19.653,40');
        expect(text(container)).toContain('Faltan 368,80');
    });

    it('mientras no hay datos enseña el esqueleto', () => {
        const { container } = renderCard({ summary: null, daily: null });
        expect(container.querySelectorAll('.panel-skeleton').length).toBeGreaterThan(0);
    });

    it('si falla la carga ofrece reintentar', () => {
        const onRetry = vi.fn();
        renderCard({ error: new Error('boom'), onRetry });
        screen.getByRole('button', { name: 'Reintentar' }).click();
        expect(onRetry).toHaveBeenCalledOnce();
    });
});