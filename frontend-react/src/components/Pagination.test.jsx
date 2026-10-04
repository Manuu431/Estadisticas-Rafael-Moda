import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Pagination from './Pagination.jsx';

const NBSP = String.fromCharCode(160);
const text = (container) => container.textContent.split(NBSP).join(' ');

const setup = (props = {}) => {
    const onPageChange = vi.fn();
    const view = render(
        <Pagination currentPage={1} totalPages={16} onPageChange={onPageChange} totalItems={185} pageSize={12} itemLabel="líneas" edges {...props} />
    );
    return { onPageChange, ...view };
};

const button = (name) => screen.getByRole('button', { name });

describe('Pagination, texto', () => {
    it('dice qué líneas se ven y cuántas hay en total', () => {
        const { container } = setup();
        expect(text(container)).toContain('Mostrando 1–12 de 185 líneas');
        expect(text(container)).toContain('Página 1 de 16');
    });

    it('en la última página el rango acaba en el total', () => {
        const { container } = setup({ currentPage: 16 });
        expect(text(container)).toContain('Mostrando 181–185 de 185 líneas');
    });

    it('agrupa los miles en todos los números, también en el rango', () => {
        const { container } = setup({ currentPage: 84, totalPages: 1270, totalItems: 15229 });
        expect(text(container)).toContain('Mostrando 997–1.008 de 15.229 líneas');
        expect(text(container)).toContain('Página 84 de 1.270');
    });

    it('sin elementos dice 0–0 y una sola página', () => {
        const { container } = setup({ totalItems: 0, totalPages: 0 });
        expect(text(container)).toContain('Mostrando 0–0 de 0 líneas');
        expect(text(container)).toContain('Página 1 de 1');
    });

    it('resalta el número de página actual', () => {
        setup({ currentPage: 3 });
        expect(screen.getByText('3')).toHaveClass('data-page-current');
    });
});

describe('Pagination, botones', () => {
    it('pone primera, anterior, siguiente y última en ese orden', () => {
        setup({ currentPage: 5 });
        const names = screen.getAllByRole('button').map((item) => item.getAttribute('aria-label'));
        expect(names).toEqual(['Primera página', 'Página anterior', 'Página siguiente', 'Última página']);
    });

    it('en la primera página están desactivados primera y anterior', () => {
        setup();
        expect(button('Primera página')).toBeDisabled();
        expect(button('Página anterior')).toBeDisabled();
        expect(button('Página siguiente')).toBeEnabled();
        expect(button('Última página')).toBeEnabled();
    });

    it('en la última página están desactivados siguiente y última', () => {
        setup({ currentPage: 16 });
        expect(button('Página siguiente')).toBeDisabled();
        expect(button('Última página')).toBeDisabled();
        expect(button('Primera página')).toBeEnabled();
        expect(button('Página anterior')).toBeEnabled();
    });

    it('en una página del medio están todos activos', () => {
        setup({ currentPage: 8 });
        screen.getAllByRole('button').forEach((item) => expect(item).toBeEnabled());
    });

    it('cada botón lleva a su página', () => {
        const { onPageChange } = setup({ currentPage: 8 });
        fireEvent.click(button('Primera página'));
        expect(onPageChange).toHaveBeenLastCalledWith(1);
        fireEvent.click(button('Página anterior'));
        expect(onPageChange).toHaveBeenLastCalledWith(7);
        fireEvent.click(button('Página siguiente'));
        expect(onPageChange).toHaveBeenLastCalledWith(9);
        fireEvent.click(button('Última página'));
        expect(onPageChange).toHaveBeenLastCalledWith(16);
    });

    it('con una sola página están todos desactivados', () => {
        setup({ totalPages: 1, totalItems: 5 });
        screen.getAllByRole('button').forEach((item) => expect(item).toBeDisabled());
    });

    it('usa los iconos de doble flecha en los extremos', () => {
        const { container } = setup();
        expect(container.querySelector('.bi-chevron-double-left')).toBeInTheDocument();
        expect(container.querySelector('.bi-chevron-double-right')).toBeInTheDocument();
    });

    it('sin edges (móvil) no muestra primera ni última', () => {
        setup({ edges: false });
        const names = screen.getAllByRole('button').map((item) => item.getAttribute('aria-label'));
        expect(names).toEqual(['Página anterior', 'Página siguiente']);
    });
});