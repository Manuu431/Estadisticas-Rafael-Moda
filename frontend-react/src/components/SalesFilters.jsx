import { useState } from 'react';
import { DATABASE_TABLES } from "../config/database.js";
import { useIsMobile } from "../utils/useIsMobile.js";
import { DEFAULT_SALES_PERIOD, customPeriodError } from "../utils/salesPeriod.js";
import BottomSheet from "./BottomSheet.jsx";
import { CustomDates, PeriodSelect } from "./SalesPeriodField.jsx";
import { MultiSelectFilter, RangeFilter, TextInputFilter, SectionSegments } from "./FiltersComponents.jsx";
import {
    handleSelectChange,
    handleRangeInputChange,
    handleTextInputChange,
    handleManualClear,
    handleManualFilter
} from "../utils/filterUtils.js";

const { filters: FILTERS, tables: TABLES } = DATABASE_TABLES.sales;
const NO_OPTIONS = {};
const ignore = () => {};
const isReady = (period) => period.key !== 'custom' || Boolean(period.from && period.to && !customPeriodError(period));

function SalesFilters({ period, onPeriodChange, onFilterChange }) {
    const [draft, setDraft] = useState(period);
    const [selectedValues, setSelectedValues] = useState({});
    const [rangeInputs, setRangeInputs] = useState({});
    const [textInputs, setTextInputs] = useState({});
    const [showMore, setShowMore] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const isMobile = useIsMobile();
    const { segment, primary } = FILTERS;

    const fields = FILTERS.label
        .map((label, index) => ({ label, inputId: FILTERS.inputId[index], inputType: FILTERS.inputType[index] }))
        .filter((field) => field.inputId !== segment);
    const primaryFields = fields.filter((field) => primary.includes(field.inputId));
    const moreFields = fields.filter((field) => !primary.includes(field.inputId));

    const changePeriod = (next) => {
        setDraft(next);
        if (!isMobile && isReady(next)) onPeriodChange(next);
    };

    const renderField = (field) => {
        if (field.inputType === "select") {
            return (
                <MultiSelectFilter
                    inputId={field.inputId}
                    label={field.label}
                    optionsData={NO_OPTIONS}
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
                    minPrice={TABLES.minPrice}
                    maxPrice={TABLES.maxPrice}
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

    const applyFilters = () => handleManualFilter(selectedValues, textInputs, rangeInputs, onFilterChange, ignore);
    const clearFilters = () => handleManualClear(setSelectedValues, setTextInputs, setRangeInputs, onFilterChange, ignore);

    const applySheet = () => {
        applyFilters();
        if (isReady(draft)) onPeriodChange(draft);
        else setDraft(period);
        setSheetOpen(false);
    };

    const clearSheet = () => {
        clearFilters();
        setDraft(DEFAULT_SALES_PERIOD);
        onPeriodChange(DEFAULT_SALES_PERIOD);
    };

    const segmentControl = (
        <SectionSegments
            inputId={segment}
            label={FILTERS.label[FILTERS.inputId.indexOf(segment)]}
            options={[]}
            selectedValues={selectedValues}
            handleSelectChange={(id, options) => handleSelectChange(id, options, setSelectedValues)}
        />
    );

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
                            <button type="button" className="m-ghost" onClick={clearSheet}>Limpiar</button>
                            <button type="button" className="m-primary" onClick={applySheet}>Ver resultados</button>
                        </>
                    }
                >
                    <div className="d-flex flex-column gap-3">
                        <PeriodSelect period={draft} onChange={changePeriod} />
                        <CustomDates period={draft} onChange={changePeriod} />
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
                <PeriodSelect period={draft} onChange={changePeriod} />
                {segmentControl}
                {primaryFields.map((field) => (
                    <div className="filters-field" key={field.inputId}>
                        {renderField(field)}
                    </div>
                ))}
                <div className="flex-grow-1 d-none d-lg-block" />
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
                <button type="button" className="panel-ghost" onClick={clearFilters}>
                    Limpiar
                </button>
                <button type="button" className="panel-primary" onClick={applyFilters}>
                    Filtrar
                </button>
            </div>
            <CustomDates period={draft} onChange={changePeriod} />
            {showMore && (
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

export default SalesFilters;