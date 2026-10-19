import { formatEurosSigned } from '../../utils/format.js';

export function StatusPill({ status }) {
    const current = status.kind === 'current';
    return (
        <span className={`planning-pill${current ? ' is-current' : ''}`}>
            {current ? <span className="campaign-dot" aria-hidden="true" /> : null}
            {status.label}
        </span>
    );
}

export function Balance({ value }) {
    return <span className={`planning-balance ${value < 0 ? 'text-negative' : 'text-positive'}`}>{formatEurosSigned(value)}</span>;
}

// «+6.215 €» en verde y en 600; con pérdidas, «−6.215 €» en rojo.
export function Profit({ value }) {
    return <span className={`planning-profit ${value < 0 ? 'text-negative' : 'text-positive'}`}>{formatEurosSigned(value, { round: true })}</span>;
}

export function ActionButton({ icon, label, onClick }) {
    return (
        <button
            type="button"
            className="planning-icon-btn"
            aria-label={label}
            onClick={(event) => {
                event.stopPropagation();
                onClick();
            }}
        >
            <i className={`bi ${icon}`} aria-hidden="true" />
        </button>
    );
}
