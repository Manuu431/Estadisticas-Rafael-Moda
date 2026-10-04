import { CustomDates } from '../../components/SalesFields.jsx';
import { COMPARE_MODES } from '../../utils/compare.js';

function PeriodChoice({ label, tone, value, options, onChange }) {
    const selected = options.find((option) => option.value === value);

    return (
        <div className="compare-slot">
            <span className="compare-slot-label">
                <span className={`panel-dot is-${tone}`} aria-hidden="true" />
                {label}
            </span>
            <label className="panel-field is-plain compare-select">
                <span className="compare-select-name">{selected?.label ?? 'Elige un periodo'}</span>
                {selected && <span className="compare-select-range">{selected.range}</span>}
                <i className="bi bi-chevron-down" aria-hidden="true" />
                <select aria-label={label} value={selected ? value : ''} onChange={(event) => onChange(event.target.value)}>
                    {!selected && <option value="" disabled>Elige un periodo</option>}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label} ({option.range})</option>
                    ))}
                </select>
            </label>
        </div>
    );
}

function DatesChoice({ label, tone, period, onChange }) {
    return (
        <div className="compare-slot">
            <span className="compare-slot-label">
                <span className={`panel-dot is-${tone}`} aria-hidden="true" />
                {label}
            </span>
            <CustomDates period={period} onChange={onChange} />
        </div>
    );
}

function ComparePeriods({ mode, onModeChange, options, a, b, onChoose, dates, onDatesChange }) {
    return (
        <section className="panel-card compare-controls" aria-label="Periodos a comparar">
            <div className="compare-mode">
                <span className="compare-slot-label">Comparar</span>
                <div className="panel-segs d-flex" role="group" aria-label="Comparar por">
                    {COMPARE_MODES.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            className={`panel-seg${mode === item.value ? ' is-on' : ''}`}
                            aria-pressed={mode === item.value}
                            onClick={() => onModeChange(item.value)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            {mode === 'dates' ? (
                <>
                    <DatesChoice label="Periodo A" tone="a" period={dates.a} onChange={(next) => onDatesChange('a', next)} />
                    <span className="compare-vs" aria-hidden="true">vs.</span>
                    <DatesChoice label="Periodo B" tone="b" period={dates.b} onChange={(next) => onDatesChange('b', next)} />
                </>
            ) : (
                <>
                    <PeriodChoice label="Periodo A" tone="a" value={a} options={options} onChange={(value) => onChoose('a', value)} />
                    <span className="compare-vs" aria-hidden="true">vs.</span>
                    <PeriodChoice label="Periodo B" tone="b" value={b} options={options} onChange={(value) => onChoose('b', value)} />
                </>
            )}
        </section>
    );
}

export default ComparePeriods;
