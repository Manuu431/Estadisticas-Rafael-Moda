import { describe, expect, it } from 'vitest';
import { clientInitials, clientMeta } from './clientsList.js';

describe('clientInitials', () => {
    it('toma la primera letra de las dos primeras palabras', () => {
        expect(clientInitials('Alicia Server Mas')).toBe('AS');
        expect(clientInitials('Amparo Llorca Ferrer')).toBe('AL');
        expect(clientInitials('Inmaculada Costa Frau')).toBe('IC');
    });

    it('con una sola palabra, una sola letra', () => {
        expect(clientInitials('Madonna')).toBe('M');
    });

    it('con dos palabras, las dos', () => {
        expect(clientInitials('Enrique Gil')).toBe('EG');
    });

    it('conserva la tilde de la inicial y la pasa a mayúscula', () => {
        expect(clientInitials('Álvaro Gil Moll')).toBe('ÁG');
        expect(clientInitials('andrés martí roig')).toBe('AM');
        expect(clientInitials('Óscar Úbeda')).toBe('ÓÚ');
    });

    it('ignora los espacios de más', () => {
        expect(clientInitials('   Beatriz    Sanchis  Pla ')).toBe('BS');
        expect(clientInitials('Carmen\tFerrer')).toBe('CF');
    });

    it('sin nombre, no devuelve nada', () => {
        expect(clientInitials('')).toBe('');
        expect(clientInitials('   ')).toBe('');
        expect(clientInitials(null)).toBe('');
        expect(clientInitials(undefined)).toBe('');
    });
});

const client = (city, province, postal_code) => ({ city, province, postal_code });

describe('clientMeta', () => {
    it('una ciudad de Valencia lleva solo la ciudad y el código postal', () => {
        expect(clientMeta(client('Oliva', 'Valencia', '46780'))).toBe('Oliva · 46780');
        expect(clientMeta(client('Tavernes de la Valldigna', 'Valencia', '46760'))).toBe('Tavernes de la Valldigna · 46760');
    });

    it('si la provincia es otra, va entre paréntesis detrás de la ciudad', () => {
        expect(clientMeta(client('Pego', 'Alicante', '03780'))).toBe('Pego (Alicante) · 03780');
        expect(clientMeta(client('Dénia', 'Alicante', '03700'))).toBe('Dénia (Alicante) · 03700');
    });

    it('si la ciudad se llama como su provincia, no se repite', () => {
        expect(clientMeta(client('Valencia', 'Valencia', '46004'))).toBe('Valencia · 46004');
        expect(clientMeta(client('Madrid', 'Madrid', '28014'))).toBe('Madrid · 28014');
        expect(clientMeta(client('Alicante', 'Alicante', '03001'))).toBe('Alicante · 03001');
    });

    it('conserva el cero inicial del código postal', () => {
        expect(clientMeta(client('Pego', 'Alicante', '03780'))).toContain('03780');
    });

    it('lo que falte se omite sin dejar separadores sueltos', () => {
        expect(clientMeta(client('Oliva', 'Valencia', null))).toBe('Oliva');
        expect(clientMeta(client('Oliva', 'Valencia', ''))).toBe('Oliva');
        expect(clientMeta(client(null, 'Alicante', '03780'))).toBe('Alicante · 03780');
        expect(clientMeta(client(null, null, '03780'))).toBe('03780');
        expect(clientMeta(client(null, null, null))).toBe('');
    });

    it('con la ciudad y sin provincia, solo la ciudad', () => {
        expect(clientMeta(client('Pego', null, '03780'))).toBe('Pego · 03780');
    });
});