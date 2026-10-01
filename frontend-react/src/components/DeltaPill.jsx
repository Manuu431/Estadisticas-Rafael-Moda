import { formatPercent } from '../utils/format.js';

function DeltaPill({ value }) {
    if (value === null || !Number.isFinite(value)) {
        return <span className="panel-muted">sin comparación</span>;
    }

    const up = value >= 0;

    return (
        <span className={`delta-pill d-inline-flex align-items-center gap-1${up ? '' : ' is-down'}`}>
            <i className={`bi bi-arrow-${up ? 'up' : 'down'}`} aria-hidden="true" />
            {formatPercent(value)}
        </span>
    );
}

export default DeltaPill;