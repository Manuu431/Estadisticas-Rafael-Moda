import { PERIOD_SEGMENTS, SECTION_SEGMENTS } from './filterOptions.js';

function Segments({ segments, value, onChange, label, className }) {
    return (
        <div className={`panel-segs d-inline-flex${className ? ` ${className}` : ''}`} role="group" aria-label={label}>
            {segments.map((segment) => (
                <button
                    key={segment.value || 'todo'}
                    type="button"
                    className={`panel-seg${segment.value === value ? ' is-on' : ''}`}
                    aria-pressed={segment.value === value}
                    onClick={() => onChange(segment.value)}
                >
                    {segment.label}
                </button>
            ))}
        </div>
    );
}

export function SectionFilter({ section, setSection }) {
    return <Segments segments={SECTION_SEGMENTS} value={section} onChange={setSection} label="Sección de la tienda" className="panel-head-segs" />;
}

export function PeriodFilter({ period, setPeriod }) {
    return <Segments segments={PERIOD_SEGMENTS} value={period} onChange={setPeriod} label="Periodo" />;
}