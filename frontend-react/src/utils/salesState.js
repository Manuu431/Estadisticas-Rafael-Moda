export const EMPTY_MESSAGE = 'No hay ventas con estos filtros.';
export const TODAY_MESSAGE = 'Todavía no hay ventas hoy.';

export function salesState({ data, settled, error, period, filters }) {
    if (error) return { kind: 'error' };
    if (data === null || settled === false) return { kind: 'loading' };
    if (data.length > 0) return { kind: 'ready' };
    const onlyToday = period.key === 'hoy' && Object.keys(filters).length === 0;
    return { kind: 'empty', message: onlyToday ? TODAY_MESSAGE : EMPTY_MESSAGE };
}