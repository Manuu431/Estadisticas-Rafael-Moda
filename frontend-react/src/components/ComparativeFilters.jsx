import { useEffect, useState } from "react";
import { DATABASE_TABLES } from "../../database.js";
import { SelectFilter, TextInputFilter, FilterButton } from "../utils/FiltersComponents.jsx";
import { updateSelectOptions } from "../utils/filterUtils.js";

function ComparativeFilters({ filters, setFilters, onFilter, classCols }) {
    const DATABASE_TABLE = DATABASE_TABLES["comparative"];
    const [optionsData, setOptionsData] = useState({});

    useEffect(() => {
        updateSelectOptions(DATABASE_TABLE, setOptionsData);
    }, []);

    const handleSelectChange = (inputId, value) => {
        setFilters(prev => ({ ...prev, [inputId]: value }));
    };

    const handleSelectDateByChange = (inputId, value) => {
        setFilters({ groupBy: "none" });
        setFilters(prev => ({ ...prev, [inputId]: value }));
    }

    const handleTextInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div className="row bg-gray py-2">
                {filters.selectDateBy === "exact_date" && (
                    <>
                        {["start_date_1", "end_date_1", "start_date_2", "end_date_2"].map((inputId) => {
                            const index = DATABASE_TABLE.filters.inputId.indexOf(inputId);
                            if (index === -1) return null;
                            const label = DATABASE_TABLE.filters.label[index];
                            const inputType = DATABASE_TABLE.filters.inputType[index];
                            return (
                                <div className={`${classCols}`} key={inputId}>
                                    <div className="mb-3 gap-3">
                                        <TextInputFilter
                                            inputId={inputId}
                                            label={label}
                                            inputType={inputType}
                                            textInputs={filters}
                                            handleTextInputChange={handleTextInputChange}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}

                {(filters.selectDateBy === "campaigns" || filters.selectDateBy === "seasons") && (
                    <>
                        {["_1", "_2"].map(suffix => {
                            const inputId = filters.selectDateBy === "campaigns" ? `campaign${suffix}` : `season${suffix}`;
                            return (
                                <div className={`${classCols}`} key={inputId}>
                                    <div className="mb-3 gap-3">
                                        <SelectFilter
                                            inputId={inputId}
                                            label={filters.selectDateBy === "campaigns" ? `Campaña ${suffix === "_1" ? "1" : "2"}` : `Temporada ${suffix === "_1" ? "1" : "2"}`}
                                            optionsData={{ [inputId]: optionsData[filters.selectDateBy] || [] }}
                                            selectedValues={filters}
                                            handleSelectChange={handleSelectChange}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}

                {["showBy", "groupBy"].map((inputId) => {
                    const index = DATABASE_TABLE.filters.inputId.indexOf(inputId);
                    if (index === -1) return null;
                    const label = DATABASE_TABLE.filters.label[index];
                    const options = DATABASE_TABLE.filters.options[inputId];
                    return (
                        <div className={`${classCols}`} key={inputId}>
                            <div className="mb-3 gap-3">
                                <SelectFilter
                                    inputId={inputId}
                                    label={label}
                                    optionsData={{ [inputId]: options }}
                                    selectedValues={filters}
                                    handleSelectChange={handleSelectChange}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="row bg-gray py-2">
                <div className={`${classCols} col-xl-4`}>
                    <div className="m-auto">
                        <SelectFilter
                            inputId={"selectDateBy"}
                            label={"Fecha por"}
                            optionsData={{ selectDateBy: DATABASE_TABLE.filters.options.selectDateBy }}
                            selectedValues={filters}
                            handleSelectChange={handleSelectDateByChange}
                        />
                    </div>
                </div>
                <div className="col-xl-4"></div>
                <FilterButton
                    classCols={classCols}
                    divClasses="justify-content-lg-start"
                    buttonClasses="btn-secondary"
                    onClickFunction={() => setFilters({ groupBy: "none", selectDateBy: filters.selectDateBy })}
                    iconClasses="bi bi-trash"
                    text="Limpiar"
                />
                <FilterButton
                    classCols={classCols}
                    divClasses="justify-content-lg-end"
                    buttonClasses="bg-orange"
                    onClickFunction={() => onFilter(filters)}
                    iconClasses="bi bi-funnel"
                    text="Filtrar"
                />
            </div>
        </>
    );
}

export default ComparativeFilters;