import { useMemo, useState } from 'react';
import SalesFilters from "../components/SalesFilters.jsx";
import Table from "../components/table/Table.jsx";
import SalesPlaceholder from "../components/table/SalesPlaceholder.jsx";
import SalesMobileList from "../components/table/SalesMobileList.jsx";
import SalesSummary, { SalesSummaryCard } from "../components/SalesSummary.jsx";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { summarizeSales } from "../utils/statisticsData.js";
import { apiDate } from "../utils/dates.js";
import { DEFAULT_SALES_PERIOD, salesPeriodLabel, salesPeriodRange } from "../utils/salesPeriod.js";
import { salesState } from "../utils/salesState.js";
import { useIsMobile } from "../utils/useIsMobile.js";

const NO_ROWS = [];

function Sales(props) {
    const [filters, setFilters] = useState({});
    const [period, setPeriod] = useState(DEFAULT_SALES_PERIOD);
    const range = salesPeriodRange(period, new Date());
    const { data, error, refetch } = useFetch(DATABASE_TABLES["sales"].endpoint, { ...filters, sale_date_min: apiDate(range.from), sale_date_max: apiDate(range.to) });
    const summary = useMemo(() => summarizeSales(data ?? NO_ROWS), [data]);
    const state = salesState({ data, error, period, filters });
    const isMobile = useIsMobile();

    return (
        <div className="sales-page">
            <header className="d-flex align-items-end justify-content-between gap-3 flex-wrap">
                <div className="panel-heading d-flex flex-column">
                    <span className="panel-period">{salesPeriodLabel(period.key, range)}</span>
                    <h1 className="panel-title m-0">{props.title}</h1>
                </div>
                {isMobile ? null : <SalesSummary kind={state.kind} summary={summary} />}
            </header>
            {isMobile ? <SalesSummaryCard kind={state.kind} summary={summary} /> : null}
            <SalesFilters period={period} onPeriodChange={setPeriod} onFilterChange={setFilters} />
            {state.kind !== 'ready' ? <SalesPlaceholder state={state} onRetry={refetch} /> : isMobile ? <SalesMobileList rows={data} /> : <Table type="sales" rows={data} />}
        </div>
    );
}

export default Sales;