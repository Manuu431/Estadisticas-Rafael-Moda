import { useMemo, useState } from 'react';
import SalesFilters from "../components/SalesFilters.jsx";
import Table from "../components/table/Table.jsx";
import SalesPlaceholder from "../components/table/SalesPlaceholder.jsx";
import SalesSummary from "../components/SalesSummary.jsx";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { summarizeSales } from "../utils/statisticsData.js";
import { apiDate } from "../utils/dates.js";
import { DEFAULT_SALES_PERIOD, salesPeriodLabel, salesPeriodRange } from "../utils/salesPeriod.js";
import { salesState } from "../utils/salesState.js";

const NO_ROWS = [];

function Sales(props) {
    const [filters, setFilters] = useState({});
    const [period, setPeriod] = useState(DEFAULT_SALES_PERIOD);
    const range = salesPeriodRange(period, new Date());
    const { data, error, refetch } = useFetch(DATABASE_TABLES["sales"].endpoint, { ...filters, sale_date_min: apiDate(range.from), sale_date_max: apiDate(range.to) });
    const summary = useMemo(() => summarizeSales(data ?? NO_ROWS), [data]);
    const state = salesState({ data, error, period, filters });

    return (
        <>
            <header className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
                <div className="panel-heading d-flex flex-column">
                    <span className="panel-period">{salesPeriodLabel(period.key, range)}</span>
                    <h1 className="panel-title m-0">{props.title}</h1>
                </div>
                <SalesSummary kind={state.kind} summary={summary} />
            </header>
            <div className="d-flex flex-column gap-4">
                <SalesFilters period={period} onPeriodChange={setPeriod} onFilterChange={setFilters} />
                {state.kind === 'ready' ? <Table type="sales" rows={data} /> : <SalesPlaceholder state={state} onRetry={refetch} />}
            </div>
        </>
    );
}

export default Sales;