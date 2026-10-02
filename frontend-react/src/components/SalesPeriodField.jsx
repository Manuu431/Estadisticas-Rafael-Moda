import { SALES_PERIODS, customPeriodError } from '../utils/salesPeriod.js';

export function PeriodSelect({ period, onChange }) {
    return (
        <label className="panel-field is-labelled panel-field-period">
            <span className="panel-field-label">Periodo</span>
            <select value={period.key} onChange={(event) => onChange({ ...period, key: event.target.value })}>
                {SALES_PERIODS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            <i className="bi bi-chevron-down" aria-hidden="true" />
        </label>
    );
}

export function CustomDates({ period, onChange }) {
    if (period.key !== 'custom') return null;
    const error = customPeriodError(period);
    const dateField = (name, label) => (
        <label className="panel-field is-labelled panel-field-period">
            <span className="panel-field-label">{label}</span>
            <input
                type="date"
                value={period[name]}
                aria-invalid={Boolean(error)}
                onChange={(event) => onChange({ ...period, [name]: event.target.value })}
            />
        </label>
    );

    return (
        <div className="d-flex flex-column gap-2">
            <div className="d-flex flex-wrap gap-2">
                {dateField('from', 'Desde')}
                {dateField('to', 'Hasta')}
            </div>
            {error && <p className="panel-note text-negative m-0" role="alert">{error}</p>}
        </div>
    );
}