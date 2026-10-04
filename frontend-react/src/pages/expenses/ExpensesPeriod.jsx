import FieldDropdown from '../../components/FieldDropdown.jsx';

function ExpensesPeriod({ menu, kind, onKindChange, locked, lockedText, grainOptions, grain, onGrainChange }) {
    return (
        <div className="expenses-tools">
            <FieldDropdown
                label="Periodo"
                value={locked ? 'locked' : kind}
                options={locked ? [{ value: 'locked', label: lockedText }] : menu}
                onChange={onKindChange}
                className="expenses-period"
                disabled={locked}
            />
            <div className="panel-segs is-plus d-inline-flex panel-head-segs" role="group" aria-label="Mostrar por">
                {grainOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={`panel-seg${grain === option.value ? ' is-on' : ''}`}
                        aria-pressed={grain === option.value}
                        onClick={() => onGrainChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ExpensesPeriod;