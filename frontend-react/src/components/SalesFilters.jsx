import { useEffect, useMemo, useState } from 'react';
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { useIsMobile } from "../utils/useIsMobile.js";
import { DEFAULT_SALES_PERIOD, customPeriodError } from "../utils/salesPeriod.js";
import { EMPTY_PANEL, panelParams } from "../utils/salesPanel.js";
import BottomSheet from "./BottomSheet.jsx";
import { BrandSelect, CustomDates, PeriodSelect, SearchField } from "./SalesFields.jsx";
import SalesPanelFields from "./SalesPanelFields.jsx";
import { SectionSegments } from "./FiltersComponents.jsx";

const OPTIONS_URL = DATABASE_TABLES.sales.endpointOptions;
const NO_OPTIONS = [];
const SEARCH_DELAY = 300;
const isReady = (period) => period.key !== 'custom' || Boolean(period.from && period.to && !customPeriodError(period));

function SalesFilters({ period, onPeriodChange, onFilterChange }) {
    const [draft, setDraft] = useState(period);
    const [search, setSearch] = useState('');
    const [brand, setBrand] = useState('');
    const [section, setSection] = useState('');
    const [panel, setPanel] = useState(EMPTY_PANEL);
    const [appliedPanel, setAppliedPanel] = useState({});
    const [showMore, setShowMore] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const isMobile = useIsMobile();
    const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DELAY);
    const { data: options } = useFetch(OPTIONS_URL);
    const panelOptions = useMemo(() => ({
        families: options?.families ?? NO_OPTIONS,
        sizes: options?.sizes ?? NO_OPTIONS,
        colors: options?.colors ?? NO_OPTIONS
    }), [options]);

    useEffect(() => {
        onFilterChange({
            ...appliedPanel,
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            ...(brand ? { brand } : {}),
            ...(section ? { section } : {})
        });
    }, [appliedPanel, debouncedSearch, brand, section, onFilterChange]);

    const changePeriod = (next) => {
        setDraft(next);
        if (!isMobile && isReady(next)) onPeriodChange(next);
    };

    const applyPanel = () => setAppliedPanel(panelParams(panel));

    const clearPanel = () => {
        setPanel(EMPTY_PANEL);
        setAppliedPanel({});
    };

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

    const brandSelect = <BrandSelect brands={options?.brands ?? NO_OPTIONS} value={brand} onChange={setBrand} />;

    const segmentControl = (
        <SectionSegments
            inputId="section"
            label="Sección"
            options={[]}
            selectedValues={{ section: section ? [section] : [] }}
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
                        <SalesPanelFields panel={panel} options={panelOptions} onChange={setPanel} />
                    </div>
                </BottomSheet>
            </div>
        );
    }

    return (
        <div className="sales-filters d-flex flex-column">
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
                <div className="filters-panel sales-panel" id="more-filters">
                    <div className="sales-panel-grid">
                        <SalesPanelFields panel={panel} options={panelOptions} onChange={setPanel} />
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="panel-ghost is-compact" onClick={clearPanel}>Limpiar filtros</button>
                        <button type="button" className="panel-primary is-compact" onClick={applyPanel}>Aplicar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalesFilters;