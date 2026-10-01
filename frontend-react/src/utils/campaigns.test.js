import { describe, expect, it } from 'vitest';
import { campaignProgress, currentCampaign, nextCampaigns, previousEdition, remainingLabel } from './campaigns.js';

const campaign = (id, typeId, start, end) => ({ id, period_type_id: typeId, start_date: start, end_date: end });

const otono26 = campaign(36, 6, '2026-09-15', '2026-10-12');
const otono25 = campaign(30, 6, '2025-09-15', '2025-10-12');
const black26 = campaign(43, 7, '2026-11-27', '2026-11-30');
const black25 = campaign(42, 7, '2025-11-27', '2025-11-30');
const navidad26 = campaign(50, 8, '2026-12-05', '2027-01-06');
const campaigns = [navidad26, black26, otono26, black25, otono25];

const hoy = new Date(2026, 9, 1);

describe('currentCampaign', () => {
    it('devuelve la campaña que contiene el día de hoy', () => {
        expect(currentCampaign(campaigns, hoy)).toBe(otono26);
    });

    it('incluye el primer y el último día', () => {
        expect(currentCampaign(campaigns, new Date(2026, 8, 15))).toBe(otono26);
        expect(currentCampaign(campaigns, new Date(2026, 9, 12))).toBe(otono26);
    });

    it('devuelve null cuando no hay ninguna en curso', () => {
        expect(currentCampaign(campaigns, new Date(2026, 9, 13))).toBe(null);
    });
});

describe('nextCampaigns', () => {
    it('devuelve las que aún no han empezado, de la más cercana a la más lejana', () => {
        expect(nextCampaigns(campaigns, hoy)).toEqual([black26, navidad26]);
    });

    it('no devuelve más de las que se le piden', () => {
        expect(nextCampaigns(campaigns, hoy, 1)).toEqual([black26]);
    });

    it('deja fuera la que está en curso', () => {
        expect(nextCampaigns(campaigns, hoy).includes(otono26)).toBe(false);
    });
});

describe('previousEdition', () => {
    it('devuelve la edición anterior de la misma campaña', () => {
        expect(previousEdition(campaigns, black26)).toBe(black25);
        expect(previousEdition(campaigns, otono26)).toBe(otono25);
    });

    it('devuelve null si es la primera edición', () => {
        expect(previousEdition(campaigns, navidad26)).toBe(null);
    });
});

describe('campaignProgress', () => {
    it('con el ejemplo del diseño, va por el día 14 de 28', () => {
        const progress = campaignProgress(otono26, new Date(2026, 8, 28));
        expect(progress).toEqual({ day: 14, total: 28, remaining: 14, percent: 50 });
    });

    it('cuenta los dos extremos', () => {
        expect(campaignProgress(otono26, new Date(2026, 8, 15))).toMatchObject({ day: 1, remaining: 27 });
        expect(campaignProgress(otono26, new Date(2026, 9, 12))).toMatchObject({ day: 28, remaining: 0, percent: 100 });
    });
});

describe('remainingLabel', () => {
    it('concuerda el singular y el plural', () => {
        expect(remainingLabel(14)).toBe('Quedan 14 días');
        expect(remainingLabel(1)).toBe('Queda 1 día');
        expect(remainingLabel(0)).toBe('Último día');
    });
});