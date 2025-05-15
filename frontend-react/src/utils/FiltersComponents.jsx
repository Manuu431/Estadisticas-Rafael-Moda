import Select from 'react-select';
import { Button } from '../utils/smallComponents';

export function SelectFilter(props) {
    return (
        <div className="position-relative m-3">
            <label
                className="position-absolute top-0 start-0 ms-3 mt-1 text-secondary small"
                htmlFor={props.inputId}
                style={{ zIndex: 2 }}
            >
                {props.label}
            </label>
            <Select
                isMulti
                inputId={props.inputId}
                name={props.inputId}
                options={props.optionsData[props.inputId] || []}
                classNamePrefix="react-select"
                className="react-select-container z-2"
                placeholder={`Seleccionar ${props.label.toLowerCase()}`}
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
    const maxValue = props.maxPrice || 200;

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

    const createRangeForm = (formProps) => (
        <div className="form-floating w-100">
            <input
                type="number"
                name={formProps.name}
                id={`${props.inputId}-${formProps.name}`}
                className="form-control"
                placeholder={formProps.label}
                value={formProps.value}
                onChange={handleChange}
                min={minValue}
                max={maxValue}
            />
            <label className="z-0" htmlFor={`${props.inputId}-${formProps.name}`}>{formProps.label}</label>
        </div>
    );

    return (
        <div className="m-3">
            <div className="d-flex gap-2">
                {createRangeForm({ name: "min", value: currentMin, label: `Mín ${props.label.toLowerCase()}` })}
                {createRangeForm({ name: "max", value: currentMax, label: `Máx ${props.label.toLowerCase()}` })}
            </div>
        </div>
    );
}

export function TextInputFilter(props) {
    return (
        <div className="form-floating m-3">
            <input
                type={props.inputType}
                id={props.inputId}
                name={props.inputId}
                className="form-control"
                placeholder={props.label}
                value={props.textInputs[props.inputId] || ""}
                onChange={props.handleTextInputChange}
            />
            <label className="z-0" htmlFor={props.inputId}>{props.label}</label>
        </div>
    );
}

export function FilterButton(props) {
    return (
        <div className={`${props.classCols} col-xl-2`}>
            <div className={`d-flex justify-content-center m-3 ${props.divClasses}`}>
                <Button
                     buttonClasses={props.buttonClasses}
                     onClickFunction={props.onClickFunction}
                     iconClasses={props.iconClasses}
                     text={props.text}
                />
            </div>
        </div>
    );
};