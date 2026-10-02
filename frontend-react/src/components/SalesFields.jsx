import { SALES_PERIODS, customPeriodError } from '../utils/salesPeriod.js';

export function InlineSelect({ name, label, value, options, onChange, className }) {
    return (
        <label className={`panel-field is-labelled ${className}`}>
            <span className="panel-field-label">{label}</span>
            <select name={name} value={value} onChange={(event) => onChange(event.target.value)}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            <i className="bi bi-chevron-down" aria-hidden="true" />
        </label>
    );
}

export function PeriodSelect({ period, onChange }) {
    return (
        <InlineSelect
            name="period"
            label="Periodo"
            value={period.key}
            options={SALES_PERIODS}
            onChange={(key) => onChange({ ...period, key })}
            className="panel-field-period"
        />
    );
}

export function BrandSelect({ brands, value, onChange }) {
    const options = [{ value: '', label: 'Todas' }, ...brands.map((brand) => ({ value: brand, label: brand }))];
    return <InlineSelect name="brand" label="Marca" value={value} options={options} onChange={onChange} className="panel-field-brand" />;
}

export function SearchField({ value, onChange }) {
    return (
        <label className="panel-field panel-field-search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
                type="search"
                name="search"
                autoComplete="off"
                placeholder="Buscar prenda, marca o color"
                aria-label="Buscar ventas"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
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
                name={name}
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