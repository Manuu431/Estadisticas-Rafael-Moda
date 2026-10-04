export const EMPTY_MESSAGE = 'No hay clientes con estos filtros.';

export function clientsState({ data, error }) {
    if (error) return { kind: 'error' };
    if (data === null) return { kind: 'loading' };
    if (data.length > 0) return { kind: 'ready' };
    return { kind: 'empty', message: EMPTY_MESSAGE };
}