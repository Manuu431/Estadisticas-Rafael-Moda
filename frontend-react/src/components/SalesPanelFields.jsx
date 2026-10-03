function PanelSelect({ id, label, allLabel, value, options, onChange }) {
    return (
        <div className="sales-panel-field">
            <label className="sales-panel-label" htmlFor={id}>{label}</label>
            <span className="panel-field is-plain">
                <select id={id} name={id} value={value} onChange={(event) => onChange(event.target.value)}>
                    <option value="">{allLabel}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <i className="bi bi-chevron-down" aria-hidden="true" />
            </span>
        </div>
    );
}

function PanelRange({ id, label, from, to, onFromChange, onToChange }) {
    return (
        <div className="sales-panel-field">
            <span className="sales-panel-label">{label}</span>
            <div className="sales-panel-pair">
                <span className="panel-field">
                    <input
                        type="number"
                        id={`${id}-from`}
                        name={`${id}-from`}
                        placeholder="Desde"
                        aria-label={`${label}, desde`}
                        value={from}
                        onChange={(event) => onFromChange(event.target.value)}
                    />
                </span>
                <span className="panel-field">
                    <input
                        type="number"
                        id={`${id}-to`}
                        name={`${id}-to`}
                        placeholder="Hasta"
                        aria-label={`${label}, hasta`}
                        value={to}
                        onChange={(event) => onToChange(event.target.value)}
                    />
                </span>
            </div>
        </div>
    );
}

function SalesPanelFields({ panel, options, onChange }) {
    const set = (field) => (value) => onChange({ ...panel, [field]: value });

    return (
        <>
            <PanelSelect id="panel-family" label="Familia" allLabel="Todas" value={panel.family} options={options.families} onChange={set('family')} />
            <PanelSelect id="panel-size" label="Talla" allLabel="Todas" value={panel.size} options={options.sizes} onChange={set('size')} />
            <PanelSelect id="panel-color" label="Color" allLabel="Todos" value={panel.color} options={options.colors} onChange={set('color')} />
            <PanelRange id="panel-price" label="Precio de venta (€)" from={panel.priceFrom} to={panel.priceTo} onFromChange={set('priceFrom')} onToChange={set('priceTo')} />
            <PanelRange id="panel-profit" label="Beneficio (€)" from={panel.profitFrom} to={panel.profitTo} onFromChange={set('profitFrom')} onToChange={set('profitTo')} />
        </>
    );
}

export default SalesPanelFields;