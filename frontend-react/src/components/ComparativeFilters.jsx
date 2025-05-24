import { useEffect, useState } from "react";
import { DATABASE_TABLES } from "../../database.js";
import { SelectFilter, TextInputFilter, FilterButton } from "../utils/FiltersComponents.jsx";
import { updateSelectOptions } from "../utils/filterUtils.js";

function ComparativeFilters({ filters, setFilters, onFilter, classCols = "col-12 col-md-6" }) {
    const DATABASE_TABLE = DATABASE_TABLES["comparative"];
    const [optionsData, setOptionsData] = useState({});

    useEffect(() => {
        updateSelectOptions(DATABASE_TABLE, {}, setOptionsData);
    }, []);

    const handleSelectChange = (inputId, value) => {
        setFilters(prev => ({ ...prev, [inputId]: value }));
    };

    const handleTextInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

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
                                    <SelectFilter
                                        inputId={inputId}
                                        label={label}
                                        optionsData={optionsData}
                                        selectedValues={filters}
                                        handleSelectChange={handleSelectChange}
                                    />
                                ) : (
                                    <TextInputFilter
                                        inputId={inputId}
                                        label={label}
                                        inputType={inputType}
                                        textInputs={filters}
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
                    onClickFunction={onFilter(filters)}
                    iconClasses="bi bi-funnel"
                    text="Filtrar"
                />
            </div>
        </>
    );
}

export default ComparativeFilters;