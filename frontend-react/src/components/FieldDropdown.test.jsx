import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import FieldDropdown from './FieldDropdown.jsx';

const OPTIONS = [
    { value: '', label: 'Todas' },
    { value: 'Alicante', label: 'Alicante' },
    { value: 'Valencia', label: 'Valencia' }
];

const setup = (props = {}) => {
    const onChange = vi.fn();
    render(<FieldDropdown label="Provincia" value="" options={OPTIONS} onChange={onChange} className="clients-province" {...props} />);
    return { onChange, toggle: screen.getByRole('button', { name: /^Provincia/ }) };
};

describe('FieldDropdown', () => {
    it('enseña la palabra del campo y la opción elegida', () => {
        const { toggle } = setup({ value: 'Valencia' });
        expect(within(toggle).getByText('Provincia')).toBeInTheDocument();
        expect(within(toggle).getByText('Valencia')).toBeInTheDocument();
    });

    it('el nombre accesible lleva la palabra y la opción elegida', () => {
        const { toggle } = setup({ value: 'Alicante' });
        expect(toggle).toHaveAccessibleName('Provincia: Alicante');
    });

    it('con un valor que no está en la lista enseña la primera opción', () => {
        const { toggle } = setup({ value: 'Sevilla' });
        expect(toggle).toHaveAccessibleName('Provincia: Todas');
    });

    it('se abre al pulsar en cualquier parte del campo, también sobre la palabra', () => {
        const { toggle } = setup();
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        fireEvent.click(within(toggle).getByText('Provincia'));
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('button', { name: 'Alicante' })).toBeInTheDocument();
    });

    it('lista todas las opciones y marca la elegida', () => {
        const { toggle } = setup({ value: 'Alicante' });
        fireEvent.click(toggle);
        const menu = toggle.parentElement;
        expect(within(menu).getAllByRole('button').slice(1).map((item) => item.textContent)).toEqual(['Todas', 'Alicante', 'Valencia']);
        expect(within(menu).getByRole('button', { name: 'Alicante' })).toHaveClass('active');
        expect(within(menu).getByRole('button', { name: 'Valencia' })).not.toHaveClass('active');
    });

    it('al elegir una opción avisa con su valor y se cierra', () => {
        const { toggle, onChange } = setup();
        fireEvent.click(toggle);
        fireEvent.click(screen.getByRole('button', { name: 'Valencia' }));
        expect(onChange).toHaveBeenCalledWith('Valencia');
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('«Todas» avisa con el valor vacío', () => {
        const { toggle, onChange } = setup({ value: 'Alicante' });
        fireEvent.click(toggle);
        fireEvent.click(screen.getByRole('button', { name: 'Todas' }));
        expect(onChange).toHaveBeenCalledWith('');
    });

    it('con valores que se parecen a un número no los confunde con su posición', () => {
        const onChange = vi.fn();
        render(<FieldDropdown label="Año" value="" options={[{ value: '', label: 'Todos' }, { value: '2', label: 'Dos' }, { value: '1', label: 'Uno' }]} onChange={onChange} />);
        fireEvent.click(screen.getByRole('button', { name: /^Año/ }));
        fireEvent.click(screen.getByRole('button', { name: 'Uno' }));
        expect(onChange).toHaveBeenCalledWith('1');
    });
});