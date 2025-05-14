import { useEffect, useState } from 'react';
import Select from 'react-select';
import { FILTERS_CONFIG } from "../../filtersConfig.js";
import { CONFIG } from "../../config.js";
import axios from "axios";

const classCols = "col-12 col-md-6";

function Filters({ type, onFilterChange }) {
    const filtersConfig = FILTERS_CONFIG[type];
    const config = CONFIG[type];
    const [optionsData, setOptionsData] = useState({});
    const [selectedValues, setSelectedValues] = useState({});
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

    const handleTextInputChange = (e) => {
        const { id, value } = e.target;
        setTextInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleClear = () => {
        setSelectedValues({});
        setTextInputs({});
        onFilterChange({});
    };

    const handleFilter = () => {
        onFilterChange({ ...selectedValues, ...textInputs });
    };
    
    return (
        <>
            <div className="row bg-gray py-2">
                {filtersConfig.label.map((label, index) => {
                    const inputId = filtersConfig.inputId[index];
                    const inputType = filtersConfig.inputType[index];

                    return (
                        <div className={`${classCols} col-xl-4`} key={index}>
                            <div className="form-floating mb-3 gap-3">
                                {inputType === "select" ? (
                                    <div className="position-relative m-3">
                                        <label
                                            className="position-absolute top-0 start-0 ms-3 mt-1 text-secondary small"
                                            htmlFor={inputId}
                                            style={{ zIndex: 2 }}
                                        >
                                            {label}
                                        </label>
                                        <Select
                                            isMulti
                                            inputId={inputId}
                                            name={inputId}
                                            options={optionsData[inputId] || []}
                                            classNamePrefix="react-select"
                                            className="react-select-container z-2"
                                            placeholder="Selecciona una opción"
                                            value={(optionsData[inputId] || []).filter(option =>
                                                selectedValues[inputId]?.includes(option.value)
                                            )}
                                            onChange={(selectedOptions) => handleSelectChange(inputId, selectedOptions)}
                                        />
                                    </div>
                                ) : (
                                    <div className="form-floating m-3">
                                        <input
                                            type={inputType}
                                            id={inputId}
                                            name={inputId}
                                            className="form-control"
                                            placeholder={label}
                                            value={textInputs[inputId] || ""}
                                            onChange={handleTextInputChange}
                                        />
                                        <label className='z-0' htmlFor={inputId}>{label}</label>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className='row bg-gray py-2'>
                <div className="col-xl-4"></div>
                <div className="col-xl-4"></div>
                {createButton("justify-content-lg-start", "btn-secondary", handleClear, "bi bi-trash", "Netejar")}
                {createButton("justify-content-lg-end", "bg-orange", handleFilter, "bi bi-funnel", "Filtrar")}
            </div>
        </>
    );
}

const createButton = (divClasses, buttonClasses, onClickFunction, iconClasses, text) => {
    return (
        <div className={`${classCols} col-xl-2`}>
            <div className={`d-flex justify-content-center m-3 justify-content-xl-end ${divClasses}`}>
                <button
                    className={`btn ${buttonClasses} ps-2 text-white w-100 w-lg-auto py-3 py-xl-2`}
                    onClick={onClickFunction}
                >
                    <i className={`${iconClasses} px-1 text-white`}></i>{text}
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

export default Filters;