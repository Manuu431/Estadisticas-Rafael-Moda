import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ClientsTable from './ClientsTable.jsx';

const clients = [
    { id: 4, name: 'Beatriz Sanchis Pla', postal_code: '03780', city: 'Pego', province: 'Alicante' },
    { id: 1, name: 'Alicia Server Mas', postal_code: '46780', city: 'Oliva', province: 'Valencia' }
];

describe('ClientsTable', () => {
    it('lleva las columnas Nombre, Ciudad, Provincia y CP, en ese orden y sin ID', () => {
        render(<ClientsTable data={clients} />);
        const headers = screen.getAllByRole('columnheader').map((cell) => cell.textContent);
        expect(headers).toEqual(['Nombre', 'Ciudad', 'Provincia', 'CP']);
    });

    it('pinta cada cliente en su fila con los datos en el orden de las columnas', () => {
        render(<ClientsTable data={clients} />);
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3);
        const cells = within(rows[1]).getAllByRole('cell').map((cell) => cell.textContent);
        expect(cells).toEqual(['Beatriz Sanchis Pla', 'Pego', 'Alicante', '03780']);
    });

    it('conserva el cero inicial del código postal', () => {
        render(<ClientsTable data={clients} />);
        expect(screen.getByText('03780')).toBeInTheDocument();
    });

    it('no ofrece botones para ordenar', () => {
        render(<ClientsTable data={clients} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});