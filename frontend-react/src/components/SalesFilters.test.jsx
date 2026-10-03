import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import SalesFilters from './SalesFilters.jsx';
import { DEFAULT_SALES_PERIOD } from '../utils/salesPeriod.js';

const OPTIONS = {
    brands: ['Escorpión', 'Lois'],
    families: ['Abrigos', 'Camisas'],
    colors: ['Azul marino', 'Negro'],
    sizes: ['S', 'M', '38', 'Única']
};

vi.mock('../hooks/useFetch.js', () => ({ useFetch: () => ({ data: OPTIONS }) }));

const setup = () => {
    const onFilterChange = vi.fn();
    render(<SalesFilters period={DEFAULT_SALES_PERIOD} onPeriodChange={vi.fn()} onFilterChange={onFilterChange} />);
    const lastFilters = () => onFilterChange.mock.calls.at(-1)[0];
    return { lastFilters };
};

const openPanel = () => fireEvent.click(screen.getByRole('button', { name: /Más filtros/ }));
const pick = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const click = (name) => fireEvent.click(screen.getByRole('button', { name }));

describe('SalesFilters, panel «Más filtros»', () => {
    it('está cerrado al empezar y no lleva «Limpiar» ni «Filtrar» en la barra', () => {
        setup();
        expect(screen.queryByLabelText('Familia')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Filtrar' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Limpiar' })).not.toBeInTheDocument();
    });

    it('trae los cinco campos en orden, sin ID ni Descuento', () => {
        setup();
        openPanel();
        const panel = document.getElementById('more-filters');
        const labels = [...panel.querySelectorAll('.sales-panel-label')].map((label) => label.textContent);
        expect(labels).toEqual(['Familia', 'Talla', 'Color', 'Precio de venta (€)', 'Beneficio (€)']);
        expect(within(panel).queryByText('ID')).not.toBeInTheDocument();
        expect(within(panel).queryByText('Descuento')).not.toBeInTheDocument();
    });

    it('los desplegables empiezan por «Todas» o «Todos» y siguen con las opciones del servidor', () => {
        setup();
        openPanel();
        const optionsOf = (label) => [...screen.getByLabelText(label).querySelectorAll('option')].map((option) => option.textContent);
        expect(optionsOf('Familia')).toEqual(['Todas', 'Abrigos', 'Camisas']);
        expect(optionsOf('Talla')).toEqual(['Todas', 'S', 'M', '38', 'Única']);
        expect(optionsOf('Color')).toEqual(['Todos', 'Azul marino', 'Negro']);
    });

    it('no filtra hasta pulsar «Aplicar» y entonces aplica los cinco a la vez', () => {
        const { lastFilters } = setup();
        openPanel();
        pick('Familia', 'Camisas');
        pick('Talla', 'M');
        pick('Color', 'Negro');
        fireEvent.change(screen.getByLabelText('Precio de venta (€), desde'), { target: { value: '50' } });
        fireEvent.change(screen.getByLabelText('Beneficio (€), hasta'), { target: { value: '80' } });
        expect(lastFilters()).toEqual({});
        click('Aplicar');
        expect(lastFilters()).toEqual({ family: 'Camisas', size: 'M', color: 'Negro', unit_price_min: '50', profit_max: '80' });
    });

    it('«Limpiar filtros» vacía solo el panel y deja la barra como estaba', () => {
        const { lastFilters } = setup();
        pick('Marca', 'Lois');
        fireEvent.click(screen.getByRole('button', { name: 'Hombre' }));
        openPanel();
        pick('Familia', 'Abrigos');
        click('Aplicar');
        expect(lastFilters()).toEqual({ family: 'Abrigos', brand: 'Lois', section: 'hombre' });
        click('Limpiar filtros');
        expect(lastFilters()).toEqual({ brand: 'Lois', section: 'hombre' });
        expect(screen.getByLabelText('Familia')).toHaveValue('');
    });
});

describe('SalesFilters, barra', () => {
    it('Marca y la sección se aplican al momento, sin pulsar nada más', () => {
        const { lastFilters } = setup();
        pick('Marca', 'Escorpión');
        expect(lastFilters()).toEqual({ brand: 'Escorpión' });
        fireEvent.click(screen.getByRole('button', { name: 'Mujer' }));
        expect(lastFilters()).toEqual({ brand: 'Escorpión', section: 'mujer' });
        fireEvent.click(screen.getByRole('button', { name: 'Todo' }));
        expect(lastFilters()).toEqual({ brand: 'Escorpión' });
    });

    it('«Marca» empieza en «Todas» con todas las marcas del servidor', () => {
        setup();
        const options = [...screen.getByLabelText('Marca').querySelectorAll('option')].map((option) => option.textContent);
        expect(options).toEqual(['Todas', 'Escorpión', 'Lois']);
    });
});