import { useCallback, useEffect, useState } from 'react';
import SalesFilters from "../components/SalesFilters.jsx";
import Table from "../components/table/Table.jsx";
import SalesTable from "../components/table/SalesTable.jsx";
import TablePlaceholder from "../components/table/TablePlaceholder.jsx";
import SalesMobileList from "../components/table/SalesMobileList.jsx";
import SalesSummary, { SalesSummaryCard } from "../components/SalesSummary.jsx";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { apiDate } from "../utils/dates.js";
import { DEFAULT_SALES_PERIOD, salesPeriodLabel, salesPeriodRange } from "../utils/salesPeriod.js";
import { PAGE_SIZE, salesRequest, salesSummary } from "../utils/salesPage.js";
import { salesState } from "../utils/salesState.js";
import { useIsMobile } from "../utils/useIsMobile.js";

function Sales(props) {
    const [filters, setFilters] = useState({});
    const [period, setPeriod] = useState(DEFAULT_SALES_PERIOD);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(PAGE_SIZE);
    const [ready, setReady] = useState({ key: null, data: null });
    const isMobile = useIsMobile();
    const range = salesPeriodRange(period, new Date());
    const dates = { sale_date_min: apiDate(range.from), sale_date_max: apiDate(range.to) };
    const filterKey = JSON.stringify({ ...filters, ...dates });
    const { data, settled, error, refetch } = useFetch(DATABASE_TABLES["sales"].endpoint, salesRequest({ ...filters, ...dates }, { isMobile, page, count }));
    useEffect(() => {
        if (settled && data) setReady({ key: filterKey, data });
    }, [settled, data, filterKey]);
    const previous = !settled && ready.key === filterKey ? ready.data : null;
    const shown = settled ? data : previous;
    const state = salesState({ data: shown?.rows ?? null, settled: settled || previous !== null, error, period, filters });
    const summary = salesSummary(shown?.summary);
    const changeFilters = useCallback((next) => {
        setFilters(next);
        setPage(1);
        setCount(PAGE_SIZE);
    }, []);
    const changePeriod = (next) => {
        setPeriod(next);
        setPage(1);
        setCount(PAGE_SIZE);
    };
    return (
        <div className="sales-page">
            <header className="d-flex align-items-end justify-content-between gap-3 flex-wrap">
                <div className="d-flex flex-column panel-heading">
                    <span className="panel-period">{salesPeriodLabel(period.key, range)}</span>
                    <h1 className="m-0 panel-title">{props.title}</h1>
                </div>
                {isMobile ? null : <SalesSummary kind={state.kind} summary={summary} />}
            </header>
            {isMobile ? <SalesSummaryCard kind={state.kind} summary={summary} /> : null}
            <SalesFilters period={period} onPeriodChange={changePeriod} onFilterChange={changeFilters} />
            {state.kind !== 'ready' ? <div className="data-card"><TablePlaceholder header={<SalesTable data={[]} />} loadingText="Cargando ventas…" state={state} onRetry={refetch} /></div> : isMobile ? (
                <SalesMobileList rows={shown.rows} total={summary.lines} days={shown.days} onMore={() => setCount((current) => current + PAGE_SIZE)} />
            ) : (
                <Table rows={shown.rows} total={summary.lines} page={page} onPageChange={setPage} />
            )}
        </div>
    );
}

export default Sales;