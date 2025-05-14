import { useEffect, useState } from 'react';
import Select from 'react-select';
import Slider from 'react-slider';
import { FILTERS_CONFIG } from "../../filtersConfig.js";
import { CONFIG } from "../../config.js";
import axios from "axios";

const classCols = "col-12 col-md-6";

function Filters({ type, onFilterChange }) {
    const filtersConfig = FILTERS_CONFIG[type];
    const config = CONFIG[type];
    const [optionsData, setOptionsData] = useState({});
    const [selectedValues, setSelectedValues] = useState({});
    const [rangeInputs, setRangeInputs] = useState({});
    const [textInputs, setTextInputs] = useState({});

    useEffect(() => {
        filtersConfig.inputType.forEach((inputType, index) => {
            if (inputType === "select") {
                const inputId = filtersConfig.inputId[index];
                axios.get(config.endpoint)
                    .then(response => {
                        const uniqueOptions = filterOptions(response, inputId);
                        const options = uniqueOptions.map(value => ({
                            value,
                            label: value,
                        }));
                        setOptionsData(prev => ({ ...prev, [inputId]: options }));
                    })
                    .catch(error => {
                        console.error(`Error loading options for ${inputId}:`, error.response ? error.response.data : error);
                    });
            }
        });
    }, [config.endpoint]);

    const handleSelectChange = (inputId, selectedOptions) => {
        setSelectedValues(prev => ({
            ...prev,
            [inputId]: selectedOptions ? selectedOptions.map(opt => opt.value) : [],
        }));
    };

    const handleRangeInputChange = (inputId, values) => {
        setRangeInputs(prev => ({
            ...prev,
            [inputId]: {
                min: values[0],
                max: values[1],
            }
        }));
    };

    const handleTextInputChange = (e) => {
        const { id, value } = e.target;
        setTextInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleClear = () => {
        setSelectedValues({});
        setTextInputs({});
        setRangeInputs({});
        onFilterChange({});
    };

    const handleFilter = () => {
    onFilterChange({ 
        ...selectedValues, 
        ...textInputs,
        ...rangeInputs 
    });
};
    
    return (
        <>
            <div className="row bg-gray py-2">
                {filtersConfig.label.map((label, index) => {
                    const inputId = filtersConfig.inputId[index];
                    const inputType = filtersConfig.inputType[index];

                    return (
                        <div className={`${classCols} col-xl-4`} key={index}>
                            <div className="mb-3 gap-3">
                                {inputType === "select" ? (
                                    <SelectFilter
                                        inputId={inputId}
                                        label={label}
                                        optionsData={optionsData}
                                        selectedValues={selectedValues}
                                        handleSelectChange={handleSelectChange}
                                    />
                                ) : inputType === "range" ? (
                                    <RangeFilter
                                        inputId={inputId}
                                        label={label}
                                        rangeInputs={rangeInputs}
                                        handleRangeInputChange={handleRangeInputChange}
                                        minPrice={config.minPrice}
                                        maxPrice={config.maxPrice}
                                    />
                                ) : (
                                    <TextInputFilter 
                                        inputId={inputId}
                                        label={label}
                                        inputType={inputType}
                                        textInputs={textInputs}
                                        handleTextInputChange={handleTextInputChange} 
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className='row bg-gray py-2'>
                <div className="col-xl-4"></div>
                <div className="col-xl-4"></div>
                <FilterButton divClasses="justify-content-lg-start" buttonClasses="btn-secondary" onClickFunction={handleClear} iconClasses="bi bi-trash" text="Netejar" />
                <FilterButton divClasses="justify-content-lg-end" buttonClasses="bg-orange" onClickFunction={handleFilter} iconClasses="bi bi-funnel" text="Filtrar" />
            </div>
        </>
    );
}

function FilterButton(props) {
    return (
        <div className={`${classCols} col-xl-2`}>
            <div className={`d-flex justify-content-center m-3 justify-content-xl-end ${props.divClasses}`}>
                <button
                    className={`btn ${props.buttonClasses} ps-2 text-white w-100 w-lg-auto py-3 py-xl-2`}
                    onClick={props.onClickFunction}
                >
                    <i className={`${props.iconClasses} px-1 text-white`}></i>{props.text}
                </button>
            </div>
        </div>
    );
};

const filterOptions = (response, inputId) => {
    const uniqueOptions = [...new Set(response.data.map(item => item[inputId]))];

    let sortedOptions;
    if (inputId === "size") {
        const tallaOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
        sortedOptions = uniqueOptions.sort((a, b) => tallaOrder.indexOf(a) - tallaOrder.indexOf(b));
    } else {
        sortedOptions = uniqueOptions.sort((a, b) => a.localeCompare(b));
    }

    return sortedOptions;
};

function SelectFilter(props) {
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

function TextInputFilter(props) {
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

function RangeFilter(props) {
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

    const createRangeForm = (props) =>{
        return (
            <div className="form-floating w-100">
                <input
                    type="number"
                    name={props.name}
                    id={`${props.inputId}-${props.name}`}
                    className="form-control"
                    placeholder={`${props.label} ${props.label2}`}
                    value={props.value}
                    onChange={handleChange}
                    min={minValue}
                    max={maxValue}
                />
                <label className="z-0" htmlFor={`${props.inputId}-${props.name}`}>{props.label}</label>
            </div>
        );
    }

    return (
        <div className="m-3">
            <div className="d-flex gap-2">
                {createRangeForm({name: "min", value: currentMin, label: `Mín ${props.label.toLowerCase()}`})}
                {createRangeForm({name: "max", value: currentMax, label: `Máx ${props.label.toLowerCase()}`})}
            </div>
        </div>
    );
}

export default Filters;