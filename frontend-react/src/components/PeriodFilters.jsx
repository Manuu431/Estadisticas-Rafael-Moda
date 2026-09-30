import { useMemo } from "react";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { SelectFilter, TextInputFilter, FilterButton } from "./FiltersComponents.jsx";
function PeriodFilters({ periods, filters, setFilters, handleSelectDateByChange, handleClear, onFilter, classCols }) {
    const DATABASE_TABLE = DATABASE_TABLES[periods === 1 ? "expenses" : "comparative"];
    const suffixes = periods === 1 ? [""] : ["_1", "_2"];
    const isList = filters.selectDateBy === "campaigns" || filters.selectDateBy === "seasons";
    const isCampaign = filters.selectDateBy === "campaigns";
    const { data } = useFetch(isList ? DATABASE_TABLES[filters.selectDateBy].endpoint : null);
    const options = useMemo(() => {
        if (!data) return [];
        return [...data]
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
            .map(item => ({ value: item.id, label: item.name, start_date: item.start_date, end_date: item.end_date }));
    }, [data]);
    const handleSelectChange = (inputId, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [inputId]: value };
            if (isList) {
                const selectedOption = options.find(opt => opt.value === value);
                if (selectedOption) {
                    const suffix = periods === 1 ? "" : inputId.endsWith("_1") ? "_1" : "_2";
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
                {filters.selectDateBy === "exact_date" && suffixes.flatMap(suffix => [`start_date${suffix}`, `end_date${suffix}`]).map((inputId) => {
                    const index = DATABASE_TABLE.filters.inputId.indexOf(inputId);
                    if (index === -1) return null;
                    const label = DATABASE_TABLE.filters.label[index];
                    const inputType = DATABASE_TABLE.filters.inputType[index];
                    return (
                        <div className={classCols} key={inputId}>
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
                {isList && suffixes.map((suffix, i) => {
                    const inputId = `${isCampaign ? "campaign" : "season"}${suffix}`;
                    const label = `${isCampaign ? "Campaña" : "Temporada"}${periods === 1 ? "" : ` ${i + 1}`}`;
                    return (
                        <div className={classCols} key={inputId}>
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
                {["showBy", "groupBy"].map((inputId) => {
                    const index = DATABASE_TABLE.filters.inputId.indexOf(inputId);
                    if (index === -1) return null;
                    const label = DATABASE_TABLE.filters.label[index];
                    return (
                        <div className={classCols} key={inputId}>
                            <div className="mb-3 gap-3">
                                <SelectFilter
                                    inputId={inputId}
                                    label={label}
                                    optionsData={{ [inputId]: DATABASE_TABLE.filters.options[inputId] }}
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
                    buttonClasses="bg-primary"
                    onClickFunction={() => onFilter(filters)}
                    iconClasses="bi bi-funnel"
                    text="Filtrar"
                />
            </div>
        </>
    );
}
export default PeriodFilters;