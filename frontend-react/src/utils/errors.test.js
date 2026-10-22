import { describe, expect, it } from 'vitest';
import { DEMO_MESSAGE, writeError } from './errors.js';

describe('writeError', () => {
    it('en el modo demo explica que es de solo lectura', () => {
        expect(writeError({ response: { status: 403 } }, 'No se ha podido crear.')).toBe(DEMO_MESSAGE);
    });
    it('con cualquier otro fallo deja el mensaje de la pantalla', () => {
        expect(writeError({ response: { status: 500 } }, 'No se ha podido crear.')).toBe('No se ha podido crear.');
        expect(writeError(new Error('red'), 'No se ha podido crear.')).toBe('No se ha podido crear.');
    });
});