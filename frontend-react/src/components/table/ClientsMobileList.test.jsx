import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ClientsMobileList from './ClientsMobileList.jsx';

const makeRows = (count) =>
    Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: `Cliente ${index + 1} Apellido`,
        city: index % 2 ? 'Pego' : 'Oliva',
        province: index % 2 ? 'Alicante' : 'Valencia',
        postal_code: index % 2 ? '03780' : '46780'
    }));

const items = () => screen.getAllByRole('listitem');
const moreButton = () => screen.queryByRole('button', { name: /Ver más clientes/ });

describe('ClientsMobileList', () => {
    it('enseña los 10 primeros y el botón con los que faltan, con separador de miles', () => {
        render(<ClientsMobileList rows={makeRows(486)} />);
        expect(items()).toHaveLength(10);
        expect(moreButton()).toHaveTextContent('Ver más clientes (476)');
        render(<ClientsMobileList rows={makeRows(1215)} />);
        expect(screen.getByRole('button', { name: 'Ver más clientes (1.205)' })).toBeInTheDocument();
    });

    it('cada fila lleva las iniciales, el nombre y la segunda línea', () => {
        render(<ClientsMobileList rows={makeRows(2)} />);
        const [first, second] = items();
        expect(first).toHaveTextContent('C1');
        expect(first).toHaveTextContent('Cliente 1 Apellido');
        expect(first).toHaveTextContent('Oliva · 46780');
        expect(second).toHaveTextContent('Pego (Alicante) · 03780');
    });

    it('las iniciales son decorativas y no las lee el lector de pantalla', () => {
        render(<ClientsMobileList rows={makeRows(1)} />);
        expect(screen.getByText('C1')).toHaveAttribute('aria-hidden', 'true');
    });

    it('cada pulsación añade 10 y el botón baja con los que faltan', () => {
        render(<ClientsMobileList rows={makeRows(486)} />);
        fireEvent.click(moreButton());
        expect(items()).toHaveLength(20);
        expect(moreButton()).toHaveTextContent('Ver más clientes (466)');
    });

    it('al llegar al final el botón desaparece', () => {
        render(<ClientsMobileList rows={makeRows(25)} />);
        fireEvent.click(moreButton());
        expect(moreButton()).toHaveTextContent('(5)');
        fireEvent.click(moreButton());
        expect(items()).toHaveLength(25);
        expect(moreButton()).not.toBeInTheDocument();
    });

    it('con 10 clientes o menos no hay botón', () => {
        render(<ClientsMobileList rows={makeRows(10)} />);
        expect(items()).toHaveLength(10);
        expect(moreButton()).not.toBeInTheDocument();
    });

    it('al cambiar la lista (otro filtro) vuelve a los 10 primeros', () => {
        const { rerender } = render(<ClientsMobileList rows={makeRows(50)} />);
        fireEvent.click(moreButton());
        expect(items()).toHaveLength(20);
        rerender(<ClientsMobileList rows={makeRows(30)} />);
        expect(items()).toHaveLength(10);
        expect(moreButton()).toHaveTextContent('(20)');
    });
});