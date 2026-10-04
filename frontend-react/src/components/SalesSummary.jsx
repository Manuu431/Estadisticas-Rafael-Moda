import { Skeleton } from '../pages/controlPanel/cards/CardState.jsx';
import { formatMoney, formatSalesLines, formatUnits } from '../utils/format.js';

const UNKNOWN = '—';

function SalesSummary({ kind, summary }) {
    if (kind === 'loading') {
        return (
            <div className="panel-summary d-flex flex-column align-items-end gap-2" aria-hidden="true">
                <Skeleton className="sales-summary-skeleton" />
                <Skeleton className="sales-summary-skeleton is-short" />
            </div>
        );
    }

    if (kind === 'error') {
        return (
            <p className="panel-summary m-0">
                <strong>{UNKNOWN}</strong> vendidos · <strong>{UNKNOWN}</strong> de beneficio
                <br />
                {UNKNOWN} líneas de venta · {UNKNOWN} prendas
            </p>
        );
    }

    return (
        <p className="panel-summary m-0">
            <strong>{formatMoney(summary.amountCents)}</strong> vendidos · <strong>{formatMoney(summary.profitCents)}</strong> de beneficio
            <br />
            {formatSalesLines(summary.lines)} · {formatUnits(summary.units)}
        </p>
    );
}

export default SalesSummary;