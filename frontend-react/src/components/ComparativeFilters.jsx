import { useEffect, useState } from "react";
import axios from "axios";
import { DATABASE_TABLES } from "../../database.js";
import { SelectFilter, TextInputFilter, FilterButton } from "../utils/FiltersComponents.jsx";

function ComparativeFilters({ filters, setFilters, handleSelectDateByChange, handleClear, onFilter, classCols }) {
    const DATABASE_TABLE = DATABASE_TABLES["comparative"];
    const [optionsData, setOptionsData] = useState({});

    const fetchOptionsData = async () => {
        try {
            if (filters.selectDateBy === "campaigns" || filters.selectDateBy === "seasons") {
                const tableKey = filters.selectDateBy;
                const endpoint = DATABASE_TABLES[tableKey].endpoint;
                const response = await axios.get(endpoint);
                const data = response.data;

                const sortedData = data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

                const options = sortedData.map(item => ({
                    value: item.id,
                    label: item.name,
                    start_date: item.start_date,
                    end_date: item.end_date
                }));

                setOptionsData(prev => ({
                    ...prev,
                    [tableKey]: options,
                }));
            }
        } catch (error) {
            console.error(`Error obteniendo datos de ${filters.selectDateBy}:`, error.response ? error.response.data : error);
        }
    };

    useEffect(() => {
        if (filters.selectDateBy === "campaigns" || filters.selectDateBy === "seasons") {
            fetchOptionsData();
        } else {
            setOptionsData({});
        }
    }, [filters.selectDateBy]);

    const handleSelectChange = (inputId, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [inputId]: value };
            
            if (filters.selectDateBy === "campaigns" || filters.selectDateBy === "seasons") {
                const tableKey = filters.selectDateBy;
                const options = optionsData[tableKey] || [];
                const selectedOption = options.find(opt => opt.value === value);
                if (selectedOption) {                    
                    const suffix = inputId.endsWith("_1") ? "_1" : "_2";
                    newFilters[`start_date${suffix}`] = selectedOption.start_date;
                    newFilters[`end_date${suffix}`] = selectedOption.end_date;
                }
            }
            
            return newFilters;
        });
    };

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
                    onClickFunction={() => handleClear()}
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