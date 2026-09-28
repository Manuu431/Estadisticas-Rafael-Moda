import { useEffect, useState } from 'react';
import { DATABASE_TABLES } from "../config/database.js"

import { MultiSelectFilter, RangeFilter, TextInputFilter, FilterButton } from "../utils/FiltersComponents.jsx";
import {
    handleSelectChange,
    handleRangeInputChange,
    handleTextInputChange,
    handleManualClear,
    handleManualFilter,
    updateMultiSelectOptions
} from "../utils/filterUtils.js";

function Filters({ type, onFilterChange, classCols }) {
    const DATABASE_TABLE = DATABASE_TABLES[type];
    const [optionsData, setOptionsData] = useState({});
    const [selectedValues, setSelectedValues] = useState({});
    const [rangeInputs, setRangeInputs] = useState({});
    const [textInputs, setTextInputs] = useState({});

    useEffect(() => {
        updateMultiSelectOptions(DATABASE_TABLE, {}, setOptionsData);
    }, [DATABASE_TABLE.endpoint]);

    return (
        <>
            <div className="row bg-gray py-2">
                {DATABASE_TABLE.filters.label.map((label, index) => {
                    const inputId = DATABASE_TABLE.filters.inputId[index];
                    const inputType = DATABASE_TABLE.filters.inputType[index];

                    return (
                        <div className={`${classCols} col-xl-4`} key={index}>
                            <div className="mb-3 gap-3">
                                {inputType === "select" ? (
                                    <MultiSelectFilter
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
                                        minPrice={DATABASE_TABLE.tables.minPrice}
                                        maxPrice={DATABASE_TABLE.tables.maxPrice}
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
                    onClickFunction={() =>
                        handleManualClear(
                            setSelectedValues,
                            setTextInputs,
                            setRangeInputs,
                            onFilterChange,
                            DATABASE_TABLE,
                            setOptionsData
                        )
                    }
                    iconClasses="bi bi-trash"
                    text="Limpiar"
                />
                <FilterButton
                    classCols={classCols}
                    divClasses="justify-content-lg-end"
                    buttonClasses="bg-orange"
                    onClickFunction={() =>
                        handleManualFilter(
                            selectedValues,
                            textInputs,
                            rangeInputs,
                            onFilterChange,
                            DATABASE_TABLE,
                            setOptionsData
                        )
                    }
                    iconClasses="bi bi-funnel"
                    text="Filtrar"
                />
            </div>
        </>
    );
}

export default Filters;