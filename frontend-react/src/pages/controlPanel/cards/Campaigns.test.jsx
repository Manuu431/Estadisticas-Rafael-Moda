import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Campaigns from './Campaigns.jsx';

const today = new Date(2026, 9, 2);

const campaign = (id, type, typeName, start, end, extra = {}) => ({
    id,
    period_type_id: type,
    type_name: typeName,
    start_date: start,
    end_date: end,
    expenses: 600,
    profits: 5992.47,
    balance: 5392.47,
    ...extra
});

const campaigns = [
    campaign(1, 10, 'Presentación Otoño-Invierno', '2026-09-15', '2026-10-12'),
    campaign(2, 20, 'Black Friday', '2026-11-27', '2026-11-30', { profits: 1108, balance: 1108 }),
    campaign(3, 30, 'Navidad y Reyes', '2026-12-05', '2027-01-07', { profits: 16055, balance: 16055 }),
    campaign(4, 40, 'Rebajas de invierno', '2027-01-07', '2027-02-28', { profits: 6215, balance: 6215 }),
    campaign(5, 20, 'Black Friday', '2025-11-28', '2025-12-01', { profits: 980, balance: 980 })
];

const text = (container) => container.textContent.split(String.fromCharCode(160)).join(' ');

describe('Campaigns', () => {
    it('enseña la campaña en curso con su progreso y sus cifras', () => {
        const { container } = render(<Campaigns campaigns={campaigns} today={today} />);
        expect(screen.getByText('Presentación Otoño-Invierno')).toBeInTheDocument();
        expect(text(container)).toContain('15 sep – 12 oct');
        expect(text(container)).toContain('día 18 de 28');
        expect(text(container)).toContain('Quedan 10 días');
        expect(text(container)).toContain('+5.392,47');
    });

    it('enseña solo las dos próximas campañas, por orden de fecha', () => {
        const { container } = render(<Campaigns campaigns={campaigns} today={today} />);
        expect(screen.getByText('Black Friday')).toBeInTheDocument();
        expect(screen.getByText('Navidad y Reyes')).toBeInTheDocument();
        expect(screen.queryByText('Rebajas de invierno')).not.toBeInTheDocument();
        expect(text(container)).toContain('en 56 días');
    });

    it('para cada próxima campaña busca el beneficio de su edición anterior', () => {
        const { container } = render(<Campaigns campaigns={campaigns} today={today} />);
        expect(text(container)).toContain('La última vez: +980');
    });

    it('dice «Primera edición» cuando la campaña no se ha hecho nunca', () => {
        render(<Campaigns campaigns={campaigns} today={today} />);
        expect(screen.getByText('Primera edición')).toBeInTheDocument();
    });

    it('avisa de que las cifras son de una sección cuando hay filtro', () => {
        const { container } = render(<Campaigns campaigns={campaigns} today={today} section="mujer" />);
        expect(text(container)).toContain('Solo Mujer');
    });

    it('sin campaña en curso lo dice y sigue enseñando las próximas', () => {
        const futuras = campaigns.filter((item) => item.id !== 1);
        render(<Campaigns campaigns={futuras} today={today} />);
        expect(screen.getByText('Ninguna campaña en curso ahora mismo.')).toBeInTheDocument();
        expect(screen.getByText('Black Friday')).toBeInTheDocument();
    });

    it('mientras no hay datos enseña el esqueleto', () => {
        const { container } = render(<Campaigns campaigns={null} today={today} />);
        expect(container.querySelectorAll('.panel-skeleton').length).toBeGreaterThan(0);
    });

    it('si falla la carga ofrece reintentar', () => {
        const onRetry = vi.fn();
        render(<Campaigns campaigns={null} today={today} error={new Error('boom')} onRetry={onRetry} />);
        screen.getByRole('button', { name: 'Reintentar' }).click();
        expect(onRetry).toHaveBeenCalledOnce();
    });
});