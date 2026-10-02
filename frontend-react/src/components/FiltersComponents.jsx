import Select from 'react-select';
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

export function MultiSelectFilter(props) {
    return (
        <div className="d-flex flex-column gap-2">
            <label className="filters-label" htmlFor={props.inputId}>{props.label}</label>
            <Select
                isMulti
                inputId={props.inputId}
                name={props.inputId}
                options={props.optionsData[props.inputId] || []}
                classNamePrefix="react-select"
                className="react-select-container z-2"
                placeholder="Todas"
                noOptionsMessage={() => 'Sin opciones'}
                value={(props.optionsData[props.inputId] || []).filter(option =>
                    props.selectedValues[props.inputId]?.includes(option.value)
                )}
                onChange={(selectedOptions) => props.handleSelectChange(props.inputId, selectedOptions)}
            />
        </div>
    );
}

export function RangeFilter(props) {
    const minValue = props.minPrice || 0;
    const maxValue = props.maxPrice || 999999;
    const currentMin = props.rangeInputs[props.inputId]?.min ?? "";
    const currentMax = props.rangeInputs[props.inputId]?.max ?? "";

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValues = {
            min: name === "min" ? value : props.rangeInputs[props.inputId]?.min ?? "",
            max: name === "max" ? value : props.rangeInputs[props.inputId]?.max ?? "",
        };
        props.handleRangeInputChange(props.inputId, [updatedValues.min, updatedValues.max]);
    };

    const createRangeInput = (name, value, placeholder, ariaLabel) => (
        <span className="panel-field flex-grow-1">
            <input
                type="number"
                name={name}
                id={`${props.inputId}-${name}`}
                placeholder={placeholder}
                aria-label={ariaLabel}
                value={value}
                onChange={handleChange}
                min={minValue}
                max={maxValue}
            />
        </span>
    );

    return (
        <div className="d-flex flex-column gap-2">
            <span className="filters-label">{props.label}</span>
            <div className="d-flex gap-2">
                {createRangeInput("min", currentMin, "Desde", `${props.label} desde`)}
                {createRangeInput("max", currentMax, "Hasta", `${props.label} hasta`)}
            </div>
        </div>
    );
}

export function TextInputFilter(props) {
    return (
        <div className="d-flex flex-column gap-2">
            <label className="filters-label" htmlFor={props.inputId}>{props.label}</label>
            <span className="panel-field">
                <input
                    type={props.inputType}
                    id={props.inputId}
                    name={props.inputId}
                    placeholder={props.label}
                    value={props.textInputs[props.inputId] || ""}
                    onChange={props.handleTextInputChange}
                />
            </span>
        </div>
    );
}