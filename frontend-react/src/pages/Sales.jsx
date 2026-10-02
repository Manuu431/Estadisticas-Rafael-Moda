import { useMemo, useState } from 'react';
import SalesFilters from "../components/SalesFilters.jsx";
import Table from "../components/table/Table.jsx";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { summarizeSales } from "../utils/statisticsData.js";
import { apiDate } from "../utils/dates.js";
import { DEFAULT_SALES_PERIOD, salesPeriodLabel, salesPeriodRange } from "../utils/salesPeriod.js";
import { formatMoney, formatSalesLines, formatUnits } from "../utils/format.js";

const NO_ROWS = [];

function Sales(props) {
    const [filters, setFilters] = useState({});
    const [period, setPeriod] = useState(DEFAULT_SALES_PERIOD);
    const range = salesPeriodRange(period, new Date());
    const { data } = useFetch(DATABASE_TABLES["sales"].endpoint, { ...filters, sale_date_min: apiDate(range.from), sale_date_max: apiDate(range.to) });
    const summary = useMemo(() => summarizeSales(data ?? NO_ROWS), [data]);

    return (
        <>
            <header className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
                <div className="panel-heading d-flex flex-column">
                    <span className="panel-period">{salesPeriodLabel(period.key, range)}</span>
                    <h1 className="panel-title m-0">{props.title}</h1>
                </div>
                <p className="panel-summary m-0">
                    <strong>{formatMoney(summary.amountCents)}</strong> vendidos · <strong>{formatMoney(summary.profitCents)}</strong> de beneficio
                    <br />
                    {formatSalesLines(summary.lines)} · {formatUnits(summary.units)}
                </p>
            </header>
            <div className="d-flex flex-column gap-4">
                <SalesFilters period={period} onPeriodChange={setPeriod} onFilterChange={setFilters} />
                <Table type="sales" rows={data ?? NO_ROWS} />
            </div>
        </>
    );
}

export default Sales;