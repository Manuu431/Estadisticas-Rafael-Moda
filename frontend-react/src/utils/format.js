export const formatNumber = (value) => value.toLocaleString('es-ES');
export const formatMoney = (cents) => `${(cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\u00a0€`;
export const formatEuros = (value) => `${Number(value ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\u00a0€`;
export const formatEurosRound = (value) => `${Math.round(Number(value ?? 0)).toLocaleString('es-ES')}\u00a0€`;
export const formatShare = (value, total) => `${(total > 0 ? (value / total) * 100 : 0).toLocaleString('es-ES', { maximumFractionDigits: 1 })} %`;
export const barWidth = (value, total) => ({ width: `${total > 0 ? (value / total) * 100 : 0}%` });