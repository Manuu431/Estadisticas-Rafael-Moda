import { describe, expect, it } from 'vitest';
import { EMPTY_PANEL, panelParams } from './salesPanel.js';

describe('EMPTY_PANEL', () => {
    it('empieza sin ningún filtro puesto', () => {
        expect(panelParams(EMPTY_PANEL)).toEqual({});
    });
});

describe('panelParams', () => {
    it('manda solo los campos rellenos', () => {
        const panel = { ...EMPTY_PANEL, family: 'Camisas', color: 'Azul marino' };
        expect(panelParams(panel)).toEqual({ family: 'Camisas', color: 'Azul marino' });
    });

    it('traduce los rangos a _min y _max de la columna que filtran', () => {
        const panel = { ...EMPTY_PANEL, priceFrom: '50', priceTo: '120', profitFrom: '10', profitTo: '60' };
        expect(panelParams(panel)).toEqual({ unit_price_min: '50', unit_price_max: '120', profit_min: '10', profit_max: '60' });
    });

    it('admite un rango abierto por un lado', () => {
        expect(panelParams({ ...EMPTY_PANEL, priceFrom: '100' })).toEqual({ unit_price_min: '100' });
        expect(panelParams({ ...EMPTY_PANEL, profitTo: '30' })).toEqual({ profit_max: '30' });
    });

    it('conserva el 0 como valor, no como campo vacío', () => {
        expect(panelParams({ ...EMPTY_PANEL, profitFrom: '0' })).toEqual({ profit_min: '0' });
    });

    it('admite beneficios negativos', () => {
        expect(panelParams({ ...EMPTY_PANEL, profitTo: '-5' })).toEqual({ profit_max: '-5' });
    });

    it('ignora los espacios en blanco', () => {
        expect(panelParams({ ...EMPTY_PANEL, family: '  ', priceFrom: ' ' })).toEqual({});
    });
});
