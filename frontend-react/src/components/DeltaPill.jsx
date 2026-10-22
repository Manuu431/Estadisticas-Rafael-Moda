import { formatPercent, percentDirection } from '../utils/format.js';

function DeltaPill({ value }) {
    if (value === null || !Number.isFinite(value)) {
        return <span className="panel-muted">sin comparación</span>;
    }

    const direction = percentDirection(value);
    return (
        <span className={`d-inline-flex align-items-center gap-1 delta-pill is-${direction}`}>
            {direction !== 'flat' && <i className={`bi bi-arrow-${direction}`} aria-hidden="true" />}
            {formatPercent(value)}
        </span>
    );
}

export default DeltaPill;