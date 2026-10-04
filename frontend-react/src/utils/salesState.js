export const EMPTY_MESSAGE = 'No hay ventas con estos filtros.';
export const TODAY_MESSAGE = 'Todavía no hay ventas hoy.';

export function salesState({ data, error, period, filters }) {
    if (data === null) return { kind: error ? 'error' : 'loading' };
    if (data.length > 0) return { kind: 'ready' };
    const onlyToday = period.key === 'hoy' && Object.keys(filters).length === 0;
    return { kind: 'empty', message: onlyToday ? TODAY_MESSAGE : EMPTY_MESSAGE };
}