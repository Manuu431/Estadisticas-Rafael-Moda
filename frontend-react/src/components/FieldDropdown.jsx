import Dropdown from 'react-bootstrap/Dropdown';

function FieldDropdown({ label, value, options, onChange, className = '', large = false, alignEnd = false }) {
    const selected = options.find((option) => option.value === value) ?? options[0];

    return (
        <Dropdown className={`panel-select ${className}`} onSelect={(position) => onChange(options[Number(position)].value)}>
            <Dropdown.Toggle
                as="button"
                type="button"
                className={`panel-field is-labelled panel-select-toggle${large ? ' is-large' : ''}`}
                aria-label={`${label}: ${selected.label}`}
            >
                <span className="panel-field-label">{label}</span>
                <span className="panel-select-value">{selected.label}</span>
                <i className="bi bi-chevron-down" aria-hidden="true" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="panel-select-menu" align={alignEnd ? 'end' : 'start'}>
                {options.map((option, position) => (
                    <Dropdown.Item as="button" type="button" key={option.value} eventKey={String(position)} active={option === selected}>
                        {option.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default FieldDropdown;