import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeekSales from './WeekSales.jsx';

const from = new Date(2026, 8, 25);
const to = new Date(2026, 9, 1);

const summary = {
    summary: { total: 4902.21, units: 55, tickets: 32, mujer: 3723.39, hombre: 1178.82, profit: 2498.66 },
    compared: { total: 4458.8, units: 50, tickets: 30, mujer: 3000, hombre: 1458.8, profit: 2000 }
};

const daily = {
    days: [{ date: '2026-09-25', total: 1000 }, { date: '2026-10-01', total: 621.87 }],
    comparedDays: [{ date: '2025-09-26', total: 800 }]
};

const renderCard = (props) => render(<WeekSales summary={summary} daily={daily} from={from} to={to} showSplit {...props} />);

const text = (container) => container.textContent.split(String.fromCharCode(160)).join(' ');

describe('WeekSales', () => {
    it('enseña el total de la semana y la comparación con el año pasado', () => {
        renderCard();
        expect(screen.getByText('4.902,21 €')).toBeInTheDocument();
        expect(screen.getByText('+9,9 %')).toBeInTheDocument();
        expect(screen.getByText(/26 sep – 2 oct\. 2025/)).toBeInTheDocument();
    });

    it('pinta una columna por día con su importe y el del año anterior', () => {
        renderCard();
        const bars = screen.getAllByRole('button');
        expect(bars).toHaveLength(7);
        expect(bars[0]).toHaveAccessibleName(/^vie 25: 1\.000,00\s€\. En 2025, 800,00\s€$/);
        expect(bars[6]).toHaveAccessibleName(/^jue 1: 621,87\s€\. En 2025, 0,00\s€$/);
    });

    it('reparte las ventas entre mujer y hombre', () => {
        const { container } = renderCard();
        expect(text(container)).toContain('76,0 %');
        expect(text(container)).toContain('24,0 %');
    });

    it('esconde el reparto cuando se está filtrando por una sección', () => {
        const { container } = renderCard({ showSplit: false });
        expect(text(container)).not.toContain('76,0 %');
    });

    it('calcula prendas, tickets y ticket medio', () => {
        renderCard();
        expect(screen.getByText('55')).toBeInTheDocument();
        expect(screen.getByText('32')).toBeInTheDocument();
        expect(screen.getByText('153,19 €')).toBeInTheDocument();
    });

    it('mientras no hay datos enseña el esqueleto, no ceros', () => {
        const { container } = renderCard({ summary: null, daily: null });
        expect(container.querySelectorAll('.panel-skeleton').length).toBeGreaterThan(0);
        expect(screen.queryByText('0,00 €')).not.toBeInTheDocument();
    });

    it('si falla la carga ofrece reintentar en vez de enseñar datos', () => {
        const onRetry = vi.fn();
        renderCard({ error: new Error('boom'), onRetry });
        expect(screen.getByRole('alert')).toBeInTheDocument();
        screen.getByRole('button', { name: 'Reintentar' }).click();
        expect(onRetry).toHaveBeenCalledOnce();
        expect(screen.queryByText('4.902,21 €')).not.toBeInTheDocument();
    });
});