import { useMemo, useState } from 'react';
import { DATABASE_TABLES } from "../config/database.js"
import { useFetch } from "../hooks/useFetch.js";
import { useIsMobile } from "../utils/useIsMobile.js";
import BottomSheet from "./BottomSheet.jsx";
import { MultiSelectFilter, RangeFilter, TextInputFilter, SectionSegments } from "./FiltersComponents.jsx";
import {
    handleSelectChange,
    handleRangeInputChange,
    handleTextInputChange,
    handleManualClear,
    handleManualFilter,
    buildSelectOptions
} from "../utils/filterUtils.js";

function Filters({ type, onFilterChange }) {
    const DATABASE_TABLE = DATABASE_TABLES[type];
    const [optionFilters, setOptionFilters] = useState({});
    const [selectedValues, setSelectedValues] = useState({});
    const [rangeInputs, setRangeInputs] = useState({});
    const [textInputs, setTextInputs] = useState({});
    const [showMore, setShowMore] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const isMobile = useIsMobile();
    const { data: optionsSource } = useFetch(DATABASE_TABLE.endpoint, optionFilters);
    const optionsData = useMemo(() => buildSelectOptions(optionsSource, DATABASE_TABLE), [optionsSource, DATABASE_TABLE]);
    const { segment, primary = [] } = DATABASE_TABLE.filters;

    const fields = DATABASE_TABLE.filters.label
        .map((label, index) => ({
            label,
            inputId: DATABASE_TABLE.filters.inputId[index],
            inputType: DATABASE_TABLE.filters.inputType[index]
        }))
        .filter((field) => field.inputId !== segment);
    const primaryFields = fields.filter((field) => primary.includes(field.inputId));
    const moreFields = fields.filter((field) => !primary.includes(field.inputId));

    const renderField = (field) => {
        if (field.inputType === "select") {
            return (
                <MultiSelectFilter
                    inputId={field.inputId}
                    label={field.label}
                    optionsData={optionsData}
                    selectedValues={selectedValues}
                    handleSelectChange={(id, options) => handleSelectChange(id, options, setSelectedValues)}
                />
            );
        }

        if (field.inputType === "range") {
            return (
                <RangeFilter
                    inputId={field.inputId}
                    label={field.label}
                    rangeInputs={rangeInputs}
                    handleRangeInputChange={(id, values) => handleRangeInputChange(id, values, setRangeInputs)}
                    minPrice={DATABASE_TABLE.tables.minPrice}
                    maxPrice={DATABASE_TABLE.tables.maxPrice}
                />
            );
        }

        return (
            <TextInputFilter
                inputId={field.inputId}
                label={field.label}
                inputType={field.inputType}
                textInputs={textInputs}
                handleTextInputChange={(e) => handleTextInputChange(e, setTextInputs)}
            />
        );
    };

    const applyFilters = () => handleManualFilter(selectedValues, textInputs, rangeInputs, onFilterChange, setOptionFilters);
    const clearFilters = () => handleManualClear(setSelectedValues, setTextInputs, setRangeInputs, onFilterChange, setOptionFilters);

    const segmentControl = segment ? (
        <SectionSegments
            inputId={segment}
            label={DATABASE_TABLE.filters.label[DATABASE_TABLE.filters.inputId.indexOf(segment)]}
            options={optionsData[segment] || []}
            selectedValues={selectedValues}
            handleSelectChange={(id, options) => handleSelectChange(id, options, setSelectedValues)}
        />
    ) : null;

    if (isMobile) {
        return (
            <div className="filters-mobile d-flex align-items-stretch gap-2">
                {segmentControl}
                <button
                    type="button"
                    className="m-btn flex-shrink-0 d-inline-flex align-items-center gap-2"
                    aria-haspopup="dialog"
                    onClick={() => setSheetOpen(true)}
                >
                    <i className="bi bi-sliders" aria-hidden="true" />
                    Filtros
                </button>
                <BottomSheet
                    show={sheetOpen}
                    onHide={() => setSheetOpen(false)}
                    title="Filtros"
                    footer={
                        <>
                            <button type="button" className="m-ghost" onClick={clearFilters}>Limpiar</button>
                            <button
                                type="button"
                                className="m-primary"
                                onClick={() => {
                                    applyFilters();
                                    setSheetOpen(false);
                                }}
                            >
                                Ver resultados
                            </button>
                        </>
                    }
                >
                    <div className="d-flex flex-column gap-3">
                        {fields.map((field) => (
                            <div key={field.inputId}>{renderField(field)}</div>
                        ))}
                    </div>
                </BottomSheet>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-3">
            <div className="filters-bar d-flex flex-wrap align-items-end">
                {segmentControl}
                {primaryFields.map((field) => (
                    <div className="filters-field" key={field.inputId}>
                        {renderField(field)}
                    </div>
                ))}
                <div className="flex-grow-1 d-none d-lg-block" />
                {moreFields.length > 0 && (
                    <button
                        type="button"
                        className={`panel-btn${showMore ? ' is-open' : ''}`}
                        aria-expanded={showMore}
                        aria-controls="more-filters"
                        onClick={() => setShowMore(!showMore)}
                    >
                        <i className="bi bi-sliders" aria-hidden="true" />
                        Más filtros
                        <i className="bi bi-chevron-down panel-chevron" aria-hidden="true" />
                    </button>
                )}
                <button type="button" className="panel-ghost" onClick={clearFilters}>
                    Limpiar
                </button>
                <button type="button" className="panel-primary" onClick={applyFilters}>
                    Filtrar
                </button>
            </div>
            {showMore && moreFields.length > 0 && (
                <div className="filters-panel" id="more-filters">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
                        {moreFields.map((field) => (
                            <div className="col" key={field.inputId}>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Filters;