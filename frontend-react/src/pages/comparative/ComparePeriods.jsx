import FieldDropdown from '../../components/FieldDropdown.jsx';
import { CustomDates } from '../../components/SalesFields.jsx';
import { COMPARE_MODES } from '../../utils/compare.js';

const NO_CHOICE = { value: '', label: 'Elige un periodo' };

function PeriodChoice({ label, tone, value, options, onChange, alignEnd }) {
    const choices = options.some((option) => option.value === value) ? options : [NO_CHOICE, ...options];
    const items = choices.map((option) => ({ ...option, detail: option.range }));
    return (
        <div className="compare-slot">
            <span className="compare-slot-label">
                <span className={`panel-dot is-${tone}`} aria-hidden="true" />
                {label}
            </span>
            <FieldDropdown
                label={label}
                showLabel={false}
                value={value}
                options={items}
                onChange={onChange}
                className="compare-select"
                alignEnd={alignEnd}
            />
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
        <section className={`panel-card compare-controls${mode === 'dates' ? ' is-dates' : ''}`} aria-label="Periodos a comparar">
            <div className="compare-mode">
                <span className="compare-slot-label">Comparar</span>
                <div className="d-flex panel-segs" role="group" aria-label="Comparar por">
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
                    <PeriodChoice label="Periodo B" tone="b" value={b} options={options} onChange={(value) => onChoose('b', value)} alignEnd />
                </>
            )}
        </section>
    );
}

export default ComparePeriods;