import { format, isBefore, isSameDay, isSameMonth, isSameYear, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatLongRange, formatMonthOfYear, periodRange } from './dates.js';

export const SALES_PERIODS = [
    { value: 'hoy', label: 'Hoy' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: 'mes', label: 'Este mes' },
    { value: 'ano', label: 'Este año' },
    { value: 'custom', label: 'Personalizado…' }
];

export const DEFAULT_SALES_PERIOD = { key: 'mes', from: '', to: '' };

const capitalize =(text) => text.charAt(0).toUpperCase() + text.slice(1);
const dayMonth = (date) => format(date, "d 'de' MMMM", { locale: es });
const dayMonthYear = (date) => format(date, "d 'de' MMMM 'de' yyyy", { locale: es });

export function salesPeriodRange({ key, from, to }, today) {
    if (key !== 'custom') return periodRange(key, today);
    if (!from || !to) return null;
    const range = { from: parseISO(from), to: parseISO(to) };
    return isBefore(range.to, range.from) ? null : range;
}

export function customPeriodError({ key, from, to }) {
    if (key !== 'custom' || !from || !to) return null;
    return isBefore(parseISO(to), parseISO(from)) ? '«Desde» no puede ser posterior a «Hasta».' : null;
}

function customLabel({ from, to }) {
    if (isSameDay(from, to)) return dayMonthYear(from);
    if (!isSameYear(from, to)) return `Del ${dayMonthYear(from)} al ${dayMonthYear(to)}`;
    if (isSameMonth(from, to)) return `Del ${format(from, 'd')} al ${dayMonthYear(to)}`;
    return `Del ${dayMonth(from)} al ${dayMonthYear(to)}`;
}

export function salesPeriodLabel(key, { from, to }) {
    const oneDay = isSameDay(from, to);
    if (key === 'mes') return `${capitalize(formatMonthOfYear(from))} · ${oneDay ? `día ${to.getDate()}` : `del ${from.getDate()} al ${to.getDate()}`}`;
    if (key === 'hoy') return capitalize(format(to, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }));
    if (key === '7d') return formatLongRange(from, to);
    if (key === 'ano') return `${to.getFullYear()} · ${oneDay ? dayMonth(to) : `del ${dayMonth(from)} al ${dayMonth(to)}`}`;
    return customLabel({ from, to });
}