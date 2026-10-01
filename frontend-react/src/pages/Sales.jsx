import { useMemo, useState } from 'react';
import Filters from "../components/Filters.jsx";
import Table from "../components/table/Table.jsx";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { summarizeBySection } from "../utils/statisticsData.js";
import { formatNumber, formatMoney } from "../utils/format.js";
import { activeFiltersLabel } from "../utils/filterUtils.js";

const NO_OPTIONS = {};
const NO_ROWS = [];

function Sales(props) {
    const [filters, setFilters] = useState({});
    const { data } = useFetch(DATABASE_TABLES["sales"].endpoint, filters);
    const summary = useMemo(() => summarizeBySection(data ?? NO_ROWS), [data]);

    return (
        <>
            <header className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
                <div className="d-flex flex-column gap-1">
                    <span className="panel-kicker">{activeFiltersLabel(filters)}</span>
                    <h1 className="panel-title m-0">{props.title}</h1>
                </div>
                <p className="panel-kicker text-md-end m-0">
                    <strong className="text-body">{formatNumber(summary.total.units)}</strong> prendas ·{' '}
                    <strong className="text-body">{formatMoney(summary.total.profitCents)}</strong> de beneficio
                    <br />
                    {formatNumber(summary.total.sales)} líneas de venta
                </p>
            </header>
            <div className="d-flex flex-column gap-4">
                <Filters type="sales" onFilterChange={setFilters} options={NO_OPTIONS} />
                <Table type="sales" rows={data ?? NO_ROWS} />
            </div>
        </>
    );
}

export default Sales;