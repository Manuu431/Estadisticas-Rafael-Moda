export const EMPTY_PANEL = { family: '', size: '', color: '', priceFrom: '', priceTo: '', profitFrom: '', profitTo: '' };

const PARAMS = {
    family: 'family',
    size: 'size',
    color: 'color',
    priceFrom: 'unit_price_min',
    priceTo: 'unit_price_max',
    profitFrom: 'profit_min',
    profitTo: 'profit_max'
};

export function panelParams(panel) {
    const params = {};
    Object.entries(PARAMS).forEach(([field, param]) => {
        const value = (panel[field] ?? '').trim();
        if (value !== '') params[param] = value;
    });
    return params;
}