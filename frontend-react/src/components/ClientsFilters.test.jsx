import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ClientsFilters from './ClientsFilters.jsx';

const OPTIONS = { provinces: ['Alicante', 'Valencia'], cities: ['Oliva', 'Pego'], total: 486 };

const setup = () => {
    const onFilterChange = vi.fn();
    render(<ClientsFilters options={OPTIONS} loading={false} onFilterChange={onFilterChange} />);
    return { lastFilters: () => onFilterChange.mock.calls.at(-1)[0] };
};

const pick = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
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
        expect(screen.getByLabelText('Provincia')).toHaveValue('');
        expect(screen.getByLabelText('Ciudad')).toHaveValue('');
        expect(lastFilters()).toEqual({});
        expect(clearButton()).not.toBeInTheDocument();
    });
});