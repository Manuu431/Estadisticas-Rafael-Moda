import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ClientsFilters from './ClientsFilters.jsx';
import { chosen, pickOption } from '../test/dropdown.js';

const OPTIONS = { provinces: ['Alicante', 'Valencia'], cities: ['Oliva', 'Pego'], total: 486 };

const setup = () => {
    const onFilterChange = vi.fn();
    render(<ClientsFilters options={OPTIONS} onFilterChange={onFilterChange} />);
    return { lastFilters: () => onFilterChange.mock.calls.at(-1)[0] };
};

afterEach(() => {
    vi.useRealTimers();
});

const pick = (label, value) => pickOption(label, value || 'Todas');
const clearButton = () => screen.queryByRole('button', { name: 'Limpiar filtros' });

describe('ClientsFilters, «Limpiar filtros»', () => {
    it('no sale mientras no haya ningún filtro puesto', () => {
        setup();
        expect(clearButton()).not.toBeInTheDocument();
    });

    it('sale al elegir una provincia, una ciudad o escribir en el buscador', () => {
        setup();
        pick('Provincia', 'Alicante');
        expect(clearButton()).toBeInTheDocument();
        pick('Provincia', '');
        expect(clearButton()).not.toBeInTheDocument();
        pick('Ciudad', 'Pego');
        expect(clearButton()).toBeInTheDocument();
        pick('Ciudad', '');
        fireEvent.change(screen.getByLabelText('Buscar clientes'), { target: { value: 'ali' } });
        expect(clearButton()).toBeInTheDocument();
    });

    it('vacía el buscador y los dos desplegables y avisa de que ya no hay filtros', () => {
        const { lastFilters } = setup();
        pick('Provincia', 'Alicante');
        pick('Ciudad', 'Pego');
        fireEvent.change(screen.getByLabelText('Buscar clientes'), { target: { value: 'ali' } });
        fireEvent.click(clearButton());
        expect(screen.getByLabelText('Buscar clientes')).toHaveValue('');
        expect(chosen('Provincia')).toBe('Todas');
        expect(chosen('Ciudad')).toBe('Todas');
        expect(lastFilters()).toEqual({});
        expect(clearButton()).not.toBeInTheDocument();
    });
});

describe('ClientsFilters, coherencia entre los filtros', () => {
    it('sin nada que limpiar, un espacio suelto en el buscador no cuenta como filtro', () => {
        setup();
        fireEvent.change(screen.getByLabelText('Buscar clientes'), { target: { value: '   ' } });
        expect(clearButton()).not.toBeInTheDocument();
    });

    it('al elegir otra provincia, la ciudad se vacía antes de pedir la lista', () => {
        const { lastFilters } = setup();
        pick('Provincia', 'Alicante');
        pick('Ciudad', 'Pego');
        expect(lastFilters()).toEqual({ province: 'Alicante', city: 'Pego' });
        pick('Provincia', 'Valencia');
        expect(chosen('Ciudad')).toBe('Todas');
        expect(lastFilters()).toEqual({ province: 'Valencia' });
    });

    it('al volver a «Todas» las provincias, la ciudad elegida se conserva', () => {
        const { lastFilters } = setup();
        pick('Provincia', 'Alicante');
        pick('Ciudad', 'Pego');
        pick('Provincia', '');
        expect(chosen('Ciudad')).toBe('Pego');
        expect(lastFilters()).toEqual({ city: 'Pego' });
    });

    it('«Limpiar filtros» quita también el texto del buscador de la consulta, sin esperar los 300 ms', () => {
        vi.useFakeTimers();
        const { lastFilters } = setup();
        fireEvent.change(screen.getByLabelText('Buscar clientes'), { target: { value: 'ana' } });
        act(() => vi.advanceTimersByTime(300));
        expect(lastFilters()).toEqual({ search: 'ana' });
        fireEvent.click(clearButton());
        expect(lastFilters()).toEqual({});
    });
});