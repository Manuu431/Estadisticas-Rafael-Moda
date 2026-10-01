function DeltaPill({ value }) {
    if (value === null || !Number.isFinite(value)) {
        return <span className="panel-muted">sin comparación</span>;
    }

    const up = value >= 0;
    const text = `${up ? '+' : '−'}${Math.abs(value).toLocaleString('es-ES', { maximumFractionDigits: 1 })} %`;

    return (
        <span className={`delta-pill d-inline-flex align-items-center gap-1${up ? '' : ' is-down'}`}>
            <i className={`bi bi-arrow-${up ? 'up' : 'down'}`} aria-hidden="true" />
            {text}
        </span>
    );
}

export default DeltaPill;