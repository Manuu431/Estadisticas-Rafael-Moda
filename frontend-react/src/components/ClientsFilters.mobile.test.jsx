import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ClientsFilters from './ClientsFilters.jsx';
import { chosen, dropdown, pickOption } from '../test/dropdown.js';

const OPTIONS = { provinces: ['Alicante', 'Valencia'], cities: ['Oliva', 'Pego'], total: 486 };

beforeAll(() => {
    window.innerWidth = 375;
});

afterEach(() => {
    vi.useRealTimers();
});

const setup = () => {
    const onFilterChange = vi.fn();
    render(<ClientsFilters options={OPTIONS} onFilterChange={onFilterChange} />);
    return { lastFilters: () => onFilterChange.mock.calls.at(-1)[0] };
};

describe('ClientsFilters en móvil', () => {
    it('lleva el buscador con su texto corto, Provincia y Ciudad, sin botón «Filtros» ni hoja', () => {
        setup();
        expect(screen.getByPlaceholderText('Nombre o código postal')).toBeInTheDocument();
        expect(dropdown('Provincia')).toBeInTheDocument();
        expect(dropdown('Ciudad')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /^Filtros/ })).not.toBeInTheDocument();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('aplica Provincia y Ciudad al momento', () => {
        const { lastFilters } = setup();
        pickOption('Provincia', 'Alicante');
        expect(lastFilters()).toEqual({ province: 'Alicante' });
        pickOption('Ciudad', 'Pego');
        expect(lastFilters()).toEqual({ province: 'Alicante', city: 'Pego' });
    });

    it('aplica el buscador a los 300 ms de dejar de escribir', () => {
        vi.useFakeTimers();
        const { lastFilters } = setup();
        fireEvent.change(screen.getByLabelText('Buscar clientes'), { target: { value: 'ali' } });
        act(() => vi.advanceTimersByTime(299));
        expect(lastFilters()).toEqual({});
        act(() => vi.advanceTimersByTime(1));
        expect(lastFilters()).toEqual({ search: 'ali' });
    });

    it('«Limpiar filtros» sale con un filtro puesto y los vacía', () => {
        const { lastFilters } = setup();
        expect(screen.queryByRole('button', { name: 'Limpiar filtros' })).not.toBeInTheDocument();
        pickOption('Provincia', 'Valencia');
        fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
        expect(chosen('Provincia')).toBe('Todas');
        expect(lastFilters()).toEqual({});
    });
});