import { fireEvent, screen, within } from '@testing-library/react';

export const dropdown = (label) => screen.getByRole('button', { name: new RegExp(`^${label}:`) });

export const chosen = (label) => dropdown(label).getAttribute('aria-label').replace(`${label}: `, '');

export const pickOption = (label, option) => {
    const toggle = dropdown(label);
    fireEvent.click(toggle);
    fireEvent.click(within(toggle.parentElement).getByRole('button', { name: option }));
};