import { describe, expect, it } from 'vitest';
import { clientsState, EMPTY_MESSAGE } from './clientsState.js';

const client = { id: 1 };

describe('clientsState', () => {
    it('sin respuesta todavía y sin error, está cargando', () => {
        expect(clientsState({ data: null, error: null })).toEqual({ kind: 'loading' });
    });

    it('sin respuesta y con error, es un error de carga y no una carga eterna', () => {
        expect(clientsState({ data: null, error: new Error('x') })).toEqual({ kind: 'error' });
    });

    it('con clientes, está listo', () => {
        expect(clientsState({ data: [client], error: null })).toEqual({ kind: 'ready' });
    });

    it('si falla una recarga no enseña los clientes antiguos como si fueran el resultado', () => {
        expect(clientsState({ data: [client], error: new Error('x') })).toEqual({ kind: 'error' });
        expect(clientsState({ data: [], error: new Error('x') })).toEqual({ kind: 'error' });
    });

    it('sin clientes, dice que no hay clientes con estos filtros', () => {
        expect(clientsState({ data: [], error: null })).toEqual({ kind: 'empty', message: EMPTY_MESSAGE });
        expect(EMPTY_MESSAGE).toBe('No hay clientes con estos filtros.');
    });
});

describe('clientsState mientras llegan otros filtros', () => {
    it('con los datos del filtro anterior todavía en pantalla, está cargando', () => {
        expect(clientsState({ data: [client], settled: false, error: null }).kind).toBe('loading');
    });
});