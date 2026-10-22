import { Skeleton } from '../pages/controlPanel/cards/CardState.jsx';
import { formatMoney, formatSalesLines, formatUnits } from '../utils/format.js';

const UNKNOWN = '—';

function SalesSummary({ kind, summary }) {
    if (kind === 'loading') {
        return (
            <div className="d-flex flex-column align-items-end gap-2 panel-summary" aria-hidden="true">
                <Skeleton className="sales-summary-skeleton" />
                <Skeleton className="sales-summary-skeleton is-short" />
            </div>
        );
    }
    if (kind === 'error') {
        return (
            <p className="m-0 panel-summary">
                <strong>{UNKNOWN}</strong> vendidos · <strong>{UNKNOWN}</strong> de beneficio
                <br />
                {UNKNOWN} líneas de venta · {UNKNOWN} prendas
            </p>
        );
    }
    return (
        <p className="m-0 panel-summary">
            <strong>{formatMoney(summary.amountCents)}</strong> vendidos · <strong>{formatMoney(summary.profitCents)}</strong> de beneficio
            <br />
            {formatSalesLines(summary.lines)} · {formatUnits(summary.units)}
        </p>
    );
}

export function SalesSummaryCard({ kind, summary }) {
    if (kind === 'loading') {
        return (
            <div className="sales-card" aria-hidden="true">
                <Skeleton className="sales-card-skeleton" />
                <Skeleton className="sales-card-skeleton" />
                <Skeleton className="sales-card-skeleton is-wide" />
            </div>
        );
    }
    const known = kind !== 'error';
    return (
        <div className="sales-card">
            <div className="sales-card-stat">
                <span className="sales-card-label">Vendido</span>
                <span className="sales-card-value">{known ? formatMoney(summary.amountCents) : UNKNOWN}</span>
            </div>
            <div className="sales-card-stat">
                <span className="sales-card-label">Beneficio</span>
                <span className="sales-card-value sales-card-profit">{known ? formatMoney(summary.profitCents) : UNKNOWN}</span>
            </div>
            <span className="sales-card-note">{known ? `${formatSalesLines(summary.lines)} · ${formatUnits(summary.units)}` : `${UNKNOWN} líneas de venta · ${UNKNOWN} prendas`}</span>
        </div>
    );
}

export default SalesSummary;