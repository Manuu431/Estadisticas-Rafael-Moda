const MONEY = { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' };
export const formatNumber = (value) => value.toLocaleString('es-ES', { useGrouping: 'always' });
export const formatMoney = (cents) => `${(cents / 100).toLocaleString('es-ES', MONEY)}\u00a0€`;
export const formatEuros = (value) => `${Number(value ?? 0).toLocaleString('es-ES', MONEY)}\u00a0€`;
export const formatEurosRound = (value) => `${Math.round(Number(value ?? 0)).toLocaleString('es-ES', { useGrouping: 'always' })}\u00a0€`;
const PERCENT = { minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: 'always' };
export const formatShare = (value, total) => `${(total > 0 ? (value / total) * 100 : 0).toLocaleString('es-ES', PERCENT)} %`;
export const percentDirection = (value) => {
    const shown = Math.round(value * 10) / 10;
    if (shown === 0) return 'flat';
    return shown > 0 ? 'up' : 'down';
};
export const formatPercent = (value) => {
    const sign = { up: '+', down: '−', flat: '' }[percentDirection(value)];
    return `${sign}${Math.abs(value).toLocaleString('es-ES', PERCENT)} %`;
};
export const formatEurosSigned = (value, { round = false } = {}) => (value < 0 ? '\u2212' : '+') + (round ? formatEurosRound : formatEuros)(Math.abs(value));
export const formatSalesLines = (lines) => formatNumber(lines) + (lines === 1 ? ' línea' : ' líneas') + ' de venta';
export const formatUnits = (units) => formatNumber(units) + ' prenda' + (units === 1 ? '' : 's');
export const formatClientsRegistered = (clients) => formatNumber(clients) + (clients === 1 ? ' cliente registrado' : ' clientes registrados');
export const barWidth = (value, total) => ({ '--w': `${total > 0 ? (value / total) * 100 : 0}%` });
export const barHeight = (value, peak, slot = 4.75) => ({ '--h': `${peak > 0 && value > 0 ? Math.max(0.25, Math.round((value / peak) * slot * 16) / 16) : 0.1875}rem` });
export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
export const round2 = (value) => Math.round(value * 100) / 100;