import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Clients from './Clients.jsx';

const screenSize = vi.hoisted(() => ({ mobile: false }));

vi.mock('../utils/useIsMobile.js', () => ({ useIsMobile: () => screenSize.mobile }));

const OPTIONS = { provinces: ['Alicante', 'Valencia'], cities: ['Oliva', 'Pego'], total: 486 };
const CLIENTS = [{ id: 1, name: 'Alicia Server Mas', postal_code: '03780', city: 'Pego', province: 'Alicante' }];

vi.mock('../hooks/useFetch.js', () => ({
    useFetch: (url) => ({ data: url.endsWith('/options') ? OPTIONS : CLIENTS, loading: false, error: null, refetch: () => {} })
}));

describe('Clients', () => {
    it('al pasar de móvil a escritorio no pierde los filtros puestos', () => {
        screenSize.mobile = true;
        const { rerender } = render(<Clients title="Clientes" />);
        fireEvent.change(screen.getByLabelText('Provincia'), { target: { value: 'Alicante' } });
        fireEvent.change(screen.getByLabelText('Buscar clientes'), { target: { value: 'ali' } });

        screenSize.mobile = false;
        rerender(<Clients title="Clientes" />);

        expect(screen.getByLabelText('Provincia')).toHaveValue('Alicante');
        expect(screen.getByLabelText('Buscar clientes')).toHaveValue('ali');
        expect(screen.getByPlaceholderText('Buscar por nombre o código postal')).toBeInTheDocument();
    });

    it('en escritorio la barra va dentro de la tarjeta y en móvil fuera de ella', () => {
        screenSize.mobile = false;
        const { unmount } = render(<Clients title="Clientes" />);
        expect(screen.getByLabelText('Provincia').closest('.data-card')).not.toBeNull();
        unmount();

        screenSize.mobile = true;
        render(<Clients title="Clientes" />);
        expect(screen.getByLabelText('Provincia').closest('.data-card')).toBeNull();
    });
});