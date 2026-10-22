export const PAGE_SIZE = 12;

const EMPTY = { lines: 0, units: 0, amountCents: 0, profitCents: 0 };

export const salesRequest = (filters, { isMobile, page, count }) => ({
    ...filters,
    limit: String(isMobile ? count : PAGE_SIZE),
    offset: String(isMobile ? 0 : (page - 1) * PAGE_SIZE)
});

export const salesSummary = (summary) => summary
    ? { lines: summary.lines, units: summary.units, amountCents: Math.round(summary.amount * 100), profitCents: Math.round(summary.profit * 100) }
    : EMPTY;