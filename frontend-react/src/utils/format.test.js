import { describe, expect, it } from 'vitest';
import { formatClientsRegistered, formatEuros, formatEurosSigned, formatMoney, formatNumber, formatPercent, formatSalesLines, formatShare, formatUnits } from './format.js';

describe('formatEuros', () => {
    it('agrupa los miles también con cuatro cifras', () => {
        expect(formatEuros(4902.21)).toBe('4.902,21\u00a0€');
        expect(formatEuros(19284.6)).toBe('19.284,60\u00a0€');
    });

    it('deja dos decimales siempre', () => {
        expect(formatEuros(621.87)).toBe('621,87\u00a0€');
        expect(formatEuros(0)).toBe('0,00\u00a0€');
    });
});

describe('formatMoney', () => {
    it('convierte céntimos y agrupa los miles', () => {
        expect(formatMoney(490221)).toBe('4.902,21\u00a0€');
    });
});

describe('formatNumber', () => {
    it('agrupa los miles', () => {
        expect(formatNumber(1305)).toBe('1.305');
    });
});

describe('formatShare', () => {
    it('deja siempre un decimal, como el diseño', () => {
        expect(formatShare(3723.39, 4902.21)).toBe('76,0 %');
        expect(formatShare(1178.82, 4902.21)).toBe('24,0 %');
        expect(formatShare(1, 3)).toBe('33,3 %');
    });

    it('devuelve cero cuando no hay total', () => {
        expect(formatShare(0, 0)).toBe('0,0 %');
    });
});

describe('formatPercent', () => {
    it('lleva signo y un decimal', () => {
        expect(formatPercent(9.945)).toBe('+9,9 %');
        expect(formatPercent(10)).toBe('+10,0 %');
        expect(formatPercent(-12)).toBe('\u221212,0 %');
    });
});

describe('formatUnits', () => {
    it('concuerda el singular y el plural', () => {
        expect(formatUnits(1)).toBe('1 prenda');
        expect(formatUnits(3)).toBe('3 prendas');
        expect(formatUnits(0)).toBe('0 prendas');
        expect(formatUnits(1200)).toBe('1.200 prendas');
    });
});

describe('formatSalesLines', () => {
    it('concuerda el singular y el plural', () => {
        expect(formatSalesLines(1)).toBe('1 línea de venta');
        expect(formatSalesLines(185)).toBe('185 líneas de venta');
        expect(formatSalesLines(0)).toBe('0 líneas de venta');
        expect(formatSalesLines(15229)).toBe('15.229 líneas de venta');
    });
});

describe('formatClientsRegistered', () => {
    it('concuerda el singular y el plural', () => {
        expect(formatClientsRegistered(1)).toBe('1 cliente registrado');
        expect(formatClientsRegistered(486)).toBe('486 clientes registrados');
        expect(formatClientsRegistered(0)).toBe('0 clientes registrados');
    });

    it('agrupa los miles', () => {
        expect(formatClientsRegistered(1205)).toBe('1.205 clientes registrados');
    });
});

describe('formatEurosSigned', () => {
    it('pone el signo delante y deja los dos decimales', () => {
        expect(formatEurosSigned(5392.47)).toBe('+5.392,47\u00a0€');
        expect(formatEurosSigned(-368.8)).toBe('\u2212368,80\u00a0€');
    });

    it('redondea cuando se le pide', () => {
        expect(formatEurosSigned(3960.4, { round: true })).toBe('+3.960\u00a0€');
        expect(formatEurosSigned(-1200, { round: true })).toBe('−1.200\u00a0€');
        expect(formatEurosSigned(0, { round: true })).toBe('+0\u00a0€');
    });
});