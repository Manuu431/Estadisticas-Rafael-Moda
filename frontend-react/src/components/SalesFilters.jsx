import { useEffect, useMemo, useState } from 'react';
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { useIsMobile } from "../utils/useIsMobile.js";
import { DEFAULT_SALES_PERIOD, customPeriodError } from "../utils/salesPeriod.js";
import BottomSheet from "./BottomSheet.jsx";
import { BrandSelect, CustomDates, PeriodSelect, SearchField } from "./SalesFields.jsx";
import { MultiSelectFilter, RangeFilter, TextInputFilter, SectionSegments } from "./FiltersComponents.jsx";
import {
    handleSelectChange,
    handleRangeInputChange,
    handleTextInputChange,
    handleManualClear,
    handleManualFilter
} from "../utils/filterUtils.js";

const { filters: FILTERS, tables: TABLES, endpointOptions: OPTIONS_URL } = DATABASE_TABLES.sales;
const BAR_FIELDS = [FILTERS.segment, 'brand'];
const NO_BRANDS = [];
const SEARCH_DELAY = 300;
const ignore = () => {};
const isReady = (period) => period.key !== 'custom' || Boolean(period.from && period.to && !customPeriodError(period));
const toOptions = (values = []) => values.map((value) => ({ value, label: value }));

const PANEL_FIELDS = FILTERS.label
    .map((label, index) => ({ label, inputId: FILTERS.inputId[index], inputType: FILTERS.inputType[index] }))
    .filter((field) => !BAR_FIELDS.includes(field.inputId));

function SalesFilters({ period, onPeriodChange, onFilterChange }) {
    const [draft, setDraft] = useState(period);
    const [search, setSearch] = useState('');
    const [brand, setBrand] = useState('');
    const [section, setSection] = useState('');
    const [panel, setPanel] = useState({});
    const [selectedValues, setSelectedValues] = useState({});
    const [rangeInputs, setRangeInputs] = useState({});
    const [textInputs, setTextInputs] = useState({});
    const [showMore, setShowMore] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const isMobile = useIsMobile();
    const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DELAY);
    const { data: options } = useFetch(OPTIONS_URL);
    const optionsData = useMemo(() => ({ family: toOptions(options?.families), size: toOptions(options?.sizes) }), [options]);

    useEffect(() => {
        onFilterChange({
            ...panel,
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            ...(brand ? { brand } : {}),
            ...(section ? { section } : {})
        });
    }, [panel, debouncedSearch, brand, section, onFilterChange]);

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
                    optionsData={optionsData}
                    selectedValues={selectedValues}
                    handleSelectChange={(id, picked) => handleSelectChange(id, picked, setSelectedValues)}
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

    const applyPanel = () => handleManualFilter(selectedValues, textInputs, rangeInputs, setPanel, ignore);
    const clearPanel = () => handleManualClear(setSelectedValues, setTextInputs, setRangeInputs, setPanel, ignore);

    const applySheet = () => {
        applyPanel();
        if (isReady(draft)) onPeriodChange(draft);
        else setDraft(period);
        setSheetOpen(false);
    };

    const clearSheet = () => {
        clearPanel();
        setBrand('');
        setDraft(DEFAULT_SALES_PERIOD);
        onPeriodChange(DEFAULT_SALES_PERIOD);
    };

    const brandSelect = <BrandSelect brands={options?.brands ?? NO_BRANDS} value={brand} onChange={setBrand} />;

    const segmentControl = (
        <SectionSegments
            inputId={FILTERS.segment}
            label={FILTERS.label[FILTERS.inputId.indexOf(FILTERS.segment)]}
            options={[]}
            selectedValues={{ [FILTERS.segment]: section ? [section] : [] }}
            handleSelectChange={(id, picked) => setSection(picked[0]?.value ?? '')}
            className="is-plus"
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
                        {brandSelect}
                        {PANEL_FIELDS.map((field) => (
                            <div key={field.inputId}>{renderField(field)}</div>
                        ))}
                    </div>
                </BottomSheet>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-3">
            <div className="filters-bar d-flex flex-wrap align-items-center">
                <SearchField value={search} onChange={setSearch} />
                <PeriodSelect period={draft} onChange={changePeriod} />
                {brandSelect}
                {segmentControl}
                <div className="flex-grow-1 d-none d-lg-block" />
                <button
                    type="button"
                    className={`panel-btn is-soft${showMore ? ' is-open' : ''}`}
                    aria-expanded={showMore}
                    aria-controls="more-filters"
                    onClick={() => setShowMore(!showMore)}
                >
                    <i className="bi bi-sliders" aria-hidden="true" />
                    Más filtros
                    <i className="bi bi-chevron-down panel-chevron" aria-hidden="true" />
                </button>
            </div>
            <CustomDates period={draft} onChange={changePeriod} />
            {showMore && (
                <div className="filters-panel" id="more-filters">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
                        {PANEL_FIELDS.map((field) => (
                            <div className="col" key={field.inputId}>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <button type="button" className="panel-ghost" onClick={clearPanel}>Limpiar filtros</button>
                        <button type="button" className="panel-primary" onClick={applyPanel}>Aplicar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalesFilters;