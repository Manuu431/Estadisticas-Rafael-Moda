import { SALES_PERIODS, customPeriodError, isDateFieldInvalid, setDateField } from '../utils/salesPeriod.js';

const toOptions = (values) => values.map((value) => ({ value, label: value }));

function SheetSelect({ id, label, value, options, onChange }) {
    return (
        <div className="sheet-field">
            <label className="sheet-label" htmlFor={id}>{label}</label>
            <span className="panel-field is-large is-plain">
                <select id={id} name={id} value={value} onChange={(event) => onChange(event.target.value)}>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </span>
        </div>
    );
}

function SheetPair({ id, label, fields }) {
    return (
        <div className="sheet-field">
            <span className="sheet-label" id={`${id}-label`}>{label}</span>
            <div className="sheet-pair">
                {fields.map(({ key, type, placeholder, ariaLabel, value, onChange }) => (
                    <span className="panel-field is-large is-plain" key={key}>
                        <input
                            type={type}
                            id={`${id}-${key}`}
                            name={`${id}-${key}`}
                            placeholder={placeholder}
                            aria-label={ariaLabel}
                            value={value}
                            onChange={(event) => onChange(event.target.value)}
                        />
                    </span>
                ))}
            </div>
        </div>
    );
}

function SalesSheet({ period, onPeriodChange, applyError, brands, brand, onBrandChange, panel, onPanelChange, options }) {
    const set = (field) => (value) => onPanelChange({ ...panel, [field]: value });
    const error = customPeriodError(period) ?? applyError;
    const dateInput = (name, id) => (
        <input
            type="date"
            id={id}
            name={name}
            aria-invalid={isDateFieldInvalid(period, name)}
            defaultValue={period[name]}
            onChange={(event) => onPeriodChange(setDateField(period, name, event.target.value, event.target.validity.badInput))}
        />
    );
    const all = (allLabel, values) => [{ value: '', label: allLabel }, ...toOptions(values)];
    return (
        <div className="sales-sheet">
            <SheetSelect
                id="sheet-period"
                label="Periodo"
                value={period.key}
                options={SALES_PERIODS}
                onChange={(key) => onPeriodChange({ ...period, key })}
            />
            {period.key === 'custom' && (
                <div className="sheet-field">
                    <div className="sheet-pair">
                        <div className="flex-grow-1 sheet-field">
                            <label className="sheet-label" htmlFor="sheet-from">Desde</label>
                            <span className="panel-field is-large is-plain">
                                {dateInput('from', 'sheet-from')}
                            </span>
                        </div>
                        <div className="flex-grow-1 sheet-field">
                            <label className="sheet-label" htmlFor="sheet-to">Hasta</label>
                            <span className="panel-field is-large is-plain">
                                {dateInput('to', 'sheet-to')}
                            </span>
                        </div>
                    </div>
                    {error && <p className="text-negative m-0 panel-note" role="alert">{error}</p>}
                </div>
            )}
            <div className="sheet-grid">
                <SheetSelect id="sheet-brand" label="Marca" value={brand} options={all('Todas', brands)} onChange={onBrandChange} />
                <SheetSelect id="sheet-family" label="Familia" value={panel.family} options={all('Todas', options.families)} onChange={set('family')} />
                <SheetSelect id="sheet-size" label="Talla" value={panel.size} options={all('Todas', options.sizes)} onChange={set('size')} />
                <SheetSelect id="sheet-color" label="Color" value={panel.color} options={all('Todos', options.colors)} onChange={set('color')} />
            </div>
            <SheetPair
                id="sheet-price"
                label="Precio de venta (€)"
                fields={[
                    { key: 'from', type: 'number', placeholder: 'Desde', ariaLabel: 'Precio de venta (€), desde', value: panel.priceFrom, onChange: set('priceFrom') },
                    { key: 'to', type: 'number', placeholder: 'Hasta', ariaLabel: 'Precio de venta (€), hasta', value: panel.priceTo, onChange: set('priceTo') }
                ]}
            />
            <SheetPair
                id="sheet-profit"
                label="Beneficio (€)"
                fields={[
                    { key: 'from', type: 'number', placeholder: 'Desde', ariaLabel: 'Beneficio (€), desde', value: panel.profitFrom, onChange: set('profitFrom') },
                    { key: 'to', type: 'number', placeholder: 'Hasta', ariaLabel: 'Beneficio (€), hasta', value: panel.profitTo, onChange: set('profitTo') }
                ]}
            />
        </div>
    );
}

export default SalesSheet;