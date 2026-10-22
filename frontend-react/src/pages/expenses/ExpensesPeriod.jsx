import FieldDropdown from '../../components/FieldDropdown.jsx';

function ExpensesPeriod({ menu, kind, onKindChange, grainOptions, grain, onGrainChange, large }) {
    return (
        <div className="expenses-tools">
            <FieldDropdown label="Periodo" value={kind} options={menu} onChange={onKindChange} className="expenses-period" large={large} />
            <div className="panel-segs is-plus panel-head-segs" role="group" aria-label="Mostrar por">
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