import Dropdown from 'react-bootstrap/Dropdown';

function FieldDropdown({ label, value, options, onChange, className = '', large = false, alignEnd = false, showLabel = true, disabled = false }) {
    const selected = options.find((option) => option.value === value) ?? options[0];
    return (
        <Dropdown className={`panel-select ${className}`} onSelect={(position) => onChange(options[Number(position)].value)}>
            <Dropdown.Toggle
                as="button"
                type="button"
                disabled={disabled}
                className={`panel-field ${showLabel ? 'is-labelled' : 'is-plain'} panel-select-toggle${large ? ' is-large' : ''}`}
                aria-haspopup="listbox"
                aria-label={`${label}: ${selected.label}`}
            >
                {showLabel && <span className="panel-field-label">{label}</span>}
                <span className="panel-select-value">{selected.label}</span>
                {selected.detail && <span className="panel-select-detail">{selected.detail}</span>}
                <i className="bi bi-chevron-down" aria-hidden="true" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="panel-select-menu" role="listbox" align={alignEnd ? 'end' : 'start'}>
                {options.map((option, position) => (
                    <Dropdown.Item as="button" type="button" role="option" aria-selected={option === selected} key={option.value} eventKey={String(position)} active={option === selected}>
                        <span className="panel-select-option">{option.label}</span>
                        {option.detail && <span className="panel-select-detail">{option.detail}</span>}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default FieldDropdown;