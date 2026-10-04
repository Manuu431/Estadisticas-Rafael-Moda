import { endOfMonth, format, isSameMonth, isSameYear, startOfDay, startOfMonth, parseISO, startOfYear, subDays, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export const COMPARABLE_DAY_OFFSET = 364;

const SHORT_MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const shortDay = (date, withYear) => {
    const month = SHORT_MONTHS[date.getMonth()];
    return withYear ? `${date.getDate()} ${month}. ${date.getFullYear()}` : `${date.getDate()} ${month}`;
};

export function lastSevenDays(today) {
    const to = startOfDay(today);
    return { from: subDays(to, 6), to };
}

export function shiftYear(date) {
    return subDays(startOfDay(date), COMPARABLE_DAY_OFFSET);
}

export function formatShortDay(date) {
    return shortDay(date, false);
}

export function formatLongRange(from, to) {
    const start = isSameMonth(from, to) ? format(from, 'd') : format(from, "d 'de' MMMM", { locale: es });
    return `Del ${start} al ${format(to, "d 'de' MMMM", { locale: es })}`;
}

export function formatShortRange(from, to) {
    const sameYear = isSameYear(from, to);
    return `${shortDay(from, !sameYear)} – ${shortDay(to, true)}`;
}

export function formatCompactRange(from, to) {
    return shortDay(from, false) + " – " + shortDay(to, false);
}

export function formatDayTick(date) {
    return format(date, 'EEE d', { locale: es });
}

export function lastFinishedMonth(today) {
    const start = startOfMonth(subMonths(startOfDay(today), 1));
    return { start, end: startOfDay(endOfMonth(start)) };
}

export function formatMonthTitle(date) {
    const name = format(date, 'MMMM', { locale: es });
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export function formatMonthOfYear(date) {
    return format(date, "MMMM 'de' yyyy", { locale: es });
}

export function formatMonthYear(date) {
    return format(date, 'MMMM yyyy', { locale: es });
}

export function periodRange(period, today) {
    const to = startOfDay(today);
    if (period === '7d') return lastSevenDays(to);
    if (period === 'mes') return { from: startOfMonth(to), to };
    if (period === 'ano') return { from: startOfYear(to), to };
    return { from: to, to };
}

export function periodSubtitle(period, range) {
    if (period === '7d') return formatLongRange(range.from, range.to);
    if (period === 'mes') return `${formatMonthTitle(range.from)}, hasta el día ${range.to.getDate()}`;
    if (period === 'ano') return `En ${range.to.getFullYear()}, hasta hoy`;
    return `Hoy, ${format(range.to, "EEEE d 'de' MMMM", { locale: es })}`;
}
export function apiDate(date) {
    return format(startOfDay(date), 'yyyy-MM-dd');
}

export function yearChartRange(month, today) {
    const from = startOfYear(month.start);
    return { from, to: isSameYear(month.start, today) ? startOfDay(today) : month.end };
}

export function formatSaleDay(value, today) {
    const date = parseISO(value);
    return shortDay(date, !isSameYear(date, today));
}

export const formatSaleTime = (soldAt) => (typeof soldAt === 'string' ? soldAt.slice(11, 16) : '');