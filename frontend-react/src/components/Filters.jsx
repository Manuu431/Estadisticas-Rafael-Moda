import { useEffect, useState } from 'react';
import axios from "axios";
import { FILTERS_CONFIG } from "../../filtersConfig.js";
import { CONFIG } from "../../config.js";
import { SelectFilter, RangeFilter, TextInputFilter, FilterButton } from "../utils/FiltersComponents.jsx";
import {
    filterOptions,
    handleSelectChange,
    handleRangeInputChange,
    handleTextInputChange,
    handleClear,
    handleFilter
} from "../utils/filterUtils.js";

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
    }, [config.endpoint, filtersConfig.inputType, filtersConfig.inputId]);

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
                                        handleSelectChange={(id, options) =>
                                            handleSelectChange(id, options, setSelectedValues)
                                        }
                                    />
                                ) : inputType === "range" ? (
                                    <RangeFilter
                                        inputId={inputId}
                                        label={label}
                                        rangeInputs={rangeInputs}
                                        handleRangeInputChange={(id, values) =>
                                            handleRangeInputChange(id, values, setRangeInputs)
                                        }
                                        minPrice={config.minPrice}
                                        maxPrice={config.maxPrice}
                                    />
                                ) : (
                                    <TextInputFilter
                                        inputId={inputId}
                                        label={label}
                                        inputType={inputType}
                                        textInputs={textInputs}
                                        handleTextInputChange={(e) =>
                                            handleTextInputChange(e, setTextInputs)
                                        }
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
                <FilterButton
                    classCols={classCols}
                    divClasses="justify-content-lg-start"
                    buttonClasses="btn-secondary"
                    onClickFunction={() => handleClear(setSelectedValues, setTextInputs, setRangeInputs, onFilterChange)}
                    iconClasses="bi bi-trash"
                    text="Netejar"
                />
                <FilterButton
                    classCols={classCols}
                    divClasses="justify-content-lg-end"
                    buttonClasses="bg-orange"
                    onClickFunction={() => handleFilter(selectedValues, textInputs, rangeInputs, onFilterChange)}
                    iconClasses="bi bi-funnel"
                    text="Filtrar"
                />
            </div>
        </>
    );
}

export default Filters;