function Segments({ options, value, onChange, label, className = '' }) {
    return (
        <div className={`${className} panel-segs`.trim()} role="group" aria-label={label}>
            {options.map((option) => (
                <button
                    key={option.value || 'all'}
                    type="button"
                    className={`panel-seg${option.value === value ? ' is-on' : ''}`}
                    aria-pressed={option.value === value}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export default Segments;