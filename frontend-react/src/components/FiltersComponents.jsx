import { SECTION_LABELS } from '../config/labels.js';

const SECTION_OPTIONS = Object.entries(SECTION_LABELS).map(([value, label]) => ({ value, label }));

export function SectionSegments({ inputId, label, options, selectedValues, handleSelectChange, className = '' }) {
    const selected = selectedValues[inputId] ?? [];
    const current = selected.length === 1 ? selected[0] : '';
    const pick = (value) => handleSelectChange(inputId, value ? [{ value }] : []);
    const known = options.filter((option) => option.value);
    const segments = [{ value: '', label: 'Todo' }, ...(known.length > 0 ? known : SECTION_OPTIONS)];

    return (
        <div className={`panel-segs d-inline-flex ${className}`} role="group" aria-label={label}>
            {segments.map((segment) => (
                <button
                    key={segment.value || 'all'}
                    type="button"
                    className={`panel-seg${segment.value === current ? ' is-on' : ''}`}
                    aria-pressed={segment.value === current}
                    onClick={() => pick(segment.value)}
                >
                    {segment.label}
                </button>
            ))}
        </div>
    );
}
