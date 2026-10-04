import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import SalesFilters from './SalesFilters.jsx';
import { DEFAULT_SALES_PERIOD } from '../utils/salesPeriod.js';

const OPTIONS = {
    brands: ['Escorpión', 'Lois'],
    families: ['Abrigos', 'Camisas'],
    colors: ['Azul marino', 'Negro'],
    sizes: ['S', 'M', '38', 'Única']
};

vi.mock('../hooks/useFetch.js', () => ({ useFetch: () => ({ data: OPTIONS }) }));

beforeAll(() => {
    window.innerWidth = 375;
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
});

const setup = () => {
    const onFilterChange = vi.fn();
    const onPeriodChange = vi.fn();
    render(<SalesFilters period={DEFAULT_SALES_PERIOD} onPeriodChange={onPeriodChange} onFilterChange={onFilterChange} />);
    const lastFilters = () => onFilterChange.mock.calls.at(-1)[0];
    return { lastFilters, onPeriodChange };
};

const openSheet = () => fireEvent.click(screen.getByRole('button', { name: /Filtros/ }));
const sheet = () => screen.getByRole('dialog');
const pick = (label, value) => fireEvent.change(within(sheet()).getByLabelText(label), { target: { value } });
const type = (label, value) => fireEvent.change(within(sheet()).getByLabelText(label), { target: { value } });
const press = (name) => fireEvent.click(within(sheet()).getByRole('button', { name }));

describe('SalesFilters en móvil, barra', () => {
    it('lleva buscador, Todo / Mujer / Hombre y «Filtros», sin «Más filtros»', () => {
        setup();
        expect(screen.getByLabelText('Buscar ventas')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Hombre' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Filtros/ })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Más filtros/ })).not.toBeInTheDocument();
    });

    it('la sección se aplica al momento', () => {
        const { lastFilters } = setup();
        fireEvent.click(screen.getByRole('button', { name: 'Mujer' }));
        expect(lastFilters()).toEqual({ section: 'mujer' });
    });

    it('el buscador se aplica 300 ms después de dejar de escribir', async () => {
        const { lastFilters } = setup();
        fireEvent.change(screen.getByLabelText('Buscar ventas'), { target: { value: 'escorpion' } });
        expect(lastFilters()).toEqual({});
        await waitFor(() => expect(lastFilters()).toEqual({ search: 'escorpion' }), { timeout: 1000 });
    });
});

describe('SalesFilters en móvil, hoja «Filtros»', () => {
    it('trae Periodo, Marca, Familia, Talla, Color, Precio y Beneficio, sin ID ni Descuento', () => {
        setup();
        openSheet();
        const labels = [...sheet().querySelectorAll('.sheet-label')].map((label) => label.textContent);
        expect(labels).toEqual(['Periodo', 'Marca', 'Familia', 'Talla', 'Color', 'Precio de venta (€)', 'Beneficio (€)']);
        expect(within(sheet()).queryByText('ID')).not.toBeInTheDocument();
        expect(within(sheet()).queryByText('Descuento')).not.toBeInTheDocument();
    });

    it('«Cerrar» y «Ver resultados» están en la hoja', () => {
        setup();
        openSheet();
        expect(within(sheet()).getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
        expect(within(sheet()).getByRole('button', { name: 'Ver resultados' })).toBeInTheDocument();
        expect(within(sheet()).getByRole('button', { name: 'Limpiar' })).toBeInTheDocument();
    });

    it('nada se aplica hasta pulsar «Ver resultados», y entonces se aplica todo a la vez', async () => {
        const { lastFilters, onPeriodChange } = setup();
        openSheet();
        pick('Marca', 'Lois');
        pick('Familia', 'Camisas');
        pick('Talla', 'M');
        pick('Color', 'Negro');
        type('Precio de venta (€), desde', '50');
        type('Beneficio (€), hasta', '80');
        pick('Periodo', 'ano');
        expect(lastFilters()).toEqual({});
        expect(onPeriodChange).not.toHaveBeenCalled();
        press('Ver resultados');
        expect(lastFilters()).toEqual({ family: 'Camisas', size: 'M', color: 'Negro', unit_price_min: '50', profit_max: '80', brand: 'Lois' });
        expect(onPeriodChange).toHaveBeenLastCalledWith({ key: 'ano', from: '', to: '' });
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 1500 });
    });

    it('«Personalizado…» enseña «Desde» y «Hasta» bajo el periodo', () => {
        setup();
        openSheet();
        expect(within(sheet()).queryByLabelText('Desde')).not.toBeInTheDocument();
        pick('Periodo', 'custom');
        expect(within(sheet()).getByLabelText('Desde')).toBeInTheDocument();
        expect(within(sheet()).getByLabelText('Hasta')).toBeInTheDocument();
    });

    it('«Limpiar» vacía toda la hoja, lo aplica y cierra, pero no toca la sección', async () => {
        const { lastFilters, onPeriodChange } = setup();
        fireEvent.click(screen.getByRole('button', { name: 'Hombre' }));
        openSheet();
        pick('Marca', 'Lois');
        pick('Familia', 'Camisas');
        pick('Periodo', 'ano');
        press('Ver resultados');
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 1500 });
        expect(lastFilters()).toEqual({ family: 'Camisas', brand: 'Lois', section: 'hombre' });
        openSheet();
        press('Limpiar');
        expect(lastFilters()).toEqual({ section: 'hombre' });
        expect(onPeriodChange).toHaveBeenLastCalledWith(DEFAULT_SALES_PERIOD);
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 1500 });
    });
});